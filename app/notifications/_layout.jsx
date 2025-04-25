import { Stack } from "expo-router";
import React from "react";
// Modal screen options
const modalScreenOptions = {
  headerShown: false,
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

const NotificationsLayout = () => {
  return (
    <Stack
      screenOptions={{
        ...modalScreenOptions,
        headerTitleStyle: {
          fontFamily: "OpenSans-Bold",
          fontSize: 24,
          color: "#5CAFFF",
          letterSpacing: 1.2,
        },
        headerTitleAlign: "center",
        headerStyle: { height: 80 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
        }}
      />
    </Stack>
  );
};

export default NotificationsLayout;