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
import { FlashList } from "@shopify/flash-list";
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

// Section IDs for the FlashList data array
type SectionId =
  | "header"
  | "error"
  | "timeframe"
  | "stats"
  | "quick-actions"
  | "upcoming";

interface Section {
  id: SectionId;
}

// ─── Skeleton (NativeWind + RN Animated) ─────────────────────────────────────

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

/** Full-page skeleton rendered as plain Views — no nested ScrollView */
const DashboardSkeleton = ({ insetTop }: { insetTop: number }) => (
  <View
    style={{ paddingTop: insetTop + 8, paddingBottom: 40 }}
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
    <View className="px-6 mb-6">
      <View className="flex-row gap-3 mb-3">
        <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
        <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
      </View>
      <View className="flex-row gap-3">
        <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
        <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
      </View>
    </View>

    {/* Period strip label */}
    <View className="px-6 mb-3">
      <SkeletonBox style={{ width: 130, height: 20 }} />
    </View>

    {/* Period strip — horizontal row of cards */}
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

    {/* Quick action circles */}
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
  </View>
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
      className={`flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full self-start mt-1 ${
        isGood ? "bg-emerald-100" : "bg-red-100"
      }`}
    >
      <Ionicons
        name={value > 0 ? "trending-up" : "trending-down"}
        size={9}
        color={isGood ? colors.emerald[600] : colors.red[600]}
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
      iconCls: "text-indigo-600",
      bgCls: "bg-indigo-50",
      iconColor: colors.indigo[600],
    },
    {
      label: "Completed",
      value: String(data.completed),
      icon: "checkmark-circle" as const,
      iconCls: "text-emerald-600",
      bgCls: "bg-emerald-50",
      iconColor: colors.emerald[600],
    },
    {
      label: "Pending / Conf.",
      value: String(data.pending),
      icon: "time" as const,
      iconCls: "text-amber-600",
      bgCls: "bg-amber-50",
      iconColor: colors.amber[600],
    },
    {
      label: "Today's Revenue",
      value: `₹${data.revenue.toLocaleString()}`,
      icon: "wallet" as const,
      iconCls: "text-violet-600",
      bgCls: "bg-violet-50",
      iconColor: colors.violet[600],
    },
  ];

  return (
    <View className="px-6 mb-6">
      <Text className="text-base font-bold text-gray-800 mb-3">
        Today at a Glance
      </Text>
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
                <View className={`self-start p-2 rounded-xl mb-2 ${c.bgCls}`}>
                  <Ionicons name={c.icon} size={16} color={c.iconColor} />
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
  const { width } = useWindowDimensions();
  const { appointmentStats, revenue, ratings, patientStats } = data;
  const tfLabel = timeframe.charAt(0).toUpperCase() + timeframe.slice(1);

  const cards = [
    {
      icon: "calendar" as const,
      label: `${tfLabel} Appointments`,
      value: String(appointmentStats.total),
      trend: appointmentStats.trend,
      iconColor: colors.indigo[500],
      bgCls: "bg-indigo-50",
    },
    {
      icon: "wallet" as const,
      label: "Period Revenue",
      value: `₹${revenue.thisPeriod.toLocaleString()}`,
      trend: revenue.growth,
      iconColor: colors.purple[600],
      bgCls: "bg-purple-100",
    },
    {
      icon: "star" as const,
      label: "Avg Rating",
      value: ratings.average > 0 ? `${ratings.average} ★` : "—",
      trend: ratings.trend,
      iconColor: colors.amber[600],
      bgCls: "bg-amber-100",
    },
    {
      icon: "people" as const,
      label: `${tfLabel} Patients`,
      value: String(patientStats.currentPeriod),
      trend: patientStats.trend,
      iconColor: colors.emerald[600],
      bgCls: "bg-emerald-100",
    },
    {
      icon: "cash" as const,
      label: "All-Time Revenue",
      value: `₹${revenue.allTime.toLocaleString()}`,
      trend: 0,
      iconColor: colors.cyan[600],
      bgCls: "bg-cyan-100",
    },
  ];

  const cardWidth = Math.min(width * 0.35, 180);

  return (
    <View className="mb-6">
      <Text className="text-base font-bold text-gray-800 mb-3 px-6">
        Period Overview
      </Text>
      {/* Horizontal ScrollView is intentional here — FlashList doesn't support horizontal sub-lists well */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
        decelerationRate="normal"
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
              <View className={`self-start p-2 rounded-xl mb-3 ${c.bgCls}`}>
                <Ionicons name={c.icon} size={16} color={c.iconColor} />
              </View>
              <Text
                className="text-xl font-extrabold text-gray-800"
                numberOfLines={1}
                // adjustsFontSizeToFit
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

// ─── Inline mini-skeleton (timeframe refresh) ─────────────────────────────────

const MiniStatsSkeleton = () => (
  <View className="px-6 mb-6">
    <SkeletonBox style={{ width: 140, height: 20 }} className="mb-3" />
    <View className="flex-row gap-3 mb-3">
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
    </View>
    <View className="flex-row gap-3 mb-5">
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
      <SkeletonBox className="flex-1 h-[90px] rounded-2xl" />
    </View>
    {/* Period strip skeleton */}
    <SkeletonBox style={{ width: 130, height: 20 }} className="mb-3" />
    <View className="flex-row gap-3">
      <SkeletonBox
        style={{ width: 150, height: 110 }}
        className="rounded-3xl"
      />
      <SkeletonBox
        style={{ width: 150, height: 110 }}
        className="rounded-3xl"
      />
      <SkeletonBox
        style={{ width: 150, height: 110 }}
        className="rounded-3xl"
      />
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
  const [fetching, setFetching] = useState(false);
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

  useEffect(() => {
    fetchData("initial");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ── FlashList sections ───────────────────────────────────────────────────
  // Each section is a lightweight descriptor; renderItem handles the actual UI.
  // This gives us FlashList's virtualisation for the full screen scroll.

  const sections: Section[] = [
    { id: "header" },
    ...(error ? [{ id: "error" as SectionId }] : []),
    { id: "timeframe" },
    { id: "stats" },
    { id: "quick-actions" },
    { id: "upcoming" },
  ];

  const renderSection = ({ item }: { item: Section }) => {
    switch (item.id) {
      case "header":
        return (
          <PremiumHeader
            name={userData.name}
            profilePic={userData.profilePic}
            notificationCount={0}
          />
        );

      case "error":
        return (
          <View className="mx-6 mb-4 rounded-2xl overflow-hidden">
            <GlassCard contentContainerClassName="flex-row items-center gap-3 p-3">
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={colors.red[600]}
              />
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
        );

      case "timeframe":
        return (
          <TimeframePicker
            value={timeframe}
            onChange={setTimeframe}
            disabled={fetching}
          />
        );

      case "stats":
        return fetching || !dashboardData ? (
          <MiniStatsSkeleton />
        ) : (
          <>
            <TodayGrid data={dashboardData.todayStats} />
            <PeriodStats data={dashboardData} timeframe={timeframe} />
          </>
        );

      case "quick-actions":
        return <QuickActionGrid />;

      case "upcoming":
        return (
          <UpcomingScheduleCard
            appointments={dashboardData?.upcomingAppointments ?? []}
            onViewAll={() => router.push("/(tabs)/appointments" as any)}
          />
        );

      default:
        return null;
    }
  };

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <GradientBackground>
      <FlashList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        // estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.indigo[600]}
            colors={[colors.indigo[600]]}
          />
        }
      />
    </GradientBackground>
  );
}
