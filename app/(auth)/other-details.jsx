import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePicker from "../../components/ReUsables/DatePicker";
import CustomDropDown from "../../components/ReUsables/CustomDropDown";
import CustomInput from "./../../components/ReUsables/CustomInput.jsx";
import { router } from "expo-router";
import CustomBtn from "../../components/CustomBtn.jsx";
import * as Location from "expo-location";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog.jsx";
import AlertBox from "../../components/AlertBox.jsx";
import * as Linking from "expo-linking";

const OtherDetails = () => {
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

  useEffect(() => {
    getCurrentLocation();
    // if(!)
  }, []);

  console.log(location);

  const hideAlert = () => {
    hideDialog();
    if (RequestStatus !== "granted") {
      Linking.openSettings();
    }
  };

  const [hospitals, setHospitals] = useState([]);

  const getNearbyHospitals = async () => {
    const userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation.coords);

    const apiKey = "AIzaSyA8FUC6GCVHUSJ8Lq7H3PKV48NQLXWJ580";
    const radius = 5000; // 5 km

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=hospital&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      setHospitals(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNearbyHospitals();
  }, []);

  console.log(hospitals)

  return (
    <SafeAreaView className="bg-white-300">
      <ScrollView
        className="px-4"
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <View className="px-4 w-full h-screen justify-evenly">
          <View>
            <Text className="font-pbold text-2xl text-center">
              Let’s complete your profile
            </Text>
            <Text className="font-pextrathin text-center text-md">
              It will help us to know more about you!
            </Text>
          </View>
          <AlertBox visible={visible} hideDialog={hideAlert} content={Error} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherDetails;
