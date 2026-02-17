import React from "react";
import { View, Platform, ViewProps, StyleProp, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { cssInterop } from "nativewind";

cssInterop(BlurView, { className: "style" });

interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?:
    | "light"
    | "dark"
    | "default"
    | "prominent"
    | "systemThinMaterial"
    | "systemMaterial"
    | "systemThickMaterial"
    | "systemChromeMaterial"
    | "systemUltraThinMaterial"
    | "systemThinMaterialLight"
    | "systemMaterialLight"
    | "systemThickMaterialLight"
    | "systemChromeMaterialLight"
    | "systemUltraThinMaterialDark"
    | "systemThinMaterialDark"
    | "systemMaterialDark"
    | "systemThickMaterialDark"
    | "systemChromeMaterialDark";
  className?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const GlassView = ({
  intensity = 50,
  tint = "light",
  className,
  children,
  style,
  ...props
}: GlassViewProps) => {
  const isAndroid = Platform.OS === "android";

  if (isAndroid) {
    // Android fallback or simplified glass effect
    return (
      <View
        className={`bg-white/90 border border-white/20 ${className}`}
        style={[style]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      className={`overflow-hidden bg-white/10 ${className}`}
      style={[
        {
          borderColor: "rgba(255,255,255,0.3)",
          borderWidth: 1,
        },
        style,
      ]}
      {...(props as any)}
    >
      {children}
    </BlurView>
  );
};

export default GlassView;
