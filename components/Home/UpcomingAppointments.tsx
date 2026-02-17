import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { PopulatedAppointment } from "~/types/models";
import { format, parseISO } from "date-fns";
import { cn } from "~/lib/utils";

interface UpcomingAppointmentsProps {
  appointments: PopulatedAppointment[];
  onViewAll?: () => void;
  className?: string;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onViewAll,
  className,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { bg: "bg-emerald-100", text: "text-emerald-900" };
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-900" };
      case "completed":
        return { bg: "bg-blue-100", text: "text-blue-900" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  if (appointments.length === 0) {
    return (
      <View className={cn("mb-6", className)}>
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Upcoming Appointments
        </Text>
        <Card>
          <EmptyState
            icon="calendar-outline"
            title="No Upcoming Appointments"
            description="You have no appointments scheduled"
          />
        </Card>
      </View>
    );
  }

  return (
    <View className={cn("mb-6", className)}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">
          Upcoming Appointments
        </Text>
        {appointments.length > 0 && (
          <Pressable onPress={onViewAll}>
            <Text className="text-sm font-semibold text-indigo-600">
              View All
            </Text>
          </Pressable>
        )}
      </View>
      <View className="gap-3">
        {appointments.map((appointment) => {
          const statusColors = getStatusColor(
            appointment.status || appointment.bookingStatus,
          );
          const startDate = parseISO(appointment.startDateTime);

          return (
            <Card key={appointment._id} className="p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1 gap-3">
                  {appointment.patient.profilePic ? (
                    <Image
                      source={{ uri: appointment.patient.profilePic }}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center">
                      <Ionicons name="person" size={20} color="#6366F1" />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text
                      className="text-base font-semibold text-gray-800"
                      numberOfLines={1}
                    >
                      {appointment.patient.name}
                    </Text>
                    <Text
                      className="text-[13px] text-gray-500 mt-0.5"
                      numberOfLines={1}
                    >
                      {typeof appointment.service === "object"
                        ? appointment.service.name
                        : "Service"}
                    </Text>
                  </View>
                </View>
                <View className={cn("px-2.5 py-1 rounded-xl", statusColors.bg)}>
                  <Text
                    className={cn(
                      "text-xs font-semibold capitalize",
                      statusColors.text,
                    )}
                  >
                    {appointment.status || appointment.bookingStatus}
                  </Text>
                </View>
              </View>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-[13px] text-gray-500">
                    {format(startDate, "MMM dd, yyyy • hh:mm a")}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="business-outline" size={16} color="#6B7280" />
                  <Text
                    className="text-[13px] text-gray-500 flex-1"
                    numberOfLines={1}
                  >
                    {typeof appointment.clinic === "object"
                      ? appointment.clinic.name
                      : "Clinic"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text className="text-[13px] text-gray-500">
                    ₹{appointment.billAmount}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
};
