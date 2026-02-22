import React from "react";
import { View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { cn } from "~/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  intensity?: number;
  tint?: "light" | "dark" | "default";
  className?: string;
  style?: ViewStyle;
  contentContainerClassName?: string;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 20,
  tint = "light",
  className,
  style,
  contentContainerClassName,
}) => {
  // On Android, BlurView can sometimes be heavy or not supported well depending on the version/device.
  // We can provide a fallback or just use it. expo-blur supports Android now.

  return (
    <BlurView
      className={cn(
        "overflow-hidden border-0 shadow-md shadow-neutral-500",
        className,
      )}
      intensity={intensity} // Disable actual blur on android if we use opacity hack, or keep it if performance is good
      tint={"prominent"}
      experimentalBlurMethod="dimezisBlurView"
      style={style}
    >
      {/* White overlay for better contrast if needed */}
      <View className={cn("p-4 overflow-hidden", contentContainerClassName)}>
        {children}
      </View>
    </BlurView>
  );
};
