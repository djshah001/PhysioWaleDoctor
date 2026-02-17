import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiText, MotiView } from "moti";
import { cssInterop } from "nativewind";

cssInterop(MotiView, { className: "style" });
cssInterop(MotiText, { className: "style" });

interface TabButtonProps {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  focusedIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  tabBarWidth: number;
  index: number;
  TranslateAnimation: any; // Moti dynamic animation type is tricky to import correctly sometimes
  w: number;
}

export default function TabButton({
  isFocused,
  onPress,
  onLongPress,
  iconName,
  focusedIcon,
  label,
  tabBarWidth,
  index,
  TranslateAnimation,
  w,
}: TabButtonProps) {
  // This useEffect already handles animation when tab becomes focused
  useEffect(() => {
    if (isFocused) {
      TranslateAnimation.animateTo({
        translateX: w * index,
        left: w / 2 - 25,
      });
    }
  }, [isFocused, index, w, TranslateAnimation]);

  return (
    <Pressable
      onPress={() => {
        // Call the onPress handler from parent
        onPress();
      }}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <MotiView
        animate={{ marginTop: isFocused ? 12 : 0 }}
        transition={{
          type: "spring",
          duration: 2000,
        }}
      >
        <Ionicons
          name={isFocused ? focusedIcon : iconName}
          size={24}
          color={isFocused ? "#fff" : "#222"}
        />
      </MotiView>
      <MotiText
        animate={{ opacity: isFocused ? 0 : 1 }}
        transition={{
          type: "spring",
          duration: 350,
        }}
        className={`text-[11px] ${
          isFocused ? "text-white-300" : "text-black-700"
        }`}
      >
        {label}
      </MotiText>
    </Pressable>
  );
}
