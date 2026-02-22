import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { DashboardAppointment } from "~/types/models";

// ─── Types ─────────────────────────────────────────────────────────────────────

type UpcomingScheduleCardProps = {
  appointments: DashboardAppointment[];
  onViewAll?: () => void;
};

// ─── Appointment-type icon/colour config ──────────────────────────────────────

const TYPE_CONFIG = {
  "In-Clinic": {
    icon: "business-outline" as const,
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    label: "Clinic",
  },
  "Home-Visit": {
    icon: "home-outline" as const,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Home",
  },
  "Video-Call": {
    icon: "videocam-outline" as const,
    bg: "bg-violet-100",
    text: "text-violet-700",
    label: "Video",
  },
} as const;

const STATUS_CONFIG = {
  confirmed: { bg: "bg-green-100", text: "text-green-700" },
  pending: { bg: "bg-amber-100", text: "text-amber-700" },
  default: { bg: "bg-gray-100", text: "text-gray-600" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const UpcomingScheduleCard: React.FC<UpcomingScheduleCardProps> = ({
  appointments,
  onViewAll,
}) => {
  return (
    <View className="px-6 pb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">
          Upcoming Schedule
        </Text>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            className="flex-row items-center gap-1"
          >
            <Text className="text-indigo-600 font-semibold text-sm">
              View All
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#4f46e5" />
          </TouchableOpacity>
        )}
      </View>

      {/* Empty state */}
      {!appointments || appointments.length === 0 ? (
        <GlassCard
          className="items-center justify-center py-10"
          contentContainerClassName="items-center justify-center py-10"
        >
          <View className="bg-indigo-50 p-4 rounded-full mb-3">
            <Ionicons name="calendar-outline" size={32} color="#6366f1" />
          </View>
          <Text className="text-gray-600 font-semibold text-base">
            No upcoming appointments
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Your schedule is clear
          </Text>
        </GlassCard>
      ) : (
        <View className="gap-3">
          {appointments.map((apt, index) => {
            const typeCfg =
              TYPE_CONFIG[apt.appointmentType as keyof typeof TYPE_CONFIG] ??
              TYPE_CONFIG["In-Clinic"];
            const statusCfg =
              STATUS_CONFIG[apt.status as keyof typeof STATUS_CONFIG] ??
              STATUS_CONFIG.default;

            const dateObj = new Date(apt.date);
            const dayStr = dateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });

            return (
              <GlassCard
                key={`${apt._id}-${index}`}
                className="p-0 overflow-hidden"
                contentContainerClassName="p-0 flex-row"
              >
                {/* Left time column */}
                <View className="w-[72px] bg-indigo-50/80 items-center justify-center py-4 px-2 border-r border-indigo-100/60 border-dashed">
                  <Text
                    className="text-indigo-700 font-extrabold text-sm text-center"
                    numberOfLines={1}
                  >
                    {apt.time}
                  </Text>
                  <Text className="text-indigo-400 text-[10px] font-medium mt-0.5 uppercase text-center">
                    {dayStr}
                  </Text>
                  {/* Appointment type badge */}
                  <View
                    className={`mt-2 ${typeCfg.bg} rounded-full px-2 py-0.5`}
                  >
                    <Ionicons
                      name={typeCfg.icon}
                      size={12}
                      color="currentColor"
                    />
                  </View>
                </View>

                {/* Right content */}
                <View className="flex-1 p-3 justify-center">
                  {/* Top row: patient name + avatar */}
                  <View className="flex-row justify-between items-start mb-1.5">
                    <View className="flex-1 mr-3">
                      <Text
                        className="font-bold text-gray-800 text-sm"
                        numberOfLines={1}
                      >
                        {apt.patientName}
                      </Text>
                      {apt.serviceName && (
                        <Text
                          className="text-gray-500 text-[11px] mt-0.5"
                          numberOfLines={1}
                        >
                          {apt.serviceName}
                        </Text>
                      )}
                    </View>

                    {/* Patient avatar */}
                    {apt.patientImage ? (
                      <Image
                        source={{ uri: apt.patientImage }}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                        className="bg-gray-200"
                      />
                    ) : (
                      <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center">
                        <Text className="text-indigo-600 font-bold text-xs">
                          {apt.patientName?.charAt(0)?.toUpperCase() ?? "P"}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Bottom row: status + clinic */}
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <View
                      className={`px-2 py-0.5 rounded-full ${statusCfg.bg}`}
                    >
                      <Text
                        className={`text-[10px] font-bold uppercase ${statusCfg.text}`}
                      >
                        {apt.status}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1 flex-1">
                      <Ionicons
                        name="location-outline"
                        size={10}
                        color="#9ca3af"
                      />
                      <Text
                        className="text-gray-400 text-[10px] flex-1"
                        numberOfLines={1}
                      >
                        {apt.clinicName}
                      </Text>
                    </View>

                    {/* Type chip */}
                    <View
                      className={`px-2 py-0.5 rounded-full ${typeCfg.bg} flex-row items-center gap-1`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${typeCfg.text}`}
                      >
                        {typeCfg.label}
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
