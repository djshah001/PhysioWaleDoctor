import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { PremiumInput } from "~/components/ui/premium/PremiumInput";
import MapSelector from "./MapSelector";

interface ClinicLocationProps {
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  pincode: string;
  setPincode: (value: string) => void;
  coordinates: [number, number];
  setCoordinates: (value: [number, number]) => void;
}

const ClinicLocation: React.FC<ClinicLocationProps> = ({
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  pincode,
  setPincode,
  coordinates,
  setCoordinates,
}) => {
  /* Removed unused state */

  const handleLocationSelect = (
    coords: [number, number],
    addressData?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    },
  ) => {
    setCoordinates(coords);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (addressData) {
      if (addressData.street) setAddress(addressData.street);
      if (addressData.city) setCity(addressData.city);
      if (addressData.state) setState(addressData.state);
      if (addressData.country) setCountry(addressData.country);
      if (addressData.postalCode) setPincode(addressData.postalCode);
    }
  };

  /* Removed unused getCurrentLocation function */

  return (
    <View className="gap-6 flex-1">
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Clinic Location
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Pin your clinic location on the map to auto-fill details
        </Text>
      </View>

      {/* Map Section - Always Visible */}
      <View className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
        <MapSelector
          coordinates={coordinates}
          onLocationSelect={handleLocationSelect}
        />
      </View>

      {/* Address Form - Animated Entry when Coordinates Selected */}
      {coordinates[0] !== 0 && coordinates[1] !== 0 && (
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="gap-4"
        >
          <View className="flex-row items-center gap-2 mb-2">
            <View className="h-8 w-8 rounded-full bg-green-100 items-center justify-center">
              <MaterialCommunityIcons name="check" size={16} color="#16a34a" />
            </View>
            <Text className="text-gray-900 font-semibold text-lg">
              Address Details
            </Text>
          </View>

          <PremiumInput
            label="Full Address (Editable)"
            placeholder="Edit street address, landmarks..."
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            returnKeyType="next"
            onSubmitEditing={() => {}}
            icon="map-marker"
            iconFamily="MaterialCommunityIcons"
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <PremiumInput
                label="City"
                placeholder="City"
                value={city}
                onChangeText={setCity}
                editable={false}
                icon="city"
                iconFamily="MaterialCommunityIcons"
              />
            </View>
            <View className="flex-1">
              <PremiumInput
                label="State"
                placeholder="State"
                value={state}
                onChangeText={setState}
                editable={false}
                icon="map-marker-radius"
                iconFamily="MaterialCommunityIcons"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <PremiumInput
                label="Country"
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                editable={false}
                icon="earth"
                iconFamily="MaterialCommunityIcons"
              />
            </View>
            <View className="flex-1">
              <PremiumInput
                label="Pincode"
                placeholder="Pincode"
                value={pincode}
                onChangeText={setPincode}
                editable={false}
                icon="mailbox"
                iconFamily="MaterialCommunityIcons"
              />
            </View>
          </View>

          <View className="bg-blue-50 p-3 rounded-xl flex-row items-start gap-3 border border-blue-100 mt-2">
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="#3b82f6"
              style={{ marginTop: 2 }}
            />
            <Text className="text-blue-700 text-xs flex-1 leading-5">
              To change City, State, or Pincode, please move the map pin to the
              correct location.
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default ClinicLocation;
