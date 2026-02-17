import React from "react";
import { View, ScrollView, Text, useWindowDimensions } from "react-native";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { ModernStatBadge } from "~/components/ui/premium/ModernStatBadge";

type StatsCarouselProps = {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalEarnings: number;
};

export const StatsCarousel: React.FC<StatsCarouselProps> = ({
  totalAppointments,
  completedAppointments,
  pendingAppointments,
  totalEarnings,
}) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.42;

  return (
    <View className="mb-6">
      <View className="px-6 mb-3 flex-row justify-between items-end">
        <Text className="text-lg font-bold text-gray-800">Overview</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {/* Main Earnings Card - Larger/Highlighted */}
        <GlassCard
          className="rounded-3xl border border-white/30"
          style={{ width: width * 0.65 }}
          contentContainerClassName="bg-indigo-50/10 flex-1 justify-center p-5"
        >
          <ModernStatBadge
            icon="wallet"
            value={`₹${totalEarnings.toLocaleString()}`}
            label="Total Earnings"
            variant="indigo"
            trend="up"
            trendValue="+12%"
          />
        </GlassCard>

        {/* Other Stats */}
        <GlassCard
          style={{ width: cardWidth }}
          className="rounded-3xl border border-white/30"
          contentContainerClassName="bg-white/10 flex-1 justify-center p-5"
        >
          <ModernStatBadge
            icon="people"
            value={totalAppointments}
            label="Appointments"
            variant="purple"
          />
        </GlassCard>

        <GlassCard
          style={{ width: cardWidth }}
          className="rounded-3xl border border-white/30"
          contentContainerClassName="bg-white/10 flex-1 justify-center p-5"
        >
          <ModernStatBadge
            icon="checkmark-circle"
            value={completedAppointments}
            label="Completed"
            variant="emerald"
          />
        </GlassCard>

        <GlassCard
          style={{ width: cardWidth }}
          className="rounded-3xl border border-white/30"
          contentContainerClassName="bg-white/10 flex-1 justify-center p-5"
        >
          <ModernStatBadge
            icon="time"
            value={pendingAppointments}
            label="Pending"
            variant="orange"
          />
        </GlassCard>
      </ScrollView>
    </View>
  );
};
