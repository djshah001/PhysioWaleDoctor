import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ViewStyle,
  Platform,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { MotiView } from "moti";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import {
  useTemplateDetails,
  useDeleteTemplate,
} from "~/apis/hooks/useTemplates";
import { Button } from "~/components/ui/button";

interface ExerciseDetail {
  _id: string;
  exerciseId: {
    _id: string;
    name: string;
    description: string;
    thumbnailUrl?: string;
  };
  defaultSets: number;
  defaultReps: number;
  holdTimeSecs: number;
}

interface TemplateDetails {
  _id: string;
  name: string;
  description: string;
  exercises: ExerciseDetail[];
  isSystem?: boolean;
  creatorModel?: string;
  createdBy: { _id: string; name: string; role?: string };
  tags: any[]; // Array of tag objects
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBox = ({
  style,
  className = "",
}: {
  style?: ViewStyle;
  className?: string;
}) => {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[{ opacity }, style]}
      className={`bg-white/50 rounded-2xl ${className}`}
    />
  );
};

const DetailSkeleton = () => (
  <View className="px-4 gap-4 mt-2">
    <SkeletonBox
      style={{ width: 120, height: 24, borderRadius: 12 }}
      className="mb-2"
    />
    <SkeletonBox style={{ width: "90%", height: 32 }} />
    <SkeletonBox style={{ width: "100%", height: 80 }} />

    <View className="flex-row gap-2 my-2">
      <SkeletonBox style={{ width: 70, height: 26, borderRadius: 12 }} />
      <SkeletonBox style={{ width: 90, height: 26, borderRadius: 12 }} />
    </View>
    <SkeletonBox style={{ width: "100%", height: 100 }} />
    <SkeletonBox style={{ width: "100%", height: 100 }} />
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function TemplateDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    data: template,
    isLoading: loading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTemplateDetails(id as string);
  const { mutate: deleteTemplate, isPending: deleting } = useDeleteTemplate();

  const handleDeleteTemplate = () => {
    Alert.alert(
      "Delete Template",
      "Are you sure you want to delete this template? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTemplate(id as string, {
              onSuccess: () => router.back(),
              onError: (err) => {
                console.error("Failed to delete template", err);
                Alert.alert("Error", "Could not delete template.");
              },
            });
          },
        },
      ],
    );
  };

  const renderContent = () => {
    if (loading && !template) return <DetailSkeleton />;

    if (isError || !template) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <GlassCard contentContainerClassName="items-center p-8 w-full rounded-3xl">
            <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={colors.red[500]}
              />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">
              Error Loading Template
            </Text>
            <Text className="text-slate-500 font-medium text-center mb-6 leading-relaxed">
              {error?.message || "Template not found."}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-slate-800 px-6 py-3 rounded-2xl w-full"
            >
              <Text className="text-white font-bold text-center">Go Back</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      );
    }

    const isSystem = template.creatorModel === "Admin" || template.isSystem;

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100, // extra space for FAB
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.indigo[600]}
            colors={[colors.indigo[600]]}
          />
        }
      >
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350 }}
          className="mb-4"
        >
          {isSystem && (
            <View className="bg-indigo-100/60 border border-indigo-200/50 px-3 py-1 rounded-full flex-row items-center self-start mb-3">
              <Ionicons
                name="shield-checkmark"
                size={12}
                color={colors.indigo[600]}
              />
              <Text className="text-[10px] font-black text-indigo-700 ml-1 uppercase tracking-widest">
                System Template
              </Text>
            </View>
          )}

          <Text className="text-3xl font-black text-slate-800 mb-2 leading-tight">
            {template.name}
          </Text>
          <Text className="text-base text-slate-600 leading-relaxed font-medium">
            {template.description || "No description provided."}
          </Text>
        </MotiView>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 350, delay: 100 }}
            className="flex-row flex-wrap gap-2 mb-6"
          >
            {template.tags.map((tag: any, idx: number) => (
              <View
                key={idx}
                className="bg-white/60 border border-white px-3 py-1.5 rounded-full shadow-sm"
              >
                <Text className="text-[11px] font-black uppercase tracking-widest text-slate-700">
                  {typeof tag === "object" && tag !== null ? tag.name : tag}
                </Text>
              </View>
            ))}
          </MotiView>
        )}

        {/* Exercises List */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 350, delay: 150 }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[15px] font-black text-slate-800 uppercase tracking-widest">
              Exercises
            </Text>
            <View className="bg-indigo-600 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {template.exercises?.length || 0}
              </Text>
            </View>
          </View>

          {!template.exercises || template.exercises.length === 0 ? (
            <GlassCard contentContainerClassName="p-6 items-center">
              <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
                <Ionicons
                  name="fitness-outline"
                  size={32}
                  color={colors.indigo[400]}
                />
              </View>
              <Text className="text-lg font-bold text-slate-800 text-center mb-1">
                No Exercises Added
              </Text>
              <Text className="text-sm text-slate-500 font-medium text-center">
                There are no exercises currently listed for this template.
              </Text>
            </GlassCard>
          ) : (
            template.exercises.map((item: any, index: number) => (
              <GlassCard
                key={index}
                className="rounded-3xl mb-3 border border-white/60"
                contentContainerClassName="p-4 flex-row items-center"
              >
                <View className="w-16 h-16 bg-slate-100 rounded-2xl items-center justify-center mr-4 border border-slate-200 overflow-hidden">
                  {item.exerciseId?.thumbnailUrl ? (
                    <Image
                      source={{ uri: item.exerciseId.thumbnailUrl }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons
                      name="barbell"
                      size={26}
                      color={colors.indigo[400]}
                    />
                  )}
                </View>

                <View className="flex-1 justify-center">
                  <Text
                    className="font-bold text-slate-800 text-[16px] mb-1.5 leading-snug"
                    numberOfLines={2}
                  >
                    {item.exerciseId?.name || "Unknown Exercise"}
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    <View className="flex-row items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
                      <Ionicons
                        name="repeat"
                        size={12}
                        color={colors.indigo[600]}
                      />
                      <Text className="text-[11px] font-black uppercase text-indigo-700 tracking-wider">
                        {item.defaultSets || 0} Sets × {item.defaultReps || 0}{" "}
                        Reps
                      </Text>
                    </View>

                    {(item.holdTimeSecs || 0) > 0 && (
                      <View className="flex-row items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        <Ionicons
                          name="timer-outline"
                          size={12}
                          color={colors.emerald[600]}
                        />
                        <Text className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                          {item.holdTimeSecs}s Hold
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </GlassCard>
            ))
          )}
        </MotiView>
      </ScrollView>
    );
  };

  return (
    <GradientBackground>
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top + (Platform.OS === "android" ? 16 : 0),
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-2 mb-2 justify-between z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>

          <Text
            className="text-xl font-black text-slate-800 flex-1 ml-4"
            numberOfLines={1}
          >
            Template
          </Text>

          {template &&
            !(template.creatorModel === "Admin" || template.isSystem) && (
              <View className="flex-row items-center gap-2">
                <Button
                  // title="Delete"
                  onPress={handleDeleteTemplate}
                  disabled={deleting}
                  loading={deleting}
                  leftIcon="trash"
                  leftIconSize={16}
                  className="bg-red-500 p-2.5 rounded-xl items-center justify-center mr-0"
                  leftIconColor="white"
                />
                <Button
                  // title="Delete"
                  onPress={() =>
                    router.push(
                      `/workouts-templates/manage?editId=${template._id}`,
                    )
                  }
                  disabled={deleting}
                  loading={deleting}
                  leftIcon="pencil"
                  leftIconSize={16}
                  className="bg-indigo-500 p-2.5 rounded-xl items-center justify-center mr-0"
                  leftIconColor="white"
                />
              </View>
            )}
        </View>

        {renderContent()}

        {/* Floating Action Button for using template */}
        {!loading && !isError && template && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 350, delay: 250 }}
            className="absolute bottom-6 left-6 right-6"
            style={{ paddingBottom: insets.bottom }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("Use this template");
              }}
              activeOpacity={0.8}
              className="bg-slate-800 rounded-2xl py-4 shadow-xl shadow-slate-300 flex-row justify-center items-center"
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white font-bold text-[16px] tracking-wide">
                Use Template
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </View>
    </GradientBackground>
  );
}
