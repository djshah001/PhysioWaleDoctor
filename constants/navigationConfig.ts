import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

// Common navigation configuration to ensure consistent transitions
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: "white" },
  animationDuration: 300, // Consistent animation duration
};

// Animation configuration for modal screens
export const modalScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: { backgroundColor: "white" },
  animationDuration: 300,
};

// Animation configuration for tab screens
export const tabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: true, // often useful
};

// Shared transition specification for screens
export const screenTransition = {
  screenOptions: {
    ...defaultScreenOptions,
    gestureEnabled: true,
    gestureDirection: "horizontal" as const,
  },
};
