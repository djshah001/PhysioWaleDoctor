import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Divider,
  Chip,
  Icon,
} from "react-native-paper";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import { useUserDataState, useToastSate } from "../../atoms/store";
import { format } from "date-fns";
import colors from "../../constants/colors";

const AppointmentAnalytics = () => {
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all"); // 'all', 'month', 'year'

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Set date range based on timeframe
      let params = {};
      if (timeframe === "month") {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        params = {
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        };
      } else if (timeframe === "year") {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0, 1);
        const endDate = new Date(today.getFullYear(), 11, 31);
        params = {
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        };
      }

      const response = await axios.get(
        `${apiUrl}/api/v/appointment-features/analytics`,
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
          params,
        }
      );

      if (response.data.success) {
        setAnalytics(response.data.data);
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

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return (
      <View className="p-5 items-center justify-center">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="mt-2.5 font-osregular text-gray-600">
          Loading analytics...
        </Text>
      </View>
    );
  }

  if (!analytics) {
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

  const totalAppointments = analytics.total || 0;

  // Calculate percentages for the progress bars
  const getPercentage = (count) => {
    return totalAppointments > 0 ? count / totalAppointments : 0;
  };

  return (
    <Card
      className="mx-4 my-2 rounded-xl shadow-sm bg-white-100 "
      elevation={5}
    >
      <Card.Content>
        <View className="flex-row justify-between items-center mb-1">
          <Title className="font-osbold text-lg text-gray-800">
            Appointment Analytics
          </Title>
        </View>
        <View className="flex-row gap-2 my-2">
          <Chip
            icon={() => (
              <>
                <Icon
                  source="calendar-month"
                  size={18}
                  color={timeframe === "month" ? "#FFFFFF" : "#000"}
                />
              </>
            )}
            mode={timeframe === "month" ? "flat" : "outlined"}
            selected={timeframe === "month"}
            onPress={() => handleTimeframeChange("month")}
            // className="h-8"
            textStyle={{ fontFamily: "OpenSans-Medium", fontSize: 12 }}
            compact
            style={{
              backgroundColor:
                timeframe === "month" && colors.accent["DEFAULT"],
            }}
            selectedColor={timeframe === "month" ? "#FFFFFF" : undefined}
          >
            Month
          </Chip>
          <Chip
            icon={() => (
              <>
                <Icon
                  source="calendar-star"
                  size={18}
                  color={timeframe === "year" ? "#FFFFFF" : "#000"}
                />
              </>
            )}
            mode={timeframe === "year" ? "flat" : "outlined"}
            selected={timeframe === "year"}
            onPress={() => handleTimeframeChange("year")}
            textStyle={{ fontFamily: "OpenSans-Medium", fontSize: 12 }}
            compact
            style={{
              backgroundColor: timeframe === "year" && colors.accent["DEFAULT"],
            }}
            selectedColor={timeframe === "year" ? "#FFFFFF" : undefined}
          >
            Year
          </Chip>
          <Chip
            icon={() => (
              <>
                <Icon
                  source="calendar"
                  size={18}
                  color={timeframe === "all" ? "#FFFFFF" : "#000000"}
                />
              </>
            )}
            mode={timeframe === "all" ? "flat" : "outlined"}
            selected={timeframe === "all"}
            onPress={() => handleTimeframeChange("all")}
            textStyle={{ fontFamily: "OpenSans-Medium", fontSize: 12 }}
            compact
            style={{
              backgroundColor: timeframe === "all" && colors.accent["DEFAULT"],
            }}
            selectedColor={timeframe === "all" ? "#FFFFFF" : undefined}
          >
            All Time
          </Chip>
        </View>

        <Paragraph className="font-osregular text-sm text-gray-600 mb-4">
          {getTimeframeLabel()}
        </Paragraph>

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
              {analytics.byStatus.completed}
            </Text>
            <Text className="font-osregular text-xs text-gray-600 mt-1">
              Completed
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="font-osbold text-2xl text-blue-500">
              {analytics.averageRating
                ? analytics.averageRating.toFixed(1)
                : "N/A"}
            </Text>
            <Text className="font-osregular text-xs text-gray-600 mt-1">
              Avg. Rating
            </Text>
          </View>
        </View>

        <Divider className="my-4" />

        <Title className="font-ossemibold text-base text-gray-800 mb-3">
          Appointment Status
        </Title>

        <View className="mb-2">
          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Confirmed
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analytics.byStatus.confirmed}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analytics.byStatus.confirmed)}
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
                {analytics.byStatus.pending}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analytics.byStatus.pending)}
              color="#FFC107"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Completed
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analytics.byStatus.completed}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analytics.byStatus.completed)}
              color="#2196F3"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Cancelled
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analytics.byStatus.cancelled}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analytics.byStatus.cancelled)}
              color="#F44336"
              className="h-2 rounded-sm"
            />
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="font-osregular text-sm text-gray-800">
                Expired
              </Text>
              <Text className="font-ossemibold text-sm text-gray-800">
                {analytics.byStatus.expired}
              </Text>
            </View>
            <ProgressBar
              progress={getPercentage(analytics.byStatus.expired)}
              color="#9E9E9E"
              className="h-2 rounded-sm"
            />
          </View>
        </View>

        <Divider className="my-4" />

        {analytics.mostVisitedClinic && (
          <View className="mb-4">
            <Title className="font-ossemibold text-base text-gray-800 mb-3">
              Most Visited Clinic
            </Title>
            <Text className="font-ossemibold text-base text-gray-800">
              {analytics.mostVisitedClinic.name}
            </Text>
            <Text className="font-osregular text-sm text-blue-500 mt-1">
              {analytics.mostVisitedClinic.count} visits
            </Text>
            <Text className="font-osregular text-sm text-gray-600 mt-1">
              {analytics.mostVisitedClinic.address}
            </Text>
          </View>
        )}

        {analytics.mostVisitedDoctor && (
          <View className="mb-4">
            <Title className="font-ossemibold text-base text-gray-800 mb-3">
              Most Visited Doctor
            </Title>
            <Text className="font-ossemibold text-base text-gray-800">
              Dr. {analytics.mostVisitedDoctor.name}
            </Text>
            <Text className="font-osregular text-sm text-blue-500 mt-1">
              {analytics.mostVisitedDoctor.count} appointments
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default AppointmentAnalytics;
