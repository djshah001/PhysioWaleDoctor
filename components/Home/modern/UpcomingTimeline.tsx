import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Appointment } from "~/types/models";

type UpcomingTimelineProps = {
  appointments: Appointment[];
  onViewAll: () => void;
};

export const UpcomingTimeline: React.FC<UpcomingTimelineProps> = ({
  appointments,
  onViewAll,
}) => {
  return (
    <View className="px-6 pb-24">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">
          Upcoming Schedule
        </Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-indigo-600 font-medium text-sm">View All</Text>
        </TouchableOpacity>
      </View>

      {!appointments ||
      !Array.isArray(appointments) ||
      appointments.length === 0 ? (
        <GlassCard className="items-center justify-center p-8 bg-gray-50/50">
          <View className="bg-gray-100 p-4 rounded-full mb-3">
            <Ionicons name="calendar-outline" size={32} color="#9ca3af" />
          </View>
          <Text className="text-gray-500 font-medium">
            No upcoming appointments
          </Text>
        </GlassCard>
      ) : (
        <View className="space-y-3">
          {appointments.map((apt, index) => {
            const date = new Date(apt.startDateTime);
            const timeString = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <GlassCard
                key={apt._id}
                className="p-0 flex-row overflow-hidden"
                contentContainerClassName="p-0 flex-1 flex-row"
              >
                {/* Left Time Strip */}
                <View className="w-20 bg-indigo-50/80 items-center justify-center p-2 border-r border-indigo-100 border-dashed">
                  <Text className="text-indigo-700 font-bold text-base">
                    {timeString}
                  </Text>
                  <Text className="text-xs text-indigo-400 font-medium uppercase">
                    {date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>

                {/* Right Content */}
                <View className="flex-1 p-3 justify-center">
                  <View className="flex-row justify-between items-start mb-1">
                    <View>
                      <Text className="font-bold text-gray-800 text-base">
                        {apt.patient?.name || "Unknown Patient"}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {apt.service?.name}
                      </Text>
                    </View>
                    {apt.patient?.profilePic ? (
                      <Image
                        source={{ uri: apt.patient.profilePic }}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      />
                    ) : (
                      <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center">
                        <Text className="text-indigo-600 font-bold text-xs">
                          {apt.patient?.name?.charAt(0) || "P"}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center space-x-2 mt-2">
                    <View
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        apt.status === "confirmed"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          apt.status === "confirmed"
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {apt.status.toUpperCase()}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-[10px]">•</Text>
                    <View className="flex-row items-center space-x-1">
                      <Ionicons
                        name="location-outline"
                        size={10}
                        color="#9ca3af"
                      />
                      <Text
                        className="text-gray-400 text-[10px]"
                        numberOfLines={1}
                      >
                        {/* @ts-ignore - Clinic name access */}
                        {apt.clinic?.name || "Clinic"}
                      </Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            );
          })}
        </View>
      )}
    </View>
  );
};
