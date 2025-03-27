import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MotiText, MotiView } from "moti";

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
}) {
  // This useEffect already handles animation when tab becomes focused
  useEffect(() => {
    if (isFocused) {
      TranslateAnimation.animateTo({
        translateX: w * index,
      });
    }
  }, [isFocused, index, w, TranslateAnimation]);
  
  return (
    <Pressable
      onPress={() => {
        // Call the onPress handler from parent
        onPress();
        // Remove this duplicate animation call - it's already handled in useEffect
        // and in the TabBarComp's onPress function
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
          duration: 2000, // This is quite long for a UI animation
        }}
      >
        <Ionicons
          name={`${isFocused ? focusedIcon : iconName}`}
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
          isFocused ? "text-white-300" : "text-black-100"
        }`}
      >
        {label}
      </MotiText>
    </Pressable>
  );
}
