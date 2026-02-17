import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

type QuickAction = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

const actions: QuickAction[] = [
  {
    id: "add_patient",
    label: "Add Patient",
    icon: "person-add",
    color: "#4f46e5", // indigo-600
    onPress: () => console.log("Add Patient"),
  },
  {
    id: "new_appt",
    label: "New Appt",
    icon: "calendar",
    color: "#059669", // emerald-600
    onPress: () => console.log("New Appt"),
  },
  {
    id: "clinics",
    label: "My Clinics",
    icon: "business",
    color: "#9333ea", // purple-600
    onPress: () => console.log("My Clinics"),
  },
  {
    id: "services",
    label: "Services",
    icon: "medkit",
    color: "#ea580c", // orange-600
    onPress: () => console.log("Services"),
  },
];

export const QuickActionGrid: React.FC = () => {
  return (
    <View className="mb-8 px-6">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Quick Actions
      </Text>
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {actions.map((action, index) => (
          <MotiView
            key={action.id}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 100 }}
            style={{ width: "23%" }}
          >
            <TouchableOpacity
              onPress={action.onPress}
              className="items-center"
              activeOpacity={0.7}
            >
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mb-2 shadow-sm"
                style={{ backgroundColor: action.color }}
              >
                <Ionicons name={action.icon} size={24} color="white" />
              </View>
              <Text
                className="text-xs font-medium text-gray-600 text-center"
                numberOfLines={1}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );
};
