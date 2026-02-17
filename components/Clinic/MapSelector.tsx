import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

interface MapSelectorProps {
  coordinates: [number, number];
  onLocationSelect: (
    coords: [number, number],
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    },
  ) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  coordinates,
  onLocationSelect,
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: coordinates[1] || 20.5937,
    longitude: coordinates[0] || 78.9629,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerCoords, setMarkerCoords] = useState({
    latitude: coordinates[1] || 20.5937,
    longitude: coordinates[0] || 78.9629,
  });
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Animation values
  const markerScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const animatedMarkerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markerScale.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Debounce timer for reverse geocoding
  const geocodeTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Update marker when coordinates prop changes
    if (coordinates[0] !== 0 && coordinates[1] !== 0) {
      setMarkerCoords({
        latitude: coordinates[1],
        longitude: coordinates[0],
      });
      setRegion({
        latitude: coordinates[1],
        longitude: coordinates[0],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [coordinates]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setLoadingAddress(true);
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      // console.log("geocode", geocode);

      if (geocode.length > 0) {
        const place = geocode[0];
        const addressData = {
          street: `${place.street || ""} ${place.name || ""}`.trim(),
          city: place.city || "",
          state: place.region || "",
          country: place.country || "",
          postalCode: place.postalCode || "",
        };
        onLocationSelect([longitude, latitude], addressData);
      } else {
        onLocationSelect([longitude, latitude]);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      onLocationSelect([longitude, latitude]);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });

    // Animate marker
    markerScale.value = withSequence(
      withSpring(1.3, { damping: 10 }),
      withSpring(1, { damping: 10 }),
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Debounce reverse geocoding
    if (geocodeTimerRef.current) {
      clearTimeout(geocodeTimerRef.current);
    }
    geocodeTimerRef.current = setTimeout(() => {
      reverseGeocode(latitude, longitude);
    }, 800);
  };

  const handleRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1, { damping: 10 }),
    );

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature",
        );
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setMarkerCoords({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0092,
        longitudeDelta: 0.0042,
      });

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0092,
          longitudeDelta: 0.0042,
        },
        1000,
      );

      await reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setLoading(false);
    }
  };

  const centerOnMarker = () => {
    mapRef.current?.animateToRegion(
      {
        ...markerCoords,
        latitudeDelta: 0.0092,
        longitudeDelta: 0.0042,
      },
      500,
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        mapType="standard"
      >
        <Marker coordinate={markerCoords} anchor={{ x: 0.5, y: 0.5 }}>
          <Animated.View style={[styles.markerContainer, animatedMarkerStyle]}>
            <View style={styles.markerPulse} />
            {/* <View style={styles.marker}> */}
            <MaterialCommunityIcons
              name="hospital-marker"
              size={30}
              color="#fff"
            />
            {/* </View> */}
          </Animated.View>
        </Marker>
      </MapView>

      {/* Glassmorphic Controls */}
      <View style={styles.controlsContainer}>
        {/* Current Location Button */}
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={loading}
            style={styles.locationButton}
            activeOpacity={0.8}
          >
            <BlurView
              intensity={90}
              tint="light"
              style={styles.blurButton}
              // experimentalBlurMethod="dimezisBlurView"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#4f46e5" />
              ) : (
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={24}
                  color="#4f46e5"
                />
              )}
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Center on Marker Button */}
        <TouchableOpacity
          onPress={centerOnMarker}
          style={styles.locationButton}
          activeOpacity={0.8}
        >
          <BlurView intensity={80} tint="light" style={styles.blurButton}>
            <MaterialCommunityIcons name="target" size={24} color="#4f46e5" />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Loading Address Indicator */}
      {loadingAddress && (
        <View style={styles.loadingContainer}>
          <BlurView intensity={90} tint="light" style={styles.loadingBlur}>
            <ActivityIndicator size="small" color="#4f46e5" />
            <Text style={styles.loadingText}>Getting address...</Text>
          </BlurView>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <BlurView intensity={80} tint="light" style={styles.instructionsBlur}>
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color="#4f46e5"
          />
          <Text style={styles.instructionsText}>
            Tap on the map to select clinic location
          </Text>
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 400,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPulse: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(79, 70, 229, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.1)",
  },
  marker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#fff",
  },
  controlsContainer: {
    position: "absolute",
    right: 16,
    top: 20,
    gap: 12,
  },
  locationButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  blurButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  loadingContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingBlur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4f46e5",
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionsBlur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
  },
});

export default MapSelector;
