import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { cssInterop } from "nativewind";
import colors from "../../constants/colors";

cssInterop(LinearGradient, { className: "style" });

interface PremiumCardProps {
  children?: React.ReactNode;
  onPress?: () => void;
  colors?: readonly string[] | string[];
  className?: string;
  delay?: number;
  variant?: string; // dummy prop for compatibility if needed
}

const PremiumCard = ({
  children,
  onPress,
  colors: gradientColors = colors.gradients.primary,
  className = "",
  delay = 0,
}: PremiumCardProps) => {
  const CardContent = (
    <LinearGradient
      colors={gradientColors as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`p-4 rounded-3xl shadow-lg border border-white/20 ${className}`}
    >
      {children}
    </LinearGradient>
  );

  const AnimatedWrapper = (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "timing",
        duration: 500,
        delay: delay,
      }}
    >
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          {CardContent}
        </TouchableOpacity>
      ) : (
        CardContent
      )}
    </MotiView>
  );

  return AnimatedWrapper;
};

export default PremiumCard;
