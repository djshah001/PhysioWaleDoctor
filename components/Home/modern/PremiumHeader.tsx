import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiText } from "moti";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Image } from "expo-image";

type PremiumHeaderProps = {
  name: string;
  profilePic?: string;
  notificationCount?: number;
};

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  name,
  profilePic,
  notificationCount = 0,
}) => {
  const insets = useSafeAreaInsets();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={{ paddingTop: insets.top }} className="px-6 pb-4">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center space-x-3 gap-2">
          <View className="relative">
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : {
                      uri:
                        "https://ui-avatars.com/api/?name=" +
                        name +
                        "&background=random",
                    }
              }
              className="w-12 h-12 rounded-full border-2 border-white"
              style={{
                width: 44,
                height: 44,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: "white",
              }}
            />
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          </View>
          <View>
            <MotiText
              from={{ opacity: 0, translateY: 5 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 }}
              className="text-gray-500 text-xs font-medium uppercase tracking-wider"
            >
              {getGreeting()},
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: 5 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 200 }}
              className="text-xl font-bold text-gray-800"
            >
              Dr. {name.split(" ")[0]}
            </MotiText>
          </View>
        </View>

        <TouchableOpacity className="relative bg-white/50 p-2.5 rounded-full border border-white/60 shadow-sm">
          <Ionicons name="notifications-outline" size={24} color="#1e293b" />
          {notificationCount > 0 && (
            <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </TouchableOpacity>
      </View>

      {/* Date Widget */}
      <GlassCard
        intensity={80}
        className="rounded-2xl"
        contentContainerClassName="py-3 px-4 flex-row justify-between items-center rounded-3xl"
      >
        <View className="flex-row items-center space-x-2 gap-2">
          <View className="bg-indigo-100 p-2 rounded-lg">
            <Ionicons name="calendar" size={18} color="#4f46e5" />
          </View>
          <Text className="text-gray-700 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <View className="flex-row items-center space-x-1.5">
          <Text className="text-gray-400 text-sm">Today's Schedule</Text>
          <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
        </View>
      </GlassCard>
    </View>
  );
};
