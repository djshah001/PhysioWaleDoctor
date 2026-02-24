import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, MotiText } from "moti";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Image } from "expo-image";
import colors from "tailwindcss/colors";

type PremiumHeaderProps = {
  name: string;
  profilePic?: string;
  notificationCount?: number;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", icon: "sunny-outline" as const };
  if (h < 18)
    return { text: "Good Afternoon", icon: "partly-sunny-outline" as const };
  return { text: "Good Evening", icon: "moon-outline" as const };
};

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  name,
  profilePic,
  notificationCount = 0,
}) => {
  const insets = useSafeAreaInsets();
  const greeting = getGreeting();
  const firstName = name.split(" ")[0];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View style={{ paddingTop: insets.top }} className="px-5 pb-4">
      {/* ── Top row: avatar + greeting + notifications ── */}
      <View className="flex-row justify-between items-center mb-4">
        {/* Left: avatar + greeting */}
        <MotiView
          from={{ opacity: 0, translateX: -12 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 80 }}
          className="flex-row items-center gap-3"
        >
          {/* Avatar with online dot */}
          <View className="relative">
            <View className="p-0.5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white/60">
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : {
                        uri:
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(name) +
                          "&background=6366f1&color=fff&bold=true",
                      }
                }
                style={{ width: 46, height: 46, borderRadius: 23 }}
              />
            </View>
            {/* Online indicator */}
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          </View>

          {/* Greeting text */}
          <View>
            <View className="flex-row items-center gap-1">
              <Ionicons
                name={greeting.icon}
                size={12}
                color={colors.amber[500]}
              />
              <MotiText
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 150 }}
                className="text-gray-500 text-xs font-semibold tracking-wide"
              >
                {greeting.text}
              </MotiText>
            </View>
            <MotiText
              from={{ opacity: 0, translateY: 4 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 220 }}
              className="text-xl font-extrabold text-gray-800"
            >
              Dr. {firstName}
            </MotiText>
          </View>
        </MotiView>

        {/* Right: notification bell */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 300 }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            className="relative bg-white/60 p-3 rounded-2xl border border-white/50"
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.slate[700]}
            />
            {notificationCount > 0 && (
              <View className="absolute top-2 right-2 min-w-[16px] h-4 bg-red-500 rounded-full items-center justify-center px-0.5">
                <Text className="text-white text-[9px] font-extrabold">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </MotiView>
      </View>

      {/* ── Date / time widget ── */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 350 }}
      >
        <GlassCard
          intensity={90}
          className="rounded-2xl"
          contentContainerClassName="px-4 py-3 flex-row items-center justify-between rounded-2xl"
        >
          {/* Left: calendar icon + date */}
          <View className="flex-row items-center gap-3">
            <View className="bg-indigo-100 p-2 rounded-xl">
              <Ionicons name="calendar" size={18} color={colors.indigo[600]} />
            </View>
            <View>
              <Text className="text-gray-800 font-bold text-sm">{dateStr}</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Ionicons
                  name="time-outline"
                  size={11}
                  color={colors.gray[400]}
                />
                <Text className="text-gray-400 text-[11px]">{timeStr}</Text>
              </View>
            </View>
          </View>

          {/* Right: CTA */}
          <View className="flex-row items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-xl">
            <Text className="text-indigo-600 text-xs font-bold">Schedule</Text>
            <Ionicons
              name="chevron-forward"
              size={13}
              color={colors.indigo[600]}
            />
          </View>
        </GlassCard>
      </MotiView>
    </View>
  );
};
