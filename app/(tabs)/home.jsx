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

  const getUserData = async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await axios.post(
      `${apiUrl}/api/v/auth/getloggedinuser`,
      {},
      { headers: { authToken: authToken } }
    );
    return res;
  };

  useEffect(() => {
    getUserData().then((userdata) => {
      // console.log(userdata.data);
      if (userdata.data.success) {
        setUserData(userdata.data.user);
      }
    });
    // console.log(UserData);
  }, []);

  // console.log(`${apiUrl}/images/profilePic/${UserData.profilePic}`);

  const [location, setLocation] = useState(null);
  // const [locationService, setLocationServices] = useState(null);
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

    // // let location = await Location.getCurrentPositionAsync({});
    // let i = await Location.getProviderStatusAsync();

    // const i = await Location.getForegroundPermissionsAsync()
    // console.log({i:i});

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  console.log(location);

  const [hospitals, setHospitals] = useState([]);

  const getNearbyHospitals = async () => {
    // const userLocation = await Location.getCurrentPositionAsync({});
    // setLocation(userLocation.coords);

    // const apiKey = "AlzaSy48uzEZAuaR7aq8iKNO8YAC4JxVgSimIzA";
    // const radius = 5000; // 5 km

    // const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=hospital&key=${apiKey}`;


    const url = `${apiUrl}/api/v/clinics/nearbyClinics?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&radius=5`;

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
    getCurrentLocation();
    // getNearbyHospitals();
  }, []);

  useEffect(() => {
    getNearbyHospitals();
  }, [location]);

  // console.log(hospitals);

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          width: "100vw",
        }}
      >
        <TopBar
          firstName={UserData.firstName}
          lastName={UserData.lastName}
          imageUrl={`${apiUrl}/images/profilePic/${UserData.profilePic}`}
        />
        <HorList data={HorizontalList} />
        <IconMenu />
        <PhysiosNearBy clinics={hospitals} />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Home;
