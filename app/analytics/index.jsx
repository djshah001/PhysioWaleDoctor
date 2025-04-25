import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Appbar, ActivityIndicator, Icon } from "react-native-paper";
import { router } from "expo-router";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../../components/Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../atoms/store";
import colors from "../../constants/colors";

// Import components
import AnalyticsDashboard from "../../components/Analytics/AnalyticsDashboard";
import AppointmentAnalyticsChart from "../../components/Analytics/AppointmentAnalyticsChart";
import RevenueAnalyticsChart from "../../components/Analytics/RevenueAnalyticsChart";
import PatientDemographics from "../../components/Analytics/PatientDemographics";
import TimeframeSelector from "../../components/Clinic/TimeframeSelector";
import ClinicPerformanceComparison from "../../components/Analytics/ClinicPerformanceComparison";

const AnalyticsScreen = () => {
  const [, setToast] = useToastSate();
  const [UserData, setUserData] = useUserDataState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeframe, setTimeframe] = useState("month");

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async (selectedTimeframe = timeframe) => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem("authToken");
      
      if (!authToken) {
        setToast({
          message: "Authentication required. Please log in again.",
          type: "error",
          visible: true,
        });
        return;
      }

      // Make API call to get analytics data
      const response = await axios.get(
        `${apiUrl}/api/v/doctor-analytics/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            timeframe: selectedTimeframe,
          },
        }
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        throw new Error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setToast({
        message: error.response?.data?.message || "Failed to fetch analytics data",
        type: "error",
        visible: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeframe, setToast]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Handle timeframe change
  const handleTimeframeChange = useCallback((newTimeframe) => {
    setTimeframe(newTimeframe);
    fetchAnalyticsData(newTimeframe);
  }, [fetchAnalyticsData]);

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      {/* Header with gradient background */}
      <View className="overflow-hidden">
        <LinearGradient
          colors={[colors.secondary[300], colors.accent.DEFAULT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-0"
          style={{ paddingTop: StatusBar.currentHeight }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            className="overflow-hidden"
          >
            <Appbar.Header
              className="bg-transparent"
              statusBarHeight={0}
            >
              <Appbar.BackAction 
                onPress={() => router.back()} 
                color={colors.white[400]}
              />
              
              <Appbar.Content
                title="Analytics Dashboard"
                titleStyle={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 20,
                  color: colors.white[400],
                }}
              />
              
              <TouchableOpacity
                onPress={handleRefresh}
                className="mr-2 bg-white-400/20 rounded-full p-2"
                disabled={refreshing}
              >
                <Icon 
                  source="refresh" 
                  size={20} 
                  color={colors.white[400]} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {}}
                className="mr-2 bg-white-400/20 rounded-full p-2"
              >
                <Icon 
                  source="export-variant" 
                  size={20} 
                  color={colors.white[400]} 
                />
              </TouchableOpacity>
            </Appbar.Header>
          </BlurView>
        </LinearGradient>
      </View>

      {/* Main content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.accent.DEFAULT]}
            tintColor={colors.accent.DEFAULT}
          />
        }
      >
        <View className="p-4">
          {/* Timeframe selector */}
          <TimeframeSelector
            selectedTimeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
          />

          {loading && !refreshing ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
              <Text className="mt-4 font-pmedium text-gray-600">
                Loading analytics data...
              </Text>
            </View>
          ) : analyticsData ? (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", duration: 500 }}
            >
              {/* Analytics Dashboard */}
              <AnalyticsDashboard data={analyticsData} />
              
              {/* Appointment Analytics Chart */}
              <AppointmentAnalyticsChart 
                data={analyticsData.appointmentStats} 
                timeframe={timeframe}
              />
              
              {/* Revenue Analytics Chart */}
              <RevenueAnalyticsChart 
                data={analyticsData.revenue} 
                timeframe={timeframe}
              />
              
              {/* Patient Demographics */}
              <PatientDemographics 
                data={analyticsData.patientDemographics} 
              />
              
              {/* Clinic Performance Comparison */}
              {analyticsData.clinics && analyticsData.clinics.length > 0 && (
                <ClinicPerformanceComparison 
                  clinics={analyticsData.clinics} 
                />
              )}
            </MotiView>
          ) : (
            <View className="items-center justify-center py-20">
              <Icon source="chart-line" size={64} color={colors.gray[300]} />
              <Text className="mt-4 font-pbold text-lg text-gray-800 text-center">
                No Analytics Data Available
              </Text>
              <Text className="mt-2 font-osregular text-gray-600 text-center">
                Start managing appointments and patients to see analytics here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
