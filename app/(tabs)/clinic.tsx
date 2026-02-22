import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { clinicApi } from "~/apis/clinic";
import { ClinicSummary } from "~/types/models";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { PremiumHeader } from "~/components/Home/modern/PremiumHeader";
import { Image } from "expo-image";
import { MotiView, MotiText } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { userDataAtom } from "~/store";

const { width } = Dimensions.get("window");

const ClinicScreen = () => {
  const router = useRouter();
  const _insets = useSafeAreaInsets();
  const [user, setUser] = useAtom(userDataAtom);

  // console.log("user", user);
  const [clinics, setClinics] = useState<ClinicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClinics = async () => {
    try {
      const response = await clinicApi.getClinicSummary();
      if (response.data) {
        setClinics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClinics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderMetricItem = (
    label: string,
    value: string | number,
    icon: React.ReactNode,
    colorClass: string,
    delay: number,
  ) => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`flex-1 ${colorClass} rounded-2xl p-3 items-center justify-center space-y-1`}
    >
      <View className="mb-1">{icon}</View>
      <Text className="text-gray-900 font-bold text-lg">{value}</Text>
      <Text className="text-gray-500 text-[10px] uppercase tracking-wide font-medium text-center">
        {label}
      </Text>
    </MotiView>
  );

  const renderClinicCard = (item: ClinicSummary, index: number) => {
    const { doctorMetrics } = item;

    return (
      <Animated.View
        key={item._id}
        entering={FadeInDown.delay(index * 150).springify()}
        className="mb-8 mx-5"
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() =>
            router.push({
              pathname: "/clinic/[id]",
              params: { id: item._id },
            })
          }
        >
          <GlassCard
            intensity={90}
            className="rounded-[32px] border-white/60 shadow-xl shadow-indigo-900/10"
            contentContainerClassName="p-0"
          >
            {/* 1. Hero Image Section */}
            <View className="h-52 relative">
              {item.images && item.images.length > 0 ? (
                <Image
                  source={{ uri: item.images[0] }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={500}
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-indigo-50">
                  <MaterialCommunityIcons
                    name="hospital-building"
                    size={64}
                    color={colors.indigo[200]}
                  />
                </View>
              )}

              {/* Gradient Overlay for text readability */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 100,
                }}
              />

              {/* Badges on Image */}
              <View className="absolute top-4 left-4 flex-row gap-2">
                {item.open24hrs && (
                  <GlassCard intensity={80} className="rounded-full px-3 py-1">
                    <Text className="text-[10px] font-bold text-emerald-700">
                      24/7 OPEN
                    </Text>
                  </GlassCard>
                )}
              </View>

              <View className="absolute top-4 right-4">
                <GlassCard
                  intensity={95}
                  tint="light"
                  className="rounded-full border border-white/60"
                  contentContainerClassName="px-3 py-1.5 flex-row items-center gap-1.5"
                >
                  <Ionicons name="star" size={14} color={colors.amber[500]} />
                  <Text className="text-xs font-bold text-gray-900">
                    {item.rating?.overall?.toFixed(1) || "New"}
                  </Text>
                  <Text className="text-[10px] text-gray-500 font-medium">
                    ({item.doctorMetrics?.totalReviews || 0})
                  </Text>
                </GlassCard>
              </View>

              {/* Title Content Overlay */}
              <View className="absolute bottom-4 left-5 right-5">
                <Text
                  className="text-2xl font-bold text-white shadow-sm mb-1"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons
                    name="location"
                    size={14}
                    color={colors.gray[300]}
                  />
                  <Text
                    className="text-gray-200 text-sm font-medium"
                    numberOfLines={1}
                  >
                    {item.address}, {item.city}
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. Enhanced Metrics Grid */}
            <View className="p-5 bg-white/40">
              <View className="flex-row gap-3 mb-3">
                {/* Revenue (Highlighted) */}
                <View className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 relative overflow-hidden">
                  <LinearGradient
                    colors={["#6366f1", "#8b5cf6"]}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                    }}
                  />
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Total Revenue
                      </Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(
                          doctorMetrics?.totalRevenueGenerated || 0,
                        )}
                      </Text>
                    </View>
                    <View className="bg-white/20 p-2 rounded-lg">
                      <MaterialCommunityIcons
                        name="finance"
                        size={20}
                        color="white"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Secondary Metrics Row */}
              <View className="flex-row gap-3">
                {renderMetricItem(
                  "Total Appts",
                  doctorMetrics?.totalAppointments || 0,
                  <Ionicons name="people" size={20} color={colors.blue[500]} />,
                  "bg-blue-50/80 border border-blue-100",
                  index * 150 + 100,
                )}
                {renderMetricItem(
                  "Upcoming",
                  doctorMetrics?.upcomingAppointments || 0,
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={colors.amber[500]}
                  />,
                  "bg-amber-50/80 border border-amber-100",
                  index * 150 + 200,
                )}
                {renderMetricItem(
                  "Completed",
                  doctorMetrics?.completedAppointments || 0,
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.emerald[500]}
                  />,
                  "bg-emerald-50/80 border border-emerald-100",
                  index * 150 + 300,
                )}
              </View>
            </View>

            {/* 3. Action Footer */}
            <View className="px-5 pb-5">
              <View className="h-[1px] bg-gray-200/50 mb-4" />
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="bg-gray-100 px-3 py-1 rounded-md">
                    <Text className="text-xs text-gray-600 font-medium">
                      {item.clinicType || "Clinic"}
                    </Text>
                  </View>
                  {item.consultationFee && (
                    <Text className="text-xs text-gray-500">
                      ₹{item.consultationFee}/visit
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-indigo-600 font-bold text-sm">
                    Manage Clinic
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={colors.indigo[600]}
                  />
                </View>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSkeleton = () => (
    <View className="px-5 space-y-6 mt-4">
      {[1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.5 }}
          animate={{ opacity: 0.8 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          className="h-[400px] bg-white/40 rounded-[32px] border border-white/20 overflow-hidden"
        />
      ))}
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.indigo[600]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <PremiumHeader
          name={user?.name || "Doctor"}
          profilePic={user?.profilePic}
          notificationCount={0}
        />

        <View className="px-6 mb-6">
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            My Clinics
          </MotiText>
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            className="text-base text-gray-500 mt-1"
          >
            Overview of performance & details
          </MotiText>
        </View>

        {loading && !refreshing ? (
          renderSkeleton()
        ) : clinics.length > 0 ? (
          <View>{clinics.map(renderClinicCard)}</View>
        ) : (
          <View className="px-6 mt-10 items-center">
            <GlassCard className="w-full p-10 items-center bg-white/60 rounded-[32px]">
              <MotiView
                from={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-28 h-28 bg-indigo-50 rounded-full items-center justify-center mb-6 shadow-sm border border-indigo-100"
              >
                <MaterialCommunityIcons
                  name="hospital-marker"
                  size={56}
                  color={colors.indigo[400]}
                />
              </MotiView>
              <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                No Clinics Found
              </Text>
              <Text className="text-gray-500 text-center mb-8 leading-6 px-4">
                You haven't added any clinics to your profile yet. Start by
                creating your first clinic to manage appointments.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/clinics/register")}
                className="bg-indigo-600 px-10 py-4 rounded-2xl shadow-lg shadow-indigo-300 w-full active:bg-indigo-700"
              >
                <Text className="text-white font-bold text-center text-lg">
                  Register New Clinic
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button for adding clinic */}
      {!loading && clinics.length > 0 && (
        <Animated.View
          entering={FadeInUp.delay(500).springify()}
          className="absolute bottom-6 right-6"
        >
          <TouchableOpacity
            onPress={() => router.push("/clinics/register")}
            className="bg-gray-900 w-16 h-16 rounded-full items-center justify-center shadow-2xl shadow-black/40 border border-white/10"
            style={{ elevation: 8 }}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </GradientBackground>
  );
};

export default ClinicScreen;
