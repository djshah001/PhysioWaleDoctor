import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native";
import { router } from "expo-router";
import { Appbar, Divider, Icon, IconButton } from "react-native-paper";
import axios from "axios";
import Repeatables, { apiUrl } from "../../components/Utility/Repeatables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../constants/colors";
import CustomBtn from "../../components/CustomBtn";

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(true);

  const [PatientData, setPatientData] = useState({});

  //   const handleScanQRCode = async () => {
  //     if (!permission.granted) {
  //       const { status } = await requestPermission();
  //       if (status !== "granted") {
  //         return;
  //       }
  //     }
  //     setShowCamera(true);
  //   };

  //   useEffect(() => {
  //     // handleScanQRCode();
  //     setShowCamera(true);
  //   }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center bg-white-300 gap-2 ">
        <Text>We need your permission to show the camera</Text>
        <CustomBtn
          handlePress={requestPermission}
          title="grant permission"
          className="bg-blueishGreen-200"
        />
      </View>
    );
  }

  const handleBarcodeScan = async (QrData) => {
    console.log(QrData.data);
    const authToken = await AsyncStorage.getItem("authToken");
    // console.log(`${apiUrl}/api/v/users/?id=${QrData.data}`);
    try {
      const res = await axios.get(`${apiUrl}/api/v/users/?id=${QrData.data}`, {
        headers: { authToken: authToken },
      });
      if (res.data.success) {
        setPatientData(res.data.data);
      }
      const result = await axios.get(
        `${apiUrl}/api/v/self-test-result?id=${QrData.data}`
      );
      if (result.data.success) {
        setPatientData((prev) => ({
          ...prev,
          selftestResults: result.data.data,
        }));
      }
      //   console.log(result.data);
      setShowCamera(false);
    } catch (error) {
      console.log("error occured");
    }
  };

  if (showCamera) {
    return (
      <SafeAreaView className="flex-1">
        <CameraView
          autofocus
          //   ratio="4:3"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          // className="flex-1 w-screen h-screen"
          style={{
            flex: 1,
          }}
          onBarcodeScanned={handleBarcodeScan}
        />
        <View className="absolute z-50 bottom-1/2 right-1/ w-screen bg-transparent items-center  ">
          <Icon
            source="scan-helper"
            color="#fff"
            size={250}
            //   onPress={() => router.push("all-notifications")}
            className="self-center"
          />
        </View>
        <View className="flex-row absolute z-30 bottom-safe-offset-40 right-1/ justify-around w-screen bg-transparent self-center ">
          <IconButton
            icon="qrcode-scan"
            iconColor="#fff"
            size={50}
            //   onPress={() => router.push("all-notifications")}
            // className="border-2 rounded-full"
          />

          <IconButton
            icon="close-circle-outline"
            iconColor="#fff"
            size={50}
            onPress={() => router.back()}
            // className="border-2 rounded-full p-0"
          />
        </View>
        {/* <Button title="Close Camera" onPress={() => router.back()} /> */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white-300 flex-1 ">
      <Appbar.Header
        mode="center-aligned"
        // safeAreaInsets={{ bottom }}
        // elevated={true}
        // elevation={3}
        className=" mt-[-25px] "
        style={{
          // height: 60,
          backgroundColor: colors.white[300],
          // marginTop:-20,
          // paddingVertical:10
        }}
      >
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content
          // title="Register Clinic"
          title={
            <View>
              {/* <Text className="text-sm leading-4 font-bold text-gray-600">
                  Hi, Welcome Back!
                </Text> */}
              <Text className="text-xl leading-6 font-pbold text-black-200">
                {/* {PatientData?.name} */}
                Patient Details
              </Text>
            </View>
          }
        />
      </Appbar.Header>
      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow px-4 w-full justify-aroun self-center gap-2 "
      >
        <PData label="name" data={PatientData?.name} />
        <PData label="email" data={PatientData?.email} />
        <PData label="contact number" data={PatientData?.contactNumber} />
        <PData label="age" data={PatientData?.age} />
        <PData label="date of birth" data={PatientData?.DOB} />
        <PData label="gender" data={PatientData?.gender} />
        <PData label="weight" data={`${PatientData?.weight} kg`} />
        <PData label="height" data={`${PatientData?.height} cm`} />

        {PatientData?.selftestResults?.length > 0 ? null : (
          <PData label="selftestResults" data="Not Done any self tests" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Scan;

function PData({ label, data }) {
  return (
    <>
      <View>
        <Text className="font-pregular text-lg text-blueishGreen-200 ">
          <Text className="font-ossemibold text-xl text-accent capitalize ">
            {label} :{" "}
          </Text>

          {label === "date of birth"
            ? new Date(data).toLocaleDateString()
            : data}
        </Text>
      </View>
      <Divider
        bold={true}
        style={{
          backgroundColor: colors.blueishGreen["400"],
        }}
      />
    </>
  );
}
