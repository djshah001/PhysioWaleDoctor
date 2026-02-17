import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cn } from "~/lib/utils";

interface QuickAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  onPress?: () => void;
  color: string;
}

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      icon: "calendar",
      label: "All Appointments",
      route: "/appointments",
      color: "#6366F1",
    },
    {
      icon: "add-circle",
      label: "Add Clinic",
      route: "/clinic/add",
      color: "#10B981",
    },
    {
      icon: "time",
      label: "Availability",
      route: "/availability",
      color: "#F59E0B",
    },
    {
      icon: "stats-chart",
      label: "Analytics",
      route: "/analytics",
      color: "#EF4444",
    },
  ];

  const handlePress = (action: QuickAction) => {
    if (action.onPress) {
      action.onPress();
    } else if (action.route) {
      // router.push(action.route);
      console.log(`Navigate to ${action.route}`);
    }
  };

  return (
    <View className={cn("mb-6", className)}>
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Quick Actions
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {actions.map((action, index) => (
          <Pressable
            key={index}
            className="w-[48%] bg-white rounded-2xl p-4 items-center shadow-md active:opacity-70"
            onPress={() => handlePress(action)}
          >
            <View
              className="w-14 h-14 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${action.color}15` }}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text className="text-[13px] font-semibold text-gray-800 text-center">
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
