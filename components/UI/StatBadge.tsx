import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "~/lib/utils";

interface StatBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  variant?: "success" | "warning" | "info" | "primary" | "danger";
  animated?: boolean;
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  icon,
  value,
  label,
  variant = "primary",
  animated = true,
  className,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [value]);

  const variantClasses = {
    success: {
      bg: "bg-emerald-100",
      icon: "#059669",
      text: "text-emerald-900",
    },
    warning: { bg: "bg-amber-100", icon: "#F59E0B", text: "text-amber-900" },
    info: { bg: "bg-blue-100", icon: "#3B82F6", text: "text-blue-900" },
    primary: { bg: "bg-indigo-100", icon: "#6366F1", text: "text-indigo-900" },
    danger: { bg: "bg-red-100", icon: "#EF4444", text: "text-red-900" },
  };

  const colorScheme = variantClasses[variant];

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className={cn(
        "flex-row items-center p-3 rounded-xl gap-3",
        colorScheme.bg,
        className,
      )}
    >
      <View className="w-12 h-12 rounded-full bg-white/50 items-center justify-center">
        <Ionicons name={icon} size={24} color={colorScheme.icon} />
      </View>
      <View className="flex-1">
        <Text className={cn("text-xl font-bold", colorScheme.text)}>
          {value}
        </Text>
        <Text className={cn("text-xs font-medium mt-0.5", colorScheme.text)}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
};
