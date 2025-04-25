import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Appbar, Icon } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../../components/Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../atoms/store";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

// Import components
import AnalyticsSummaryCard from "../../components/Clinic/AnalyticsSummaryCard";
import TimeframeSelector from "../../components/Clinic/TimeframeSelector";

// Import ClinicId specific components
import ClinicInfoCard from "../../components/Clinic/ClinicId/ClinicInfoCard";
import AppointmentStatusChart from "../../components/Clinic/ClinicId/AppointmentStatusChart";
import RecentAppointmentsList from "../../components/Clinic/ClinicId/RecentAppointmentsList";
import PopularServicesCard from "../../components/Clinic/ClinicId/PopularServicesCard";
import ClinicDetailHeader from "../../components/Clinic/ClinicId/ClinicDetailHeader";
import UpcomingAppointmentsCard from "../../components/Clinic/ClinicId/UpcomingAppointmentsCard";

// Import analytics components
import MonthlyTrendsChart from "../../components/Analytics/MonthlyTrendsChart";
import DailyTrendsChart from "../../components/Analytics/DailyTrendsChart";
import ClinicInsightsCard from "../../components/Analytics/ClinicInsightsCard";
import colors from "../../constants/colors";
import CustomHeader from "../../components/UI/CustomHeader";

const ClinicDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [, setToast] = useToastSate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clinicData, setClinicData] = useState(null);
  const [timeframe, setTimeframe] = useState("month");
  const [UserData] = useUserDataState();

  // console.log(id)

  const fetchClinicData = useCallback(
    async (selectedTimeframe = timeframe) => {
      try {
        setLoading(true);
        const authToken = UserData.authToken;

        if (!authToken) {
          setToast({
            visible: true,
            message: "Authentication required. Please log in again.",
            type: "error",
          });
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${apiUrl}/api/v/clinic-analytics/${id}`,
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
          setClinicData(response.data.data);
        } else {
          throw new Error("Failed to fetch clinic data");
        }
      } catch (error) {
        console.error(
          "Error fetching clinic data:",
          error.response?.data || error.message
        );
        setToast({
          visible: true,
          message: "Failed to fetch clinic data. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id, setToast, timeframe]
  );

  useEffect(() => {
    fetchClinicData();
  }, [fetchClinicData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClinicData();
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    fetchClinicData(newTimeframe);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (loading && !clinicData) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
       <CustomHeader
        title="Clinic Details"
        gradient={colors.gradients.secondary}
      />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
          <Text className="mt-4 font-pmedium text-gray-600">
            Loading clinic data...
          </Text>
        </View>
      </View>
    );
  }

  if (!clinicData) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ClinicDetailHeader title="Clinic Details" />
        <View className="flex-1 justify-center items-center p-4">
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 700 }}
            className="items-center"
          >
            <Icon
              source="alert-circle-outline"
              size={64}
              color={colors.gray[400]}
            />
            <Text className="text-lg font-pbold text-center mt-4">
              Clinic not found
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              The clinic you're looking for doesn't exist or you don't have
              access to it.
            </Text>
          </MotiView>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* <ClinicDetailHeader title={clinicData.clinic.name} id={id} /> */}
      <CustomHeader
        title={clinicData.clinic.name}
        id={id}
        Children={
          <>
            {/* <Appbar.Action
              icon="refresh"
              onPress={handleRefresh}
              disabled={refreshing}
              color={colors.white[400]}
            /> */}
            <Appbar.Action
              icon="pencil"
              onPress={() => {
                router.push({
                  pathname: "/clinics/edit",
                  params: { id },
                });
              }}
              color={colors.white[400]}
            />
            <Appbar.Action
              icon="share-variant"
              onPress={() => {}}
              color={colors.white[400]}
            />
          </>
        }
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.accent.DEFAULT]}
            tintColor={colors.accent.DEFAULT}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          {/* Clinic Info Card */}
          <ClinicInfoCard clinic={clinicData.clinic} />

          {/* Timeframe Filter */}
          <TimeframeSelector
            selectedTimeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
          />

          {/* Analytics Summary Cards */}
          <MotiView
            className="flex-row mb-2"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 100 }}
          >
            <AnalyticsSummaryCard
              title="Total Appointments"
              value={clinicData.appointmentStats.total}
              icon="calendar-check"
              iconColor={colors.primary[500]}
              onPress={() => router.push("/appointments")}
              trend={clinicData.appointmentStats.trend > 0}
              trendUp={clinicData.appointmentStats.trend > 0}
              subtitle={
                clinicData.appointmentStats.trend
                  ? `${Math.abs(
                      clinicData.appointmentStats.trend
                    )}% from last period`
                  : null
              }
            />
            <AnalyticsSummaryCard
              title="Revenue"
              value={formatCurrency(clinicData.revenue.total)}
              icon="currency-inr"
              iconColor="#4CAF50"
              onPress={() => router.push("/analytics")}
              trend={clinicData.revenue.trend !== 0}
              trendUp={clinicData.revenue.trend > 0}
              subtitle={
                clinicData.revenue.trend
                  ? `${Math.abs(clinicData.revenue.trend)}% from last period`
                  : null
              }
            />
          </MotiView>

          <MotiView
            className="flex-row mb-4"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 200 }}
          >
            <AnalyticsSummaryCard
              title="Avg. Rating"
              value={clinicData.ratings.average || "N/A"}
              icon="star"
              iconColor="#FFC107"
              subtitle={`${clinicData.ratings.count} ratings`}
              gradientColors={["#FFF8E1", "#FFECB3"]}
            />
            <AnalyticsSummaryCard
              title="Patients"
              value={clinicData.patientDemographics.total}
              icon="account-group"
              iconColor={colors.accent.DEFAULT}
              onPress={() => router.push("/patients")}
              trend={clinicData.patientDemographics.trend !== 0}
              trendUp={clinicData.patientDemographics.trend > 0}
              subtitle={
                clinicData.patientDemographics.trend
                  ? `${Math.abs(
                      clinicData.patientDemographics.trend
                    )}% from last period`
                  : null
              }
            />
          </MotiView>

          {/* Appointment Status Chart */}
          <AppointmentStatusChart stats={clinicData.appointmentStats} />

          {/* Clinic Insights Card */}
          <ClinicInsightsCard
            insights={{
              busiestDay: clinicData.appointmentStats.busiestDay,
              busiestTimeSlot: clinicData.appointmentStats.busiestTimeSlot,
              averageRevenue: clinicData.revenue.average,
            }}
          />

          {/* Trends Charts */}
          {timeframe === "year" && clinicData.monthlyTrends && (
            <MonthlyTrendsChart data={clinicData.monthlyTrends} />
          )}

          {(timeframe === "week" || timeframe === "month") &&
            clinicData.dailyTrends && (
              <DailyTrendsChart
                data={clinicData.dailyTrends}
                timeframe={timeframe}
              />
            )}

          {/* Upcoming Appointments */}
          <UpcomingAppointmentsCard
            appointments={clinicData.upcomingAppointments}
          />

          {/* Recent Appointments */}
          <RecentAppointmentsList
            appointments={clinicData.recentAppointments}
          />

          {/* Popular Services */}
          <PopularServicesCard services={clinicData.popularServices} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ClinicDetailScreen;
