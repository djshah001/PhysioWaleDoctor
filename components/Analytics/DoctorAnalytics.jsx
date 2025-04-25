import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Divider,
  Chip,
} from "react-native-paper";
import colors from "../../constants/colors";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToastSate } from "../../atoms/store";
import { CustomChip } from "../ReUsables/CustomChip";


const DoctorAnalytics = ({ stats = null }) => {
  const [timeframe, setTimeframe] = useState("month"); // 'all', 'month', 'year'
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(stats);
  const [, setToast] = useToastSate();

  // Initialize with the stats from props
  useEffect(() => {
    if (stats) {
      setAnalyticsData(stats);
    }
  }, [stats]);

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      default:
        return "All Time";
    }
  };

  const handleTimeframeChange = async (newTimeframe) => {
    try {
      setTimeframe(newTimeframe);
      setLoading(true);

      // Get the auth token
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setToast({
          visible: true,
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      // Make the API call with the new timeframe
      const response = await axios.get(
        `${apiUrl}/api/v/doctor-analytics/appointment-analytics`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            timeframe: newTimeframe,
          },
        }
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        throw new Error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error(
        "Error fetching analytics:",
        error.response?.data || error.message
      );
      setToast({
        visible: true,
        message: "Failed to fetch appointment analytics. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card
        className="mx-4 my-2 rounded-xl shadow-sm bg-white-100"
        elevation={2}
      >
        <Card.Content className="items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.accent["DEFAULT"]} />
          <Text className="mt-4 font-pmedium text-gray-600">
            Updating analytics...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="mx-4 my-2 rounded-xl">
        <Card.Content>
          <Title className="font-osbold text-lg text-gray-800">
            No Analytics Available
          </Title>
          <Paragraph>You don't have any appointment data yet.</Paragraph>
        </Card.Content>
      </Card>
    );
  }

  const totalAppointments = analyticsData.total || 0;

  // Calculate percentages for the progress bars
  const getPercentage = (count) => {
    return totalAppointments > 0 ? count / totalAppointments : 0;
  };

  return (
    <Card className="mx-4 my-2 rounded-xl shadow-sm bg-white-100" elevation={2}>
      <Card.Content>
        <View className="flex-row justify-between items-center mb-1">
          <Title className="font-osbold text-lg text-gray-800">
            Appointment Analytics
          </Title>
        </View>
        <View className="flex-row gap-2 my-2">
          <CustomChip
            iconName="calendar-month"
            text="Month"
            selected={timeframe === "month"}
            onPress={() => handleTimeframeChange("month")}
          />

          <CustomChip
            iconName="calendar-range"
            text="Year"
            selected={timeframe === "year"}
            onPress={() => handleTimeframeChange("year")}
          />
          <CustomChip
            iconName="calendar-text"
            text="All Time"
            selected={timeframe === "all"}
            onPress={() => handleTimeframeChange("all")}
          />
        </View>

        <Divider className="my-2" />

        <View className="flex-row justify-between mb-4">
          <View className="items-center flex-1">
            <Text className="font-osbold text-2xl text-blue-500">
              {totalAppointments}
            </Text>
            <Text className="font-osregular text-xs text-gray-600 mt-1">
              Total Appointments
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="font-osbold text-2xl text-blue-500">
              {analyticsData.completed || 0}
            </Text>
            <Text className="font-osregular text-xs text-gray-600 mt-1">
              Completed
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="font-osbold text-2xl text-blue-500">
              {analyticsData.averageRating
                ? analyticsData.averageRating.toFixed(1)
                : "N/A"}
            </Text>
            <Text className="font-osregular text-xs text-gray-600 mt-1">
              Avg. Rating
            </Text>
          </View>
        </View>

        <Divider className="mb-2" />

        <View className="mb-2">
          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Confirmed
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analyticsData.byStatus?.confirmed || 0}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analyticsData.byStatus?.confirmed || 0)}
              color="#4CAF50"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Pending
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analyticsData.byStatus?.pending || 0}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analyticsData.byStatus?.pending || 0)}
              color="#FFC107"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Cancelled
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analyticsData.byStatus?.cancelled || 0}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analyticsData.byStatus?.cancelled || 0)}
              color="#F44336"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Rejected
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analyticsData.byStatus?.rejected || 0}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analyticsData.byStatus?.rejected || 0)}
              color="#9C27B0"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Expired
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analyticsData.byStatus?.expired || 0}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analyticsData.byStatus?.expired || 0)}
              color="#607D8B"
              className="h-2 rounded-sm"
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default DoctorAnalytics;
