import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { router } from "expo-router";
import colors from "../../constants/colors";

/**
 * RegisterClinicButton component displays a button to register a new clinic
 * 
 * @returns {JSX.Element} - Rendered component
 */
const RegisterClinicButton = () => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", duration: 500, delay: 300 }}
      className="bg-white-400 shadow-md py-4 px-4 border-t border-gray-100"
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("clinics/register")}
        className="overflow-hidden"
      >
        <LinearGradient
          colors={[colors.secondary[200], colors.secondary[300]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-xl p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="bg-white-400/30 rounded-full p-3 mr-4">
                <Icon source="plus" size={24} color={colors.white[400]} />
              </View>
              <View>
                <Text className="font-pbold text-lg text-white-400">
                  Add New Clinic
                </Text>
                <Text className="text-sm text-white-300">
                  Register your practice location
                </Text>
              </View>
            </View>
            <View className="bg-white-400/30 rounded-full p-2">
              <Icon source="arrow-right" size={24} color={colors.white[400]} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};

export default RegisterClinicButton;
