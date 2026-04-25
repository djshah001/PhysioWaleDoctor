import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { Template } from "~/types/models";

interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  onPress: () => void;
}

export const TemplateCard = ({ template, isSelected, onPress }: TemplateCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`bg-white/60 rounded-2xl p-4 mb-3 border ${
        isSelected ? "border-indigo-500 bg-indigo-50/50" : "border-white/80"
      }`}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-slate-800 font-bold text-base mb-1" numberOfLines={1}>
            {template.name}
          </Text>
          <Text className="text-slate-500 text-xs font-medium" numberOfLines={1}>
            {template.description || "No description"}
          </Text>
        </View>

        <View
          className={`w-6 h-6 rounded-full border ${
            isSelected ? "border-indigo-500 bg-indigo-500 items-center justify-center" : "border-slate-300"
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
      </View>

      <View className="flex-row gap-2 mt-3 pt-3 border-t border-slate-200/50 flex-wrap">
        <View className="px-2 py-1 rounded-full bg-slate-100 flex-row items-center">
          <Ionicons name="fitness-outline" size={12} color={colors.slate[500]} className="mr-1" />
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {template.exercises.length} Exercises
          </Text>
        </View>
        {template.targetArea && (
          <View className="px-2 py-1 rounded-full bg-indigo-50 flex-row items-center">
            <Ionicons name="body-outline" size={12} color={colors.indigo[500]} className="mr-1" />
            <Text className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
              {template.targetArea}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
