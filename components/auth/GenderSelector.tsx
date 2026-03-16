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
  theme?: "dark" | "light";
}

const genderOptions = [
  { value: "male", label: "Male", icon: "gender-male" },
  { value: "female", label: "Female", icon: "gender-female" },
  { value: "others", label: "Other", icon: "gender-transgender" },
];

const GenderSelector: React.FC<GenderSelectorProps> = ({
  value,
  onChange,
  theme = "dark",
}) => {
  const isLight = theme === "light";

  const handleSelect = (gender: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(gender);
  };

  return (
    <View className={isLight ? "" : "gap-2"}>
      <Text
        className={
          isLight
            ? "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
            : "text-white mb-2 ml-1 font-pmedium"
        }
      >
        Gender
      </Text>
      <View className="flex-row gap-3">
        {genderOptions.map((option) => {
          const isSelected = value === option.value;

          return (
            <View key={option.value} className="flex-1">
              <Button
                onPress={() => handleSelect(option.value)}
                className={`overflow-hidden rounded-2xl border p-0 ${
                  isSelected
                    ? isLight
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-rose-500 bg-rose-500/20"
                    : isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-white/10 bg-white/5"
                }`}
              >
                <BlurView
                  intensity={isLight ? 0 : 20}
                  tint={isLight ? "light" : "dark"}
                  experimentalBlurMethod="dimezisBlurView"
                  className={`items-center w-full justify-center flex-row gap-2 ${
                    isLight ? "py-3" : "p-4 flex-col"
                  }`}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={isLight ? 20 : 32}
                    color={
                      isSelected ? (isLight ? "#ffffff" : "#fb7185") : "#9ca3af"
                    }
                  />
                  <Text
                    className={`${
                      isLight ? "font-bold text-sm" : "mt-2 font-pmedium"
                    } ${
                      isSelected
                        ? isLight
                          ? "text-white"
                          : "text-rose-400"
                        : isLight
                          ? "text-gray-600"
                          : "text-slate-400"
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
