import { View, Text, ScrollView } from "react-native";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClinicsState, useToastSate, useUserDataState } from "../../atoms/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { StatusBar } from "expo-status-bar";
import HorList from "../../components/Home/HorList";
import IconMenu from "../../components/Home/IconMenu";
import PhysiosNearBy from "../../components/Home/PhysiosNearBy";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";

import * as Location from "expo-location";
import { HorizontalList } from "../../constants/Data";
import { Appbar } from "react-native-paper";
import colors from "../../constants/colors";
import { router, useFocusEffect } from "expo-router";
import { apiUrl } from "../../components/Utility/Repeatables";

const Home = () => {
  const [UserData, setUserData] = useUserDataState();
  const [Clinics, setClinics] = useClinicsState();
  const [toast, setToast] = useToastSate();
  const [hospitals, setHospitals] = useState([]);
  const [RequestStatus, setRequestStatus] = useState(null);
  const initialLoadRef = useRef(false);

  const [IsLoading, setIsLoading] = useState(false);

  // Memoize the welcome message to prevent re-renders
  const welcomeMessage = useMemo(
    () => (
      <View>
        <Text className="text-sm leading-4 font-bold text-gray-600">
          Hi, Welcome Back!
        </Text>
        <Text className="text-xl leading-6 font-pbold text-black-200">
          {UserData.name}
        </Text>
      </View>
    ),
    [UserData.name]
  );

  // Optimize API calls with useCallback
  const getLoggedInData = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      router.replace("/sign-in");
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/api/v/auth/getLoggedInData/doctor`,
        {},
        { headers: { authToken } }
      );
      if (res.data.success) {
        setUserData(res.data.loggedInData);
      }
      return res;
    } catch (error) {
      console.error(error?.response?.data || error);
      await AsyncStorage.multiRemove(["authToken", "isLoggedIn"]);
      router.replace("/sign-in");
    }
  }, [setUserData]);

  const getCurrentLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setRequestStatus(status);

    if (status !== "granted") {
      setToast({
        title: "Location Permission Denied",
        visible: true, // FIXED
        type: "error",
      });
      return;
    }

    const providerStatus = await Location.getProviderStatusAsync();
    if (!providerStatus.locationServicesEnabled) {
      setToast({
        title: "Location Services are disabled",
        visible: true, // FIXED
        type: "error",
      });
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserData((prev) =>
        prev?.location?.latitude !== location.coords.latitude ||
        prev?.location?.longitude !== location.coords.longitude
          ? { ...prev, location: location.coords }
          : prev
      );
    } catch (error) {
      console.error("Location error:", error);
      setToast({
        title: "Location Permission Denied",
        visible: true, // FIXED
        type: "error",
      });
    }
  }, [setUserData]);

  const getNearbyHospitals = useCallback(async () => {
    if (!UserData?.location?.latitude || !UserData?.location?.longitude) return;

    setIsLoading(true);
    const url = `${apiUrl}/api/v/clinics/nearbyClinics?latitude=${UserData.location.latitude}&longitude=${UserData.location.longitude}&radius=5`;

    try {
      const response = await axios.get(url);
      setClinics(response.data.clinics || []);
    } catch (error) {
      console.error(error?.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  }, [UserData?.location?.latitude, UserData?.location?.longitude]);

  // Use useFocusEffect to handle focus events more efficiently
  useFocusEffect(
    useCallback(() => {
      if (!UserData || Object.keys(UserData).length === 0) {
        getLoggedInData();
        getCurrentLocation();
        initialLoadRef.current = true;
      }
    }, [getLoggedInData, getCurrentLocation])
  );

  // Only run when location actually changes
  // useEffect(() => {
  //   if (UserData?.location?.latitude && UserData?.location?.longitude) {
  //     getNearbyHospitals();
  //   }
  // }, [UserData]);

  useFocusEffect(
    useCallback(() => {
      if (UserData?.location?.latitude && UserData?.location?.longitude) {
        getNearbyHospitals();
      }
    }, [UserData?.location?.latitude, UserData?.location?.longitude])
  );

  // Use useMemo for the hospital list to prevent unnecessary re-renders
  // const memoizedHospitals = useMemo(() => hospitals, [hospitals]);

  // Memoize the app bar actions to prevent re-renders
  const appBarActions = useMemo(
    () => (
      <>
        <Appbar.Action
          icon="bell-outline"
          color={colors.black[300]}
          onPress={() => router.push("/notifications")}
        />
        <Appbar.Action
          icon="qrcode-scan"
          onPress={() => router.push("Scanner/Scan")}
        />
      </>
    ),
    []
  );

  // Logs true for both empty and non-empty objects
  // To check if object has properties, use Object.keys(UserData).length > 0
  // Logs true if UserData object exists and has properties, false if it's null/undefined
  // console.log(!!UserData);

  console.log(Clinics.length);

  return (
    <SafeAreaView className="bg-white-300">
      <ScrollView className="flex-grow">
        <Appbar.Header
          statusBarHeight={0}
          style={{
            backgroundColor: colors.white[300],
          }}
        >
          <Appbar.Content title={welcomeMessage} />
          {appBarActions}
        </Appbar.Header>

        <View className="gap-4">
          <HorList data={HorizontalList} />
          <IconMenu />
          <PhysiosNearBy clinics={Clinics} isLoading={IsLoading} />
          <View className="mb-10" style={{ height: 90 }} />
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Home;
