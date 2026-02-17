import React from "react";
import { View, Text } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "~/lib/utils";

type StatVariant = "indigo" | "purple" | "emerald" | "rose" | "orange";

type ModernStatBadgeProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  variant?: StatVariant;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
};

const variantStyles: Record<
  StatVariant,
  { bg: string; icon: string; text: string }
> = {
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    text: "text-indigo-900",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    text: "text-purple-900",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    text: "text-emerald-900",
  },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", text: "text-rose-900" },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    text: "text-orange-900",
  },
};

export const ModernStatBadge: React.FC<ModernStatBadgeProps> = ({
  icon,
  value,
  label,
  variant = "indigo",
  trend,
  trendValue,
}) => {
  const styles = variantStyles[variant];

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between mb-2">
        <View className={cn("p-2 rounded-xl", styles.bg)}>
          <Ionicons
            name={icon}
            size={20}
            className={styles.icon}
            color={
              // nativewind text-color classes don't apply to vector icons color prop directly usually
              variant === "indigo"
                ? "#4f46e5"
                : variant === "purple"
                  ? "#9333ea"
                  : variant === "emerald"
                    ? "#059669"
                    : variant === "rose"
                      ? "#e11d48"
                      : "#ea580c"
            }
          />
        </View>
        {trend && (
          <View
            className={cn(
              "flex-row items-center space-x-1 px-1.5 py-0.5 rounded-full",
              trend === "up"
                ? "bg-green-100"
                : trend === "down"
                  ? "bg-red-100"
                  : "bg-gray-100",
            )}
          >
            <Ionicons
              name={
                trend === "up"
                  ? "arrow-up"
                  : trend === "down"
                    ? "arrow-down"
                    : "remove"
              }
              size={10}
              color={
                trend === "up"
                  ? "#16a34a"
                  : trend === "down"
                    ? "#dc2626"
                    : "#6b7280"
              }
            />
            {trendValue && (
              <Text
                className={cn(
                  "text-[10px] font-medium",
                  trend === "up"
                    ? "text-green-700"
                    : trend === "down"
                      ? "text-red-700"
                      : "text-gray-600",
                )}
              >
                {trendValue}
              </Text>
            )}
          </View>
        )}
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <Text className={cn("text-2xl font-bold tracking-tight", styles.text)}>
          {value}
        </Text>
        <Text className="text-gray-500 text-xs font-medium mt-0.5">
          {label}
        </Text>
      </MotiView>
    </View>
  );
};
