import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface MultiSelectChipsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  maxSelections?: number;
  required?: boolean;
}

const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
  options,
  selected,
  onChange,
  label,
  icon,
  maxSelections,
  required = false,
}) => {
  const toggleSelection = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      if (maxSelections && selected.length >= maxSelections) {
        return; // Don't allow more selections
      }
      onChange([...selected, option]);
    }
  };

  return (
    <View>
      {label && (
        <View className="flex-row items-center mb-3">
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color="#4f46e5"
              style={{ marginRight: 8 }}
            />
          )}
          <Text className="text-gray-800 font-semibold text-base">
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
        </View>
      )}

      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggleSelection(option)}
              activeOpacity={0.7}
            >
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className={`px-4 py-2.5 rounded-full border ${
                  isSelected
                    ? "bg-indigo-100 border-indigo-500"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <View className="flex-row items-center gap-2">
                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color="#4f46e5"
                    />
                  )}
                  <Text
                    className={`font-medium text-sm ${
                      isSelected ? "text-indigo-700" : "text-gray-600"
                    }`}
                  >
                    {option}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {maxSelections && (
        <Text className="text-gray-500 text-xs mt-2 font-medium">
          Select up to {maxSelections} options ({selected.length}/
          {maxSelections})
        </Text>
      )}
    </View>
  );
};

export default MultiSelectChips;
