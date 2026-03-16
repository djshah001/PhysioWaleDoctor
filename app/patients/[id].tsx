import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import colors from "tailwindcss/colors";
import { MotiView } from "moti";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { doctorApi } from "~/apis/doctors";
import { Patient, Appointment } from "~/types/models";

interface PatientDetailsResponse {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: any[];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBox = ({
  style,
  className = "",
}: {
  style?: ViewStyle;
  className?: string;
}) => {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.82,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[{ opacity }, style]}
      className={`bg-white/50 rounded-2xl ${className}`}
    />
  );
};

const DetailSkeleton = () => (
  <View className="px-4 gap-4 pt-4">
    <View className="flex-row items-center justify-center mb-2">
      <SkeletonBox style={{ width: 96, height: 96, borderRadius: 48 }} />
    </View>
    <View className="items-center gap-2 mb-4">
      <SkeletonBox style={{ width: 160, height: 24 }} />
      <SkeletonBox style={{ width: 120, height: 16 }} />
    </View>
    <View className="flex-row gap-3">
      <SkeletonBox style={{ height: 80, flex: 1 }} />
      <SkeletonBox style={{ height: 80, flex: 1 }} />
    </View>
    <SkeletonBox style={{ height: 150 }} />
    <SkeletonBox style={{ height: 150 }} />
  </View>
);

// ─── Info row helper ──────────────────────────────────────────────────────────

const InfoRow = ({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <View className="flex-row items-center gap-3 py-3 border-b border-white/20 last:border-0">
    <View className="bg-indigo-50/80 p-2 rounded-xl mt-0.5 border border-indigo-100/50">
      <Ionicons name={icon} size={16} color="#4f46e5" />
    </View>
    <View className="flex-1">
      <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
        {label}
      </Text>
      <Text
        className={`text-slate-800 text-sm ${mono ? "font-mono tracking-widest text-indigo-700 font-bold" : "font-semibold"}`}
      >
        {value}
      </Text>
    </View>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<PatientDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await doctorApi.getPatientDetails(id as string);
      setData(res.data?.data);
    } catch (err: any) {
      console.error("Error fetching patient details:", err);
      setError("Failed to load patient details. They might not exist.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const renderContent = () => {
    if (loading && !data) return <DetailSkeleton />;

    if (error || !data) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <GlassCard contentContainerClassName="items-center p-8 w-full rounded-3xl">
            <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={colors.red[500]}
              />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">
              Error Loading Patient
            </Text>
            <Text className="text-slate-500 font-medium text-center mb-6 leading-relaxed">
              {error || "Patient not found."}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-slate-800 px-6 py-3 rounded-2xl w-full"
            >
              <Text className="text-white font-bold text-center">Go Back</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      );
    }

    const { patient, appointments, prescriptions } = data;

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100, // extra space for FAB
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDetails(true)}
            tintColor={colors.indigo[600]}
            colors={[colors.indigo[600]]}
          />
        }
      >
        {/* Profile Card */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350 }}
          className="mb-4"
        >
          <GlassCard
            className="rounded-3xl"
            contentContainerClassName="p-5 items-center"
          >
            <View className="w-24 h-24 rounded-full bg-white shadow-sm border-2 border-slate-100 overflow-hidden mb-4 items-center justify-center">
              {patient.profilePic ? (
                <Image
                  source={{ uri: patient.profilePic }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                />
              ) : (
                <Text className="text-4xl font-black text-indigo-400">
                  {patient.name?.charAt(0).toUpperCase() || "P"}
                </Text>
              )}
            </View>

            <Text className="text-2xl font-black text-slate-800 mb-1">
              {patient.name}
            </Text>

            {patient.gender && (
              <Text className="text-slate-500 font-medium mb-3 capitalize text-sm">
                {patient.gender}
                {patient.DOB
                  ? ` • ${Math.floor((new Date().getTime() - new Date(patient.DOB).getTime()) / 31557600000)} yrs`
                  : ""}
              </Text>
            )}

            <View className="w-full bg-white/40 rounded-2xl p-2 px-3 mt-1">
              {patient.phoneNumber && (
                <InfoRow
                  icon="call-outline"
                  label="Phone Number"
                  value={patient.phoneNumber}
                />
              )}
              {patient.email && (
                <InfoRow
                  icon="mail-outline"
                  label="Email Address"
                  value={patient.email}
                />
              )}
            </View>
          </GlassCard>
        </MotiView>

        {/* Stats Row */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 100 }}
          className="flex-row gap-3 mb-4"
        >
          <GlassCard
            className="flex-1 rounded-3xl"
            contentContainerClassName="p-4 items-center"
          >
            <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mb-2">
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.indigo[500]}
              />
            </View>
            <Text className="text-2xl font-black text-slate-800 mb-0.5">
              {appointments.length}
            </Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Sessions
            </Text>
          </GlassCard>

          <GlassCard
            className="flex-1 rounded-3xl"
            contentContainerClassName="p-4 items-center"
          >
            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2">
              <Ionicons
                name="fitness-outline"
                size={18}
                color={colors.emerald[500]}
              />
            </View>
            <Text className="text-2xl font-black text-slate-800 mb-0.5">
              {prescriptions.length}
            </Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Workouts
            </Text>
          </GlassCard>
        </MotiView>

        {/* Prescriptions Section */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 150 }}
          className="mb-4"
        >
          <GlassCard className="rounded-3xl" contentContainerClassName="p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Active Prescriptions
              </Text>
              <View className="bg-white/50 px-2 py-0.5 rounded-full border border-white/60">
                <Text className="text-[10px] font-bold text-slate-500">
                  {prescriptions.length}
                </Text>
              </View>
            </View>

            {prescriptions.length === 0 ? (
              <View className="bg-white/40 rounded-2xl border border-dashed border-white p-6 items-center">
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color={colors.slate[400]}
                  className="mb-2"
                />
                <Text className="text-slate-600 font-semibold text-center mt-2 mb-1">
                  No Active Plans
                </Text>
                <Text className="text-slate-400 text-xs text-center">
                  Create a workout to help them recover faster.
                </Text>
              </View>
            ) : (
              prescriptions.map((px, index) => (
                <View
                  key={px._id || index}
                  className="bg-white/60 rounded-2xl p-4 mb-2 flex-row items-center border border-white/80"
                >
                  <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color={colors.emerald[600]}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-bold mb-0.5 text-[15px]">
                      {px.templateSnapshot?.name || "Custom Workout"}
                    </Text>
                    <Text className="text-xs font-medium text-emerald-600">
                      Status: {px.status}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.slate[300]}
                  />
                </View>
              ))
            )}
          </GlassCard>
        </MotiView>

        {/* Appointment History */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 200 }}
          className="mb-4"
        >
          <GlassCard className="rounded-3xl" contentContainerClassName="p-5">
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Recent Sessions
            </Text>

            {appointments.length === 0 ? (
              <View className="bg-white/40 rounded-2xl p-6 items-center">
                <Ionicons
                  name="calendar-outline"
                  size={28}
                  color={colors.slate[300]}
                />
                <Text className="text-slate-500 font-medium text-center mt-3">
                  No history available.
                </Text>
              </View>
            ) : (
              appointments.slice(0, 5).map((app, index) => (
                <View
                  key={app._id}
                  className="bg-white/60 rounded-2xl p-3 mb-2 flex-row items-center border border-white/60"
                >
                  <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-3">
                    <Ionicons
                      name={
                        app.appointmentType === "Video-Call"
                          ? "videocam-outline"
                          : "business-outline"
                      }
                      size={18}
                      color={colors.slate[400]}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-bold text-[14px]">
                      {new Date(app.startDateTime).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <Text className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {typeof app.service === "object" && app.service
                        ? (app.service as any).name
                        : "Follow Up"}
                      {" • "}
                      {app.appointmentType}
                    </Text>
                  </View>
                  <View
                    className={`px-2.5 py-1 rounded-lg ${app.bookingStatus === "completed" ? "bg-emerald-50" : app.bookingStatus === "confirmed" ? "bg-indigo-50" : "bg-slate-100"}`}
                  >
                    <Text
                      className={`text-[9px] font-black uppercase tracking-widest ${app.bookingStatus === "completed" ? "text-emerald-600" : app.bookingStatus === "confirmed" ? "text-indigo-600" : "text-slate-500"}`}
                    >
                      {app.bookingStatus}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </GlassCard>
        </MotiView>
      </ScrollView>
    );
  };

  return (
    <GradientBackground>
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 pb-2 gap-3 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-800 flex-1">
            Patient Profile
          </Text>
        </View>

        {renderContent()}

        {/* FAB */}
        {!loading && !error && data && (
          <View
            className="absolute bottom-6 left-6 right-6"
            style={{ paddingBottom: insets.bottom }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("Prescribe clicked");
              }}
              activeOpacity={0.8}
              className="bg-slate-800 rounded-2xl py-4 shadow-xl shadow-slate-300 flex-row justify-center items-center"
            >
              <Ionicons
                name="fitness"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white font-bold text-[15px] tracking-wide">
                Prescribe Workout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GradientBackground>
  );
}
