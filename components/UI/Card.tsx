import React from "react";
import { View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "~/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  variant?: "default" | "glass" | "gradient";
  gradientColors?: string[];
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onPress,
  variant = "default",
  gradientColors = ["#667eea", "#764ba2"],
}) => {
  const baseClasses = "bg-white rounded-2xl p-4 shadow-md";
  const glassClasses = "bg-white/90 border border-white/30";
  const gradientClasses = "shadow-lg";

  const content = (
    <View
      className={cn(
        baseClasses,
        variant === "glass" && glassClasses,
        className,
      )}
    >
      {children}
    </View>
  );

  if (variant === "gradient") {
    const gradientContent = (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={cn("rounded-2xl p-4", gradientClasses, className)}
      >
        {children}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} className="active:opacity-80">
          {gradientContent}
        </Pressable>
      );
    }
    return gradientContent;
  }

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    );
  }

  return content;
};
