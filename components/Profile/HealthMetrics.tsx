import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useUserDataState, useToastSate } from "../../atoms/store";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const HealthMetrics = () => {
  const [userData] = useUserDataState();
  const [, setToast] = useToastSate(); // Only need setter
  const [bmi, setBmi] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData.height && userData.weight) {
      calculateBMI();
    }
  }, [userData.height, userData.weight]);

  const calculateBMI = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${apiUrl}/api/v/users/bmi`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setBmi(response.data.data);
      }
    } catch (error: any) {
      console.error("BMI calculation error:", error.response?.data || error);
      setToast({
        message: "Failed to calculate BMI",
        visible: true,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBmiColor = () => {
    if (!bmi) return "text-gray-500";

    const bmiValue = parseFloat(bmi.bmi);
    if (bmiValue < 18.5) return "text-blue-500";
    if (bmiValue >= 18.5 && bmiValue < 25) return "text-green-500";
    if (bmiValue >= 25 && bmiValue < 30) return "text-orange-500";
    return "text-red-500";
  };

  const getMetricStatus = () => {
    if (!userData.height || !userData.weight) {
      return (
        <TouchableOpacity
          onPress={() => router.push("/profile/edit-profile" as any)}
          className="flex-row items-center justify-center bg-secondary-100 py-2 px-4 rounded-lg mt-2"
        >
          <Text className="text-secondary-200 font-pmedium">
            Add your height and weight
          </Text>
          <FontAwesome5
            name="arrow-right"
            size={14}
            color="#055300"
            className="ml-2"
          />
        </TouchableOpacity>
      );
    }

    if (loading) {
      return (
        <Text className="text-gray-500 text-center mt-2">Calculating...</Text>
      );
    }

    return null;
  };

  return (
    <View className=" items-center">
      {/* <Text className="font-pbold text-lg mb-2">Health Metrics</Text> */}

      <View className="flex-row gap-4 mb-3 ">
        <View className="items-center">
          <Text className="font-pregular text-gray-800">Height</Text>
          <Text className="font-pmedium text-lg">
            {userData.height ? `${userData.height} cm` : "-"}
          </Text>
        </View>

        <View className="items-center">
          <Text className="font-pregular text-gray-800">Weight</Text>
          <Text className="font-pmedium text-lg">
            {userData.weight ? `${userData.weight} kg` : "-"}
          </Text>
        </View>

        <View className="items-center">
          <Text className="font-pregular text-gray-800">BMI</Text>
          <Text className={`font-pmedium text-lg ${getBmiColor()}`}>
            {bmi ? bmi.bmi : "-"}
          </Text>
        </View>
      </View>

      {bmi && (
        <View className="bg-gray-100 p-2 rounded-lg">
          <Text className="text-center font-pmedium">
            Status: <Text className={getBmiColor()}>{bmi.category}</Text>
          </Text>
        </View>
      )}

      {getMetricStatus()}
    </View>
  );
};

export default HealthMetrics;
