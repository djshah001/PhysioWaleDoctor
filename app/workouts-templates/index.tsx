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
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { MotiView } from "moti";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { useTemplates } from "~/apis/hooks/useTemplates";
import { useToast } from "~/store/toastStore";

interface Template {
  _id: string;
  name: string;
  description: string;
  exercises: any[];
  isSystem: boolean; // Note: In backend, check creatorModel === 'Admin' instead of isSystem if we adapt
  creatorModel?: string;
  createdBy: any;
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

const TemplateCardSkeleton = () => (
  <View className="mx-4 mb-3">
    <GlassCard contentContainerClassName="p-4 flex-row items-center gap-4">
      <View className="flex-1 gap-2">
        <SkeletonBox style={{ width: "40%", height: 16 }} />
        <SkeletonBox style={{ width: "80%", height: 12 }} />
        <SkeletonBox style={{ width: "20%", height: 12 }} />
      </View>
      <SkeletonBox style={{ width: 32, height: 32, borderRadius: 16 }} />
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

export default function TemplatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { showActionSheetWithOptions } = useActionSheet();
  const { showToast } = useToast();

  const {
    data: templatesData,
    isLoading: loading,
    isFetching,
    isError,
    refetch,
  } = useTemplates();
  const templates = templatesData || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "All" | "My Templates" | "System"
  >("All");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);

  // Debounced search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(text), 300);
  };

  useEffect(() => {
    let result = templates;

    // Apply Filter type (System means created by Admin, My Templates created by Doctor)
    if (filterType === "System") {
      result = result.filter(
        (t: Template) => t.creatorModel === "Admin" || t.isSystem,
      );
    } else if (filterType === "My Templates") {
      result = result.filter(
        (t: Template) => t.creatorModel === "Doctor" && !t.isSystem,
      );
    }

    // Apply Search
    if (debouncedSearch.trim()) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (t: Template) =>
          t.name.toLowerCase().includes(lower) ||
          (t.description && t.description.toLowerCase().includes(lower)),
      );
    }

    setFilteredTemplates(result);
  }, [debouncedSearch, filterType, templates]);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isSys = item.creatorModel === "Admin" || item.isSystem;

      return (
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: index * 50 }}
          className="mx-4 mb-3"
        >
          <TouchableOpacity
            onPress={() => router.push(`/workouts-templates/${item._id}`)}
            activeOpacity={0.7}
            className="border border-slate-200 rounded-2xl overflow-hidden"
          >
            <GlassCard contentContainerClassName="flex-row items-center justify-between p-4 rounded-3xl">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
                  {isSys && (
                    <View className="bg-indigo-100/50 border border-indigo-200/50 px-2 py-0.5 rounded-full flex-row items-center">
                      <Ionicons
                        name="shield-checkmark"
                        size={10}
                        color={colors.indigo[600]}
                      />
                      <Text className="text-[10px] font-black text-indigo-700 ml-1 uppercase tracking-wider">
                        System
                      </Text>
                    </View>
                  )}
                  <Text
                    className="text-[16px] font-bold text-slate-800 leading-tight"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text
                  className="text-[13px] text-slate-500 font-medium mb-3 leading-snug"
                  numberOfLines={2}
                >
                  {item.description || "No description provided."}
                </Text>

                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1 bg-white/60 px-2 py-1 rounded-lg">
                    <Ionicons
                      name="fitness"
                      size={12}
                      color={colors.emerald[600]}
                    />
                    <Text className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                      {item.exercises?.length || 0} Exercises
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center">
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.slate[400]}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </MotiView>
      );
    },
    [router],
  );

  const openFilterSheet = () => {
    const options = ["All", "My Templates", "System", "Cancel"];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Filter Templates",
        message: "Select which templates you'd like to view.",
        tintColor: colors.indigo[600],
      },
      (selectedIndex?: number) => {
        if (
          selectedIndex !== undefined &&
          selectedIndex !== cancelButtonIndex
        ) {
          setFilterType(options[selectedIndex] as any);
        }
      },
    );
  };

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
            Workout Library
          </Text>
        </View>

        <HeaderSearch
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search workouts..."
        />

        {/* Filter Action Sheet Trigger */}
        <View className="flex-row items-center px-4 mb-4 justify-between z-20">
          <Text className="text-slate-500 font-bold text-[13px] uppercase tracking-wider">
            Viewing: <Text className="text-indigo-600">{filterType}</Text>
          </Text>
          <TouchableOpacity
            onPress={openFilterSheet}
            className="flex-row items-center bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="filter" size={14} color={colors.slate[600]} />
            <Text className="text-slate-700 font-bold text-[13px] ml-1.5">
              Filter
            </Text>
          </TouchableOpacity>
        </View>

        {isError ? (
          <View className="flex-1 items-center justify-center p-6 mx-4">
            <GlassCard contentContainerClassName="items-center p-6 w-full">
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={colors.red[500]}
              />
              <Text className="text-red-600 font-medium text-center mt-4 mb-4">
                Failed to load templates from the library.
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-indigo-100 px-6 py-2.5 rounded-full"
              >
                <Text className="text-indigo-700 font-bold">Retry</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        ) : (
          <View className="flex-1">
            {loading && templates.length === 0 ? (
              <View>
                {[1, 2, 3, 4, 5].map((key) => (
                  <TemplateCardSkeleton key={key} />
                ))}
              </View>
            ) : (
              <FlashList
                data={filteredTemplates}
                keyExtractor={(item: any) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingBottom: insets.bottom + 100,
                  paddingTop: 8,
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-20 px-8">
                    <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center mb-5">
                      <Ionicons
                        name="document-text-outline"
                        size={36}
                        color={colors.indigo[400]}
                      />
                    </View>
                    <Text className="text-lg font-bold text-slate-800 text-center mb-2">
                      No Templates Found
                    </Text>
                    <Text className="text-sm text-slate-500 text-center leading-relaxed">
                      {searchQuery || filterType !== "All"
                        ? "No templates match your search and filter criteria."
                        : "You haven't created any templates yet."}
                    </Text>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={isFetching && !loading}
                    onRefresh={() => refetch()}
                    tintColor={colors.indigo[600]}
                    colors={[colors.indigo[600]]}
                  />
                }
              />
            )}
          </View>
        )}

        {/* Floating Action Button for Create */}
        {!loading && (
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: "spring" }}
            className="absolute bottom-6 right-6"
            style={{ paddingBottom: insets.bottom }}
          >
            <TouchableOpacity
              onPress={() => router.push("/workouts-templates/manage" as any)}
              activeOpacity={0.8}
              className="bg-slate-800 w-[60px] h-[60px] rounded-[30px] items-center justify-center shadow-xl shadow-slate-300"
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </MotiView>
        )}
      </View>
    </GradientBackground>
  );
}
