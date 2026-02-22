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
import { router } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import colors from "tailwindcss/colors";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard"; // only used for overlay
import {
  appointmentApi,
  BookingStatus,
  GetDoctorAppointmentsParams,
} from "~/apis/appointments";
import { PopulatedAppointment, Clinic } from "~/types/models";
import api from "~/apis/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS: { key: BookingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Upcoming" },
  { key: "completed", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
  { key: "rejected", label: "Rejected" },
];

const APPT_TYPES = ["In-Clinic", "Home-Visit", "Video-Call"] as const;
type ApptType = (typeof APPT_TYPES)[number];

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
      style={[{ opacity }, style]}
      className={`bg-white/50 rounded-2xl ${className}`}
    />
  );
};

const AppointmentCardSkeleton = () => (
  <View className="px-4 mb-3">
    <SkeletonBox style={{ height: 96 }} className="rounded-3xl" />
  </View>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_STYLE[status] ?? STATUS_STYLE.expired;
  return (
    <View
      className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${cfg.bg}`}
    >
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

// ─── Appointment card ─────────────────────────────────────────────────────────

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
        style={{ marginHorizontal: 16, marginBottom: 12 }}
      >
        {/* Plain card — no BlurView: BlurView inside FlatList crashes on Android */}
        <View style={cardStyles.card}>
          {/* Main row */}
          <View className="flex-row p-3 gap-3">
            {/* Avatar */}
            {patient?.profilePic ? (
              <Image
                source={{ uri: patient.profilePic }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                className="bg-gray-200"
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
                  className="font-bold text-gray-800 text-sm flex-1 mr-2"
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

              {/* Meta row */}
              <View
                className="flex-row items-center flex-wrap"
                style={{ gap: 6 }}
              >
                <View className="flex-row items-center" style={{ gap: 3 }}>
                  <Ionicons name="time-outline" size={11} color="#9ca3af" />
                  <Text className="text-gray-500 text-[11px]">
                    {dateStr} · {timeStr}
                  </Text>
                </View>
                <View className="flex-row items-center" style={{ gap: 3 }}>
                  <Ionicons
                    name={TYPE_ICON[item.appointmentType] ?? "calendar-outline"}
                    size={11}
                    color="#9ca3af"
                  />
                  <Text className="text-gray-500 text-[11px]">
                    {item.appointmentType}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Clinic strip */}
          {clinic && (
            <View
              className="flex-row items-center px-3 pb-2"
              style={{ gap: 4 }}
            >
              <Ionicons name="location-outline" size={11} color="#6366f1" />
              <Text
                className="text-indigo-600 text-[11px] font-medium flex-1"
                numberOfLines={1}
              >
                {clinic.name}
              </Text>
              {item.billAmount > 0 && (
                <Text className="text-gray-600 text-[11px] font-semibold">
                  ₹{item.billAmount.toLocaleString()}
                </Text>
              )}
            </View>
          )}

          {/* Quick actions for pending */}
          {isPending && (
            <View className="flex-row border-t border-white/30">
              <TouchableOpacity
                onPress={() => onReject(item._id)}
                className="flex-1 flex-row items-center justify-center py-2.5 border-r border-white/30"
                style={{ gap: 6 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color="#dc2626"
                />
                <Text className="text-red-600 text-sm font-bold">Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onAccept(item._id)}
                className="flex-1 flex-row items-center justify-center py-2.5"
                style={{ gap: 6 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#059669"
                />
                <Text className="text-emerald-600 text-sm font-bold">
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

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
    <View className="flex-row flex-wrap px-4 mb-2" style={{ gap: 6 }}>
      {type && (
        <TouchableOpacity
          onPress={onClearType}
          className="flex-row items-center bg-indigo-100 border border-indigo-200 rounded-full px-3 py-1"
          style={{ gap: 4 }}
          activeOpacity={0.7}
        >
          <Ionicons name={TYPE_ICON[type]} size={12} color="#4f46e5" />
          <Text className="text-indigo-700 text-[11px] font-bold">{type}</Text>
          <Ionicons name="close" size={12} color="#4f46e5" />
        </TouchableOpacity>
      )}
      {clinicName && (
        <TouchableOpacity
          onPress={onClearClinic}
          className="flex-row items-center bg-indigo-100 border border-indigo-200 rounded-full px-3 py-1"
          style={{ gap: 4 }}
          activeOpacity={0.7}
        >
          <Ionicons name="business-outline" size={12} color="#4f46e5" />
          <Text
            className="text-indigo-700 text-[11px] font-bold"
            numberOfLines={1}
            style={{ maxWidth: 120 }}
          >
            {clinicName}
          </Text>
          <Ionicons name="close" size={12} color="#4f46e5" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────

type FilterState = {
  appointmentType?: ApptType;
  clinicId?: string;
  clinicName?: string;
};

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

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
  const [clinics, setClinics] = useState<{ _id: string; name: string }[]>([]);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchQuery = useRef("");
  const activeFilters = [filters.appointmentType, filters.clinicId].filter(
    Boolean,
  ).length;

  // ── Load clinics for filter ────────────────────────────────────────────────

  useEffect(() => {
    api
      .get<{ success: boolean; data: Clinic[] }>("/clinics/my/clinics")
      .then((r) => {
        const list = r.data?.data ?? [];
        setClinics(list.map((c) => ({ _id: c._id, name: c.name })));
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

  // ── Filter action sheet ────────────────────────────────────────────────────

  const openTypeFilter = () => {
    const options = [...APPT_TYPES, "Clear", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = options.length - 2; // "Clear"

    showActionSheetWithOptions(
      {
        title: "Filter by Type",
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (idx) => {
        if (idx === undefined || idx === cancelButtonIndex) return;
        if (idx === destructiveButtonIndex) {
          setFilters((f) => ({ ...f, appointmentType: undefined }));
        } else {
          setFilters((f) => ({ ...f, appointmentType: APPT_TYPES[idx] }));
        }
      },
    );
  };

  const openClinicFilter = () => {
    if (clinics.length === 0) {
      Alert.alert(
        "No Clinics",
        "You don't have any clinics associated with your account.",
      );
      return;
    }
    const clinicNames = clinics.map((c) => c.name);
    const options = [...clinicNames, "All Clinics", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = options.length - 2; // "All Clinics" → clear

    showActionSheetWithOptions(
      {
        title: "Filter by Clinic",
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (idx) => {
        if (idx === undefined || idx === cancelButtonIndex) return;
        if (idx === destructiveButtonIndex) {
          setFilters((f) => ({
            ...f,
            clinicId: undefined,
            clinicName: undefined,
          }));
        } else {
          const clinic = clinics[idx];
          setFilters((f) => ({
            ...f,
            clinicId: clinic._id,
            clinicName: clinic.name,
          }));
        }
      },
    );
  };

  const openFilterSheet = () => {
    const options = [
      "Filter by Type",
      "Filter by Clinic",
      "Clear All Filters",
      "Cancel",
    ];
    const cancelButtonIndex = 3;
    const destructiveButtonIndex = 2;

    showActionSheetWithOptions(
      { title: "Filters", options, cancelButtonIndex, destructiveButtonIndex },
      (idx) => {
        if (idx === 0) openTypeFilter();
        else if (idx === 1) openClinicFilter();
        else if (idx === 2) setFilters({});
      },
    );
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

  const onAccept = (id: string) =>
    handleStatusUpdate(id, "confirmed", "Accept");
  const onReject = (id: string) => handleStatusUpdate(id, "rejected", "Reject");

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
        {/* Header */}
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-2xl font-extrabold text-gray-800">
              Appointments
            </Text>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              {pagination.totalItems > 0 && (
                <View className="bg-indigo-100 px-3 py-1 rounded-full">
                  <Text className="text-indigo-700 text-xs font-bold">
                    {pagination.totalItems}
                  </Text>
                </View>
              )}
              {/* Filter button */}
              <TouchableOpacity
                onPress={openFilterSheet}
                className={`flex-row items-center rounded-xl px-3 py-2 border ${
                  activeFilters > 0
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white/70 border-white/40"
                }`}
                style={{ gap: 5 }}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="options-outline"
                  size={16}
                  color={activeFilters > 0 ? "white" : "#6366f1"}
                />
                <Text
                  className={`text-xs font-bold ${activeFilters > 0 ? "text-white" : "text-indigo-600"}`}
                >
                  {activeFilters > 0 ? `Filters (${activeFilters})` : "Filter"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-gray-500 text-sm">
            Manage your patient appointments
          </Text>
        </View>

        {/* Search */}
        <View
          className="mx-4 mb-3 flex-row items-center bg-white/70 border border-white/40 rounded-2xl px-3 py-2.5"
          style={{ gap: 8 }}
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

        {/* Active filter chips */}
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

        {/* Status tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
            paddingBottom: 4,
          }}
          className="mb-3"
        >
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveStatus(tab.key)}
                className={`px-4 py-1.5 rounded-full border ${
                  isActive
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white/60 border-white/40"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xs font-bold ${isActive ? "text-white" : "text-gray-600"}`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List */}
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
          <FlatList
            data={appointments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 120,
              flexGrow: 1,
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
            removeClippedSubviews
            maxToRenderPerBatch={8}
            windowSize={10}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20 px-8">
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

        {/* Updating overlay */}
        {updatingId && (
          <View className="absolute inset-0 bg-black/20 items-center justify-center">
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

// ─── Card StyleSheet (plain card, no BlurView) ────────────────────────────────
const cardStyles = StyleSheet.create({
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
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: "#4f46e5",
    fontWeight: "800",
    fontSize: 18,
  },
  patientName: {
    fontWeight: "700",
    color: "#1f2937",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  serviceName: {
    color: "#6b7280",
    fontSize: 11,
    marginTop: 2,
    marginBottom: 4,
  },
  metaText: {
    color: "#9ca3af",
    fontSize: 11,
  },
  clinicName: {
    color: "#4f46e5",
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  billAmount: {
    color: "#374151",
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.07)",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  actionBtnLeft: {
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.07)",
  },
  rejectText: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 13,
  },
  acceptText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 13,
  },
});
