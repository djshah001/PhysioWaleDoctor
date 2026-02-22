import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";

type GradientBackgroundProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = "primary",
}) => {
  // const { width: _width, height: _height } = useWindowDimensions();

  const getColors = (): [string, string, ...string[]] => {
    switch (variant) {
      case "dark":
        return ["#0f172a", "#1e293b", "#0f172a"];
      case "secondary":
        // Teal/Blue vibe
        return ["#f0f9ff", "#e0f2fe", "#bae6fd"];
      case "primary":
      default:
        // Subtle Indigo/White mix for a clean premium look
        // Top is slightly tinted, bottom is white
        return ["#eef2ff", "#ffffff", "#ffffff"];
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={variant === "dark" ? "light" : "dark"} />

      {/* Mesh Gradient Emulation using absolute positioned blobs */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={getColors()}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Animated ambient blobs for "premium" feel */}
        {variant !== "dark" && (
          <>
            <MotiView
              from={{ opacity: 0.5, scale: 0.8, translateX: -50 }}
              animate={{ opacity: 0.8, scale: 1.2, translateX: 50 }}
              transition={{
                type: "timing",
                duration: 5000,
                loop: true,
                repeatReverse: true,
              }}
              style={[styles.blob, styles.blob1]}
            />
            <MotiView
              from={{ opacity: 0.4, scale: 1, translateY: 0 }}
              animate={{ opacity: 0.7, scale: 1.1, translateY: -30 }}
              transition={{
                type: "timing",
                duration: 7000,
                loop: true,
                repeatReverse: true,
              }}
              style={[styles.blob, styles.blob2]}
            />
          </>
        )}
      </View>

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
    zIndex: 1,
  },
  blob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.6,
  },
  blob1: {
    top: -100,
    left: -100,
    backgroundColor: "rgba(99, 102, 241, 0.15)", // Indigo
    // filter: 'blur(60px)', // doesn't work in RN natively without skia, but opacity helps
  },
  blob2: {
    top: 100,
    right: -50,
    backgroundColor: "rgba(168, 85, 247, 0.15)", // Purple
  },
});
