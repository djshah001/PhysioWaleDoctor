import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

import { RecoilRoot } from "recoil";

import "../global.css";
import { PaperProvider } from "react-native-paper";
import colors from "../constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomToast from "../components/ReUsables/CustomToast";

const Rootlayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-ExtraBold": require("../assets/fonts/OpenSans-ExtraBold.ttf"),
    "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <RecoilRoot>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(notifications)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(Self-Test)" options={{ headerShown: false }} />
            <Stack.Screen
              name="clinics/register"
              options={{
                headerShown: false,
                title: "Register Clinic",
                animation: "slide_from_bottom",
                headerTitleStyle: {
                  fontFamily: "OpenSans-Bold",
                  // fontWeight: 600,
                  fontSize: 18,
                  color: colors.blues[400],
                  letterSpacing: 1.2,
                },
                headerTitleAlign: "center",
                headerStyle: { height: 40 },
                // headerTransparent:true,
              }}
            />
          </Stack> */}
          <Slot />
          <CustomToast/>
        </GestureHandlerRootView>
      </PaperProvider>
    </RecoilRoot>
  );
};

export default Rootlayout;
