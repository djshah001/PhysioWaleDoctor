import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { userDataAtom } from "~/store/userAtoms";
import { homeApi } from "~/apis/home";
import { DashboardData } from "~/types/models";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { PremiumHeader } from "~/components/Home/modern/PremiumHeader";
import { QuickActionGrid } from "~/components/Home/modern/QuickActionGrid";
import { UpcomingScheduleCard } from "~/components/Home/modern/UpcomingScheduleCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";
import colors from "tailwindcss/colors";

// ─── Types ───────────────────────────────────────────────────────────────────

type Timeframe = "week" | "month" | "year";

// ─── Skeleton (NativeWind + RN Animated) ─────────────────────────────────────

/**
 * A pulsing skeleton block. Uses React Native's Animated API so it works
 * without Moti and across all platforms. Style through `className` and `style`.
 */
const SkeletonBox = ({
  className = "",
  style,
}: {
  className?: string;
  style?: ViewStyle;
}) => {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
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

/** Full-screen skeleton that mirrors the real layout */
const DashboardSkeleton = ({ insetTop }: { insetTop: number }) => (
  <ScrollView
    scrollEnabled={false}
    contentContainerStyle={{ paddingTop: insetTop + 8, paddingBottom: 40 }}
    className="flex-1"
  >
    {/* Header */}
    <View className="px-6 pb-4 flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        <SkeletonBox className="w-11 h-11 rounded-full" />
        <View className="gap-2">
          <SkeletonBox style={{ width: 80, height: 11 }} />
          <SkeletonBox style={{ width: 130, height: 20 }} />
        </View>
      </View>
      <SkeletonBox className="w-10 h-10 rounded-full" />
    </View>

    {/* Date widget */}
    <View className="px-6 mb-5">
      <SkeletonBox className="h-12 rounded-2xl" />
    </View>

    {/* Timeframe pills */}
    <View className="flex-row gap-2 px-6 mb-5">
      <SkeletonBox className="flex-1 h-9 rounded-full" />
      <SkeletonBox className="flex-1 h-9 rounded-full" />
      <SkeletonBox className="flex-1 h-9 rounded-full" />
    </View>

    {/* Section label */}
    <View className="px-6 mb-3">
      <SkeletonBox style={{ width: 140, height: 20 }} />
    </View>

    {/* Today 2×2 grid */}
    <View className="px-6 mb-6 flex-row flex-wrap gap-3">
      {[0, 1, 2, 3].map((i) => (
        <SkeletonBox
          key={i}
          style={{ width: "47.5%" as any, height: 90 }}
          className="rounded-2xl"
        />
      ))}
    </View>

    {/* Period strip label */}
    <View className="px-6 mb-3">
      <SkeletonBox style={{ width: 130, height: 20 }} />
    </View>

    {/* Period strip */}
    <View className="flex-row gap-3 pl-6 mb-6">
      {[0, 1, 2].map((i) => (
        <SkeletonBox
          key={i}
          style={{ width: 150, height: 110 }}
          className="rounded-3xl"
        />
      ))}
    </View>

    {/* Quick actions label */}
    <View className="px-6 mb-3">
      <SkeletonBox style={{ width: 110, height: 20 }} />
    </View>

    {/* Quick actions */}
    <View className="flex-row justify-between px-6 mb-6">
      {[0, 1, 2, 3].map((i) => (
        <View key={i} className="items-center gap-2">
          <SkeletonBox
            style={{ width: 56, height: 56 }}
            className="rounded-2xl"
          />
          <SkeletonBox style={{ width: 44, height: 11 }} />
        </View>
      ))}
    </View>

    {/* Upcoming label */}
    <View className="px-6 mb-3">
      <SkeletonBox style={{ width: 160, height: 20 }} />
    </View>

    {/* Upcoming appointment cards */}
    {[0, 1, 2].map((i) => (
      <View key={i} className="px-6 mb-3">
        <SkeletonBox style={{ height: 72 }} className="rounded-2xl" />
      </View>
    ))}
  </ScrollView>
);

// ─── Trend pill ───────────────────────────────────────────────────────────────

const TrendPill = ({
  value,
  invert = false,
}: {
  value: number;
  invert?: boolean;
}) => {
  if (value === 0) return null;
  const isGood = invert ? value < 0 : value > 0;
  const label = `${value > 0 ? "+" : ""}${value}%`;
  return (
    <View
      className={`flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full self-start mt-1
        ${isGood ? "bg-emerald-100" : "bg-red-100"}`}
    >
      <Ionicons
        name={value > 0 ? "trending-up" : "trending-down"}
        size={9}
        color={isGood ? "#059669" : "#dc2626"}
      />
      <Text
        className={`text-[9px] font-bold ${
          isGood ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {label}
      </Text>
    </View>
  );
};

// ─── Today grid ───────────────────────────────────────────────────────────────

const TodayGrid = ({ data }: { data: DashboardData["todayStats"] }) => {
  const cells = [
    {
      label: "Today's Patients",
      value: String(data.total),
      icon: "people" as const,
      color: "#4f46e5",
      bgColor: "#eef2ff",
    },
    {
      label: "Completed",
      value: String(data.completed),
      icon: "checkmark-circle" as const,
      color: "#059669",
      bgColor: "#ecfdf5",
    },
    {
      label: "Pending / Conf.",
      value: String(data.pending),
      icon: "time" as const,
      color: "#d97706",
      bgColor: "#fffbeb",
    },
    {
      label: "Today's Revenue",
      value: `₹${data.revenue.toLocaleString()}`,
      icon: "wallet" as const,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
    },
  ];

  return (
    <View className="px-6 mb-6">
      <Text className="text-base font-bold text-gray-800 mb-3">
        Today at a Glance
      </Text>
      {/* Use fixed row-pair layout instead of flex-wrap + percentage widths */}
      {[cells.slice(0, 2), cells.slice(2, 4)].map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row gap-3 mb-3">
          {row.map((c, i) => (
            <MotiView
              key={c.label}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: (rowIdx * 2 + i) * 80 }}
              className="flex-1"
            >
              <GlassCard
                className="flex-1 rounded-2xl"
                contentContainerClassName="p-4 rounded-2xl"
              >
                <View
                  style={{ backgroundColor: c.bgColor }}
                  className="self-start p-2 rounded-xl mb-2"
                >
                  <Ionicons name={c.icon} size={16} color={c.color} />
                </View>
                <Text
                  className="text-2xl font-extrabold text-gray-800"
                  numberOfLines={1}
                >
                  {c.value}
                </Text>
                <Text
                  className="text-gray-500 text-[11px] mt-0.5"
                  numberOfLines={1}
                >
                  {c.label}
                </Text>
              </GlassCard>
            </MotiView>
          ))}
        </View>
      ))}
    </View>
  );
};

// ─── Period stats strip ───────────────────────────────────────────────────────

const PeriodStats = ({
  data,
  timeframe,
}: {
  data: DashboardData;
  timeframe: Timeframe;
}) => {
  console.log(JSON.stringify(data, null, 2));

  const { width } = useWindowDimensions();
  const { appointmentStats, revenue, ratings, patientStats } = data;
  const tfLabel = timeframe.charAt(0).toUpperCase() + timeframe.slice(1);

  const cards = [
    {
      icon: "calendar" as const,
      label: `${tfLabel} Appointments`,
      value: String(appointmentStats.total),
      trend: appointmentStats.trend,
      color: "#4f46e5",
      bgColor: "#eef2ff",
    },
    {
      icon: "wallet" as const,
      label: "Period Revenue",
      value: `₹${revenue.thisPeriod.toLocaleString()}`,
      trend: revenue.growth,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
    },
    {
      icon: "star" as const,
      label: "Avg Rating",
      value: ratings.average > 0 ? `${ratings.average} ★` : "—",
      trend: ratings.trend,
      color: "#d97706",
      bgColor: "#fffbeb",
    },
    {
      icon: "people" as const,
      label: `${tfLabel} Patients`,
      value: String(patientStats.currentPeriod),
      trend: patientStats.trend,
      color: "#059669",
      bgColor: "#ecfdf5",
    },
    {
      icon: "cash" as const,
      label: "All-Time Revenue",
      value: `₹${revenue.allTime.toLocaleString()}`,
      trend: 0,
      color: "#0891b2",
      bgColor: "#ecfeff",
    },
  ];

  const cardWidth = Math.min(width * 0.44, 180);

  return (
    <View className="mb-6">
      <Text className="text-base font-bold text-gray-800 mb-3 px-6">
        Period Overview
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
        decelerationRate="fast"
      >
        {cards.map((c, i) => (
          <MotiView
            key={c.label}
            from={{ opacity: 0, translateX: 16 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: i * 60 }}
          >
            <GlassCard
              style={{ width: cardWidth }}
              className="rounded-3xl"
              contentContainerClassName="p-4 rounded-3xl"
            >
              <View
                style={{ backgroundColor: c.bgColor }}
                className="self-start p-2 rounded-xl mb-3"
              >
                <Ionicons name={c.icon} size={16} color={c.color} />
              </View>
              <Text
                className="text-xl font-extrabold text-gray-800"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {c.value}
              </Text>
              <Text
                className="text-gray-500 text-[11px] mt-0.5"
                numberOfLines={1}
              >
                {c.label}
              </Text>
              <TrendPill value={c.trend} />
            </GlassCard>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
};

// ─── Timeframe picker ─────────────────────────────────────────────────────────

const TimeframePicker = ({
  value,
  onChange,
  disabled,
}: {
  value: Timeframe;
  onChange: (t: Timeframe) => void;
  disabled?: boolean;
}) => {
  const options: { key: Timeframe; label: string }[] = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  return (
    <View className="flex-row gap-2 px-6 mb-5">
      {options.map(({ key, label }) => {
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => !disabled && onChange(key)}
            disabled={disabled}
            className={`flex-1 py-2 rounded-full items-center border ${
              active
                ? "bg-indigo-600 border-indigo-600"
                : "bg-white/60 border-white/40"
            } ${disabled ? "opacity-60" : ""}`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-xs font-bold ${
                active ? "text-white" : "text-gray-600"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Inline mini-skeleton (during timeframe refresh, keeps layout stable) ────

const MiniStatsSkeleton = () => (
  <View className="px-6 mb-6">
    <SkeletonBox style={{ width: 140, height: 20 }} className="mb-3" />
    <View className="flex-row gap-3 mb-3">
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
    </View>
    <View className="flex-row gap-3">
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
    </View>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [userData] = useAtom(userDataAtom);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false); // timeframe re-fetch
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [error, setError] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = useCallback(
    async (mode: "initial" | "refresh" | "timeframe" = "timeframe") => {
      if (!userData) return;
      try {
        if (mode === "initial") setLoading(true);
        else if (mode === "refresh") setRefreshing(true);
        else setFetching(true);

        setError(null);
        const data = await homeApi.getDashboardData(timeframe);
        setDashboardData(data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err?.response?.data ?? err);
        setError("Failed to load dashboard. Pull down to retry.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setFetching(false);
      }
    },
    [userData, timeframe],
  );

  // Initial load
  useEffect(() => {
    fetchData("initial");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timeframe change
  useEffect(() => {
    if (!loading) fetchData("timeframe");
  }, [timeframe]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = useCallback(() => fetchData("refresh"), [fetchData]);

  // ── Not logged in ─────────────────────────────────────────────────────────

  if (!userData) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center p-8">
          <GlassCard contentContainerClassName="p-6 items-center">
            <Ionicons
              name="lock-closed-outline"
              size={36}
              color={colors.indigo[500]}
            />
            <Text className="text-base text-gray-800 text-center font-semibold mt-3">
              Please log in to continue.
            </Text>
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  // ── Full-page skeleton on initial load ───────────────────────────────────

  if (loading) {
    return (
      <GradientBackground>
        <DashboardSkeleton insetTop={insets.top} />
      </GradientBackground>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.indigo[600]}
            colors={[colors.indigo[600]]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <PremiumHeader
          name={userData.name}
          profilePic={userData.profilePic}
          notificationCount={0}
        />

        {/* ── Error banner (below header, above content) ── */}
        {error && (
          <View className="mx-6 mb-4 rounded-2xl overflow-hidden">
            <GlassCard contentContainerClassName="flex-row items-center gap-3 p-3">
              <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
              <Text className="text-red-700 text-sm font-medium flex-1">
                {error}
              </Text>
              <TouchableOpacity
                onPress={() => fetchData("refresh")}
                hitSlop={8}
              >
                <Text className="text-indigo-600 text-sm font-bold">Retry</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

        {/* ── Timeframe selector ── */}
        <TimeframePicker
          value={timeframe}
          onChange={setTimeframe}
          disabled={fetching}
        />

        {/* ── Today / period data ── */}
        {fetching || !dashboardData ? (
          <MiniStatsSkeleton />
        ) : (
          <>
            <TodayGrid data={dashboardData.todayStats} />
            <PeriodStats data={dashboardData} timeframe={timeframe} />
          </>
        )}

        {/* ── Quick Actions (always visible) ── */}
        <QuickActionGrid />

        {/* ── Upcoming schedule (always visible, gracefully empty) ── */}
        <UpcomingScheduleCard
          appointments={dashboardData?.upcomingAppointments ?? []}
          onViewAll={() => router.push("/(tabs)/appointments" as any)}
        />
      </ScrollView>
    </GradientBackground>
  );
}
