import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { userDataAtom } from "~/store/userAtoms";
import { homeApi } from "~/apis/home";
import { DashboardData } from "~/types/models";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { PremiumHeader } from "~/components/Home/modern/PremiumHeader";
import { StatsCarousel } from "~/components/Home/modern/StatsCarousel";
import { QuickActionGrid } from "~/components/Home/modern/QuickActionGrid";
import { ClinicShowcase } from "~/components/Home/modern/ClinicShowcase";
import { UpcomingTimeline } from "~/components/Home/modern/UpcomingTimeline";
import { router } from "expo-router";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [userData] = useAtom(userDataAtom);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await homeApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Mock data for demo purposes if API fails or is empty initially
      if (!dashboardData) {
        // keep it null or set mock
      }
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchDashboardData();
    }
  }, [userData]);

  const onRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, []);

  if (!userData) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center p-8">
          <GlassCard className="p-6 w-full items-center">
            <Text className="text-base text-gray-800 text-center font-medium">
              Please log in to verify your session.
            </Text>
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  if (loading && !dashboardData && !refreshing) {
    return (
      <GradientBackground>
        <View
          style={{ paddingTop: insets.top + 20 }}
          className="px-6 space-y-6"
        >
          <View className="flex-row items-center space-x-4 mb-4">
            <View className="w-12 h-12 bg-white/30 rounded-full" />
            <View className="space-y-2">
              <View className="w-24 h-4 bg-white/30 rounded" />
              <View className="w-32 h-6 bg-white/30 rounded" />
            </View>
          </View>
          <View className="h-40 bg-white/20 rounded-3xl" />
          <View className="flex-row justify-between">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="w-16 h-16 bg-white/20 rounded-2xl" />
            ))}
          </View>
          <View className="h-48 bg-white/20 rounded-3xl" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
            colors={["#6366F1"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <PremiumHeader
          name={userData.name}
          profilePic={userData.profilePic}
          notificationCount={2} // Replace with real count
        />

        {dashboardData && (
          <StatsCarousel
            totalAppointments={dashboardData.todayStats.totalAppointments}
            completedAppointments={
              dashboardData.todayStats.completedAppointments
            }
            pendingAppointments={dashboardData.todayStats.pendingAppointments}
            totalEarnings={dashboardData.todayStats.totalEarnings}
          />
        )}

        <QuickActionGrid />

        {/* Divider / Section Gap */}
        <View className="h-2" />

        {dashboardData && (
          <ClinicShowcase
            clinics={dashboardData.clinics}
            onAddClinic={() => router.push("/clinics/register")}
          />
        )}

        {dashboardData && (
          <UpcomingTimeline
            appointments={dashboardData.upcomingAppointments}
            onViewAll={() => console.log("View All")}
          />
        )}

        {error && (
          <View className="px-6">
            <GlassCard className="bg-red-500/10 border-red-200">
              <Text className="text-red-700 text-sm text-center font-medium">
                {error}
              </Text>
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}
