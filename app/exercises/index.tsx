import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { MotiView } from "moti";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Image } from "expo-image";
import { exerciseApi, Exercise } from "~/apis/exercises";
import { useToast } from "~/store/toastStore";

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

const ExerciseCardSkeleton = () => (
  <View className="mx-4 mb-3">
    <GlassCard contentContainerClassName="p-3 flex-row items-center gap-4">
      <SkeletonBox style={{ width: 64, height: 64, borderRadius: 16 }} />
      <View className="flex-1 gap-2">
        <SkeletonBox style={{ width: "60%", height: 16 }} />
        <SkeletonBox style={{ width: "90%", height: 12 }} />
        <SkeletonBox style={{ width: "40%", height: 20, borderRadius: 8 }} />
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

export default function ExercisesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<string[]>(["All"]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const filterSheetRef = useRef<ActionSheetRef>(null);

  const { showToast } = useToast();

  // Debounced search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(text), 300);
  };

  const fetchExercises = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await exerciseApi.getAll();
      const data = res.data || [];
      // Handle nested api response structures like { success: true, data: [...] }
      const validData = Array.isArray(data)
        ? data
        : (data as any).data || (data as any).exercises || [];

      setExercises(validData);
      setFilteredExercises(validData);

      // Generate dynamic filters from fetched data
      const uniqueFilters = new Set<string>();
      validData.forEach((ex: any) => {
        if (ex.bodyPart) uniqueFilters.add(ex.bodyPart);
        if (ex.tags && Array.isArray(ex.tags)) {
          ex.tags.forEach((t: any) => uniqueFilters.add(t.name || t));
        }
      });
      setFilters(["All", ...Array.from(uniqueFilters)]);
    } catch (err: any) {
      console.error("Error fetching exercises:", err);
      setError("Failed to load exercises library.");
      showToast("error", "Error", "Failed to load exercises library.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  useEffect(() => {
    let result = exercises;

    if (activeFilter !== "All") {
      result = result.filter(
        (ex) =>
          ex.bodyPart === activeFilter ||
          (ex.tags &&
            ex.tags.some(
              (t: any) => t.name === activeFilter || t === activeFilter,
            )),
      );
    }

    if (debouncedSearch.trim()) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter((ex) => ex.name.toLowerCase().includes(lower));
    }

    setFilteredExercises(result);
  }, [debouncedSearch, activeFilter, exercises]);

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    actionSheetRef.current?.show();
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Exercise; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350, delay: index * 50 }}
        className="mx-4 mb-3"
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleExercisePress(item)}
          className="border border-slate-200 rounded-3xl overflow-hidden"
        >
          <GlassCard contentContainerClassName="flex-row items-center p-3 rounded-3xl">
            <View className="w-[72px] h-[72px] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              {item.videoUrl ? (
                <View className="flex-1 relative">
                  <View className="absolute inset-0 items-center justify-center bg-indigo-50/50 z-10">
                    <Ionicons
                      name="play-circle"
                      size={28}
                      color={colors.indigo[500]}
                    />
                  </View>
                  {item.thumbnailUrl && (
                    <Image
                      source={{ uri: item.thumbnailUrl }}
                      className="w-full h-full opacity-60"
                      contentFit="cover"
                    />
                  )}
                </View>
              ) : item.thumbnailUrl ? (
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons
                    name="fitness-outline"
                    size={28}
                    color={colors.slate[400]}
                  />
                </View>
              )}
            </View>

            <View className="flex-1 ml-4 justify-center">
              <Text
                className="text-base font-bold text-slate-800 mb-1 leading-snug"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text
                className="text-[12px] text-slate-500 font-medium mb-2 leading-snug"
                numberOfLines={1}
              >
                {item.description || "No description provided."}
              </Text>

              <View className="flex-row gap-1 flex-wrap">
                {item.bodyPart && (
                  <View className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    <Text className="text-[10px] font-bold text-slate-600 uppercase">
                      {item.bodyPart}
                    </Text>
                  </View>
                )}
                {item.tags &&
                  item.tags.slice(0, 2).map((tag: any, idx: number) => (
                    <View
                      key={idx}
                      className="bg-indigo-50 px-2 py-1 rounded border border-indigo-100"
                    >
                      <Text className="text-[10px] font-bold text-indigo-600 uppercase">
                        {tag.name || tag}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </MotiView>
    ),
    [],
  );

  return (
    <GradientBackground>
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top + (Platform.OS === "android" ? 16 : 0),
        }}
      >
        <View className="flex-row items-center px-4 mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center mr-3"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-800 flex-1">
            Exercise Library
          </Text>
        </View>

        <HeaderSearch
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search items by name..."
        />

        {/* Filter Trigger */}
        <View className="flex-row items-center px-4 mb-4 justify-between z-20">
          <Text className="text-slate-500 font-bold text-[13px] uppercase tracking-wider">
            Viewing: <Text className="text-indigo-600">{activeFilter}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => filterSheetRef.current?.show()}
            className="flex-row items-center bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="filter" size={14} color={colors.slate[600]} />
            <Text className="text-slate-700 font-bold text-[13px] ml-1.5">
              Filter
            </Text>
          </TouchableOpacity>
        </View>

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
                onPress={() => fetchExercises(true)}
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
                {[1, 2, 3, 4, 5, 6].map((key) => (
                  <ExerciseCardSkeleton key={key} />
                ))}
              </View>
            ) : (
              <FlashList
                {...({
                  data: filteredExercises,
                  keyExtractor: (item: any) => item._id,
                  renderItem: renderItem as any,
                  estimatedItemSize: 120,
                  contentContainerStyle: {
                    paddingBottom: insets.bottom + 40,
                    paddingTop: 8,
                  },
                  showsVerticalScrollIndicator: false,
                } as any)}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-20 px-8">
                    <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center mb-5">
                      <Ionicons
                        name="barbell-outline"
                        size={36}
                        color={colors.indigo[400]}
                      />
                    </View>
                    <Text className="text-lg font-bold text-slate-800 text-center mb-2">
                      No Exercises Found
                    </Text>
                    <Text className="text-sm text-slate-500 text-center leading-relaxed">
                      {searchQuery || activeFilter !== "All"
                        ? "No exercises match your search and filter criteria."
                        : "Your exercise library is empty."}
                    </Text>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchExercises(true)}
                    tintColor={colors.indigo[600]}
                    colors={[colors.indigo[600]]}
                  />
                }
              />
            )}
          </View>
        )}
      </View>

      {/* Exercise Details Action Sheet */}
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        containerStyle={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          backgroundColor: "white",
        }}
        indicatorStyle={{
          width: 48,
          height: 6,
          backgroundColor: colors.slate[300],
          marginTop: 12,
        }}
      >
        {selectedExercise && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className="px-6 py-4 pb-12">
              <View className="w-full h-56 rounded-3xl bg-slate-100 overflow-hidden mb-6 border border-slate-200 shadow-sm relative">
                {selectedExercise.videoUrl ? (
                  <View className="flex-1 relative">
                    <View className="absolute inset-0 items-center justify-center bg-indigo-50/50 z-10">
                      <Ionicons
                        name="play-circle"
                        size={56}
                        color={colors.indigo[500]}
                      />
                    </View>
                    {selectedExercise.thumbnailUrl && (
                      <Image
                        source={{ uri: selectedExercise.thumbnailUrl }}
                        className="w-full h-full opacity-60"
                        contentFit="cover"
                      />
                    )}
                  </View>
                ) : selectedExercise.thumbnailUrl ? (
                  <Image
                    source={{ uri: selectedExercise.thumbnailUrl }}
                    className="w-full h-full"
                    contentFit="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center bg-indigo-50/30">
                    <Ionicons
                      name="barbell-outline"
                      size={64}
                      color={colors.indigo[200]}
                    />
                  </View>
                )}
              </View>

              <Text className="text-[28px] font-black text-slate-800 mb-3 leading-tight">
                {selectedExercise.name}
              </Text>

              <View className="flex-row gap-2 flex-wrap mb-6">
                {selectedExercise.bodyPart && (
                  <View className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                    <Text className="text-[13px] font-extrabold text-slate-600 uppercase tracking-widest">
                      {selectedExercise.bodyPart}
                    </Text>
                  </View>
                )}
                {selectedExercise.tags &&
                  selectedExercise.tags.map((tag: any, idx: number) => (
                    <View
                      key={idx}
                      className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"
                    >
                      <Text className="text-[13px] font-extrabold text-indigo-600 uppercase tracking-widest">
                        {tag.name || tag}
                      </Text>
                    </View>
                  ))}
              </View>

              <View className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <Text className="text-slate-800 font-extrabold mb-2 text-sm uppercase tracking-widest">
                  Instructions
                </Text>
                <Text className="text-slate-600 font-medium leading-relaxed text-[15px]">
                  {selectedExercise.description ||
                    "No specific instructions provided for this exercise."}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </ActionSheet>

      {/* Filter Action Sheet */}
      <ActionSheet
        ref={filterSheetRef}
        gestureEnabled
        containerStyle={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          backgroundColor: "white",
        }}
        indicatorStyle={{
          width: 48,
          height: 6,
          backgroundColor: colors.slate[300],
          marginTop: 12,
        }}
      >
        <View className="px-6 py-6 pb-12">
          <Text className="text-xl font-black text-slate-800 mb-6">
            Filter by Category
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {filters.map((filter, index) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setActiveFilter(filter);
                    filterSheetRef.current?.hide();
                  }}
                  activeOpacity={0.7}
                  className={`px-4 py-2.5 rounded-full border ${isActive ? "bg-indigo-600 border-indigo-600" : "bg-slate-50 border-slate-200"}`}
                >
                  <Text
                    className={`text-[14px] font-bold ${isActive ? "text-white" : "text-slate-700"}`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ActionSheet>
    </GradientBackground>
  );
}
