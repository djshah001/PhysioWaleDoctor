import React from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-paper";
import { router } from "expo-router";
import CustomBtn from "../CustomBtn";

const EmptyAppointments = () => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-4 border-2 border-blue-100">
        <Icon
          source="calendar-blank"
          size={50}
          color="#4A90E2"
        />
      </View>
      <Text className="font-pbold text-xl text-black-400 text-center mt-2">
        No Appointments Found
      </Text>
      <Text className="font-osregular text-md text-black-300 text-center mt-2 mb-6 max-w-xs">
        You don't have any appointments scheduled. Book an appointment with a clinic to get started.
      </Text>
      <CustomBtn
        title="Find Clinics"
        iconName="magnify"
        useGradient
        className="rounded-xl w-48"
        handlePress={() => router.push("/home")}
      />
    </View>
  );
};

export default EmptyAppointments;
