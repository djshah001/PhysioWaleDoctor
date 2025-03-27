import React from "react";
import { Stack } from "expo-router";

const SelfTestLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="Self-Test"
        options={{
          headerShown: false,

          headerTitleStyle: {
            fontFamily: "OpenSans-Bold",
            // fontWeight: 600,
            fontSize: 18,
            color: "#5CAFFF",
            letterSpacing: 1.2,
          },
          headerTitleAlign: "center",
          headerStyle: { height: 40 },
        }}
      />
      <Stack.Screen
        name="questions/[question]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default SelfTestLayout;
