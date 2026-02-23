import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  ViewStyle,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { useAtom } from "jotai";
import { SheetManager } from "react-native-actions-sheet";
import colors from "tailwindcss/colors";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import {
  appointmentApi,
  BookingStatus,
  GetDoctorAppointmentsParams,
} from "~/apis/appointments";
import { clinicApi } from "~/apis/clinic";
import { clinicsAtom } from "~/store";
import { PopulatedAppointment, Clinic, ClinicSummary } from "~/types/models";
import {
  ApptType,
  FILTER_SHEET_ID,
} from "~/components/Appointments/FilterSheet";
import { FlashList } from "@shopify/flash-list";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS: { key: BookingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Upcoming" },
  { key: "completed", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> =
  {
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "#d97706" },
    confirmed: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "#4f46e5" },
    completed: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "#059669",
    },
    cancelled: { bg: "bg-gray-100", text: "text-gray-500", dot: "#9ca3af" },
    rejected: { bg: "bg-red-100", text: "text-red-700", dot: "#dc2626" },
    expired: { bg: "bg-gray-100", text: "text-gray-400", dot: "#d1d5db" },
  };

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  "In-Clinic": "business-outline",
  "Home-Visit": "home-outline",
  "Video-Call": "videocam-outline",
};

const LIMIT = 15;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBox = ({ style }: { style?: ViewStyle }) => {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
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
      style={[
        // rgba + animated opacity — must stay as style
        { opacity, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 20 },
        style,
      ]}
    />
  );
};

const AppointmentCardSkeleton = () => (
  <View className="px-4 mb-3">
    <SkeletonBox style={{ height: 96 }} />
  </View>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_STYLE[status] ?? STATUS_STYLE.expired;
  return (
    <View
      className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${cfg.bg}`}
    >
      {/* dot color is dynamic — keep as style */}
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: cfg.dot,
        }}
      />
      <Text className={`text-[10px] font-bold capitalize ${cfg.text}`}>
        {status}
      </Text>
    </View>
  );
};

// ─── Active filter chips ───────────────────────────────────────────────────────

interface FilterChipsProps {
  type?: ApptType;
  clinicName?: string;
  onClearType: () => void;
  onClearClinic: () => void;
}

const FilterChips = ({
  type,
  clinicName,
  onClearType,
  onClearClinic,
}: FilterChipsProps) => {
  if (!type && !clinicName) return null;
  return (
    <View className="flex-row flex-wrap px-4 mb-2 gap-1.5">
      {type && (
        <TouchableOpacity
          onPress={onClearType}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 bg-violet-100 border border-violet-300 rounded-full px-2.5 py-1"
        >
          <Ionicons name={TYPE_ICON[type] as any} size={12} color="#4f46e5" />
          <Text className="text-indigo-600 text-[11px] font-bold">{type}</Text>
          <Ionicons name="close" size={12} color="#4f46e5" />
        </TouchableOpacity>
      )}
      {clinicName && (
        <TouchableOpacity
          onPress={onClearClinic}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 bg-violet-100 border border-violet-300 rounded-full px-2.5 py-1"
        >
          <Ionicons name="business-outline" size={12} color="#4f46e5" />
          <Text
            className="text-indigo-600 text-[11px] font-bold max-w-[120px]"
            numberOfLines={1}
          >
            {clinicName}
          </Text>
          <Ionicons name="close" size={12} color="#4f46e5" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Appointment Card ─────────────────────────────────────────────────────────

interface CardProps {
  item: PopulatedAppointment;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onPress: (id: string) => void;
}

const AppointmentCard = React.memo(
  ({ item, onAccept, onReject, onPress }: CardProps) => {
    const patient = typeof item.patient === "object" ? item.patient : null;
    const clinic = typeof item.clinic === "object" ? item.clinic : null;
    const service = typeof item.service === "object" ? item.service : null;

    const dt = new Date(item.startDateTime);
    const dateStr = dt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = dt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const isPending = item.bookingStatus === "pending";

    return (
      <TouchableOpacity
        onPress={() => onPress(item._id)}
        activeOpacity={0.75}
        className="mx-4 mb-3"
      >
        {/* Plain card — no BlurView (BlurView inside FlatList crashes on Android) */}
        <View style={cardStyles.card}>
          {/* Main row */}
          <View className="flex-row p-3 gap-3">
            {/* Avatar */}
            {patient?.profilePic ? (
              <Image
                source={{ uri: patient.profilePic }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                recyclingKey={item._id}
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center">
                <Text className="text-indigo-600 font-extrabold text-lg">
                  {(patient?.name ?? "P").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            {/* Info */}
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text
                  className="font-bold text-gray-800 text-[13px] flex-1 mr-2"
                  numberOfLines={1}
                >
                  {patient?.name ?? "Unknown Patient"}
                </Text>
                <StatusBadge status={item.bookingStatus} />
              </View>
              <Text
                className="text-gray-500 text-[11px] mt-0.5 mb-1"
                numberOfLines={1}
              >
                {service?.name ?? "—"}
              </Text>
              <View className="flex-row flex-wrap gap-2 mt-0.5">
                <View className="flex-row items-center gap-0.5">
                  <Ionicons name="time-outline" size={11} color="#9ca3af" />
                  <Text className="text-gray-400 text-[11px]">
                    {dateStr} · {timeStr}
                  </Text>
                </View>
                <View className="flex-row items-center gap-0.5">
                  <Ionicons
                    name={
                      (TYPE_ICON[item.appointmentType] ??
                        "calendar-outline") as any
                    }
                    size={11}
                    color="#9ca3af"
                  />
                  <Text className="text-gray-400 text-[11px]">
                    {item.appointmentType}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Clinic strip */}
          {clinic && (
            <View className="flex-row items-center px-3 pb-2 gap-1">
              <Ionicons name="location-outline" size={11} color="#6366f1" />
              <Text
                className="text-indigo-500 text-[11px] font-semibold flex-1"
                numberOfLines={1}
              >
                {clinic.name}
              </Text>
              {item.billAmount > 0 && (
                <Text className="text-gray-700 text-[11px] font-semibold">
                  ₹{item.billAmount.toLocaleString()}
                </Text>
              )}
            </View>
          )}

          {/* Quick actions for pending */}
          {isPending && (
            <View style={cardStyles.actionRow} className="gap-0">
              <Button
                onPress={() => onReject(item._id)}
                leftIcon="close-circle-outline"
                leftIconSize={16}
                leftIconColor="#dc2626"
                title="Reject"
                style={cardStyles.actionBtnLeft}
                className="flex-1 bg-transparent rounded-none py-2.5 shadow-none"
                textClassName="text-red-600 text-[13px] font-bold"
              />
              <Button
                onPress={() => onAccept(item._id)}
                leftIcon="checkmark-circle-outline"
                leftIconSize={16}
                leftIconColor="#059669"
                title="Accept"
                className="flex-1 bg-transparent rounded-none py-2.5 shadow-none"
                textClassName="text-emerald-600 text-[13px] font-bold"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

type FilterState = {
  appointmentType?: ApptType;
  clinicId?: string;
  clinicName?: string;
};

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();

  // Jotai clinic atom
  const [storedClinics, setStoredClinics] = useAtom(clinicsAtom);

  // List state
  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter state
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchQuery = useRef("");

  const activeFilters = [filters.appointmentType, filters.clinicId].filter(
    Boolean,
  ).length;

  // ── Load clinics (hydrate atom) ────────────────────────────────────────────

  useEffect(() => {
    if (storedClinics.length > 0) return; // already loaded
    clinicApi
      .getClinicSummary()
      .then((r) => {
        const list = r.data?.data ?? [];
        setStoredClinics(list as unknown as Clinic[]);
      })
      .catch(console.warn);
  }, []);

  // ── Fetch appointments ─────────────────────────────────────────────────────

  const fetchAppointments = useCallback(
    async (
      opts: { page?: number; replace?: boolean; refresh?: boolean } = {},
    ) => {
      const { page = 1, replace = true, refresh = false } = opts;
      try {
        if (refresh) setRefreshing(true);
        else if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const params: GetDoctorAppointmentsParams = {
          status: activeStatus,
          search: searchQuery.current || undefined,
          appointmentType: filters.appointmentType,
          clinicId: filters.clinicId,
          page,
          limit: LIMIT,
        };

        const res = await appointmentApi.getDoctorAppointments(params);
        setAppointments((prev) =>
          replace ? res.appointments : [...prev, ...res.appointments],
        );
        setPagination(res.pagination);
      } catch (e) {
        console.error("fetchAppointments error:", e);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [activeStatus, filters],
  );

  useEffect(() => {
    fetchAppointments({ page: 1, replace: true });
  }, [fetchAppointments]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      searchQuery.current = text;
      fetchAppointments({ page: 1, replace: true });
    }, 400);
  };

  const onRefresh = () =>
    fetchAppointments({ page: 1, replace: true, refresh: true });
  const onEndReached = () => {
    if (!loadingMore && pagination.currentPage < pagination.totalPages) {
      fetchAppointments({ page: pagination.currentPage + 1, replace: false });
    }
  };

  // ── Filter sheet ──────────────────────────────────────────────────────────

  const openFilterSheet = async () => {
    const result = await SheetManager.show<"appointment-filter-sheet">(
      FILTER_SHEET_ID,
      {
        payload: {
          clinics: storedClinics as unknown as ClinicSummary[],
          current: filters,
        },
      },
    );
    if (result) {
      setFilters({
        appointmentType: result.appointmentType,
        clinicId: result.clinicId,
        clinicName: result.clinicName,
      });
    }
  };

  // ── Status quick-actions ───────────────────────────────────────────────────

  const handleStatusUpdate = useCallback(
    async (id: string, status: "confirmed" | "rejected", label: string) => {
      Alert.alert(
        `${label} Appointment`,
        `Are you sure you want to ${label.toLowerCase()} this appointment?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: label,
            style: status === "rejected" ? "destructive" : "default",
            onPress: async () => {
              try {
                setUpdatingId(id);
                await appointmentApi.updateStatus(id, status);
                setAppointments((prev) =>
                  prev.map((a) =>
                    a._id === id ? { ...a, bookingStatus: status } : a,
                  ),
                );
              } catch {
                Alert.alert("Error", "Failed to update appointment status.");
              } finally {
                setUpdatingId(null);
              }
            },
          },
        ],
      );
    },
    [],
  );

  const onAccept = useCallback(
    (id: string) => handleStatusUpdate(id, "confirmed", "Accept"),
    [handleStatusUpdate],
  );
  const onReject = useCallback(
    (id: string) => handleStatusUpdate(id, "rejected", "Reject"),
    [handleStatusUpdate],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: PopulatedAppointment }) => (
      <AppointmentCard
        item={item}
        onAccept={onAccept}
        onReject={onReject}
        onPress={(id) => router.push(`/appointments/${id}` as any)}
      />
    ),
    [onAccept, onReject],
  );

  const keyExtractor = useCallback(
    (item: PopulatedAppointment) => item._id,
    [],
  );

  return (
    <GradientBackground>
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-2xl font-extrabold text-gray-800">
              Appointments
            </Text>
            <View className="flex-row items-center gap-2">
              {pagination.totalItems > 0 && (
                <View className="bg-indigo-100 px-3 py-1 rounded-full">
                  <Text className="text-indigo-700 text-xs font-bold">
                    {pagination.totalItems}
                  </Text>
                </View>
              )}
              {/* Filter button */}
              <Button
                onPress={openFilterSheet}
                leftIcon="options-outline"
                leftIconSize={16}
                leftIconColor={"white"}
                title={
                  activeFilters > 0 ? `Filters (${activeFilters})` : "Filter"
                }
                className={
                  "bg-indigo-600 border border-indigo-600 rounded-xl px-3 py-2"
                }
                // style={
                //   activeFilters === 0
                //     ? { backgroundColor: "rgba(255,255,255,0.75)" }
                //     : undefined
                // }
                textClassName={`text-xs font-bold text-white `}
              />
            </View>
          </View>
          <Text className="text-gray-500 text-sm">
            Manage your patient appointments
          </Text>
        </View>

        {/* ── Search ─────────────────────────────────────────────────────── */}
        <View
          className="mx-4 mb-3 flex-row items-center gap-2 rounded-2xl px-3 py-2.5 border"
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            borderColor: "rgba(255,255,255,0.5)",
          }}
        >
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 text-gray-800 text-sm"
            placeholder="Search patient name..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* ── Active filter chips ─────────────────────────────────────────── */}
        <FilterChips
          type={filters.appointmentType}
          clinicName={filters.clinicName}
          onClearType={() =>
            setFilters((f) => ({ ...f, appointmentType: undefined }))
          }
          onClearClinic={() =>
            setFilters((f) => ({
              ...f,
              clinicId: undefined,
              clinicName: undefined,
            }))
          }
        />

        {/* ── Status tabs ─────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // 1. Add items-center to prevent children (buttons) from stretching vertically
          contentContainerClassName="px-4 gap-2 items-center"
          // 2. Add shrink-0 or flex-grow-0 so the ScrollView itself doesn't expand
          className="mb-4 flex-grow-0 shrink-0"
        >
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.key;
            return (
              <Button
                key={tab.key}
                onPress={() => setActiveStatus(tab.key)}
                title={tab.label}
                className={`rounded-full px-4 py-1 border shadow-none ${
                  isActive
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white/70 border-white/20"
                }`}
                textClassName={`text-xs font-bold ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
            );
          })}
        </ScrollView>

        {/* ── List ────────────────────────────────────────────────────────── */}
        {loading ? (
          <ScrollView
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <AppointmentCardSkeleton key={i} />
            ))}
          </ScrollView>
        ) : (
          <FlashList
            data={appointments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
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
            onEndReached={onEndReached}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <View className=" items-center justify-center pt-20 px-8">
                <View className="bg-indigo-50 p-6 rounded-full mb-4">
                  <Ionicons name="calendar-outline" size={48} color="#6366f1" />
                </View>
                <Text className="text-gray-700 font-bold text-lg text-center">
                  No appointments found
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-2">
                  {search
                    ? `No results for "${search}"`
                    : `No ${activeStatus === "all" ? "" : activeStatus} appointments yet`}
                </Text>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View className="py-6 items-center">
                  <ActivityIndicator color={colors.indigo[600]} />
                </View>
              ) : null
            }
          />
        )}

        {/* ── Updating overlay ────────────────────────────────────────────── */}
        {updatingId && (
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            <GlassCard
              contentContainerClassName="px-8 py-5 items-center"
              style={{ gap: 12 }}
            >
              <ActivityIndicator color={colors.indigo[600]} size="large" />
              <Text className="text-gray-700 font-semibold text-sm">
                Updating…
              </Text>
            </GlassCard>
          </View>
        )}
      </View>
    </GradientBackground>
  );
}

// ─── Minimal StyleSheet (only for values NativeWind can't express) ─────────────

const cardStyles = StyleSheet.create({
  // rgba background + custom shadow — NativeWind can't do dynamic rgba or shadow config
  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  // rgba border — NativeWind can't express rgba border colors
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.07)",
  },
  actionBtnLeft: {
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.07)",
  },
});
