import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import colors from "../../constants/colors";

/**
 * ClinicPerformanceCard component displays clinic performance metrics
 * 
 * @param {Object} props - Component props
 * @param {number} props.appointmentsCount - Number of appointments
 * @param {number} props.revenue - Total revenue
 * @returns {JSX.Element} - Rendered component
 */
const ClinicPerformanceCard = ({ appointmentsCount = 0, revenue = 0 }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <View className="mx-4 mb-4 bg-white-400 rounded-xl shadow-sm overflow-hidden">
      <LinearGradient
        colors={[colors.secondary[150], colors.white[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="p-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="bg-secondary-300 rounded-full p-1.5">
              <Icon source="chart-bar" size={18} color={colors.white[400]} />
            </View>
            <Text className="font-pbold text-base text-black-200 ml-2">
              Clinic Performance
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/analytics")}
            className="bg-secondary-100 rounded-full px-2 py-1 flex-row items-center"
          >
            <Text className="text-secondary-300 text-xs font-ossemibold mr-1">
              Details
            </Text>
            <Icon
              source="chevron-right"
              size={14}
              color={colors.secondary[300]}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mb-3">
          <View className="bg-gray-50 rounded-lg p-2 flex-1 mr-1">
            <View className="flex-row items-center mb-1">
              <Icon
                source="calendar-check"
                size={14}
                color={colors.accent[500]}
              />
              <Text className="text-xs text-gray-500 ml-1">Appointments</Text>
            </View>
            <Text className="text-lg font-pbold text-black-200">
              {appointmentsCount}
            </Text>
          </View>

          <View className="bg-gray-50 rounded-lg p-2 flex-1 ml-1">
            <View className="flex-row items-center mb-1">
              <Icon
                source="currency-inr"
                size={14}
                color={colors.primary[400]}
              />
              <Text className="text-xs text-gray-500 ml-1">Revenue</Text>
            </View>
            <Text className="text-lg font-pbold text-black-200">
              {formatCurrency(revenue)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-white-400 rounded-lg p-2 flex-1 mr-1 border border-secondary-150"
            activeOpacity={0.7}
            onPress={() => router.push("/analytics")}
          >
            <Text className="text-center text-secondary-300 font-ossemibold">
              View Analytics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-secondary-300 rounded-lg p-2 flex-1 ml-1 shadow-sm"
            activeOpacity={0.7}
            onPress={() => router.push("/appointments")}
          >
            <Text className="text-center text-white-400 font-ossemibold">
              Appointments
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ClinicPerformanceCard;
