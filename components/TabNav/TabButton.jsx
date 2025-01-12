import React from "react";
import { Pressable, Text, TouchableOpacity } from "react-native";
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
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: "center",
      }} // className="items-center justify-center"
    >
      {/* <MotiView
        className={` ${
          isFocused ? "bg-[#95AEFE] shadow-md shadow-blue-600" : "bg-white-300"
        } justify-center items-center w-[50px] h-[50px] rounded-full absolute `}
        // animate={{ translateX: tabBarWidth / (index + 1) }}
      /> */}

      <MotiView
        animate={{ marginTop: isFocused ? 12 : 0 }}
        transition={{
          type: "spring",
          duration: 2000,
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
