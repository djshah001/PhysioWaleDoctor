import React from "react";
import { Text, ActivityIndicator, View } from "react-native";
import { MotiPressable } from "moti/interactions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import clsx from "clsx";

interface CustomBtnProps {
  title?: string;
  handlePress: () => void;
  variant?: "filled" | "outlined" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  iconPosition?: "left" | "right";
  useGradient?: boolean;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

const CustomBtn: React.FC<CustomBtnProps> = ({
  title,
  handlePress,
  variant = "filled",
  loading = false,
  disabled = false,
  className,
  textClassName,
  iconName,
  iconSize = 20,
  iconColor,
  iconPosition = "left",
  useGradient = false,
  gradientColors = ["#38bdf8", "#0ea5e9"], // Sky blue gradient
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  bgColor,
  borderColor,
  textColor,
}) => {
  const baseContainerStyle =
    "flex-row items-center justify-center rounded-2xl min-h-[56px] px-6";

  const getVariantStyle = () => {
    if (disabled) return "bg-gray-200 border-gray-200";
    if (variant === "filled" && !useGradient)
      return "bg-sky-500 border-sky-500 shadow-md shadow-sky-200";
    if (variant === "outlined") return "bg-transparent border-2 border-sky-500";
    if (variant === "ghost") return "bg-transparent border-transparent";
    return "";
  };

  const getTextStyle = () => {
    if (disabled) return "text-gray-400";
    if (variant === "filled") return "text-white";
    if (variant === "outlined" || variant === "ghost") return "text-sky-600";
    return "text-black";
  };

  // Explicit colors for Icons if not provided
  const resolvedIconColor = iconColor
    ? iconColor
    : disabled
    ? "#9ca3af"
    : variant === "filled"
    ? "white"
    : "#0284c7";

  return (
    <MotiPressable
      onPress={!disabled && !loading ? handlePress : undefined}
      animate={({ pressed }) => {
        "worklet";
        return {
          scale: pressed && !disabled ? 0.96 : 1,
          opacity: disabled ? 0.8 : 1,
        };
      }}
      transition={{ type: "timing", duration: 100 }}
      style={{ width: "100%" }}
    >
      {/* Container Logic for Gradient or Solid */}
      {useGradient && !disabled && variant === "filled" ? (
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          className={clsx(
            baseContainerStyle,
            "shadow-lg shadow-sky-500/30",
            className
          )}
        >
          <Content
            loading={loading}
            iconName={iconName}
            iconPosition={iconPosition}
            iconSize={iconSize}
            title={title}
            textClassName={clsx("font-bold text-lg", textClassName)}
            textColor={textColor || "white"}
            iconColor={resolvedIconColor}
          />
        </LinearGradient>
      ) : (
        <View
          className={clsx(
            baseContainerStyle,
            getVariantStyle(),
            bgColor ? `bg-[${bgColor}]` : "",
            borderColor ? `border-[${borderColor}]` : "",
            className
          )}
        >
          <Content
            loading={loading}
            iconName={iconName}
            iconPosition={iconPosition}
            iconSize={iconSize}
            title={title}
            textClassName={clsx(
              "font-bold text-lg",
              getTextStyle(),
              textClassName
            )}
            textColor={textColor}
            iconColor={resolvedIconColor}
          />
        </View>
      )}
    </MotiPressable>
  );
};

const Content = ({
  loading,
  iconName,
  iconPosition,
  iconSize,
  title,
  textClassName,
  textColor,
  iconColor,
}: any) => (
  <>
    {loading ? (
      <ActivityIndicator color={textColor || iconColor} size="small" />
    ) : (
      <View className="flex-row items-center justify-center gap-3">
        {iconName && iconPosition === "left" && (
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        )}
        {title && (
          <Text
            className={textClassName}
            style={textColor ? { color: textColor } : {}}
          >
            {title}
          </Text>
        )}
        {iconName && iconPosition === "right" && (
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        )}
      </View>
    )}
  </>
);

export default CustomBtn;
