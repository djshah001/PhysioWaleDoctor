import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import colors from "../../constants/colors";

cssInterop(LinearGradient, { className: "style" });

interface GradientButtonProps {
  title?: string;
  onPress?: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  gradientColors?: readonly string[] | string[];
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const GradientButton = ({
  title,
  onPress,
  iconName,
  gradientColors = colors.gradients.primary,
  className = "",
  textClassName = "",
  isLoading = false,
  disabled = false,
}: GradientButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      className={`w-full overflow-hidden rounded-xl shadow-md ${
        disabled ? "opacity-60" : ""
      } ${className}`}
    >
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="py-3 px-6 flex-row items-center justify-center gap-2"
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            {iconName && <Ionicons name={iconName} size={20} color="white" />}
            <Text
              className={`text-white font-psemibold text-lg ${textClassName}`}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
