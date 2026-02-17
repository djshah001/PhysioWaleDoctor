import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FreeformChips from "./FreeformChips";

interface ClinicMetadataProps {
  clinicType: string;
  setClinicType: (value: string) => void;
  specializations: string[];
  setSpecializations: (value: string[]) => void;
  tags: string[];
  setTags: (value: string[]) => void;
}

const CLINIC_TYPES = [
  "Private Clinic",
  "Polyclinic",
  "Hospital",
  "Rehab Center",
  "Home Visit Base",
];

const ClinicMetadata: React.FC<ClinicMetadataProps> = ({
  clinicType,
  setClinicType,
  specializations,
  setSpecializations,
  tags,
  setTags,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Clinic Details
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Specify clinic type, specializations, and tags
        </Text>
      </View>

      {/* Clinic Type */}
      <View>
        <Text className="text-gray-900 font-bold mb-3">Clinic Type</Text>
        <View className="gap-2">
          {CLINIC_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setClinicType(type)}
              className={`p-4 rounded-xl border flex-row items-center justify-between ${
                clinicType === type
                  ? "bg-indigo-50 border-indigo-500"
                  : "bg-white border-gray-200"
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons
                  name={
                    type === "Hospital"
                      ? "hospital-building"
                      : type === "Polyclinic"
                        ? "office-building"
                        : type === "Rehab Center"
                          ? "heart-pulse"
                          : type === "Home Visit Base"
                            ? "home-heart"
                            : "hospital-box"
                  }
                  size={22}
                  color={clinicType === type ? "#4f46e5" : "#6b7280"}
                />
                <Text
                  className={`font-semibold ${
                    clinicType === type ? "text-indigo-700" : "text-gray-700"
                  }`}
                >
                  {type}
                </Text>
              </View>
              {clinicType === type && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4f46e5"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Specializations */}
      <View>
        <Text className="text-gray-900 font-bold mb-2">Specializations</Text>
        <Text className="text-gray-500 text-xs mb-3">
          Add areas of expertise (e.g., Sports Injury, Orthopedic)
        </Text>
        <FreeformChips
          selectedItems={specializations}
          onSelectionChange={setSpecializations}
          placeholder="Add specialization"
        />
      </View>

      {/* Tags */}
      <View>
        <Text className="text-gray-900 font-bold mb-2">Tags</Text>
        <Text className="text-gray-500 text-xs mb-3">
          Add keywords for better discoverability (e.g., premium, experienced)
        </Text>
        <FreeformChips
          selectedItems={tags}
          onSelectionChange={setTags}
          placeholder="Add tag"
        />
      </View>
    </Animated.View>
  );
};

export default ClinicMetadata;
