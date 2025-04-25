import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { router } from "expo-router";
import colors from "../../constants/colors";

/**
 * EmptyClinicView component displays a message when no clinics are available
 * 
 * @returns {JSX.Element} - Rendered component
 */
const EmptyClinicView = () => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <View className="bg-gray-50 p-6 rounded-xl items-center shadow-sm">
        <View className="bg-secondary-100 rounded-full p-4 mb-4">
          <Icon source="hospital-building" size={40} color={colors.secondary[300]} />
        </View>
        <Text className="font-pbold text-lg text-black-200 text-center mb-2">
          No Clinics Found
        </Text>
        <Text className="text-gray-500 text-center mb-4">
          You haven't registered any clinics yet. Add your first clinic to start managing your practice.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("clinics/register")}
          className="bg-secondary-300 rounded-lg py-2 px-4 flex-row items-center"
        >
          <Icon source="plus" size={18} color={colors.white[400]} />
          <Text className="text-white-400 font-ossemibold ml-2">
            Register Clinic
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyClinicView;
