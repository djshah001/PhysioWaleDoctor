import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <View
      className={cn("items-center justify-center p-8 min-h-[200px]", className)}
    >
      <View className="w-30 h-30 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name={icon} size={64} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-semibold text-gray-800 text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-gray-500 text-center mb-6 leading-5">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          className="bg-indigo-600 px-6 py-3 rounded-xl active:opacity-80"
          onPress={onAction}
        >
          <Text className="text-white text-sm font-semibold">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
