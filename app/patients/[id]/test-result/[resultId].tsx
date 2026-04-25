import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Button } from "~/components/ui/button";
import { clinicalApi } from "~/apis/clinical";

export default function TestResultReviewScreen() {
  const { id, resultId } = useLocalSearchParams<{ id: string; resultId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resultId) {
      fetchTestResult();
    }
  }, [resultId]);

  const fetchTestResult = async () => {
    setLoading(true);
    try {
      const res = await clinicalApi.getTestResultById(resultId);
      setResult(res.data?.data);
    } catch (err: any) {
      console.error("Error fetching test result", err);
      setError("Failed to load the test result.");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.indigo[500]} />
          <Text className="mt-4 text-slate-500 font-medium">Loading Assessment...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (error || !result) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="warning-outline" size={48} color={colors.red[400]} />
          <Text className="mt-4 text-slate-700 font-bold text-lg text-center">{error}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            className="mt-6 bg-slate-800 rounded-full px-8 py-3"
          />
        </View>
      </GradientBackground>
    );
  }

  const categoryName = typeof result.categoryId === "object" ? result.categoryId.name : "Clinical Assessment";
  const severityStyle = getSeverityColor(result.severity);

  return (
    <GradientBackground>
      <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 pb-2 gap-3 z-10 mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-black text-slate-800" numberOfLines={1}>
              Review Assessment
            </Text>
            <Text className="text-slate-500 text-xs font-medium">
              {new Date(result.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <GlassCard className="rounded-3xl mb-6 mt-2" contentContainerClassName="p-5">
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
              Condition
            </Text>
            <Text className="text-2xl font-black text-slate-800 mb-4">{categoryName}</Text>

            <View className="flex-row items-center justify-between border-t border-slate-200/50 pt-4">
              <View>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Severity Score
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-black text-indigo-600">{result.percentage}%</Text>
                  <Text className="text-sm font-bold text-slate-400 ml-1">
                    ({result.totalScore}/{result.maxPossibleScore} pts)
                  </Text>
                </View>
              </View>

              <View className={`px-3 py-1.5 rounded-full flex-row items-center ${severityStyle.bg}`}>
                <View className={`w-2 h-2 rounded-full mr-2 ${severityStyle.dot}`} />
                <Text className={`text-xs font-bold uppercase tracking-wider ${severityStyle.text}`}>
                  {result.severity}
                </Text>
              </View>
            </View>
          </GlassCard>

          <Text className="text-lg font-bold text-slate-800 mb-4 ml-1">Patient Responses</Text>

          {/* Answers List */}
          {result.answers && result.answers.map((answer: any, index: number) => (
            <View key={answer.questionId || index} className="mb-4 bg-white/60 rounded-2xl p-4 border border-white/80">
              <View className="flex-row items-start mb-2">
                <Text className="text-slate-400 font-bold mr-2">{index + 1}.</Text>
                <Text className="text-slate-800 font-bold text-base flex-1">
                  {answer.questionText}
                </Text>
              </View>
              
              <View className="ml-5 mt-2 space-y-2">
                {answer.selectedOptions?.map((opt: any, idx: number) => (
                  <View key={idx} className="flex-row items-center bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                    <Ionicons name="checkmark-circle" size={18} color={colors.indigo[500]} className="mr-2" />
                    <Text className="text-indigo-900 font-medium flex-1">{opt.text}</Text>
                    <View className="bg-white rounded-full px-2 py-1 ml-2">
                      <Text className="text-xs font-bold text-indigo-500">{opt.points} pts</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
          
          {/* Bottom spacing for FAB */}
          <View className="h-24" />
        </ScrollView>

        {/* Floating Action Button */}
        <View className="absolute bottom-0 left-0 right-0 p-4 pb-8 pt-4 bg-white/80" style={{ paddingBottom: insets.bottom + 16 }}>
          <Button
            title="Prescribe Workout"
            onPress={() => router.push(`/patients/${id}/prescribe?testResultId=${result._id}`)}
            className="bg-rose-500 rounded-2xl py-4"
            rightIcon="fitness-outline"
          />
        </View>
      </View>
    </GradientBackground>
  );
}
