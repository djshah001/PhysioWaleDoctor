import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

import ClinicImages, { ImageUploadState } from "./ClinicImages";

interface FacilitiesGalleryProps {
  // Facilities
  facilities: string[];
  setFacilities: (value: string[]) => void;
  // Images
  imageStates: ImageUploadState[];
  onImagesSelected: (assets: ImagePicker.ImagePickerAsset[]) => void;
  onRemoveImage: (index: number) => void;
  onRetryUpload: (index: number) => void;
}

const FACILITY_OPTIONS = [
  { value: "Parking", icon: "parking", color: "#3b82f6" },
  {
    value: "Wheelchair Access",
    icon: "wheelchair-accessibility",
    color: "#8b5cf6",
  },
  { value: "Restroom", icon: "toilet", color: "#ec4899" },
  { value: "Wifi", icon: "wifi", color: "#10b981" },
  { value: "Waiting Area", icon: "seat", color: "#f59e0b" },
  { value: "Emergency Services", icon: "ambulance", color: "#ef4444" },
];

export default function FacilitiesGallery({
  facilities,
  setFacilities,
  imageStates,
  onImagesSelected,
  onRemoveImage,
  onRetryUpload,
}: FacilitiesGalleryProps) {
  const toggleFacility = (facility: string) => {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter((f) => f !== facility));
    } else {
      setFacilities([...facilities, facility]);
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} className="mb-6">
        <View className="flex-row items-center mb-2">
          <Ionicons name="images" size={28} color="#8b5cf6" />
          <Text className="text-2xl font-bold text-gray-900 ml-3">
            Facilities & Gallery
          </Text>
        </View>
        <Text className="text-gray-500 text-sm">
          Showcase your clinic's amenities and photos
        </Text>
      </Animated.View>

      {/* Facilities */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        className="mb-6"
      >
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            Facilities <Text className="text-red-500">*</Text>
          </Text>
          <Text className="text-sm text-gray-500 mb-3">
            Select all amenities available at your clinic
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {FACILITY_OPTIONS.map((facility) => {
            const isSelected = facilities.includes(facility.value);
            return (
              <TouchableOpacity
                key={facility.value}
                onPress={() => toggleFacility(facility.value)}
                className={`flex-row items-center px-4 py-3 rounded-xl border-2 ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-500"
                    : "bg-white border-gray-200"
                }`}
                style={{ minWidth: "45%" }}
              >
                <MaterialCommunityIcons
                  name={facility.icon as any}
                  size={24}
                  color={isSelected ? "#4f46e5" : facility.color}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    isSelected ? "text-indigo-700" : "text-gray-700"
                  }`}
                  numberOfLines={1}
                >
                  {facility.value}
                </Text>
                {isSelected && (
                  <View className="ml-auto">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#4f46e5"
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Count */}
        {facilities.length > 0 && (
          <View className="mt-3 bg-indigo-50 rounded-lg px-3 py-2">
            <Text className="text-sm text-indigo-700 font-medium">
              ✓ {facilities.length} facilit{facilities.length > 1 ? "ies" : "y"}{" "}
              selected
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Gallery */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        className="mb-6"
      >
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            Clinic Photos <Text className="text-red-500">*</Text>
          </Text>
          <Text className="text-sm text-gray-500 mb-3">
            Add high-quality images of your clinic (min 1, max 10)
          </Text>
        </View>

        <ClinicImages
          imageStates={imageStates}
          onImagesSelected={onImagesSelected}
          onRemoveImage={onRemoveImage}
          onRetryUpload={onRetryUpload}
        />

        {/* Tips */}
        <View className="mt-4 bg-sky-50 rounded-xl p-4 border border-sky-200">
          <View className="flex-row items-start">
            <Ionicons name="bulb" size={20} color="#0ea5e9" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-sky-900 mb-2">
                Photo Tips
              </Text>
              <Text className="text-xs text-sky-700 leading-5">
                • Include reception, treatment rooms, and equipment{"\n"}• Use
                good lighting and clear angles{"\n"}• Show your clinic's
                cleanliness and professionalism{"\n"}• Avoid blurry or
                low-quality images
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
