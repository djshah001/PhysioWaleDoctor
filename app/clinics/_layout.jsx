import { Stack } from "expo-router";
import React from "react";
import colors from "../../constants/colors";

const ClinicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white[300] },
        // animation: "slide_from_right",
      }}
    >
      
      <Stack.Screen
        name="[clinic]"
        options={{
        //   headerShown: false,
          animation: "ios_from_right",
          animationDuration: 5000,
          animationTypeForReplace: "pop",
          headerStyle: { backgroundColor: "red" },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default ClinicLayout;
