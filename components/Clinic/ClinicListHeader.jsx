import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon, Divider } from "react-native-paper";
import { router } from "expo-router";
import colors from "../../constants/colors";

/**
 * ClinicListHeader component displays the clinics count and add new button
 * 
 * @param {Object} props - Component props
 * @param {number} props.clinicsCount - Number of clinics
 * @returns {JSX.Element} - Rendered component
 */
const ClinicListHeader = ({ clinicsCount = 0 }) => {
  return (
    <View className="px-4 mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="font-pbold text-lg text-black-700">
          Your Clinics ({clinicsCount})
        </Text>
        <TouchableOpacity
          onPress={() => router.push("clinics/register")}
          className="flex-row items-center"
        >
          <Icon source="plus" size={16} color={colors.secondary[300]} />
          <Text className="ml-1 text-secondary-300 font-ossemibold text-sm">
            Add New
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="font-osregular text-sm text-gray-600">
        Tap on a clinic to view detailed analytics
      </Text>
      
      <Divider className="mt-2 mb-2" />
    </View>
  );
};

export default ClinicListHeader;
