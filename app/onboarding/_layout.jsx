import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
// Import default screen options
const defaultScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

const OnBoardingLayout = () => {
  return (
    <Stack
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default OnBoardingLayout;
