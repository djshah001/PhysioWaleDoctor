import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

import axios from "axios";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import {useUserDataState} from './../../atoms/store.js';

import CustomBtn from "./../../components/CustomBtn.jsx";
import Repeatables from './../../components/Utility/Repeatables.jsx';

import colors from "./../../constants/colors.js";
const Clinic = () => {
  const [UserData, setUserData] = useUserDataState();

  const { apiUrl } = Repeatables();

  // const getClinics = async () => {
  //   console.log(UserData.clinics)
  //   const res = await axios.get(
  //     `${apiUrl}/api/v/clinics/by-doctor?id=6783ebd2f0bc7b8583940d15`
  //   );
  //   console.log(res.data);
  // };

  useEffect(() => {
    // getClinics();
    // console.log(UserData.clinics)
  }, []);

  if (UserData.clinics.length === 0) {
    return (
      <SafeAreaView className="bg-white-300 flex-1 ">
        <ScrollView
          // className="px-4"
          contentContainerClassName=" w-full h-screen justify-center items-center gap-4 "
        >
          {/* <LinearGradient
            colors={[colors.blues[400], colors.blues[600], colors.blues[800]]} // Gradient colors (light to dark)
            start={{ x: 0, y: 0 }} // Start point of the gradient
            end={{ x: 0, y: 1 }} // End point of the gradient
            className="w-full h-screen justify-center items-center px-6 gap-6 "
          > */}
            <MaterialIcons
              name="add-location-alt"
              size={150}
              color={colors.blueishGreen[500]}
            />
            <Text className="text-2xl text-center text-black-200 ">
              You have not added any clinics yet
            </Text>
            <CustomBtn
              title="Register Clinic"
              //  iconName: any;
              handlePress={() => router.push("clinics/register")}
              //  loading: any;
              customStyles="w-4/6"
              secondScheme={true}
            />
          {/* </LinearGradient> */}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white-300 flex-1 ">
      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow px-10 w-full h-scree justify-evenly self-center "
      >
        <Text>Clinic</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Clinic;
