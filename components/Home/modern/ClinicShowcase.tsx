import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Clinic } from "~/types/models";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import { blurhash } from "~/components/Utility/Repeatables";
import colors from "tailwindcss/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 280; // Increased height for better visibility

type ClinicShowcaseProps = {
  clinics: Clinic[];
  onAddClinic: () => void;
};

const getStatusColor = (isOpen: boolean) =>
  isOpen ? colors.green[500] : colors.red[500];
const getStatusText = (isOpen: boolean) => (isOpen ? "Open Now" : "Closed");

const getTodayTiming = (clinic: Clinic) => {
  if (clinic.open24hrs) return "Open 24/7";

  const now = new Date();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const currentDay = days[now.getDay()];
  const schedule = clinic.timing[currentDay];

  if (schedule.isClosed || !schedule.shifts.length) return "Closed Today";

  return schedule.shifts
    .map((shift) => `${shift.open12h} - ${shift.close12h}`)
    .join(", ");
};

// Helper to check if clinic is open
const isClinicOpen = (clinic: Clinic): boolean => {
  if (clinic.open24hrs) return true;

  const now = new Date();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const currentDay = days[now.getDay()];
  const todaySchedule = clinic.timing[currentDay];

  if (todaySchedule.isClosed || !todaySchedule.shifts.length) return false;

  const currentTime = now.getHours() * 60 + now.getMinutes();

  return todaySchedule.shifts.some((shift) => {
    // 24h format for logic: "16:00"
    const [openHour, openMinute] = shift.open.split(":").map(Number);
    const [closeHour, closeMinute] = shift.close.split(":").map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    return currentTime >= openTime && currentTime <= closeTime;
  });
};

// Memoized Card Component for Performance
const ClinicCard = React.memo(
  ({
    item,
    onPress,
    width,
    height,
  }: {
    item: Clinic;
    onPress?: () => void;
    width: number;
    height: number;
  }) => {
    const isOpen = isClinicOpen(item);
    const coverImage =
      item.images && item.images.length > 0 ? { uri: item.images[0] } : null;

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPress}
        style={{ width, height, marginRight: 20 }}
      >
        <GlassCard
          className="flex-1 overflow-hidden border border-white/60 rounded-3xl shadow-lg shadow-indigo-500/10"
          intensity={95}
          contentContainerClassName="p-0 flex-1"
        >
          {/* Image Section */}
          <View className="h-44 relative bg-gray-50">
            {coverImage ? (
              <Image
                source={coverImage}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                placeholder={blurhash}
                transition={500}
              />
            ) : (
              <LinearGradient
                colors={["#eef2ff", "#c7d2fe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full items-center justify-center relative overflow-hidden"
              >
                <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                <View className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                <MaterialCommunityIcons
                  name="hospital-building"
                  size={64}
                  color={colors.indigo[300]}
                />
              </LinearGradient>
            )}

            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
              locations={[0.6, 1]}
              className="absolute inset-x-0 bottom-0 h-30"
            >
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text
                      className="font-bold text-white text-[22px] leading-tight font-heading"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <View className="flex-row items-center mt-1.5">
                      <View className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        <Text className="text-indigo-600 text-[10px] font-bold tracking-wide uppercase">
                          {item.clinicType || "General Clinic"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Status Badge */}
            <View className="absolute top-4 right-4 flex-row items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50">
              <View
                className="w-2 h-2 rounded-full shadow-sm"
                style={{
                  backgroundColor: getStatusColor(isOpen),
                  shadowColor: getStatusColor(isOpen),
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                }}
              />
              <Text
                className="text-[10px] font-bold tracking-wider"
                style={{ color: getStatusColor(isOpen) }}
              >
                {getStatusText(isOpen).toUpperCase()}
              </Text>
            </View>

            {/* Rating Badge */}
            <View className="absolute top-4 left-4 flex-row items-center gap-1.5 ">
              <View className="flex-row items-center bg-amber-400 px-2 py-1 rounded-lg shadow-sm">
                <Ionicons name="star" size={12} color="white" />
                <Text className="text-white text-xs font-bold ml-1">
                  {item.rating?.overall?.toFixed(1) || "New"}
                </Text>
              </View>
              {item.rating?.reviewCount > 0 && (
                <Text className="text-white/90 text-xs font-medium drop-shadow-md">
                  {item.rating.reviewCount} Reviews
                </Text>
              )}
            </View>
          </View>

          {/* Content Section */}
          <View className="p-5 flex-1 gap-2 bg-white/40">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center border border-gray-100 shadow-sm">
                <Ionicons name="location" size={16} color={colors.gray[400]} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-gray-900 text-sm font-semibold"
                  numberOfLines={1}
                >
                  {item.city}
                </Text>
                <Text
                  className="text-gray-500 text-xs font-medium mt-0.5"
                  numberOfLines={1}
                >
                  {item.address}
                </Text>
              </View>
            </View>

            <View className=" border-t border-gray-100/50 flex-row items-center justify-between">
              <View className=" flex-row items-center gap-2 bg-emerald-50/50 px-2.5 py-1.5 rounded-lg border border-emerald-100/50 mr-2">
                <MaterialCommunityIcons
                  name="clock-time-four"
                  size={14}
                  color={colors.emerald[600]}
                />
                <Text
                  className="text-emerald-700 text-xs font-semibold "
                  numberOfLines={1}
                >
                  {getTodayTiming(item)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onPress}
                className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center shadow-md shadow-indigo-300 active:scale-95 transition-transform"
              >
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  },
);

export const ClinicShowcase: React.FC<ClinicShowcaseProps> = ({
  clinics,
  onAddClinic,
}) => {
  const renderEmptyState = () => (
    <Animated.View entering={FadeInUp.delay(200).springify()} className="px-6">
      <TouchableOpacity onPress={onAddClinic} activeOpacity={0.9}>
        <GlassCard
          className="h-48 items-center justify-center border-dashed border-2 border-indigo-300 bg-indigo-50/30 overflow-hidden"
          intensity={20}
        >
          <LinearGradient
            colors={["rgba(99, 102, 241, 0.05)", "rgba(168, 85, 247, 0.05)"]}
            className="absolute inset-0"
          />
          <View className="w-16 h-16 rounded-full bg-indigo-100 items-center justify-center mb-4 shadow-sm">
            <Ionicons name="add" size={32} color="#4f46e5" />
          </View>
          <Text className="text-lg font-bold text-gray-800 mb-1">
            Add Your First Clinic
          </Text>
          <Text className="text-sm text-gray-500 text-center px-8">
            Start managing your practice effectively
          </Text>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderItem = useCallback(
    ({ item }: { item: Clinic }) => (
      <ClinicCard
        item={item}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        onPress={() => {
          /* Add navigation or edit action here */
        }}
      />
    ),
    [],
  );

  return (
    <View className="mb-8">
      <View className="px-6 mb-5 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Your Clinics</Text>
          <Text className="text-xs text-gray-500 font-medium mt-1">
            Manage your practice locations
          </Text>
        </View>
        {clinics && clinics.length > 0 && (
          <TouchableOpacity
            onPress={onAddClinic}
            className="bg-indigo-600 px-4 py-2 rounded-full shadow-lg shadow-indigo-200 flex-row items-center gap-1.5 active:bg-indigo-700"
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text className="text-white font-bold text-xs tracking-wide">
              Add New
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!clinics || clinics.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={{ height: CARD_HEIGHT, width: width }}>
          <FlashList<Clinic>
            data={clinics}
            renderItem={renderItem}
            // estimatedItemSize={CARD_WIDTH}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }} // Add paddingBottom for shadow
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 20} // Card width + margin
            disableIntervalMomentum
          />
        </View>
      )}
    </View>
  );
};
