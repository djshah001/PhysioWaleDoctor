import { Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [IsAppFirstOpened, setIsAppFirstOpened] = useState(null);
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    const checkAppLaunch = async () => {
      try {
        const val = await AsyncStorage.getItem("@IsAppFirstOpened");
        if (val === null) {
          await AsyncStorage.setItem("@IsAppFirstOpened", "true");
          setIsAppFirstOpened(true);
        } else {
          setIsAppFirstOpened(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    AsyncStorage.getItem("isLoggedIn").then((isLoggedIn) => {
      setIsLoggedIn(Boolean(isLoggedIn));
    });

    checkAppLaunch();
  }, []);

  // useEffect(() => {
  //   if (IsAppFirstOpened === false) {
  //     router.replace("/sign-in");
  //   }
  // }, [IsAppFirstOpened]);

  if (IsAppFirstOpened === null) {
    return (
      <SafeAreaView>
        <Text>Icon Screen</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {IsAppFirstOpened ? (
        <Redirect href="/onboarding" />
      ) : IsLoggedIn ? (
        <Redirect href="/home" />
      ) : (
        <Redirect href="/sign-in" />
      )}
    </SafeAreaView>
  );
};

export default Index;
