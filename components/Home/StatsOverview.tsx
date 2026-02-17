import React from "react";
import { View, Text } from "react-native";
import { StatBadge } from "../ui/StatBadge";
import { cn } from "~/lib/utils";

interface StatsOverviewProps {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalEarnings: number;
  className?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalAppointments,
  completedAppointments,
  pendingAppointments,
  totalEarnings,
  className,
}) => {
  return (
    <View className={cn("mb-6", className)}>
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Today's Overview
      </Text>
      <View className="flex-row flex-wrap gap-3">
        <View className="w-[48%]">
          <StatBadge
            icon="calendar"
            value={totalAppointments}
            label="Total"
            variant="primary"
          />
        </View>
        <View className="w-[48%]">
          <StatBadge
            icon="checkmark-circle"
            value={completedAppointments}
            label="Completed"
            variant="success"
          />
        </View>
        <View className="w-[48%]">
          <StatBadge
            icon="time"
            value={pendingAppointments}
            label="Pending"
            variant="warning"
          />
        </View>
        <View className="w-[48%]">
          <StatBadge
            icon="cash"
            value={`₹${totalEarnings.toLocaleString()}`}
            label="Earnings"
            variant="info"
          />
        </View>
      </View>
    </View>
  );
};
