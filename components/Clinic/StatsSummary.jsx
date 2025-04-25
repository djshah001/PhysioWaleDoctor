import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import colors from "../../constants/colors";

/**
 * StatsSummary component displays analytics overview with metrics in a blurred card
 * 
 * @param {Object} props - Component props
 * @param {number} props.scrollPosition - Current scroll position for animation
 * @param {number} props.clinicsCount - Number of clinics
 * @param {number} props.patientsCount - Number of patients
 * @param {number} props.appointmentsCount - Number of appointments
 * @param {number} props.revenue - Total revenue
 * @returns {JSX.Element} - Rendered component
 */
const StatsSummary = ({ 
  scrollPosition = 0, 
  clinicsCount = 0, 
  patientsCount = 0, 
  appointmentsCount = 0, 
  revenue = 0 
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <MotiView
      className="mx-4 mt-2 mb-4"
      animate={{
        opacity: scrollPosition > 80 ? 0 : 1,
        translateY: scrollPosition > 80 ? -20 : 0
      }}
      transition={{
        type: 'timing',
        duration: 300
      }}
    >
      <BlurView
        intensity={40}
        tint="dark"
        className="rounded-xl overflow-hidden"
      >
        <View
          className="p-4"
          style={{
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white-400 font-pbold text-base">
              Analytics Overview
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/analytics")}
              className="flex-row items-center bg-white-400/30 px-2 py-1 rounded-full"
            >
              <Text className="text-white-400 text-sm font-ossemibold">
                View All
              </Text>
              <Icon
                source="chevron-right"
                size={14}
                color={colors.white[400]}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between gap-2">
            {/* Clinics */}
            <View className="flex-row items-center bg-white-400/10 rounded-lg p-2 flex-1 gap-2">
              <View className="bg-primary-100 rounded-full p-2 ">
                <Icon
                  source="hospital-building"
                  size={20}
                  color={colors.secondary[300]}
                />
              </View>
              <View>
                <Text className="text-white-300 text-sm font-osmedium">Clinics</Text>
                <Text className="text-white-400 font-pbold text-lg">
                  {clinicsCount}
                </Text>
              </View>
            </View>

            {/* Patients */}
            <View className="flex-row items-center bg-white-400/10 rounded-lg p-2 flex-1 gap-2 ">
              <View className="bg-blue-100 rounded-full p-2 ">
                <Icon
                  source="account-group"
                  size={20}
                  color={colors.blues[500]}
                />
              </View>
              <View>
                <Text className="text-white-300 text-sm font-osmedium">Patients</Text>
                <Text className="text-white-400 font-pbold text-lg">
                  {patientsCount}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mt-2 gap-2">
            {/* Appointments */}
            <View className="flex-row items-center bg-white-400/10 rounded-lg p-2 flex-1 gap-2">
              <View className="bg-accent-100 rounded-full p-2 ">
                <Icon
                  source="calendar-check"
                  size={20}
                  color={colors.accent[500]}
                />
              </View>
              <View>
                <Text className="text-white-300 text-sm font-osmedium">
                  Appointments
                </Text>
                <Text className="text-white-400 font-pbold text-lg">
                  {appointmentsCount}
                </Text>
              </View>
            </View>

            {/* Revenue */}
            <View className="flex-row items-center bg-white-400/10 rounded-lg p-2 flex-1 gap-2 ">
              <View className="bg-primary-100 rounded-full p-2 ">
                <Icon
                  source="currency-inr"
                  size={20}
                  color={colors.primary[400]}
                />
              </View>
              <View>
                <Text className="text-white-300 text-sm font-osmedium">Revenue</Text>
                <Text className="text-white-400 font-pbold text-lg">
                  {formatCurrency(revenue)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </MotiView>
  );
};

export default StatsSummary;
