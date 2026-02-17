import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import colors from "../../constants/colors";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GradientCardProps {
  variant?:
    | "primary"
    | "secondary"
    | "secondary2"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "glass"
    | "accentGlass"
    | "primaryGlass"
    | "dark"
    | "light";
  gradientColors?: string[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  animated?: boolean;
  animationProps?: any; // MotiProps
  children?: React.ReactNode;
  className?: string; // For NativeWind
}

const GradientCard: React.FC<GradientCardProps> = ({
  variant = "light",
  gradientColors,
  style,
  contentStyle,
  animated = true,
  animationProps = {},
  children,
  className,
  ...props
}) => {
  let colorsList: string[];

  if (!gradientColors) {
    switch (variant) {
      case "primary":
        colorsList = colors.gradients.primary;
        break;
      case "secondary":
        colorsList = colors.gradients.secondary;
        break;
      case "secondary2":
        colorsList = colors.gradients.secondary2;
        break;
      case "accent":
        colorsList = colors.gradients.accent;
        break;
      case "success":
        colorsList = colors.gradients.success;
        break;
      case "warning":
        colorsList = colors.gradients.warning;
        break;
      case "error":
        colorsList = colors.gradients.error;
        break;
      case "glass":
        colorsList = colors.gradients.glass;
        break;
      case "accentGlass":
        colorsList = colors.gradients.accentGlass;
        break;
      case "primaryGlass":
        colorsList = colors.gradients.primaryGlass;
        break;
      case "dark":
        colorsList = colors.gradients.dark;
        break;
      case "light":
      default:
        colorsList = colors.gradients.light;
        break;
    }
  } else {
    colorsList = gradientColors;
  }

  const CardContent = (
    <View
      className={twMerge(
        "rounded-2xl overflow-hidden mb-4 bg-white shadow-sm elevation-2",
        className
      )}
      style={style}
    >
      <LinearGradient
        colors={colorsList as unknown as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </LinearGradient>
    </View>
  );

  if (animated) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        {...animationProps}
      >
        {CardContent}
      </MotiView>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

export default GradientCard;
