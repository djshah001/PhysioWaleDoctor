import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../../components/Home/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserDataState } from "../../atoms/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { StatusBar } from "expo-status-bar";
import HorList from "../../components/Home/HorList";
import IconMenu from "../../components/Home/IconMenu";
import PhysiosNearBy from "../../components/Home/PhysiosNearBy";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";

import * as Location from "expo-location";
import { HorizontalList } from "../../constants/Data";

const Home = () => {
  const [UserData, setUserData] = useUserDataState();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const getLoggedInData = async () => {
    console.log("first");
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await axios.post(
      `${apiUrl}/api/v/auth/getLoggedInData/doctor`,
      {},
      { headers: { authToken: authToken } }
    );
    console.log(res.data);
    if (res.data.success) {
      setUserData(res.data.loggedInData);
    }
    return res;
  };

  const [RequestStatus, setRequestStatus] = useState(null);

  const {
    IsLoading,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
    Error,
    setError,
  } = useLoadingAndDialog();

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);
    setRequestStatus(status);

    if (status !== "granted") {
      setError("Permission to access location was denied");
      showDialog();
      return;
    }

    const providerStatus = await Location.getProviderStatusAsync();
    if (!providerStatus.locationServicesEnabled) {
      setError(
        "Location services (GPS) are disabled. Please enable them to proceed."
      );
      showDialog();
      return;
    }

    // const i = await Location.getForegroundPermissionsAsync()
    // console.log({i:i});

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    console.log(location);
    setUserData((prev) => ({ ...prev, location: location.coords }));
  };

  const [hospitals, setHospitals] = useState([]);

  const getNearbyHospitals = async () => {
    // const userLocation = await Location.getCurrentPositionAsync({});
    // setLocation(userLocation.coords);

    // const apiKey = "AlzaSy48uzEZAuaR7aq8iKNO8YAC4JxVgSimIzA";
    // const radius = 5000; // 5 km

    // const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=hospital&key=${apiKey}`;

    const url = `${apiUrl}/api/v/clinics/nearbyClinics?latitude=${UserData.location.latitude}&longitude=${UserData.location.longitude}&radius=5`;

    // console.log(url);

    try {
      const response = await axios.get(url);
      // console.log({ res: response.data });
      setHospitals(response.data.clinics);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLoggedInData();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // getNearbyHospitals();
  }, []);

  useEffect(() => {
    getNearbyHospitals();
  }, [UserData.location]);

  // console.log(hospitals);

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          width: "100vw",
        }}
      >
        <TopBar name={UserData.name} imageUrl={UserData.profilePic} />
        <HorList data={HorizontalList} />
        <IconMenu />
        <PhysiosNearBy clinics={hospitals} />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Home;
