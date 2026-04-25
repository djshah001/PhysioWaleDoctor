import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { TestResult } from "~/types/models";

interface TestResultCardProps {
  result: TestResult;
  onPress?: () => void;
}

export const TestResultCard = ({ result, onPress }: TestResultCardProps) => {
  const categoryName =
    typeof result.categoryId === "object"
      ? result.categoryId.name
      : "Clinical Assessment";

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Normal":
        return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" };
      case "Mild":
        return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
      case "Moderate":
        return { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" };
      case "Severe":
        return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" };
    }
  };

  const severityStyle = getSeverityColor(result.severity);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      className="bg-white/60 rounded-2xl p-4 mb-3 border border-white/80"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-slate-800 font-bold text-base mb-1" numberOfLines={1}>
            {categoryName}
          </Text>
          <Text className="text-slate-500 text-xs font-medium">
            {new Date(result.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>

        <View className={`px-2.5 py-1 rounded-full flex-row items-center ${severityStyle.bg}`}>
          <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${severityStyle.dot}`} />
          <Text className={`text-[10px] font-bold uppercase tracking-wider ${severityStyle.text}`}>
            {result.severity}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
        <View className="flex-row items-center">
          <Ionicons name="analytics-outline" size={16} color={colors.slate[400]} className="mr-1.5" />
          <Text className="text-slate-600 text-sm font-semibold">
            Score: {result.score} ({result.percentage}%)
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className={`text-xs font-bold ${result.status === "Pending" ? "text-amber-600" : result.status === "Prescribed" ? "text-emerald-600" : "text-slate-500"}`}>
            {result.status}
          </Text>
          {onPress && (
            <Ionicons name="chevron-forward" size={16} color={colors.slate[400]} className="ml-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
