import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import colors from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CustomBtn({
  title,
  handlePress,
  variant = "filled",
  loading = false,
  disabled = false,
  className = "",
  textClassName = "",
  iconName,
  iconSize = 20,
  iconColor,
  iconPosition = "left",
  useGradient = false,
  gradientColors = [colors.secondary[200], colors.secondary[300]],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
}) {
  // Define gray colors since they're missing from colors file
  const grayColors = {
    300: "#D1D5DB",
    500: "#6B7280",
  };

  const getBackgroundColor = () => {
    if (disabled) return grayColors[300];
    if (variant === "filled" && !useGradient) return colors.secondary[300];
    return "transparent";
  };

  const getTextColor = () => {
    if (disabled) return grayColors[500];
    if (variant === "filled") return colors.white[300];
    return colors.secondary[300];
  };

  const getBorderColor = () => {
    if (disabled) return grayColors[300];
    return colors.secondary[300];
  };

  const iconColorToUse = iconColor || getTextColor();

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {iconName && iconPosition === "left" && (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={iconColorToUse}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className={`text-center font-psemibold text-base ${textClassName}`}
            style={{ color: getTextColor() }}
          >
            {title}
          </Text>
          {iconName && iconPosition === "right" && (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={iconColorToUse}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </>
  );

  // If using gradient and not disabled and variant is filled
  if (useGradient && !disabled && variant === "filled") {
    return (
      <TouchableOpacity
        onPress={!disabled && !loading ? handlePress : null}
        className={`rounded-full ${className} overflow-hidden`}
        activeOpacity={0.8}
        style={{
          shadowColor: gradientColors[1],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 6,
          backgroundColor: "transparent", // Ensure background is visible
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          className={`py-4 px-4 flex-row items-center justify-center rounded-full`}
          style={{
            borderWidth: 0,
            minHeight: 50, // Ensure minimum height for visibility
          }}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular button without gradient
  return (
    <TouchableOpacity
      onPress={!disabled && !loading ? handlePress : null}
      className={`py-3 px-4 rounded-full flex-row items-center justify-center ${className}`}
      activeOpacity={0.8}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
        borderWidth: variant === "outlined" ? 2 : 0,
        shadowColor:
          variant === "filled" ? colors.secondary[300] : "transparent",
        shadowOffset: { width: 0, height: variant === "filled" ? 3 : 0 },
        shadowOpacity: variant === "filled" ? 0.2 : 0,
        shadowRadius: variant === "filled" ? 4 : 0,
        elevation: variant === "filled" ? 4 : 0,
        minHeight: 50, // Ensure minimum height for visibility
      }}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}
