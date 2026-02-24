import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  ViewStyle,
  Alert,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom } from "jotai";
import { SheetManager } from "react-native-actions-sheet";
import colors from "tailwindcss/colors";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Button } from "~/components/ui/button";
import { serviceApi } from "~/apis/services";
import { clinicApi } from "~/apis/clinic";
import { userDataAtom } from "~/store/userAtoms";
import { Service, Clinic } from "~/types/models";
import { ServiceCard } from "~/components/Services/ServiceCard";
import {
  SERVICE_FORM_SHEET_ID,
  ServiceFormSheetPayload,
} from "~/components/Services/ServiceFormSheet";
import {
  SERVICE_FILTER_SHEET_ID,
  ServiceFilterState,
  ServiceFilterSheetPayload,
  DEFAULT_SERVICE_FILTER,
  countActiveFilters,
} from "~/components/Services/ServiceFilterSheet";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

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

const ServiceCardSkeleton = () => (
  <View className="mx-4 mb-3">
    <GlassCard contentContainerClassName="p-4 flex-row gap-3">
      <SkeletonBox style={{ width: 62, height: 100 }} className="rounded-xl" />
      <View className="flex-1 gap-2">
        <SkeletonBox style={{ width: "70%", height: 16 }} />
        <SkeletonBox style={{ width: "90%", height: 11 }} />
        <SkeletonBox style={{ width: "90%", height: 11 }} />
        <View className="flex-row gap-2">
          <SkeletonBox
            style={{ width: 70, height: 26 }}
            className="rounded-lg"
          />
          <SkeletonBox
            style={{ width: 70, height: 26 }}
            className="rounded-lg"
          />
        </View>
      </View>
    </GlassCard>
  </View>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({
  hasFilters,
  onAdd,
}: {
  hasFilters: boolean;
  onAdd: () => void;
}) => (
  <View className="flex-1 items-center justify-center px-8 py-16">
    <GlassCard contentContainerClassName="items-center py-10 px-6">
      <View className="w-20 h-20 bg-indigo-50 rounded-3xl items-center justify-center mb-4">
        <Ionicons name="medkit-outline" size={36} color={colors.indigo[400]} />
      </View>
      <Text className="font-bold text-gray-800 text-base mb-1">
        {hasFilters ? "No services found" : "No services yet"}
      </Text>
      <Text className="text-gray-400 text-sm text-center leading-5 mb-5">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Add your first service to start seeing patients"}
      </Text>
      {!hasFilters && (
        <Button
          onPress={onAdd}
          leftIcon="add-circle-outline"
          leftIconSize={16}
          leftIconColor="white"
          title="Add Service"
          className="bg-indigo-600 rounded-xl px-5 py-2.5 shadow-none"
          textClassName="text-white font-bold text-sm"
        />
      )}
    </GlassCard>
  </View>
);

// ─── Active filter pills ──────────────────────────────────────────────────────

const FilterPill = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <TouchableOpacity
    onPress={onRemove}
    activeOpacity={0.75}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#ede9fe",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    }}
  >
    <Text style={{ fontSize: 12, fontWeight: "600", color: "#4f46e5" }}>
      {label}
    </Text>
    <Ionicons name="close" size={12} color="#4f46e5" />
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [userData] = useAtom(userDataAtom);

  const [services, setServices] = useState<Service[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ServiceFilterState>(
    DEFAULT_SERVICE_FILTER,
  );
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(text), 400);
  };

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters),
    [filters],
  );

  const hasFilters = !!debouncedSearch || activeFilterCount > 0;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchServices = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!userData) return;
      try {
        if (mode === "initial") setLoading(true);
        else setRefreshing(true);
        setError(null);

        const params: any = { limit: 50 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.category !== "all") params.category = filters.category;
        if (filters.status === "active") params.isActive = true;
        if (filters.status === "inactive") params.isActive = false;
        if (filters.isHomeVisit !== null)
          params.isHomeVisit = filters.isHomeVisit;
        if (filters.clinicId) params.clinicId = filters.clinicId;

        const res = await serviceApi.getMyServices(params);
        setServices(res.data.data ?? []);
      } catch (err: any) {
        setError("Failed to load services. Pull down to retry.");
        console.error("Services fetch error:", err?.response?.data ?? err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userData, debouncedSearch, filters],
  );

  const fetchClinics = useCallback(async () => {
    if (!userData) return;
    try {
      const res = await clinicApi.getMyClinics(userData._id);
      setClinics(res.data.data ?? []);
    } catch {
      // non-critical
    }
  }, [userData]);

  useEffect(() => {
    fetchServices("initial");
    fetchClinics();
  }, []);

  useEffect(() => {
    if (!loading) fetchServices("initial");
  }, [debouncedSearch, filters]);

  const onRefresh = useCallback(
    () => fetchServices("refresh"),
    [fetchServices],
  );

  // ── Filter sheet ──────────────────────────────────────────────────────────

  const openFilters = useCallback(async () => {
    const payload: ServiceFilterSheetPayload = {
      clinics,
      current: filters,
    };
    const result = await (SheetManager.show as any)(SERVICE_FILTER_SHEET_ID, {
      payload,
    });
    if (result) setFilters(result);
  }, [clinics, filters]);

  const clearFilter = useCallback((key: keyof ServiceFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "category"
          ? "all"
          : key === "status"
            ? "all"
            : key === "isHomeVisit"
              ? null
              : key === "clinicId"
                ? null
                : key === "clinicName"
                  ? null
                  : prev[key],
      ...(key === "clinicId" ? { clinicName: null } : {}),
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_SERVICE_FILTER);
    setSearchQuery("");
    setDebouncedSearch("");
  }, []);

  // ── Form sheet ────────────────────────────────────────────────────────────

  const openForm = useCallback(
    (service?: Service) => {
      const payload: ServiceFormSheetPayload = {
        service,
        clinics,
        onSaved: (saved: Service) => {
          setServices((prev) => {
            const idx = prev.findIndex((s) => s._id === saved._id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = saved;
              return next;
            }
            return [saved, ...prev];
          });
        },
      };
      SheetManager.show(SERVICE_FORM_SHEET_ID, { payload });
    },
    [clinics],
  );

  const handleToggleActive = useCallback(async (service: Service) => {
    try {
      const res = await serviceApi.toggleActive(service._id, !service.isActive);
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? res.data.data : s)),
      );
    } catch {
      Alert.alert("Error", "Failed to update service status.");
    }
  }, []);

  const handleDelete = useCallback(async (service: Service) => {
    try {
      await serviceApi.deleteService(service._id);
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } catch {
      Alert.alert("Error", "Failed to delete service.");
    }
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const activeCount = services.filter((s) => s.isActive).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <GradientBackground>
      {/* ── Header ── */}
      <View style={{ paddingTop: insets.top }} className="px-5 pb-2">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Button
              onPress={() => router.canGoBack() && router.back()}
              leftIcon="chevron-back"
              leftIconSize={20}
              leftIconColor={colors.gray[700]}
              className="bg-white/50 rounded-xl p-2 shadow-none"
            />
            <View>
              <Text className="text-xl font-extrabold text-gray-800">
                My Services
              </Text>
              <Text className="text-gray-400 text-xs">
                {services.length} total · {activeCount} active
              </Text>
            </View>
          </View>
          <Button
            onPress={() => openForm()}
            leftIcon="add"
            leftIconSize={18}
            leftIconColor="white"
            title="Add"
            className="bg-indigo-600 rounded-xl px-3 py-2 shadow-none"
            textClassName="text-white font-bold text-sm"
          />
        </View>

        {/* Search + Filter row */}
        <View className="flex-row gap-2 mb-3 items-center">
          <GlassCard
            className="flex-1 rounded-2xl"
            contentContainerClassName="flex-row items-center gap-2 px-3 py-2.5 rounded-2xl"
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.gray[400]}
            />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder="Search services…"
              placeholderTextColor={colors.gray[400]}
              className="flex-1 text-gray-800 text-sm"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Button
                onPress={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
                leftIcon="close-circle"
                leftIconSize={18}
                leftIconColor={colors.gray[400]}
                className="bg-transparent shadow-none p-0"
              />
            )}
          </GlassCard>

          {/* Filter button */}
          <Button
            onPress={openFilters}
            leftIcon="filter-circle"
            leftIconSize={30}
            leftIconColor="white"
            // title="Filter"
            className="bg-rose-500/90 rounded-xl px-2 py-2 shadow-none"
            textClassName="text-white font-bold text-sm"
          />
        </View>

        {/* Active filter pills */}
        {hasFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingBottom: 8 }}
          >
            {filters.category !== "all" && (
              <FilterPill
                label={filters.category}
                onRemove={() => clearFilter("category")}
              />
            )}
            {filters.status !== "all" && (
              <FilterPill
                label={filters.status === "active" ? "Active" : "Inactive"}
                onRemove={() => clearFilter("status")}
              />
            )}
            {filters.isHomeVisit !== null && (
              <FilterPill
                label={filters.isHomeVisit ? "Home Visit" : "In-Clinic"}
                onRemove={() => clearFilter("isHomeVisit")}
              />
            )}
            {filters.clinicId && filters.clinicName && (
              <FilterPill
                label={filters.clinicName}
                onRemove={() => clearFilter("clinicId")}
              />
            )}
            {debouncedSearch && (
              <FilterPill
                label={`"${debouncedSearch}"`}
                onRemove={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
              />
            )}
            {(activeFilterCount > 1 ||
              (activeFilterCount > 0 && debouncedSearch)) && (
              <TouchableOpacity
                onPress={clearAllFilters}
                activeOpacity={0.75}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "#fef2f2",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <Ionicons name="close-circle" size={12} color="#dc2626" />
                <Text
                  style={{ fontSize: 12, fontWeight: "600", color: "#dc2626" }}
                >
                  Clear all
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      {/* ── Error banner ── */}
      {error && (
        <View className="mx-5 mb-3 rounded-2xl overflow-hidden">
          <GlassCard contentContainerClassName="flex-row items-center gap-3 p-3">
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.red[600]}
            />
            <Text className="text-red-700 text-sm font-medium flex-1">
              {error}
            </Text>
            <Button
              onPress={() => fetchServices("initial")}
              title="Retry"
              className="bg-transparent shadow-none p-0"
              textClassName="text-indigo-600 text-sm font-bold"
            />
          </GlassCard>
        </View>
      )}

      {/* ── Content ── */}
      {loading ? (
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </ScrollView>
      ) : services.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onAdd={() => openForm()} />
      ) : (
        <FlashList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ServiceCard
              item={item}
              onEdit={openForm}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 4,
            paddingBottom: insets.bottom + 100,
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
      )}
    </GradientBackground>
  );
}
