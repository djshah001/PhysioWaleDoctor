import React, { memo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { Image } from "expo-image";
import { MotiView } from "moti";

import { useAuth } from "../../hooks/useAuth";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Button } from "~/components/ui/button";
import { useAtom } from "jotai";
import { userDataAtom } from "~/store";

const HEADER_HEIGHT = 420; // Slightly taller for maximum cinematic impact

// --- COMPONENTS ---

const SkeletonLoader = memo(() => (
  <View className="flex-1 bg-[#F4F7FB]">
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
      className="flex-1"
    >
      <View
        style={{ height: HEADER_HEIGHT, backgroundColor: colors.slate[200] }}
      />
      <View className="px-5 -mt-16 gap-y-5">
        <View className="h-48 w-full bg-white rounded-[32px] shadow-sm border border-slate-100 p-6" />
        <View className="flex-row gap-4">
          <View className="flex-1 h-36 bg-white rounded-[28px] border border-slate-100" />
          <View className="flex-1 h-36 bg-white rounded-[28px] border border-slate-100" />
        </View>
        <View className="h-64 w-full bg-white rounded-[32px] border border-slate-100 mt-4" />
      </View>
    </MotiView>
  </View>
));

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
  showDivider?: boolean;
}

// Revamped MenuItem: Designed to live inside a unified list group
const MenuItem = memo(
  ({
    icon,
    title,
    subtitle,
    onPress,
    isDestructive,
    showDivider = true,
  }: MenuItemProps) => (
    <>
      <Button
        onPress={onPress}
        className="flex-row items-center py-4 px-5 bg-transparent shadow-none"
      >
        <View
          className={`w-11 h-11 rounded-2xl items-center justify-center mr-4 ${
            isDestructive ? "bg-red-50" : "bg-indigo-50"
          }`}
        >
          {icon}
        </View>
        <View className="flex-1 justify-center">
          <Text
            className={`font-bold text-[16px] tracking-tight ${
              isDestructive ? "text-red-600" : "text-slate-800"
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-[13px] font-medium text-slate-600 mt-0.5"
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {!isDestructive && (
          <Feather name="chevron-right" size={20} color={colors.slate[600]} />
        )}
      </Button>
      {showDivider && <View className="h-[1px] bg-slate-100 flex-1 " />}
    </>
  ),
);

// --- MAIN SCREEN ---

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useAtom(userDataAtom);
  // console.log(JSON.stringify(user, null, 2));
  const { logout, refreshUser } = useAuth();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.3],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0],
            [1.4, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [HEADER_HEIGHT - 140, HEADER_HEIGHT - 80],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [HEADER_HEIGHT - 140, HEADER_HEIGHT - 80],
            [-10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!user) {
    return <SkeletonLoader />;
  }

  const profilePic = user.profilePic
    ? { uri: user.profilePic }
    : require("../../assets/images/no.png");

  return (
    <View className="flex-1 bg-[#F4F7FB]">
      {/* ── Parallax Background Image ── */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_HEIGHT,
          },
          headerStyle,
        ]}
      >
        <Image
          source={profilePic}
          contentFit="cover"
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
          placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
          transition={500}
        />
        {/* Richer gradient for better text pop */}
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)", "rgba(15,23,42,0.85)"]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* ── Sticky Top Navigation ── */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: insets.top + (Platform.OS === "ios" ? 50 : 60),
            zIndex: 50,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.4)",
          },
          stickyHeaderStyle,
        ]}
      >
        <BlurView
          intensity={90}
          tint="light"
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod="dimezisBlurView"
        />
        <View className="flex-1 flex-row items-center justify-between px-5 pt-10 pb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-slate-900/5"
          >
            <Ionicons name="chevron-back" size={24} color={colors.slate[800]} />
          </TouchableOpacity>
          <Text className="font-extrabold text-[17px] text-slate-800 tracking-tight">
            {user.name}
          </Text>
          <View className="w-10 h-10" />
        </View>
      </Animated.View>

      {/* ── Main Scroll Content ── */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 80, // Deeper overlap
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh} // Swapped out API fetching for instant Atom state
            tintColor="#fff"
          />
        }
      >
        <View className="px-5">
          {/* 1. Identity & Bio Card */}
          <Animated.View
            entering={FadeInUp.springify().damping(16).mass(0.9).delay(100)}
          >
            <GlassCard
              className="p-6 rounded-[32px] overflow-hidden border border-white bg-white/70"
              style={{
                shadowColor: colors.indigo[900],
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.06,
                shadowRadius: 32,
                elevation: 10,
              }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View
                  className={`px-3 py-1.5 rounded-full ${user.isVerified ? "bg-indigo-600" : "bg-slate-700"}`}
                >
                  <Text className="text-[10px] font-black uppercase tracking-widest text-white">
                    {user.isVerified
                      ? "Verified Identity"
                      : "Pending Verification"}
                  </Text>
                </View>
                <View className="bg-white flex-row items-center px-3 py-1.5 rounded-full shadow-sm shadow-slate-200">
                  <Ionicons name="star" size={14} color={colors.amber[500]} />
                  <Text className="text-slate-800 font-bold text-xs ml-1.5">
                    {user.averageRating?.toFixed(1) || "New"}
                  </Text>
                </View>
              </View>

              <Text className="text-[32px] font-black text-slate-900 tracking-tight mb-1">
                {user.name}
              </Text>
              <Text className="text-indigo-600 font-bold text-[16px] mb-5 tracking-wide">
                {user.specialization}
              </Text>

              <Text className="text-slate-600 leading-relaxed font-medium text-[15px]">
                {user.bio ||
                  "Crafting your professional bio helps patients understand your expertise and approach to care."}
              </Text>

              {/* Seamless Inline Contact Info */}
              <View className="mt-6 pt-5 border-t border-slate-200/50 gap-y-3.5">
                {user.phoneNumber && (
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                      <Ionicons
                        name="call"
                        size={14}
                        color={colors.slate[600]}
                      />
                    </View>
                    <Text className="text-slate-700 font-semibold text-sm ml-3">
                      {user.countryCode} {user.phoneNumber}
                    </Text>
                  </View>
                )}
                {user.email && (
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                      <Ionicons
                        name="mail"
                        size={14}
                        color={colors.slate[600]}
                      />
                    </View>
                    <Text className="text-slate-700 font-semibold text-sm ml-3">
                      {user.email}
                    </Text>
                  </View>
                )}
              </View>
            </GlassCard>
          </Animated.View>

          {/* 2. Action Metrics Row */}
          <Animated.View
            entering={FadeInUp.springify().damping(16).mass(0.9).delay(200)}
            className="mt-5 flex-row gap-x-4"
          >
            {/* Experience Card */}
            <GlassCard className="flex-1 bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm shadow-slate-200/50 items-center justify-center ">
              <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center mb-4 self-center">
                <Feather
                  name="briefcase"
                  size={22}
                  color={colors.indigo[600]}
                />
              </View>
              <Text className="text-[32px] font-black tracking-tighter text-slate-900 mb-0.5 text-center">
                {user.experienceYears || 0}
                <Text className="text-[16px] text-slate-700 font-bold">
                  {" "}
                  yrs
                </Text>
              </Text>
              <Text className="text-[13px] text-slate-700 font-semibold">
                Clinical Experience
              </Text>
            </GlassCard>

            {/* Fee Card */}
            <GlassCard className="flex-1 bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm shadow-slate-200/50">
              <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mb-4 self-center">
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={24}
                  color={colors.emerald[600]}
                />
              </View>
              <Text className="text-[32px] font-black tracking-tighter text-slate-900 mb-0.5 text-center">
                <Text className="text-[20px] text-slate-700 font-bold">₹</Text>
                {user.consultationFee || 0}
              </Text>
              <Text className="text-[13px] text-slate-700 font-semibold">
                Consultation Fee
              </Text>
            </GlassCard>
          </Animated.View>

          {/* 3. Unified Settings Group */}
          <Animated.View
            entering={FadeInUp.springify().damping(16).mass(0.9).delay(300)}
            className="mt-8"
          >
            <Text className="text-slate-800 font-black text-[18px] mb-4 px-2 tracking-tight">
              Preferences
            </Text>

            <GlassCard className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden py-2">
              <MenuItem
                icon={
                  <Feather name="user" size={20} color={colors.indigo[600]} />
                }
                title="Edit Profile"
                subtitle="Update credentials & personal info"
                onPress={() => router.push("/profile/edit")}
              />
              <MenuItem
                icon={
                  <MaterialCommunityIcons
                    name="hospital-building"
                    size={20}
                    color={colors.indigo[600]}
                  />
                }
                title="Manage Clinics"
                subtitle={`${user.clinics?.length || 0} active locations attached`}
                onPress={() => {}}
              />
              <MenuItem
                icon={
                  <Feather name="shield" size={20} color={colors.indigo[600]} />
                }
                title="Privacy & Security"
                subtitle="Password, 2FA & data management"
                onPress={() => {}}
              />
              <MenuItem
                icon={
                  <Feather
                    name="help-circle"
                    size={20}
                    color={colors.slate[600]}
                  />
                }
                title="Help & Support"
                subtitle="Reach out to the support team"
                onPress={() => {}}
                showDivider={false} // Last item before destructive
              />
            </GlassCard>
          </Animated.View>

          {/* 4. Standalone Logout Group */}
          <Animated.View
            entering={FadeInUp.springify().damping(16).mass(0.9).delay(400)}
            className="mt-5"
          >
            <GlassCard className="bg-rose-500 rounded-[28px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden py-1">
              <MenuItem
                icon={
                  <Feather name="log-out" size={20} color={colors.red[600]} />
                }
                title="Sign Out"
                onPress={handleLogout}
                isDestructive
                showDivider={false}
              />
            </GlassCard>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
