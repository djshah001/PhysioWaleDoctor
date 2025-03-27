import { Stack } from "expo-router";
import React from "react";

const NotificationsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "OpenSans-Bold",
          fontSize: 24,
          color: "#5CAFFF",
          letterSpacing: 1.2,
        },
        headerTitleAlign: "center",
        headerStyle: { height: 80 },
        presentation: "formSheet",
        animation: "slide_from_right",
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