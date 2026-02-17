import React from "react";
import { View, Text, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Button } from "../ui/button";

interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
}

const genderOptions = [
  { value: "male", label: "Male", icon: "gender-male" },
  { value: "female", label: "Female", icon: "gender-female" },
  { value: "others", label: "Other", icon: "gender-transgender" },
];

const GenderSelector: React.FC<GenderSelectorProps> = ({ value, onChange }) => {
  const handleSelect = (gender: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(gender);
  };

  return (
    <View className="gap-2">
      <Text className="text-white mb-2 ml-1 font-pmedium">Gender</Text>
      <View className="flex-row gap-3">
        {genderOptions.map((option) => {
          const isSelected = value === option.value;

          return (
            <View key={option.value} className="flex-1">
              <Button
                onPress={() => handleSelect(option.value)}
                className={`overflow-hidden rounded-2xl border-2 p-0 ${
                  isSelected
                    ? "border-rose-500 bg-rose-500/20"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <BlurView
                  intensity={20}
                  tint="dark"
                  experimentalBlurMethod="dimezisBlurView"
                  className="p-4 items-center w-full"
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={32}
                    color={isSelected ? "#fb7185" : "#94a3b8"}
                  />
                  <Text
                    className={`mt-2 font-pmedium ${
                      isSelected ? "text-rose-400" : "text-slate-400"
                    }`}
                  >
                    {option.label}
                  </Text>
                </BlurView>
              </Button>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default GenderSelector;
