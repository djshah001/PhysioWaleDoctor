import "../global.css";
import { Stack, router } from "expo-router";
import { useAtom } from "jotai";
import { isAppFirstOpenedAtom } from "../store/authAtoms";
import { SheetProvider } from "react-native-actions-sheet";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import {
  useFonts as usePoppins,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import {
  useFonts as useOpenSans,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
} from "@expo-google-fonts/open-sans";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../hooks/useAuth";
import Toast from "../components/ui/Toast";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAppFirstOpened, loadUserData, isLoggedIn, isProfileCompleted } =
    useAuth();

  const [poppinsLoaded] = usePoppins({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  const [openSansLoaded] = useOpenSans({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
  });

  const fontsLoaded = poppinsLoaded && openSansLoaded;

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Redirect to complete profile if logged in but incomplete

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      {/* <SafeAreaProvider> */}
      <ActionSheetProvider>
        <SheetProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAppFirstOpened}>
              <Stack.Screen name="onboarding" />
            </Stack.Protected>
            <Stack.Protected guard={!isAppFirstOpened}>
              {/* Authenticated & Profile Completed -> Main App */}
              <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="(tabs)" />
                {/* <Stack.Screen name="(profile)" /> */}
              </Stack.Protected>

              {/* Not Logged In OR Profile Incomplete -> Auth Flow */}
              <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="(auth)" />
              </Stack.Protected>
            </Stack.Protected>
          </Stack>
          <Toast />
        </SheetProvider>
      </ActionSheetProvider>
      {/* </SafeAreaProvider> */}
    </GestureHandlerRootView>
  );
}
