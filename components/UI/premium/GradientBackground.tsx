import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Canvas, Circle, BlurMask, Fill } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import colors from "tailwindcss/colors";

type GradientBackgroundProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = "primary",
}) => {
  const { width, height } = useWindowDimensions();

  // ── Premium Modern Color Palettes ──
  const themes = {
    primary: {
      bg: colors.violet[100], // Very subtle warm tint
      // bg: "#A78BFA", // Very subtle warm tint
      blob1: colors.orange[400], // Orange 300
      blob2: colors.rose[400], // Rose 300
      blob3: colors.amber[400], // Amber 300
    },

    secondary: {
      bg: "#FFF1F2", // Warm Rose 50
      blob1: "#F472B6", // Vibrant Pink
      blob2: "#C084FC", // Deep Purple
      blob3: "#FBBF24", // Accent Amber
    },
    dark: {
      bg: "#0F172A", // Deep Slate 900
      blob1: "#38BDF8", // Neon Light Blue
      blob2: "#818CF8", // Deep Indigo
      blob3: "#2DD4BF", // Vibrant Teal
    },
  };

  const theme = themes[variant];

  // ── Fluid Animation Values ──
  // We use Reanimated shared values to smoothly drift the coordinates of the circles.
  const cx1 = useSharedValue(width * 0.2);
  const cy1 = useSharedValue(height * 0.2);

  const cx2 = useSharedValue(width * 0.8);
  const cy2 = useSharedValue(height * 0.8);

  const cx3 = useSharedValue(width * 0.5);
  const cy3 = useSharedValue(height * 0.5);

  useEffect(() => {
    // Blob 1: Drifts smoothly around the top-left quadrant
    cx1.value = withRepeat(
      withTiming(width * 0.4, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    cy1.value = withRepeat(
      withTiming(height * 0.4, {
        duration: 9500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    // Blob 2: Drifts smoothly around the bottom-right quadrant
    cx2.value = withRepeat(
      withTiming(width * 0.6, {
        duration: 7000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    cy2.value = withRepeat(
      withTiming(height * 0.6, {
        duration: 8500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    // Blob 3: Does a wider sweep across the screen
    cx3.value = withRepeat(
      withTiming(width * 0.8, {
        duration: 10000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    cy3.value = withRepeat(
      withTiming(height * 0.2, {
        duration: 11000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [width, height]);

  return (
    <View style={styles.container}>
      <StatusBar style={variant === "dark" ? "light" : "dark"} />

      {/* ── Skia Mesh Gradient Canvas ── */}
      <View style={StyleSheet.absoluteFill}>
        <Canvas style={{ flex: 1 }}>
          <Fill color={theme.bg} />

          {/* By using massive circles with high blur masks, they bleed together 
            seamlessly, creating a fluid, modern mesh gradient.
          */}
          <Circle
            cx={cx1}
            cy={cy1}
            r={width * 0.6}
            color={theme.blob1}
            opacity={0.35}
          >
            <BlurMask blur={90} style="normal" />
          </Circle>

          <Circle
            cx={cx2}
            cy={cy2}
            r={width * 0.6}
            color={theme.blob2}
            opacity={0.35}
          >
            <BlurMask blur={90} style="normal" />
          </Circle>

          <Circle
            cx={cx3}
            cy={cy3}
            r={width * 0.5}
            color={theme.blob3}
            opacity={0.3}
          >
            <BlurMask blur={90} style="normal" />
          </Circle>
        </Canvas>
      </View>

      {/* ── Content Wrapper ── */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 1, // Ensures content sits above the Skia canvas
  },
});
