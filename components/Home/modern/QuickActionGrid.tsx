import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";
import colors from "tailwindcss/colors";
import { Button } from "~/components/ui/button";

type QuickAction = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** NativeWind bg class for the icon bubble */
  bgCls: string;
  /** NativeWind text class for the label */
  textCls: string;
  /** Ionicons color value */
  iconColor: string;
  onPress: () => void;
};

const actions: QuickAction[] = [
  {
    id: "patients",
    label: "Patients",
    icon: "people-outline",
    bgCls: "bg-emerald-500",
    textCls: "text-emerald-600",
    iconColor: "white",
    onPress: () => router.push("/patients" as any),
  },
  {
    id: "workouts",
    label: "Templates",
    icon: "document-text-outline",
    bgCls: "bg-amber-500",
    textCls: "text-amber-600",
    iconColor: "white",
    onPress: () => router.push("/workouts-templates" as any),
  },
  {
    id: "exercises",
    label: "Exercises",
    icon: "barbell-outline",
    bgCls: "bg-cyan-500",
    textCls: "text-cyan-600",
    iconColor: "white",
    onPress: () => router.push("/exercises" as any),
  },
  {
    id: "services",
    label: "Services",
    icon: "medkit-outline",
    bgCls: "bg-rose-500",
    textCls: "text-rose-600",
    iconColor: "white",
    onPress: () => router.push("/services" as any),
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: "calendar-outline",
    bgCls: "bg-indigo-500",
    textCls: "text-indigo-600",
    iconColor: "white",
    onPress: () => router.push("/(tabs)/appointments" as any),
  },
  {
    id: "clinics",
    label: "My Clinics",
    icon: "business-outline",
    bgCls: "bg-violet-500",
    textCls: "text-violet-600",
    iconColor: "white",
    onPress: () => router.push("/(tabs)/clinic" as any),
  },
];

export const QuickActionGrid: React.FC = () => {
  return (
    <View className="mb-6 px-5">
      {/* Section header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-gray-800">Quick Actions</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-indigo-500 text-xs leading-4 font-semibold">
            All tools
          </Text>
          <Ionicons name="grid-outline" size={13} color={colors.indigo[500]} />
        </View>
      </View>

      {/* 4-column grid */}
      <View className="flex-row flex-wrap flex-1 ">
        {actions.map((action, index) => (
          <Button
            key={action.id}
            onPress={action.onPress}
            className="items-center bg-transparent shadow-none flex-col w-24"
          >
            {/* Icon bubble */}
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center shadow-sm ${action.bgCls}`}
            >
              <Ionicons name={action.icon} size={20} color={action.iconColor} />
            </View>

            {/* Label */}
            <Text
              className={`text-xs font-semibold text-center ${action.textCls}`}
              numberOfLines={1}
            >
              {action.label}
            </Text>
          </Button>
        ))}
      </View>
    </View>
  );
};
