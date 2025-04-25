import { Stack } from "expo-router";
import React from "react";
// Import default screen options
const defaultScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
  gestureEnabled: true,
  gestureDirection: "horizontal",
};

const AppointmentsLayout = () => {
  return (
    <Stack
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="book"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="my-appointments"
        options={{
          presentation: "card",
        }}
      />
      
      <Stack.Screen
        name="reschedule"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
};

export default AppointmentsLayout;