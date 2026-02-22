import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { doctorApi } from "../../apis/doctors";
import { ClinicAnalytics, DaySchedule } from "../../types/models";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-gifted-charts";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";

// ─── Constants ────────────────────────────────────────────────────────────────

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
type DayKey = (typeof DAYS)[number];
const DAY_LABELS: Record<DayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ClinicTiming = Partial<Record<DayKey, DaySchedule>>;

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

type UpcomingAppointment = {
  _id: string;
  patientName: string;
  patientImage: string | null;
  date: string;
  time: string;
  status: string;
  service: { name?: string } | null;
  appointmentType: "In-Clinic" | "Home-Visit" | "Video-Call";
};

type PopularService = { name: string; count: number };

type ChartItem = {
  value: number;
  label: string;
  frontColor: string;
  gradientColor: string;
};

// ─── Helper Components ────────────────────────────────────────────────────────

type SectionTitleProps = {
  text: string;
  subtitle?: string;
  className?: string;
};
const SectionTitle = ({ text, subtitle, className }: SectionTitleProps) => (
  <View className={`px-1 mb-4 flex-row items-center gap-2 ${className ?? ""}`}>
    <View className="w-1 h-5 rounded-full bg-indigo-500" />
    <View>
      <Text className="text-base font-bold text-gray-900 tracking-tight">
        {text}
      </Text>
      {subtitle ? (
        <Text className="text-[11px] text-gray-400 mt-0.5">{subtitle}</Text>
      ) : null}
    </View>
  </View>
);

type TrendBadgeProps = { trend: number; dark?: boolean };
const TrendBadge = ({ trend, dark = false }: TrendBadgeProps) => {
  if (trend === 0) return null;
  const up = trend > 0;
  const containerBg = dark
    ? up
      ? "bg-emerald-400/20"
      : "bg-rose-400/20"
    : up
      ? "bg-green-100"
      : "bg-red-100";
  const textColor = dark
    ? up
      ? "text-emerald-200"
      : "text-rose-200"
    : up
      ? "text-green-700"
      : "text-red-700";
  return (
    <View
      className={`flex-row items-center gap-0.5 px-2 py-0.5 rounded-full ${containerBg}`}
    >
      <Ionicons
        name={up ? "trending-up" : "trending-down"}
        size={10}
        color={
          dark
            ? up
              ? colors.emerald[200]
              : colors.rose[200]
            : up
              ? colors.green[700]
              : colors.red[700]
        }
      />
      <Text className={`text-[10px] font-bold ${textColor}`}>
        {up ? "+" : ""}
        {trend}%
      </Text>
    </View>
  );
};

type KpiTileProps = {
  icon: React.ReactNode;
  bg: string;
  gradColors: readonly [string, string];
  value: string | number;
  label: string;
  trend?: number;
};
const KpiTile = ({
  icon,
  bg,
  gradColors,
  value,
  label,
  trend,
}: KpiTileProps) => (
  <View
    className="flex-1 rounded-3xl overflow-hidden"
    style={{
      elevation: 2,
      shadowColor: gradColors[1],
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    }}
  >
    <LinearGradient
      colors={[...gradColors]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-3.5"
    >
      <View
        className={`w-8 h-8 rounded-xl items-center justify-center mb-3 bg-white/25`}
      >
        {icon}
      </View>
      <Text className="text-2xl font-bold text-white">{value}</Text>
      <Text className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mt-0.5">
        {label}
      </Text>
      {trend !== undefined ? <TrendBadge trend={trend} dark /> : null}
    </LinearGradient>
  </View>
);

const STATUS_META: Record<
  AppointmentStatus,
  { bar: string; text: string; bg: string }
> = {
  completed: {
    bar: colors.emerald[500],
    text: colors.emerald[700],
    bg: colors.emerald[50],
  },
  pending: {
    bar: colors.amber[400],
    text: colors.amber[700],
    bg: colors.amber[50],
  },
  confirmed: {
    bar: colors.blue[500],
    text: colors.blue[700],
    bg: colors.blue[50],
  },
  cancelled: {
    bar: colors.red[400],
    text: colors.red[700],
    bg: colors.red[50],
  },
  rejected: {
    bar: colors.rose[500],
    text: colors.rose[700],
    bg: colors.rose[50],
  },
  expired: {
    bar: colors.gray[400],
    text: colors.gray[500],
    bg: colors.gray[100],
  },
};

type StatusKpiProps = { status: string; count: number };
const StatusKpi = ({ status, count }: StatusKpiProps) => {
  const m = STATUS_META[status as AppointmentStatus] ?? {
    bar: colors.gray[400],
    text: colors.gray[500],
    bg: colors.gray[50],
  };
  return (
    <View
      style={{
        backgroundColor: m.bg,
        borderLeftColor: m.bar,
        borderLeftWidth: 3,
      }}
      className="flex-1 min-w-[28%] p-3 rounded-r-2xl rounded-l-sm"
    >
      <Text style={{ color: m.text }} className="text-xl font-bold">
        {count}
      </Text>
      <Text
        style={{ color: m.text }}
        className="text-[10px] capitalize font-semibold mt-0.5"
      >
        {status}
      </Text>
    </View>
  );
};

type InfoChipProps = {
  icon: string;
  label: string;
  color?: string;
  bg?: string;
};
const InfoChip = ({
  icon,
  label,
  color = colors.indigo[700],
  bg = colors.indigo[50],
}: InfoChipProps) => (
  <View
    style={{ backgroundColor: bg }}
    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 mr-2 mb-1"
  >
    <Ionicons name={icon as any} size={13} color={color} />
    <Text style={{ color }} className="text-xs font-semibold">
      {label}
    </Text>
  </View>
);

const FACILITY_ICONS: Record<string, { icon: string; lib: "ion" | "mc" }> = {
  Parking: { icon: "car", lib: "ion" },
  "Wheelchair Access": { icon: "wheelchair-accessibility", lib: "mc" },
  Restroom: { icon: "toilet", lib: "mc" },
  "Waiting Area": { icon: "seat", lib: "mc" },
  "Waiting Room": { icon: "seat", lib: "mc" },
  Wifi: { icon: "wifi", lib: "ion" },
  "X-Ray": { icon: "radiology-box-outline", lib: "mc" },
  MRI: { icon: "mri", lib: "mc" },
  Gym: { icon: "dumbbell", lib: "mc" },
};

type FacilityChipProps = { label: string };
const FacilityChip = ({ label }: FacilityChipProps) => {
  const info = FACILITY_ICONS[label];
  return (
    <View
      className="items-center mr-4 mb-4 overflow-hidden rounded-2xl"
      style={{ width: 64 }}
    >
      <LinearGradient
        colors={[colors.indigo[500], colors.violet[600]]}
        className="w-12 h-12 rounded-2xl items-center justify-center mb-1.5 overflow-hidden"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {info?.lib === "mc" ? (
          <MaterialCommunityIcons
            name={info.icon as any}
            size={22}
            color="white"
          />
        ) : (
          <Ionicons
            name={(info?.icon ?? "checkmark-circle") as any}
            size={22}
            color="white"
          />
        )}
      </LinearGradient>
      <Text
        className="text-gray-600 text-[10px] font-semibold text-center"
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
};

type TimingRowProps = { day: DayKey; schedule: DaySchedule };
const TimingRow = ({ day, schedule }: TimingRowProps) => {
  const todayIndex = new Date().getDay();
  const todayDayKey = DAYS[todayIndex === 0 ? 6 : todayIndex - 1];
  const isToday = day === todayDayKey;
  const closed = schedule.isClosed;
  const shifts = schedule.shifts ?? [];
  return (
    <View
      className={`flex-row items-center justify-between py-3 px-3 rounded-2xl mb-1.5 ${
        isToday ? "" : closed ? "opacity-50" : ""
      }`}
    >
      {isToday && (
        <LinearGradient
          colors={[colors.indigo[500], colors.violet[600]]}
          style={StyleSheet.absoluteFill}
          className="rounded-2xl"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      )}
      <Text
        className={`text-sm font-bold w-10 ${isToday ? "text-white" : "text-gray-700"}`}
      >
        {DAY_LABELS[day]}
      </Text>
      {closed ? (
        <View className="bg-red-50 px-3 py-0.5 rounded-full">
          <Text className="text-red-500 text-xs font-bold">Closed</Text>
        </View>
      ) : shifts.length === 0 ? (
        <Text className="text-gray-400 text-xs">—</Text>
      ) : (
        <View className="items-end gap-0.5">
          {shifts.map((s, i) => (
            <Text
              key={i}
              className={`text-xs font-medium ${
                isToday ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {s.open12h ?? s.open} – {s.close12h ?? s.close}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

type StatusBadgeProps = { label: string; color: string; bg: string };
const StatusBadge = ({ label, color, bg }: StatusBadgeProps) => (
  <View
    style={{ backgroundColor: bg }}
    className="px-3 py-1 rounded-full mr-2 mb-1"
  >
    <Text style={{ color }} className="text-[10px] font-bold">
      {label}
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ClinicDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<ClinicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month",
  );

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [-100, 0, IMG_HEIGHT],
      [IMG_HEIGHT + 100, IMG_HEIGHT, insets.top + 60],
      Extrapolation.CLAMP,
    ),
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-100, 0, IMG_HEIGHT],
          [-50, 0, IMG_HEIGHT * 0.5],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-100, 0],
          [1.5, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const stickyOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [IMG_HEIGHT - 60, IMG_HEIGHT - 20],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const overlayOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, IMG_HEIGHT - 80],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await doctorApi.getClinicAnalytics(id, timeframe);
      if (response.data) setData(response.data.data);
    } catch (error) {
      console.error("Error fetching clinic analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, timeframe]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={colors.indigo[600]} />
        <Text className="text-gray-400 text-sm mt-3">
          Loading clinic details…
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <StatusBar style="dark" />
        <MaterialCommunityIcons
          name="hospital-box-outline"
          size={64}
          color={colors.gray[300]}
        />
        <Text className="text-gray-500 font-semibold mt-3">
          Clinic not found
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          You may not have access to this clinic.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-indigo-600 px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Safe destructure with defaults ────────────────────────────────────────
  const {
    clinic,
    appointmentStats,
    revenue,
    ratings,
    patientDemographics,
    upcomingAppointments = [],
    dailyTrends = [],
    popularServices = [],
    monthlyTrends = [],
  } = data;

  // clinic is Partial<Clinic> — every field is optional
  const clinicName = clinic.name ?? "Clinic";
  const clinicAddress = [clinic.address, clinic.city, clinic.state]
    .filter(Boolean)
    .join(", ");
  const clinicPincode = clinic.pincode ?? "";
  const clinicPhone = clinic.phoneNumber ?? "";
  const clinicImages: string[] = clinic.images ?? [];
  const clinicFacilities: string[] = clinic.facilities ?? [];
  const clinicTiming: ClinicTiming =
    (clinic.timing as ClinicTiming | undefined) ?? {};
  const clinicFee = clinic.consultationFee ?? 0;
  const clinicType = clinic.clinicType ?? null;
  const clinicDescription = clinic.description ?? null;
  const clinicOpen24 = clinic.open24hrs ?? false;
  const clinicVerified = clinic.isVerified ?? false;
  const clinicApptConfig = clinic.appointmentConfig ?? null;
  const clinicHomeVisit = clinic.homeVisitConfig ?? null;

  const chartItems: ChartItem[] = (
    timeframe === "year" ? monthlyTrends : dailyTrends
  )
    .slice(-14)
    .map((item) => ({
      value: (item as any).count ?? 0,
      label:
        timeframe === "year"
          ? ((item as any).month ?? "")
          : ((item as any).weekday ?? ""),
      frontColor: colors.indigo[500],
      gradientColor: colors.indigo[200],
    }));

  const byStatus = appointmentStats?.byStatus ?? {};

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />

      {/* ── Parallax hero ─────────────────────────────────────────────────── */}
      <Animated.View style={[styles.heroContainer, headerStyle]}>
        {clinicImages[0] ? (
          <Animated.Image
            source={{ uri: clinicImages[0] }}
            style={[styles.heroImage, imageStyle]}
          />
        ) : (
          <Animated.View
            style={[
              styles.heroImage,
              {
                backgroundColor: colors.indigo[100],
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="hospital-building"
              size={80}
              color={colors.indigo[300]}
            />
          </Animated.View>
        )}
        {/* <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={StyleSheet.absoluteFill}
        /> */}

        {/* Overlay info – fades on scroll */}
        <Animated.View
          style={[
            { position: "absolute", bottom: 20, left: 20, right: 20 },
            overlayOpacity,
          ]}
        >
          <View className="flex-row flex-wrap mb-2">
            {clinicOpen24 && (
              <StatusBadge
                label="24/7 OPEN"
                color={colors.emerald[300]}
                bg="rgba(16,185,129,0.2)"
              />
            )}
            {clinicVerified && (
              <StatusBadge
                label="✓ VERIFIED"
                color={colors.blue[300]}
                bg="rgba(59,130,246,0.2)"
              />
            )}
            {clinicType && (
              <StatusBadge
                label={clinicType.toUpperCase()}
                color={colors.gray[300]}
                bg="rgba(255,255,255,0.1)"
              />
            )}
          </View>
          <Text
            className="text-3xl font-bold text-white mb-1"
            numberOfLines={2}
          >
            {clinicName}
          </Text>
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name="location" size={13} color={colors.gray[300]} />
            <Text className="text-gray-200 text-sm flex-1" numberOfLines={1}>
              {clinicAddress}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={13} color={colors.amber[400]} />
              <Text className="text-amber-200 font-bold text-sm">
                {(ratings?.average ?? 0).toFixed(1)}
              </Text>
              <Text className="text-amber-200/60 text-xs">
                ({ratings?.count ?? 0})
              </Text>
            </View>
            {clinicPhone ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="call" size={13} color={colors.gray[300]} />
                <Text className="text-gray-200 text-xs">{clinicPhone}</Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </Animated.View>

      {/* ── Sticky title bar ──────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.stickyBar,
          stickyOpacity,
          { paddingTop: insets.top, height: insets.top + 60 },
        ]}
        // className="bg-gray-500/80 shadow-none"
        className="border-b-2 border-gray-200"
      >
        <BlurView
          intensity={50}
          tint="prominent"
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod="dimezisBlurView"
        />
        <View className="flex-1 flex-row items-center px-4 justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text
            className="font-bold text-xl text-black flex-1 text-center"
            numberOfLines={1}
          >
            {clinicName}
          </Text>
          <View className="w-10" />
        </View>
      </Animated.View>

      {/* ── Floating back button ──────────────────────────────────────────── */}
      <Animated.View
        style={[
          { position: "absolute", top: insets.top + 10, left: 20, zIndex: 200 },
          overlayOpacity,
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/30 items-center justify-center border border-white/20"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: IMG_HEIGHT + 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeframe tabs */}
        <View className="px-5 mb-6">
          <View
            className="flex-row bg-white rounded-2xl p-1.5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {(["week", "month", "year"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTimeframe(t)}
                className="flex-1 items-center py-2.5 rounded-xl overflow-hidden"
              >
                {timeframe === t && (
                  <LinearGradient
                    colors={[colors.indigo[500], colors.violet[600]]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                )}
                <Text
                  className={`text-xs font-bold capitalize ${timeframe === t ? "text-white" : "text-gray-400"}`}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── KPI cards ───────────────────────────────────────────────────── */}
        <View className="px-5 mb-8">
          <SectionTitle text="Overview" />
          {/* Revenue + Appointments top row */}
          <View className="flex-row gap-3 mb-3">
            <GlassCard className="flex-[2] p-4 rounded-3xl overflow-hidden bg-white border border-gray-100">
              <LinearGradient
                colors={[colors.indigo[500], colors.indigo[700]]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View className="flex-row justify-between items-start mb-5">
                <View className="p-2 bg-white/20 rounded-xl">
                  <MaterialCommunityIcons
                    name="finance"
                    size={20}
                    color="white"
                  />
                </View>
                <TrendBadge trend={revenue?.trend ?? 0} dark />
              </View>
              <View>
                <Text className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Revenue
                </Text>
                <Text className="text-white text-xl font-bold">
                  ₹{(revenue?.currentPeriod ?? 0).toLocaleString()}
                </Text>
                <Text className="text-indigo-200 text-[10px] mt-0.5">
                  All‑time ₹{(revenue?.total ?? 0).toLocaleString()}
                </Text>
              </View>
            </GlassCard>

            <GlassCard className="flex-1 p-4 rounded-3xl bg-white border border-gray-100 justify-between">
              <View className="p-2 bg-blue-50 rounded-xl self-start">
                <Ionicons name="calendar" size={18} color={colors.blue[500]} />
              </View>
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  {appointmentStats?.total ?? 0}
                </Text>
                <Text className="text-gray-400 text-[10px] font-medium">
                  Appts
                </Text>
                <Text className="text-gray-400 text-[10px]">
                  All‑time {appointmentStats?.allTime ?? 0}
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Patients, Rating, Avg revenue */}
          <View className="flex-row gap-3">
            <KpiTile
              icon={<Ionicons name="people" size={18} color="white" />}
              bg="bg-white/25"
              gradColors={[colors.purple[500], colors.indigo[600]] as const}
              value={patientDemographics?.currentPeriod ?? 0}
              label="Patients"
              trend={patientDemographics?.trend ?? 0}
            />
            <KpiTile
              icon={<Ionicons name="star" size={18} color="white" />}
              bg="bg-white/25"
              gradColors={[colors.amber[400], colors.orange[500]] as const}
              value={(ratings?.currentPeriod ?? 0).toFixed(1)}
              label="Rating"
            />
            <KpiTile
              icon={<Ionicons name="cash" size={18} color="white" />}
              bg="bg-white/25"
              gradColors={[colors.emerald[500], colors.teal[600]] as const}
              value={`₹${Math.round(revenue?.average ?? 0)}`}
              label="Avg/Appt"
            />
          </View>
        </View>

        {/* ── Status breakdown ──────────────────────────────────────────────── */}
        {Object.keys(byStatus).length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="px-5 mb-8"
          >
            <SectionTitle text="Appointment Status" />
            <View
              className="bg-white rounded-3xl p-4"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row flex-wrap gap-2">
                {(Object.entries(byStatus) as [string, number][]).map(
                  ([status, count]) => (
                    <StatusKpi key={status} status={status} count={count} />
                  ),
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* ── Activity chart ──────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          className="px-5 mb-8"
        >
          <SectionTitle
            text="Activity Trends"
            subtitle={`Per ${timeframe === "year" ? "month" : "day"}`}
          />
          <View
            className="rounded-3xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <LinearGradient colors={["#fafbff", "#f0f3ff"]} className="p-5">
              {chartItems.length > 0 ? (
                <BarChart
                  data={chartItems}
                  barWidth={20}
                  noOfSections={4}
                  barBorderRadius={4}
                  frontColor={colors.indigo[500]}
                  gradientColor={colors.indigo[200]}
                  showGradient
                  yAxisThickness={0}
                  xAxisThickness={0}
                  xAxisLabelTextStyle={{ color: colors.gray[400], fontSize: 9 }}
                  yAxisTextStyle={{ color: colors.gray[400], fontSize: 9 }}
                  height={160}
                  width={width - 80}
                  hideRules
                  isAnimated
                />
              ) : (
                <View className="h-32 items-center justify-center">
                  <Feather
                    name="bar-chart-2"
                    size={40}
                    color={colors.gray[200]}
                  />
                  <Text className="text-gray-400 text-sm mt-2">
                    No data for this period
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>
        </Animated.View>

        {/* ── Clinic Info ──────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-5 mb-8"
        >
          <SectionTitle text="Clinic Info" />
          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {clinicDescription ? (
              <Text className="text-gray-600 text-sm leading-5 mb-4">
                {clinicDescription}
              </Text>
            ) : null}
            <View className="flex-row flex-wrap">
              <InfoChip icon="cash-outline" label={`₹${clinicFee} / visit`} />
              {clinicType ? (
                <InfoChip icon="business-outline" label={clinicType} />
              ) : null}
              {clinicApptConfig?.slotDuration ? (
                <InfoChip
                  icon="time-outline"
                  label={`${clinicApptConfig.slotDuration} min slots`}
                />
              ) : null}
              {clinicApptConfig?.instantBooking ? (
                <InfoChip
                  icon="flash-outline"
                  label="Instant Booking"
                  color={colors.amber[700]}
                  bg={colors.amber[50]}
                />
              ) : null}
              {clinicApptConfig?.isVirtualConsultationAvailable ? (
                <InfoChip
                  icon="videocam-outline"
                  label="Virtual Consult"
                  color={colors.blue[700]}
                  bg={colors.blue[50]}
                />
              ) : null}
              {clinicHomeVisit?.isAvailable ? (
                <InfoChip
                  icon="home-outline"
                  label={`Home Visit (${clinicHomeVisit.radiusKm ?? 0} km)`}
                  color={colors.emerald[700]}
                  bg={colors.emerald[50]}
                />
              ) : null}
            </View>

            <View className="h-px bg-gray-100 my-4" />
            <View className="flex-row items-start gap-2 mb-2">
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.gray[400]}
              />
              <Text className="text-gray-600 text-sm flex-1">
                {clinicAddress}
                {clinicPincode ? ` – ${clinicPincode}` : ""}
              </Text>
            </View>
            {clinicPhone ? (
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={colors.gray[400]}
                />
                <Text className="text-gray-600 text-sm">{clinicPhone}</Text>
              </View>
            ) : null}
          </View>
        </Animated.View>

        {/* ── Facilities ──────────────────────────────────────────────────── */}
        {clinicFacilities.length > 0 ? (
          <Animated.View
            entering={FadeInDown.delay(220).springify()}
            className="mb-8"
          >
            <SectionTitle text="Facilities" className="px-5" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4 }}
            >
              {clinicFacilities.map((f) => (
                <FacilityChip key={f} label={f} />
              ))}
            </ScrollView>
          </Animated.View>
        ) : null}

        {/* ── Working Hours ────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(240).springify()}
          className="px-5 mb-8"
        >
          <SectionTitle text="Working Hours" />
          <View
            className="bg-white rounded-3xl p-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {clinicOpen24 ? (
              <LinearGradient
                colors={[colors.emerald[500], colors.teal[600]]}
                className="flex-row items-center gap-3 px-4 py-3 rounded-2xl"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="time" size={18} color="white" />
                <Text className="text-white font-bold">
                  Open 24 hours, 7 days a week
                </Text>
              </LinearGradient>
            ) : (
              DAYS.map((day) => {
                const schedule = clinicTiming[day];
                if (!schedule) return null;
                return <TimingRow key={day} day={day} schedule={schedule} />;
              })
            )}
          </View>
        </Animated.View>

        {/* ── Insights ────────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(260).springify()}
          className="px-5 mb-8"
        >
          <SectionTitle text="Insights" />
          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Busiest Day",
                value: appointmentStats?.busiestDay?.day
                  ? appointmentStats.busiestDay.day.slice(0, 3)
                  : "—",
                icon: "calendar" as const,
                colors: [colors.orange[500], colors.red[500]] as const,
              },
              {
                label: "Peak Hour",
                value: appointmentStats?.busiestTimeSlot?.formattedTime ?? "—",
                icon: "clock" as const,
                colors: [colors.violet[500], colors.indigo[600]] as const,
              },
              {
                label: "All Patients",
                value: String(patientDemographics?.total ?? 0),
                icon: "users" as const,
                colors: [colors.blue[500], colors.cyan[600]] as const,
              },
            ].map((item) => (
              <View
                key={item.label}
                className="flex-1 rounded-3xl overflow-hidden"
                style={{
                  elevation: 3,
                  shadowColor: item.colors[1],
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <LinearGradient
                  colors={[...item.colors]}
                  className="p-3.5 items-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center mb-2">
                    <Feather name={item.icon} size={18} color="white" />
                  </View>
                  <Text className="text-white font-bold text-base">
                    {item.value}
                  </Text>
                  <Text className="text-white/70 text-[10px] font-semibold uppercase tracking-wide mt-0.5 text-center">
                    {item.label}
                  </Text>
                </LinearGradient>
              </View>
            ))}
          </View>

          {/* Gender split */}
          <View
            className="bg-white rounded-3xl p-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text className="text-sm font-bold text-gray-700 mb-4">
              Patient Gender Split
            </Text>
            {[
              {
                label: "Male",
                value: patientDemographics?.gender?.male ?? 0,
                colors: [colors.blue[400], colors.indigo[500]] as const,
              },
              {
                label: "Female",
                value: patientDemographics?.gender?.female ?? 0,
                colors: [colors.pink[400], colors.rose[500]] as const,
              },
              {
                label: "Other",
                value: patientDemographics?.gender?.other ?? 0,
                colors: [colors.purple[400], colors.violet[500]] as const,
              },
            ].map((g) => {
              const total = (patientDemographics?.total ?? 0) || 1;
              const pct = Math.round((g.value / total) * 100);
              return (
                <View key={g.label} className="mb-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-600 text-xs font-semibold">
                      {g.label}
                    </Text>
                    <Text
                      style={{ color: g.colors[1] }}
                      className="text-xs font-bold"
                    >
                      {g.value} · {pct}%
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <LinearGradient
                      colors={[...g.colors]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: 999,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Popular Services ─────────────────────────────────────────────── */}
        {popularServices.length > 0 ? (
          <Animated.View
            entering={FadeInDown.delay(280).springify()}
            className="px-5 mb-8"
          >
            <SectionTitle text="Top Services" />
            <View
              className="bg-white rounded-3xl p-5"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {popularServices.map((svc: PopularService, i: number) => {
                const pct = Math.round(
                  (svc.count / (popularServices[0]?.count || 1)) * 100,
                );
                const barColors = [
                  [colors.indigo[500], colors.violet[600]],
                  [colors.blue[500], colors.cyan[600]],
                  [colors.purple[500], colors.indigo[600]],
                ] as const;
                const bc = barColors[i % 3]!;
                return (
                  <View key={`${svc.name}-${i}`} className="mb-5">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-2.5">
                        <LinearGradient
                          colors={[...bc]}
                          className="w-7 h-7 rounded-xl items-center justify-center"
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Text className="text-white font-bold text-[10px]">
                            {i + 1}
                          </Text>
                        </LinearGradient>
                        <Text className="text-gray-800 font-semibold text-sm">
                          {svc?.name}
                        </Text>
                      </View>
                      <Text
                        style={{ color: bc[0] }}
                        className="font-bold text-sm"
                      >
                        {svc?.count} visits
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <LinearGradient
                        colors={[...bc]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: 999,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        ) : null}

        {/* ── Upcoming Appointments ────────────────────────────────────────── */}
        <View className="px-5">
          <SectionTitle text="Upcoming Appointments" />
          {upcomingAppointments.length === 0 ? (
            <View className="p-10 items-center bg-white rounded-3xl border border-dashed border-indigo-200">
              <LinearGradient
                colors={[colors.indigo[50], colors.violet[50]]}
                className="w-20 h-20 rounded-full items-center justify-center mb-3"
              >
                <Ionicons
                  name="calendar-outline"
                  size={40}
                  color={colors.indigo[300]}
                />
              </LinearGradient>
              <Text className="text-gray-500 font-semibold">
                No upcoming appointments
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Your schedule is clear
              </Text>
            </View>
          ) : (
            (upcomingAppointments as UpcomingAppointment[]).map(
              (apt, index) => (
                <MotiView
                  key={apt._id}
                  from={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 80 } as any}
                  className="mb-3"
                >
                  <View
                    className="p-4 bg-white rounded-2xl flex-row items-center"
                    style={{
                      shadowColor: "#000",
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <View className="h-11 w-11 rounded-full bg-indigo-50 overflow-hidden border border-indigo-100 mr-3 items-center justify-center">
                      {apt.patientImage ? (
                        <Image
                          source={{ uri: apt.patientImage }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                        />
                      ) : (
                        <Text className="text-indigo-600 font-bold text-base">
                          {apt.patientName?.charAt(0) ?? "P"}
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-sm">
                        {apt.patientName ?? "Unknown Patient"}
                      </Text>
                      <Text className="text-gray-400 text-xs mt-0.5">
                        {apt.service?.name ?? "Consultation"}
                      </Text>
                    </View>
                    <View className="items-end bg-gray-50 px-3 py-1.5 rounded-xl">
                      <Text className="text-indigo-600 font-bold text-xs">
                        {new Date(apt.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}
                      </Text>
                      <Text className="text-gray-400 text-[10px] uppercase font-medium mt-0.5">
                        {apt.time}
                      </Text>
                    </View>
                  </View>
                </MotiView>
              ),
            )
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  heroContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    zIndex: 1,
    overflow: "hidden",
  },
  heroImage: {
    width,
    height: IMG_HEIGHT + 100,
    position: "absolute",
    top: 0,
  },
  stickyBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
  },
});

export default ClinicDetailsScreen;
