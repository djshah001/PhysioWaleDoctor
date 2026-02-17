import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MultiSelectChips from "./MultiSelectChips";

interface ClinicSpecializationsProps {
  specializations: string[];
  setSpecializations: (value: string[]) => void;
}

const SPECIALIZATION_OPTIONS = [
  "Sports Physiotherapy",
  "Geriatric Physiotherapy",
  "Pediatric Physiotherapy",
  "Neurological Physiotherapy",
  "Cardiopulmonary Physiotherapy",
  "Orthopedic Physiotherapy",
  "Women's Health",
  "Other",
];

const ClinicSpecializations: React.FC<ClinicSpecializationsProps> = ({
  specializations,
  setSpecializations,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-pbold text-white mb-2">
          Specializations
        </Text>
        <Text className="text-sky-200/70 text-sm font-pregular">
          What areas of physiotherapy does your clinic specialize in?
        </Text>
      </View>

      <MultiSelectChips
        label="Clinic Specializations"
        icon="medical-bag"
        options={SPECIALIZATION_OPTIONS}
        selected={specializations}
        onChange={setSpecializations}
        required
      />
    </Animated.View>
  );
};

export default ClinicSpecializations;
