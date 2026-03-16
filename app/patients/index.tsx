import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Animated,
  ViewStyle,
  TextInput,
  Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import colors from "tailwindcss/colors";
import { MotiView } from "moti";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { doctorApi } from "~/apis/doctors";
import { useToast } from "~/store/toastStore";

interface PatientOverview {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
  isProfileCompleted: boolean;
}

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

const PatientCardSkeleton = () => (
  <View className="mx-4 mb-4">
    <GlassCard contentContainerClassName="p-4 flex-row items-center gap-4">
      <SkeletonBox style={{ width: 64, height: 64, borderRadius: 32 }} />
      <View className="flex-1 gap-2.5">
        <SkeletonBox style={{ width: "65%", height: 18 }} />
        <SkeletonBox style={{ width: "40%", height: 14 }} />
      </View>
      <View className="items-end gap-2.5">
        <SkeletonBox style={{ width: 60, height: 20, borderRadius: 10 }} />
        <SkeletonBox style={{ width: 32, height: 32, borderRadius: 16 }} />
      </View>
    </GlassCard>
  </View>
);

// ─── Search ───────────────────────────────────────────────────────────────────

const HeaderSearch = ({
  value,
  onChangeText,
  placeholder = "Search...",
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) => (
  <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm mx-4 mb-4">
    <Ionicons
      name="search"
      size={20}
      color={colors.slate[400]}
      className="mr-2"
    />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.slate[400]}
      className="flex-1 font-medium text-slate-800 text-[15px] p-0"
      autoCapitalize="none"
      autoCorrect={false}
    />
    {value.length > 0 && (
      <Ionicons
        name="close-circle"
        size={18}
        color={colors.slate[300]}
        suppressHighlighting
        onPress={() => onChangeText("")}
      />
    )}
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function PatientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [patients, setPatients] = useState<PatientOverview[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientOverview[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  // Debounced search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(text), 300);
  };

  const fetchPatients = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await doctorApi.getMyPatients();
      const data = res.data?.data || [];
      setPatients(data);
      setFilteredPatients(data);
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients");
      showToast("error", "Error", "Failed to load patients");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredPatients(patients);
      return;
    }
    const lower = debouncedSearch.toLowerCase();
    setFilteredPatients(
      patients.filter(
        (p) =>
          p.name?.toLowerCase().includes(lower) ||
          p.email?.toLowerCase().includes(lower) ||
          p.phoneNumber?.includes(lower),
      ),
    );
  }, [debouncedSearch, patients]);

  const renderItem = useCallback(
    ({ item, index }: { item: PatientOverview; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350, delay: index * 50 }}
        className="mx-4 mb-3"
      >
        <TouchableOpacity
          onPress={() => router.push(`/patients/${item._id}`)}
          activeOpacity={0.7}
          className="border border-slate-200 rounded-3xl overflow-hidden"
        >
          <GlassCard contentContainerClassName="flex-row items-center p-4 rounded-3xl">
            {item.profilePic ? (
              <Image
                source={{ uri: item.profilePic }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                className="bg-slate-200 border border-slate-200"
              />
            ) : (
              <View className="w-14 h-14 rounded-full bg-indigo-100 items-center justify-center border border-indigo-200">
                <Text className="text-xl font-extrabold text-indigo-600">
                  {item.name?.charAt(0).toUpperCase() || "P"}
                </Text>
              </View>
            )}

            <View className="flex-1 ml-4 justify-center">
              <Text
                className="text-[16px] font-bold text-slate-800 mb-1 leading-tight"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-[13px] text-slate-500 font-medium leading-tight">
                {item.phoneNumber || item.email || "No contact info"}
              </Text>
            </View>

            <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center">
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.indigo[500]}
              />
            </View>
          </GlassCard>
        </TouchableOpacity>
      </MotiView>
    ),
    [router],
  );

  return (
    <GradientBackground>
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top + (Platform.OS === "android" ? 16 : 0),
        }}
      >
        <View className="flex-row items-center px-4 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center mr-3"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-800 flex-1">
            My Patients
          </Text>
        </View>

        <HeaderSearch
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search by name, email, phone..."
        />

        {error ? (
          <View className="flex-1 items-center justify-center p-6 mx-4">
            <GlassCard contentContainerClassName="items-center p-6 w-full">
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={colors.red[500]}
              />
              <Text className="text-red-600 font-medium text-center mt-4 mb-4">
                {error}
              </Text>
              <TouchableOpacity
                onPress={() => fetchPatients(true)}
                className="bg-indigo-100 px-6 py-2.5 rounded-full"
              >
                <Text className="text-indigo-700 font-bold">Retry</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        ) : (
          <View className="flex-1">
            {loading ? (
              <View>
                {[1, 2, 3, 4, 5].map((key) => (
                  <PatientCardSkeleton key={key} />
                ))}
              </View>
            ) : (
              <FlashList
                {...({
                  data: filteredPatients,
                  keyExtractor: (item: any) => item._id,
                  renderItem: renderItem as any,
                  estimatedItemSize: 100,
                  contentContainerStyle: {
                    paddingBottom: insets.bottom + 20,
                    paddingTop: 8,
                  },
                  showsVerticalScrollIndicator: false,
                } as any)}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-20 px-8">
                    <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center mb-5">
                      <Ionicons
                        name="people-outline"
                        size={36}
                        color={colors.indigo[400]}
                      />
                    </View>
                    <Text className="text-lg font-bold text-slate-800 text-center mb-2">
                      No Patients Found
                    </Text>
                    <Text className="text-sm text-slate-500 text-center leading-relaxed">
                      {searchQuery
                        ? "We couldn't find anyone matching your search criteria."
                        : "You don't have any patients associated with your profile yet."}
                    </Text>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchPatients(true)}
                    tintColor={colors.indigo[600]}
                    colors={[colors.indigo[600]]}
                  />
                }
              />
            )}
          </View>
        )}
      </View>
    </GradientBackground>
  );
}
