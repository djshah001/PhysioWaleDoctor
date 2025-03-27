import { Stack } from "expo-router";
import React from "react";

const AppointmentsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="book"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
};

export default AppointmentsLayout;