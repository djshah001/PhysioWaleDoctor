import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "~/lib/utils";

interface WelcomeHeaderProps {
  name: string;
  profilePic?: string;
  totalAppointments: number;
  className?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  name,
  profilePic,
  totalAppointments,
  className,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={cn("rounded-2xl p-5 mb-5", className)}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-sm text-white/90 font-medium">
            {getGreeting()}
          </Text>
          <Text className="text-2xl font-bold text-white mt-1">Dr. {name}</Text>
          <View className="flex-row items-center gap-1.5 mt-2">
            <Ionicons name="calendar-outline" size={16} color="#FFF" />
            <Text className="text-[13px] text-white/95 font-medium">
              {totalAppointments}{" "}
              {totalAppointments === 1 ? "appointment" : "appointments"} today
            </Text>
          </View>
        </View>
        <View className="ml-4">
          {profilePic ? (
            <Image
              source={{ uri: profilePic }}
              className="w-15 h-15 rounded-full border-3 border-white"
            />
          ) : (
            <View className="w-15 h-15 rounded-full bg-white items-center justify-center">
              <Ionicons name="person" size={32} color="#667eea" />
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};
