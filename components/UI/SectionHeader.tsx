import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  className?: string;
}

const SectionHeader = ({
  title,
  subtitle,
  onSeeAll,
  className = "",
}: SectionHeaderProps) => {
  return (
    <View className={`flex-row justify-between items-end mb-4 ${className}`}>
      <View>
        <Text className="text-xl font-pbold text-gray-800">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 font-pmedium mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      {onSeeAll && (
        <TouchableOpacity
          onPress={onSeeAll}
          className="flex-row items-center gap-1 bg-secondary-50 px-3 py-1.5 rounded-full"
        >
          <Text className="text-secondary-500 font-psemibold text-sm">
            See All
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.secondary.DEFAULT}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
