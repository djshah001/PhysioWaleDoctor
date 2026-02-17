import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View, Platform } from "react-native";
import colors from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";

// Enable NativeWind for LinearGradient
cssInterop(LinearGradient, { className: "style" });

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
  bgColor,
  borderColor,
  textColor,
}) {
  // Define gray colors since they're missing from colors file
  const grayColors = {
    300: "#D1D5DB",
    500: "#6B7280",
  };

  const getBackgroundColor = () => {
    if (bgColor) return bgColor;
    if (disabled) return grayColors[300];
    if (variant === "filled" && !useGradient) return colors.secondary[300];
    return "transparent";
  };

  const getTextColor = () => {
    if (textColor) return textColor;
    if (disabled) return grayColors[500];
    if (variant === "filled") return colors.white[300];
    return colors.secondary[300];
  };

  const getBorderColor = () => {
    if (borderColor) return borderColor;
    if (disabled) return grayColors[300];
    return colors.secondary[300];
  };

  const iconColorToUse = iconColor || getTextColor();

  // Platform-specific shadow class for iOS
  const iosShadowClass = variant === "filled" || useGradient
    ? "shadow-md shadow-black/20"
    : "";

  // Platform-specific elevation style for Android
  const androidElevation = (variant === "filled" || useGradient) && Platform.OS === "android"
    ? { elevation: 4 }
    : {};

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View className="flex-row items-center justify-center space-x-2">
          {iconName && iconPosition === "left" && (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={iconColorToUse}
            />
          )}
          {title && (
            <Text
              className={`text-center font-psemibold text-base ${textClassName}`}
              style={{ color: getTextColor() }}
            >
              {title}
            </Text>
          )}
          {iconName && iconPosition === "right" && (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={iconColorToUse}
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
        activeOpacity={0.7}
        className={`rounded-full overflow-hidden ${className} ${Platform.OS === "ios" ? iosShadowClass : ""}`}
        style={androidElevation}
      >
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          className="py-3.5 px-4 flex-row items-center justify-center min-h-[50px]"
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular button without gradient
  const borderWidth = variant === "outlined" ? "border-2" : "border-0";
  const bgColorStyle = { backgroundColor: getBackgroundColor() };
  const borderColorStyle = { borderColor: getBorderColor() };

  return (
    <TouchableOpacity
      onPress={!disabled && !loading ? handlePress : null}
      activeOpacity={0.7}
      className={`py-3 px-4 rounded-full flex-row items-center justify-center ${borderWidth} min-h-[50px] ${className} ${Platform.OS === "ios" ? iosShadowClass : ""}`}
      style={[
        bgColorStyle,
        borderColorStyle,
        androidElevation
      ]}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}
