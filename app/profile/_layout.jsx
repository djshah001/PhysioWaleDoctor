import { Stack } from "expo-router";
import React from "react";
import colors from "../../constants/colors";

// Import default screen options
const defaultScreenOptions = {
  headerShown: true,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
  headerTitleStyle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  headerTintColor: colors.secondary[300],
};

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        ...defaultScreenOptions,
        contentStyle: { backgroundColor: colors.white[300] },
      }}
    >
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="full-schedule"
        options={{
          title: "Weekly Schedule",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
