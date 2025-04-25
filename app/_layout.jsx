import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

// Define default screen options
const defaultScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

import { RecoilRoot } from "recoil";

import "../global.css";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import colors from "../constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomToast from "../components/ReUsables/CustomToast";
import { StatusBar } from "expo-status-bar";
import CustomActionSheet from "../components/ReUsables/CustomActionSheet";
import { SheetProvider } from "react-native-actions-sheet";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#050316",
  },
};

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
      <PaperProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SheetProvider>
            <Stack screenOptions={defaultScreenOptions}>
              <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
              <Stack.Screen name="appointments" />
              <Stack.Screen name="clinics" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="analytics" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="Scanner" />
              <Stack.Screen name="(Self-Test)" />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ animation: "fade" }} />
            </Stack>
            <CustomToast />
            <StatusBar style="auto" />
            {/* <CustomActionSheet /> */}
          </SheetProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </RecoilRoot>
  );
};

export default Rootlayout;
