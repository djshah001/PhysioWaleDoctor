import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { MotiView } from "moti";
import { DashboardAppointment } from "~/types/models";
import colors from "tailwindcss/colors";

// ─── Types ─────────────────────────────────────────────────────────────────────

type UpcomingScheduleCardProps = {
  appointments: DashboardAppointment[];
  onViewAll?: () => void;
};

// ─── Config maps ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  "In-Clinic": {
    icon: "business-outline" as const,
    bgCls: "bg-indigo-100",
    textCls: "text-indigo-700",
    iconColor: colors.indigo[600],
    label: "Clinic",
  },
  "Home-Visit": {
    icon: "home-outline" as const,
    bgCls: "bg-emerald-100",
    textCls: "text-emerald-700",
    iconColor: colors.emerald[600],
    label: "Home",
  },
  "Video-Call": {
    icon: "videocam-outline" as const,
    bgCls: "bg-violet-100",
    textCls: "text-violet-700",
    iconColor: colors.violet[600],
    label: "Video",
  },
} as const;

const STATUS_CONFIG: Record<
  string,
  { bgCls: string; textCls: string; dotCls: string }
> = {
  confirmed: {
    bgCls: "bg-emerald-100",
    textCls: "text-emerald-700",
    dotCls: "bg-emerald-500",
  },
  pending: {
    bgCls: "bg-amber-100",
    textCls: "text-amber-700",
    dotCls: "bg-amber-500",
  },
  default: {
    bgCls: "bg-gray-100",
    textCls: "text-gray-600",
    dotCls: "bg-gray-400",
  },
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptySchedule = () => (
  <GlassCard contentContainerClassName="items-center justify-center py-12 px-6">
    <View className="w-20 h-20 bg-indigo-50 rounded-3xl items-center justify-center mb-4">
      <Ionicons
        name="calendar-clear-outline"
        size={36}
        color={colors.indigo[400]}
      />
    </View>
    <Text className="text-gray-700 font-bold text-base mb-1">All Clear!</Text>
    <Text className="text-gray-400 text-sm text-center leading-5">
      No upcoming appointments.{"\n"}Enjoy your free time 🎉
    </Text>
  </GlassCard>
);

// ─── Appointment row ──────────────────────────────────────────────────────────

const AppointmentRow = ({
  apt,
  index,
}: {
  apt: DashboardAppointment;
  index: number;
}) => {
  const typeCfg =
    TYPE_CONFIG[apt.appointmentType as keyof typeof TYPE_CONFIG] ??
    TYPE_CONFIG["In-Clinic"];
  const statusCfg = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.default;

  const dateObj = new Date(apt.date);
  const dayNum = dateObj.toLocaleDateString("en-IN", { day: "numeric" });
  const monthStr = dateObj.toLocaleDateString("en-IN", { month: "short" });

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 80, type: "spring", damping: 18 }}
    >
      <GlassCard
        className="overflow-hidden rounded-2xl"
        contentContainerClassName="p-0 rounded-2xl"
      >
        <View className="flex-row">
          {/* Left: date + type strip */}
          <View className="w-[68px] bg-indigo-50 items-center justify-center py-4 border-r border-indigo-100">
            <Text className="text-indigo-700 font-extrabold text-lg leading-tight">
              {dayNum}
            </Text>
            <Text className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wide mb-2">
              {monthStr}
            </Text>

            {/* Type icon chip */}
            <View className={`p-1.5 rounded-xl ${typeCfg.bgCls}`}>
              <Ionicons
                name={typeCfg.icon}
                size={13}
                color={typeCfg.iconColor}
              />
            </View>
          </View>

          {/* Right: main content */}
          <View className="flex-1 px-3 py-3 justify-between">
            {/* Top: patient name + avatar */}
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 mr-2">
                <Text
                  className="font-bold text-gray-800 text-[13px]"
                  numberOfLines={1}
                >
                  {apt.patientName}
                </Text>
                {apt.serviceName && (
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons
                      name="medical-outline"
                      size={10}
                      color={colors.gray[400]}
                    />
                    <Text
                      className="text-gray-400 text-[11px]"
                      numberOfLines={1}
                    >
                      {apt.serviceName}
                    </Text>
                  </View>
                )}
              </View>

              {/* Avatar */}
              {apt.patientImage ? (
                <Image
                  source={{ uri: apt.patientImage }}
                  style={{ width: 34, height: 34, borderRadius: 17 }}
                  className="bg-gray-200"
                />
              ) : (
                <View className="w-[34px] h-[34px] rounded-full bg-indigo-100 items-center justify-center">
                  <Text className="text-indigo-600 font-bold text-sm">
                    {apt.patientName?.charAt(0)?.toUpperCase() ?? "P"}
                  </Text>
                </View>
              )}
            </View>

            {/* Bottom: time + status + clinic */}
            <View className="flex-row items-center gap-2 flex-wrap">
              {/* Time pill */}
              <View className="flex-row items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg">
                <Ionicons
                  name="time-outline"
                  size={11}
                  color={colors.indigo[500]}
                />
                <Text className="text-indigo-600 text-[11px] font-bold">
                  {apt.time}
                </Text>
              </View>

              {/* Status badge with dot */}
              <View
                className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${statusCfg.bgCls}`}
              >
                <View
                  className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotCls}`}
                />
                <Text
                  className={`text-[10px] font-bold capitalize ${statusCfg.textCls}`}
                >
                  {apt.status}
                </Text>
              </View>

              {/* Clinic name */}
              {apt.clinicName && (
                <View className="flex-row items-center gap-0.5 flex-1">
                  <Ionicons
                    name="location-outline"
                    size={10}
                    color={colors.gray[400]}
                  />
                  <Text
                    className="text-gray-400 text-[10px] flex-1"
                    numberOfLines={1}
                  >
                    {apt.clinicName}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </GlassCard>
    </MotiView>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const UpcomingScheduleCard: React.FC<UpcomingScheduleCardProps> = ({
  appointments,
  onViewAll,
}) => {
  return (
    <View className="px-5 pb-6">
      {/* Section header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-2">
          <View className="bg-indigo-100 p-1.5 rounded-lg">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.indigo[600]}
            />
          </View>
          <Text className="text-base font-bold text-gray-800">
            Upcoming Schedule
          </Text>
          {appointments.length > 0 && (
            <View className="bg-indigo-100 px-2 py-0.5 rounded-full">
              <Text className="text-indigo-700 text-[11px] font-bold">
                {appointments.length}
              </Text>
            </View>
          )}
        </View>

        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            className="flex-row items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-xl"
          >
            <Text className="text-indigo-600 text-xs font-bold">View All</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color={colors.indigo[600]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {!appointments || appointments.length === 0 ? (
        <EmptySchedule />
      ) : (
        <View className="gap-3">
          {appointments.map((apt, index) => (
            <AppointmentRow
              key={`${apt._id}-${index}`}
              apt={apt}
              index={index}
            />
          ))}
        </View>
      )}
    </View>
  );
};
