import { Stack } from "expo-router";
import React from "react";
import colors from "../../constants/colors";

// Import default screen options
const defaultScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

const AnalyticsLayout = () => {
  return (
    <Stack
      screenOptions={{
        ...defaultScreenOptions,
        contentStyle: { backgroundColor: colors.white[300] },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
    </Stack>
  );
};

export default AnalyticsLayout;
