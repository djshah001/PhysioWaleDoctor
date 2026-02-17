import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MultiSelectChips from "./MultiSelectChips";

interface ClinicFacilitiesProps {
  facilities: string[];
  setFacilities: (value: string[]) => void;
}

const FACILITY_OPTIONS = [
  "Wheelchair Access",
  "Parking",
  "Waiting Room",
  "X-Ray",
  "MRI",
  "Gym",
  "Restroom",
  "Wifi",
  "Other",
];

const ClinicFacilities: React.FC<ClinicFacilitiesProps> = ({
  facilities,
  setFacilities,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Facilities & Amenities
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Select all facilities available at your clinic
        </Text>
      </View>

      <MultiSelectChips
        label="Available Facilities"
        icon="hospital-box"
        options={FACILITY_OPTIONS}
        selected={facilities}
        onChange={setFacilities}
        required
      />

      {facilities.length === 0 && (
        <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <Text className="text-amber-700 text-sm font-medium">
            💡 Tip: Adding facilities helps patients choose your clinic
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default ClinicFacilities;
