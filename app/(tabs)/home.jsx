import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserDataState, useToastSate } from "./../../atoms/store.js";
import colors from "./../../constants/colors.js";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { Appbar, Card, Icon } from "react-native-paper";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

// Import analytics components
import DoctorAnalytics from "../../components/Analytics/DoctorAnalytics";
import ClinicSummary from "../../components/Analytics/ClinicSummary";
import RevenueCard from "../../components/Analytics/RevenueCard";
import UpcomingAppointments from "../../components/Analytics/UpcomingAppointments";
import { LinearGradient } from "expo-linear-gradient";

cssInterop(Image, { className: "style" });
cssInterop(Appbar, { className: "style" });
cssInterop(Card, { className: "style" });

const Home = () => {
  const [UserData, setUserData] = useUserDataState();
  const [setToast] = useToastSate();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadRef = useRef(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Memoize the welcome message to prevent re-renders
  const welcomeMessage = useMemo(
    () => (
      <View>
        <Text className="text-sm leading-4 font-bold text-gray-100">
          Hi, Welcome Back!
        </Text>
        <Text className="text-xl leading-6 font-pbold text-white-200">
          {UserData?.name}
        </Text>
      </View>
    ),
    [UserData.name]
  );

  // Optimize API calls with useCallback
  const getLoggedInData = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    setIsLoading(true);
    if (!authToken) {
      setToast({
        title: "No auth token found",
        visible: true,
        type: "error",
      });
      setIsLoading(false);
      setRefreshing(false);
      router.replace("/sign-in");
      return;
    }
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/auth/getLoggedInData/doctor`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setUserData({ ...response.data.loggedInData, authToken: authToken });
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error);
      setToast({
        title: "Failed to fetch user data",
        visible: true,
        type: "error",
      });
      await AsyncStorage.multiRemove(["authToken", "isLoggedIn"]);
      router.replace("/sign-in");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [setUserData, setToast]);

  // Function to fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setAnalyticsLoading(false);
        return;
      }

      const response = await axios.get(
        `${apiUrl}/api/v/doctor-analytics/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
        "Error fetching analytics data:",
        error.response?.data || error.message
      );
      setToast({
        visible: true,
        message: "Failed to fetch analytics data",
        type: "error",
      });

      // Set fallback mock data for development/demo purposes
      setAnalyticsData({
        upcomingAppointments: [
          {
            _id: "1",
            patientName: "John Smith",
            patientImage: "https://randomuser.me/api/portraits/men/32.jpg",
            date: new Date().toISOString(),
            time: new Date().toISOString(),
            status: "confirmed",
            clinicName: "City Physiotherapy Center",
          },
          {
            _id: "2",
            patientName: "Sarah Johnson",
            patientImage: "https://randomuser.me/api/portraits/women/44.jpg",
            date: new Date(Date.now() + 86400000).toISOString(),
            time: new Date(Date.now() + 86400000).toISOString(),
            status: "pending",
            clinicName: "City Physiotherapy Center",
          },
        ],
        appointmentStats: {
          total: 45,
          completed: 23,
          thisMonth: 12,
          averageRating: 4.7,
          byStatus: {
            pending: 5,
            confirmed: 12,
            completed: 23,
            cancelled: 3,
            rejected: 1,
            expired: 1,
          },
        },
        revenue: {
          total: 145000,
          thisMonth: 32000,
          lastMonth: 28000,
          growth: 14.3,
        },
        clinics: [
          {
            _id: "1",
            name: "City Physiotherapy Center",
            address: "123 Main St, Bangalore, Karnataka",
            rating: 4.8,
            appointmentsCount: 45,
          },
          {
            _id: "2",
            name: "Downtown Rehab Clinic",
            address: "456 Park Ave, Mumbai, Maharashtra",
            rating: 4.5,
            appointmentsCount: 32,
          },
        ],
      });
    } finally {
      setAnalyticsLoading(false);
    }
  }, [setToast]);

  // Use useFocusEffect to handle initial load only
  useFocusEffect(
    useCallback(() => {
      // Only run on initial load, not on every focus
      if (!UserData || Object.keys(UserData).length === 0) {
        getLoggedInData();
        initialLoadRef.current = true;
        fetchAnalyticsData();
      }
    }, [getLoggedInData, fetchAnalyticsData])
  );

  // Memoize the app bar actions to prevent re-renders
  const appBarActions = useCallback(
    () => (
      <>
        <Appbar.Action
          icon="bell-outline"
          color={colors.white[300]}
          onPress={() => router.push("/notifications")}
        />
        <Appbar.Action
          icon="qrcode-scan"
          color={colors.white[300]}
          onPress={() => router.push("Scanner/Scan")}
        />
      </>
    ),
    []
  );

  // Create a dedicated refresh function
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    getLoggedInData();
    fetchAnalyticsData();
    setTimeout(() => setRefreshing(false), 1000); // Simulate network delay
  }, [getLoggedInData, fetchAnalyticsData]);

  // console.log(analyticsData.remainingClinicsCount);

  return (
    <View className="bg-white-300 flex-1">
      <StatusBar style="light" translucent />
      <LinearGradient
        colors={[colors.secondary[250], colors.secondary[300]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingVertical: 5 }}
        className="rounded-b-2xl shadow-md overflow-hidden mb-2"
      >
        <Appbar.Header className="bg-transparent">
          <Appbar.Content title={welcomeMessage} />
          {appBarActions()}
        </Appbar.Header>
      </LinearGradient>

      <View className="flex-1">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
        >
          {isLoading || analyticsLoading ? (
            <View className="flex-1 justify-center items-center py-10">
              <ActivityIndicator
                size="large"
                color={colors.accent["DEFAULT"]}
              />
              <Text className="mt-4 font-pmedium text-gray-600">
                Loading your dashboard...
              </Text>
            </View>
          ) : (
            <>
              {analyticsData && (
                <>
                  <UpcomingAppointments
                    appointments={analyticsData.upcomingAppointments}
                  />

                  <DoctorAnalytics stats={analyticsData.appointmentStats} />
                  <RevenueCard revenue={analyticsData.revenue} />
                  <ClinicSummary
                    clinics={analyticsData.clinics}
                    remainingClinicsCount={analyticsData.remainingClinicsCount}
                  />
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
