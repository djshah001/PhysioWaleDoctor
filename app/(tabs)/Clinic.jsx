import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useToastSate, useClinicsState } from "./../../atoms/store.js";
import colors from "./../../constants/colors.js";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables.jsx";
import { Icon, Avatar, Divider, ProgressBar } from "react-native-paper";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { format } from "date-fns";

// Import custom components

import ListHeader from "../../components/Clinic/ListHeader";
import EmptyClinicView from "../../components/Clinic/EmptyClinicView";
import RegisterClinicButton from "../../components/Clinic/RegisterClinicButton";

cssInterop(Image, { className: "style" });
cssInterop(Icon, { className: "style" });
cssInterop(Avatar, { className: "style" });
cssInterop(Divider, { className: "style" });
cssInterop(ProgressBar, { className: "style" });

const Clinic = () => {
  // We're using ClnicData instead of UserData.clinics
  const [ClnicData, setClinicData] = useClinicsState();
  const [, setToast] = useToastSate();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch clinics with analytics data
  const fetchClinics = async (forceRefresh = false) => {
    // If we already have clinics and aren't forcing a refresh, don't fetch
    if (ClnicData?.length > 0 && !forceRefresh && !refreshing) {
      return;
    }

    // console.log('Fetching clinics...');

    setLoading(true);
    const authToken = await AsyncStorage.getItem("authToken");

    try {
      // First, always try to get all clinic analytics
      const analyticsRes = await axios.get(
        `${apiUrl}/api/v/clinic-analytics/all`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // console.log("Clinic analytics response:", analyticsRes.data);

      if (analyticsRes.data.success) {
        // Store the clinic data with analytics
        setClinicData(analyticsRes.data.data || []);

        // If we got empty clinics array, make a call to get basic clinic data
        if (analyticsRes.data.data.length === 0) {
          await fetchBasicClinicData(authToken);
        }
      } else {
        throw new Error("Failed to fetch clinic analytics");
      }
    } catch (error) {
      console.error(
        "Fetch analytics error:",
        error.response?.data || error.message
      );

      // If analytics fetch fails, try to get basic clinic data
      await fetchBasicClinicData(authToken);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper function to fetch basic clinic data
  const fetchBasicClinicData = async (authToken) => {
    try {
      const res = await axios.get(`${apiUrl}/api/v/clinics/by-doctor`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.data.success) {
        setClinicData(res.data.data || []);
      }
    } catch (error) {
      console.error("Basic clinic fetch failed:", error.message);
      setToast({
        message: "Failed to fetch clinics",
        visible: true,
        type: "error",
      });
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClinics(true); // Force refresh
  }, []);

  // Only fetch clinics on focus if we don't have them already
  useFocusEffect(
    useCallback(() => {
      if (ClnicData?.length > 0) return;
      fetchClinics();
    }, [])
  );

  // Log UserData when it changes
  // useEffect(() => {
  //   console.log("UserData updated:", UserData);
  //   console.log("Clinics count:", UserData.clinics?.length || 0);
  // }, [UserData]);

  // Using the EmptyClinicView component imported from components/Clinic

  const renderClinicCard = useCallback(({ item: clinic }) => {
    // Format currency
    const formatCurrency = (amount) => {
      return `₹${(amount || 0).toLocaleString("en-IN")}`;
    };

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return format(new Date(dateString), "MMM dd");
    };

    // Check if clinic object is valid
    if (!clinic || !clinic._id) {
      return (
        <MotiView
          from={{ opacity: 0, translateY: 5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          className="my-2 mx-4 p-4 rounded-xl bg-white-400 shadow-md border border-gray-100"
        >
          <Text className="text-black-200 font-pbold">Invalid Clinic Data</Text>
          <Text className="text-black-300">Please refresh to try again</Text>
        </MotiView>
      );
    }

    // Get next appointment if available
    const nextAppointment = clinic.nextAppointment || null;

    // Calculate appointment completion rate
    const completionRate =
      clinic.stats?.totalAppointments > 0
        ? clinic.stats?.completedAppointments / clinic.stats?.totalAppointments
        : 0;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", duration: 500, damping: 15 }}
        className="my-3 mx-4 rounded-xl overflow-hidden bg-white-400 shadow-md border border-gray-100"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // console.log("Pressed on clinic card:", clinic._id);
            router.push({
              pathname: `/clinics/${clinic._id}`,
              params: { id: clinic._id },
            });
          }}
        >
          {/* Card Header with Image */}
          <View className="relative">
            <Image
              source={{
                uri: clinic.images?.[0] || "https://via.placeholder.com/400",
              }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={500}
              className="w-full h-40 rounded-t-xl"
            />

            {/* Gradient overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
                zIndex: 1,
              }}
            />

            {/* Clinic name on image */}
            <View
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{ zIndex: 2 }}
            >
              <Text className="text-xl font-pbold text-white-400 drop-shadow-md">
                {clinic.name}
              </Text>
              <View className="flex-row items-center">
                <Icon source="map-marker" size={16} color={colors.white[300]} />
                <Text
                  className="text-white-300 ml-1 text-sm font-osregular"
                  numberOfLines={1}
                >
                  {clinic.address || "Address not available"}
                </Text>
              </View>
            </View>

            {/* Rating badge */}
            {clinic.stats && (
              <View className="absolute top-3 right-3 bg-white-400/90 rounded-full px-3 py-1 flex-row items-center shadow-sm">
                <Icon source="star" size={16} color="#FFC107" />
                <Text className="ml-1 font-ossemibold text-sm">
                  {clinic.stats?.averageRating || "N/A"}
                </Text>
              </View>
            )}

            {/* Status badge */}
            <View className="absolute top-3 left-3 bg-secondary-300/90 rounded-full px-3 py-1 flex-row items-center shadow-sm">
              <Icon
                source="hospital-building"
                size={16}
                color={colors.white[400]}
              />
              <Text className="ml-1 font-ossemibold text-sm text-white-400">
                {clinic.open24hrs ? "Open 24hrs" : "Active"}
              </Text>
            </View>
          </View>

          {/* Card Content */}
          <View className="p-4 bg-white-300 ">
            {/* Analytics summary */}
            <View className="flex-row justify-between mb-4 bg-gray-50 p-3 rounded-xl shadow-lg shadow-black-500 ">
              <View className="flex-1 items-center border-r border-gray-200">
                <Text className="text-xs text-gray-500 mb-1">Appointments</Text>
                <Text className="font-pbold text-lg text-secondary-300">
                  {clinic.stats?.totalAppointments || 0}
                </Text>
              </View>

              <View className="flex-1 items-center border-r border-gray-200">
                <Text className="text-xs text-gray-500 mb-1">Patients</Text>
                <Text className="font-pbold text-lg text-secondary-300">
                  {clinic.stats?.uniquePatientCount || 0}
                </Text>
              </View>

              <View className="flex-1 items-center">
                <Text className="text-xs text-gray-500 mb-1">Revenue</Text>
                <Text className="font-pbold text-lg text-secondary-300">
                  {formatCurrency(clinic.stats?.totalRevenue)}
                </Text>
              </View>
            </View>

            {/* Completion rate */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs font-ossemibold text-gray-700">
                  Completion Rate
                </Text>
                <Text className="text-xs font-ossemibold text-gray-700">
                  {Math.round(completionRate * 100)}%
                </Text>
              </View>
              <ProgressBar
                progress={completionRate}
                color={colors.secondary[300]}
                className="h-2 rounded-full"
              />
            </View>

            {/* Divider */}
            <Divider className="mb-3" />

            {/* Next appointment */}
            {nextAppointment ? (
              <View className="flex-row items-center bg-gray-50 p-3 rounded-xl shadow-lg shadow-black-500">
                <View className="mr-3">
                  <Avatar.Text
                    size={40}
                    label={nextAppointment.patientName?.charAt(0) || "?"}
                    color={colors.white[400]}
                    style={{ backgroundColor: colors.secondary[300] }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-ossemibold text-gray-700">
                    Next Appointment
                  </Text>
                  <Text className="text-sm font-osregular">
                    {nextAppointment.patientName}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {formatDate(nextAppointment.date)} •{" "}
                    {nextAppointment.time || "N/A"}
                  </Text>
                </View>
                <View className="bg-secondary-300 rounded-full h-10 w-10 items-center justify-center">
                  <Icon
                    source="arrow-right"
                    size={20}
                    color={colors.white[400]}
                  />
                </View>
              </View>
            ) : (
              <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl shadow-lg shadow-black-500">
                <View className="flex-1">
                  <Text className="text-sm font-ossemibold text-gray-700">
                    No upcoming appointments
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Tap to view clinic details
                  </Text>
                </View>
                <View className="bg-accent rounded-full h-12 w-12 items-center justify-center">
                  <Icon
                    source="arrow-top-right"
                    size={24}
                    color={colors.white[300]}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  }, []);

  // Calculate total stats
  const totalPatients =
    ClnicData?.reduce(
      (sum, clinic) => sum + (clinic.stats?.uniquePatientCount || 0),
      0
    ) || 0;

  const totalAppointments =
    ClnicData?.reduce(
      (sum, clinic) => sum + (clinic.stats?.totalAppointments || 0),
      0
    ) || 0;

  const totalRevenue =
    ClnicData?.reduce(
      (sum, clinic) => sum + (clinic.stats?.totalRevenue || 0),
      0
    ) || 0;

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  // Filter functions for chips

  const getFilteredClinics = () => {
    if (!ClnicData || ClnicData.length === 0) return [];

    switch (selectedFilter) {
      case "active":
        return [...ClnicData].sort(
          (a, b) =>
            (b.stats?.totalAppointments || 0) -
            (a.stats?.totalAppointments || 0)
        );
      case "revenue":
        return [...ClnicData].sort(
          (a, b) => (b.stats?.totalRevenue || 0) - (a.stats?.totalRevenue || 0)
        );
      case "rated":
        return [...ClnicData].sort(
          (a, b) =>
            (b.stats?.averageRating || 0) - (a.stats?.averageRating || 0)
        );
      default:
        return ClnicData;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header with gradient background and blur effect */}

      {/* Main content */}
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.secondary[300]} />
          <Text className="mt-4 text-black-300 font-pmedium">
            Loading your clinics...
          </Text>
        </View>
      ) : ClnicData?.length === 0 ? (
        <EmptyClinicView />
      ) : (
        <View className="flex-1">
          <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            <FlashList
              data={getFilteredClinics()}
              renderItem={renderClinicCard}
              estimatedItemSize={450}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{
                paddingBottom: 16,
                paddingHorizontal: 0,
              }}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.secondary[300]]}
                  tintColor={colors.secondary[300]}
                />
              }
              ListEmptyComponent={<EmptyClinicView />}
              ListHeaderComponent={
                <ListHeader
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  clinicsCount={ClnicData.length}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  totalPatients={totalPatients}
                  totalAppointments={totalAppointments}
                  totalRevenue={totalRevenue}
                />
              }
              numColumns={1}
              drawDistance={400}
              ListFooterComponent={<RegisterClinicButton />}
              ListFooterComponentStyle={{ marginBottom: 80 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Clinic;

// Using the imported ListHeader component from components/Clinic

// Using the imported RegisterClinicButton component from components/Clinic
