import { Stack } from "expo-router";
import React from "react";
// Import default screen options
const defaultScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

// Modal screen options
const modalScreenOptions = {
  headerShown: false,
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

const ScannerLayout = () => {
  return (
    <Stack
      screenOptions={modalScreenOptions}
    >
      <Stack.Screen
        name="Scan"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Result"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ScannerLayout;
