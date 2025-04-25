import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Card, Icon, Divider, Badge } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { CustomChip } from "../../ReUsables/CustomChip";
import colors from "../../../constants/colors";

const ClinicInfoCard = ({ clinic }) => {
  const defaultImage = "https://via.placeholder.com/300x200?text=Clinic+Image";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatTiming = (timing) => {
    if (!timing) return "Not available";

    try {
      if (typeof timing === "string") {
        timing = JSON.parse(timing);
      }

      return `${timing.open} - ${timing.close}`;
    } catch (error) {
      return "Not available";
    }
  };

  const openMaps = () => {
    const { latitude, longitude } = clinic.location?.coordinates || {
      latitude: 0,
      longitude: 0,
    };
    const label = encodeURIComponent(clinic.name);
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const callClinic = () => {
    const phoneNumber = clinic.phone || clinic.contactNumber;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
    >
      <Card className="rounded-xl overflow-hidden shadow-md bg-white-400 mb-4">
        <View className="relative">
          {clinic.images && clinic.images.length > 0 ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onMomentumScrollEnd={(event) => {
                  const slideWidth = event.nativeEvent.layoutMeasurement.width;
                  const index = Math.floor(
                    event.nativeEvent.contentOffset.x / slideWidth
                  );
                  setCurrentImageIndex(index);
                }}
              >
                {clinic.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={{ width: 400, height: 180 }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Image pagination dots */}
              {clinic.images.length > 1 && (
                <View className="absolute bottom-2 self-center flex-row">
                  {clinic.images.map((_, index) => (
                    <View
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        index === currentImageIndex
                          ? "bg-white-400"
                          : "bg-white-400/50"
                      }`}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Image
              source={{ uri: defaultImage }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />
          )}

          {/* Status badge */}
          <View className="absolute top-3 right-3">
            {clinic.open24hrs ? (
              <View className="bg-success/90 px-3 py-1 rounded-full flex-row items-center">
                <Icon source="clock" size={14} color="white" />
                <Text className="text-white-400 text-xs font-ossemibold ml-1">
                  Open 24 Hours
                </Text>
              </View>
            ) : (
              <BlurView
                intensity={80}
                tint="dark"
                className="rounded-full overflow-hidden"
              >
                <View className="px-3 py-1 flex-row items-center">
                  <Icon source="clock-outline" size={14} color="white" />
                  <Text className="text-white-400 text-xs font-ossemibold ml-1">
                    {formatTiming(clinic.timing)}
                  </Text>
                </View>
              </BlurView>
            )}
          </View>
        </View>

        <LinearGradient
          colors={["#FFFFFF", "#F8FAFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-xl font-pbold text-black-700">
                  {clinic.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  {/* <Icon
                    source="map-marker"
                    size={16}
                    color={colors.gray[500]}
                  /> */}
                  <Text className="text-sm text-gray-500 ml-1">
                    {clinic.address}, {clinic.city}
                  </Text>
                </View>
              </View>

              {clinic.verified && (
                <Badge className="bg-accent-DEFAULT" size={24}>
                  <Icon source="check-decagram" size={16} color="white" />
                </Badge>
              )}
            </View>

            {/* Clinic features */}
            {clinic.features && clinic.features.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3 -mx-1"
              >
                {clinic.features.map((feature, index) => (
                  <CustomChip
                    key={index}
                    text={feature}
                    selected={false}
                    compact
                  />
                ))}
              </ScrollView>
            )}

            <Divider className="my-3" />

            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-2 bg-accent-50 rounded-lg mr-2"
                onPress={openMaps}
              >
                <Icon
                  source="map-marker"
                  size={20}
                  color={colors.accent.DEFAULT}
                />
                <Text className="ml-2 text-accent-DEFAULT font-ossemibold">
                  Directions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-2 bg-primary-50 rounded-lg ml-2"
                onPress={callClinic}
              >
                <Icon source="phone" size={20} color={colors.primary[400]} />
                <Text className="ml-2 text-primary-400 font-ossemibold">
                  Call
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default ClinicInfoCard;
