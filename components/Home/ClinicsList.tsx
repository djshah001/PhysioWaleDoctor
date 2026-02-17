import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { Clinic } from "~/types/models";
import { useRouter } from "expo-router";
import { cn } from "~/lib/utils";

interface ClinicsListProps {
  clinics: Clinic[];
  onAddClinic?: () => void;
  className?: string;
}

export const ClinicsList: React.FC<ClinicsListProps> = ({
  clinics,
  onAddClinic,
  className,
}) => {
  const router = useRouter();

  if (clinics.length === 0) {
    return (
      <View className={cn("mb-6", className)}>
        <Text className="text-lg font-bold text-gray-800 mb-3">My Clinics</Text>
        <Card>
          <EmptyState
            icon="business-outline"
            title="No Clinics Yet"
            description="Add your first clinic to start managing appointments"
            actionLabel="Add Clinic"
            onAction={onAddClinic}
          />
        </Card>
      </View>
    );
  }

  return (
    <View className={cn("mb-6", className)}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">My Clinics</Text>
        <Pressable onPress={onAddClinic}>
          <Ionicons name="add-circle" size={28} color="#6366F1" />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pr-4"
      >
        {clinics.map((clinic) => (
          <Pressable
            key={clinic._id}
            onPress={() => {
              // Navigate to clinic details
              // router.push(`/clinic/${clinic._id}`);
            }}
            className="active:opacity-80"
          >
            <Card className="w-60">
              <View className="flex-row justify-between items-center mb-3">
                <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center">
                  <Ionicons name="business" size={24} color="#6366F1" />
                </View>
                <View className="flex-row items-center gap-1 bg-amber-100 px-2 py-1 rounded-xl">
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text className="text-xs font-semibold text-amber-900">
                    {clinic.rating?.overall?.toFixed(1) || "N/A"}
                  </Text>
                </View>
              </View>
              <Text
                className="text-base font-semibold text-gray-800 mb-2"
                numberOfLines={1}
              >
                {clinic.name}
              </Text>
              <View className="flex-row items-center gap-1 mb-1.5">
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text
                  className="text-[13px] text-gray-500 flex-1"
                  numberOfLines={1}
                >
                  {clinic.city}, {clinic.state}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="medical-outline" size={14} color="#6B7280" />
                <Text className="text-[13px] text-gray-500">
                  {Array.isArray(clinic.services) ? clinic.services.length : 0}{" "}
                  services
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
