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

const AuthLayout = () => {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="send-otp" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
      <Stack.Screen name="other-details" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
