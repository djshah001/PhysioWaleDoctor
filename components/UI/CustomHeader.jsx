import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import colors from "../../constants/colors";
import { Appbar } from "react-native-paper";
import { cssInterop } from "nativewind";

cssInterop(Appbar, { className: "style" });

const CustomHeader = ({
  title,
  textColor = colors.white[400],
  gradient = colors.gradients.secondary,
  className,
  Children,
  BottomChildren,
  statusBarHeight = true,
}) => {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={`rounded-b-2xl shadow-md overflow-hidden mb-2 ${className}`}
    >
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={statusBarHeight ? undefined : 0}
        mode="center-aligned"
      >
        <Appbar.BackAction onPress={() => router.back()} color={textColor} />
        <Appbar.Content
          title={title}
          titleStyle={{ fontWeight: "bold", color: textColor }}
        />
        {Children}
      </Appbar.Header>
      {BottomChildren}
    </LinearGradient>
  );
};

export default CustomHeader;
