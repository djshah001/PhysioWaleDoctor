import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useToast, ToastType } from "../../store/toastStore";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        icon: "checkmark-circle",
        color: "#4ADE80", // green-400
        bgColor: "rgba(74, 222, 128, 0.2)",
        borderColor: "rgba(74, 222, 128, 0.5)",
      };
    case "error":
      return {
        icon: "alert-circle",
        color: "#F87171", // red-400
        bgColor: "rgba(248, 113, 113, 0.2)",
        borderColor: "rgba(248, 113, 113, 0.5)",
      };
    case "warning":
      return {
        icon: "warning",
        color: "#FACC15", // yellow-400
        bgColor: "rgba(250, 204, 21, 0.2)",
        borderColor: "rgba(250, 204, 21, 0.5)",
      };
    case "info":
    default:
      return {
        icon: "information-circle",
        color: "#60A5FA", // blue-400
        bgColor: "rgba(96, 165, 250, 0.2)",
        borderColor: "rgba(96, 165, 250, 0.5)",
      };
  }
};

export default function Toast() {
  const { toast, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!toast) return null;

  const config = getToastConfig(toast.type);

  // Determine standard top offset including status bar
  const topOffset = insets.top + 10;

  return (
    <Animated.View
      entering={SlideInUp.springify()}
      exiting={SlideOutUp.duration(200)}
      style={{
        position: "absolute",
        top: topOffset,
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: "center",
      }}
    >
      <BlurView
        intensity={100}
        tint="dark" // Adjust to 'dark' if using dark mode primarily, or make it dynamic
        experimentalBlurMethod="dimezisBlurView"
        style={{
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          // borderColor: colors.neutral[400],
          // backgroundColor: config.bgColor, // Fallback / tint overlay
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={hideToast}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: config.color,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              // shadowColor: config.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Ionicons name={config.icon as any} size={24} color="#FFF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.neutral[100], // gray-800
                marginBottom: 2,
              }}
            >
              {toast.title}
            </Text>
            {toast.message && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.neutral[200], // gray-600
                  fontWeight: "500",
                }}
              >
                {toast.message}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={hideToast} hitSlop={10}>
            <Ionicons name="close" size={24} color={colors.neutral[200]} />
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
}
