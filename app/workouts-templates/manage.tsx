import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { MotiView } from "moti";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import api from "~/apis/api";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useCallback, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { ScrollView as SV } from "react-native-actions-sheet";
import { Image } from "expo-image";
import { Button } from "~/components/ui/button";
import { PremiumInput } from "~/components/ui/premium/PremiumInput";
import { useToast } from "~/store/toastStore";
import {
  useCreateTemplate,
  useUpdateTemplate,
  useTemplateDetails,
} from "~/apis/hooks/useTemplates";

export default function ManageTemplateScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: templateData, isLoading: loadingTemplate } = useTemplateDetails(
    editId as string,
    {
      enabled: !!editId,
    },
  );

  const { mutateAsync: createTemplate, isPending: creating } =
    useCreateTemplate();
  const { mutateAsync: updateTemplate, isPending: updating } =
    useUpdateTemplate();

  const loading = loadingTemplate || creating || updating;

  React.useEffect(() => {
    if (templateData) {
      setName(templateData.name || "");
      setDescription(templateData.description || "");
      const mappedEx = (templateData.exercises || []).map((ex: any) => ({
        exerciseId: ex.exerciseId?._id || ex.exerciseId,
        name: ex.exerciseId?.name || "Unknown Exercise",
        description: ex.exerciseId?.description || "",
        thumbnailUrl: ex.exerciseId?.thumbnailUrl || null,
        defaultSets: ex.defaultSets || 0,
        defaultReps: ex.defaultReps || 0,
        holdTimeSecs: ex.holdTimeSecs || 0,
      }));
      setSelectedExercises(mappedEx);
    }
  }, [templateData]);

  // Exercise Selection State
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Bottom Sheet Ref
  const actionSheetRef = useRef<ActionSheetRef>(null);

  // Callbacks
  const handlePresentModalPress = useCallback(() => {
    actionSheetRef.current?.show();
    if (availableExercises.length === 0) fetchExercises();
  }, [availableExercises.length]);

  const handleCloseModalPress = useCallback(() => {
    actionSheetRef.current?.hide();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoadingExercises(true);
      const res = await api.get<{ success: boolean; data: any }>("/exercises");
      const data = res.data?.data || [];
      const exercisesList = Array.isArray(data)
        ? data
        : data.exercises || data.items || [];
      setAvailableExercises(exercisesList);
    } catch (err) {
      console.error("Failed to load library exercises:", err);
      Alert.alert("Error", "Could not load the exercise library.");
    } finally {
      setLoadingExercises(false);
    }
  };

  const toggleExerciseSelection = (exercise: any) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.find((e) => e.exerciseId === exercise._id);
      if (isSelected) {
        return prev.filter((e) => e.exerciseId !== exercise._id);
      }
      return [
        ...prev,
        {
          exerciseId: exercise._id,
          name: exercise.name,
          description: exercise.description,
          thumbnailUrl: exercise.thumbnailUrl,
          defaultSets: 3,
          defaultReps: 10,
          holdTimeSecs: 0,
        },
      ];
    });
  };

  const handleRemoveSelected = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.filter((e) => e.exerciseId !== exerciseId),
    );
  };

  const updateExerciseParam = (index: number, field: string, value: number) => {
    setSelectedExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const moveExerciseUp = (index: number) => {
    if (index === 0) return;
    setSelectedExercises((prev) => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveExerciseDown = (index: number) => {
    if (index === selectedExercises.length - 1) return;
    setSelectedExercises((prev) => {
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("error", "Please provide a template name.");
      return;
    }

    if (selectedExercises.length === 0) {
      showToast(
        "error",
        "Please attach at least one exercise to the template.",
      );
      return;
    }

    try {
      // Map the selected exercises to the precise backend creation payload format
      const formattedExercises = selectedExercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps,
        defaultDurationSecs: 0,
        holdTimeSecs: ex.holdTimeSecs,
        restTimeSecs: 30,
        notes: "",
      }));

      if (editId) {
        await updateTemplate({
          id: editId as string,
          data: {
            name,
            description,
            exercises: formattedExercises,
          },
        });
        showToast("success", "Template updated successfully");
      } else {
        await createTemplate({
          name,
          description,
          exercises: formattedExercises,
        });
        showToast("success", "Template created successfully");
      }

      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to save template.",
      );
    }
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
        <View className="flex-row items-center px-4 py-2 mb-4 justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center mr-3"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-black text-slate-800">
              {editId ? "Edit Template" : "New Template"}
            </Text>
          </View>
          <Button
            title="Save"
            onPress={handleSave}
            disabled={name.trim() === "" || selectedExercises.length === 0}
            className={`px-4 py-2 rounded-2xl flex-row items-center justify-center bg-indigo-500`}
            loading={loading}
            rightIcon={"arrow-forward"}
            rightIconSize={18}
          />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 80,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 350 }}
            className="mb-6"
          >
            <GlassCard className="rounded-3xl" contentContainerClassName="p-5">
              {/* Form Fields */}
              <View className="mb-2">
                <PremiumInput
                  label="Template Name *"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Back Pain Rehab Phase 1"
                />
              </View>

              <View className="mb-2">
                <PremiumInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe the clinical focus..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View className="mt-2">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Exercises ({selectedExercises.length})
                  </Text>
                  {selectedExercises.length > 0 && (
                    <Button
                      title="Add More "
                      onPress={handlePresentModalPress}
                      className="bg-indigo-600 text-white px-2 py-1 rounded-full"
                      textClassName="text-sm"
                      leftIcon={"add"}
                      leftIconSize={16}
                    />
                  )}
                </View>

                {selectedExercises.length === 0 ? (
                  <TouchableOpacity
                    onPress={handlePresentModalPress}
                    className="border-2 border-dashed border-indigo-300 bg-indigo-50/50 rounded-2xl py-6 items-center justify-center"
                  >
                    <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mb-3">
                      <Ionicons
                        name="add"
                        size={24}
                        color={colors.indigo[600]}
                      />
                    </View>
                    <Text className="text-indigo-700 font-bold text-[15px]">
                      Select Exercises
                    </Text>
                    <Text className="text-slate-400 text-xs mt-1 text-center px-4">
                      Browse your library and add items to this template
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="gap-3">
                    {selectedExercises.map((ex, index) => (
                      <View
                        key={ex.exerciseId || index}
                        className="bg-white/60 border border-slate-200 rounded-2xl overflow-hidden mb-2"
                      >
                        <View className="flex-row items-center p-3 relative">
                          <View className="w-12 h-12 bg-slate-100 rounded-lg mr-3 items-center justify-center overflow-hidden">
                            {ex.thumbnailUrl ? (
                              <Image
                                source={{ uri: ex.thumbnailUrl }}
                                className="w-full h-full"
                                contentFit="cover"
                              />
                            ) : (
                              <Ionicons
                                name="body"
                                size={20}
                                color={colors.slate[400]}
                              />
                            )}
                          </View>
                          <View className="flex-1 justify-center">
                            <Text
                              className="font-bold text-slate-800 text-sm leading-tight mb-1"
                              numberOfLines={1}
                            >
                              {ex.name}
                            </Text>
                            <Text
                              className="text-slate-500 font-medium text-[11px]"
                              numberOfLines={1}
                            >
                              {ex.description || "No description"}
                            </Text>
                          </View>

                          <View className="flex-row items-center gap-1 ml-4 justify-end">
                            <View className="flex-col gap-1">
                              <TouchableOpacity
                                onPress={() => moveExerciseUp(index)}
                                disabled={index === 0}
                                className={`p-1.5 rounded-lg ${index === 0 ? "bg-slate-50" : "bg-slate-100"}`}
                              >
                                <Ionicons
                                  name="chevron-up"
                                  size={14}
                                  color={
                                    index === 0
                                      ? colors.slate[300]
                                      : colors.slate[600]
                                  }
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => moveExerciseDown(index)}
                                disabled={
                                  index === selectedExercises.length - 1
                                }
                                className={`p-1.5 rounded-lg ${index === selectedExercises.length - 1 ? "bg-slate-50" : "bg-slate-100"}`}
                              >
                                <Ionicons
                                  name="chevron-down"
                                  size={14}
                                  color={
                                    index === selectedExercises.length - 1
                                      ? colors.slate[300]
                                      : colors.slate[600]
                                  }
                                />
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              onPress={() =>
                                handleRemoveSelected(ex.exerciseId)
                              }
                              className="p-2.5 bg-red-50 rounded-lg ml-1"
                            >
                              <Ionicons
                                name="trash-outline"
                                size={18}
                                color={colors.red[500]}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Reps/Sets Controls */}
                        <View className="flex-row items-center justify-between border-t border-slate-100 p-3 bg-slate-50/50">
                          <View className="flex-row flex-1 gap-4">
                            <View className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
                              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                Sets
                              </Text>
                              <TextInput
                                value={String(ex.defaultSets || 0)}
                                onChangeText={(val) =>
                                  updateExerciseParam(
                                    index,
                                    "defaultSets",
                                    parseInt(val) || 0,
                                  )
                                }
                                keyboardType="numeric"
                                className="font-black text-slate-800 text-[15px] p-0"
                              />
                            </View>
                            <View className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
                              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                Reps
                              </Text>
                              <TextInput
                                value={String(ex.defaultReps || 0)}
                                onChangeText={(val) =>
                                  updateExerciseParam(
                                    index,
                                    "defaultReps",
                                    parseInt(val) || 0,
                                  )
                                }
                                keyboardType="numeric"
                                className="font-black text-slate-800 text-[15px] p-0"
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </GlassCard>
          </MotiView>
        </ScrollView>
      </View>

      {/* Exercise Selection Action Sheet */}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          backgroundColor: "#f8fafc",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          height: "85%",
        }}
        indicatorStyle={{
          backgroundColor: colors.slate[300],
          width: 40,
          height: 4,
        }}
        gestureEnabled
        keyboardHandlerEnabled
      >
        <View className="flex-1 px-4 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4 px-2">
            <Text className="text-xl font-black text-slate-800">
              Exercise Library
            </Text>
            <TouchableOpacity
              onPress={handleCloseModalPress}
              className="bg-slate-200/70 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color={colors.slate[600]} />
            </TouchableOpacity>
          </View>

          <View className="px-2 mb-4">
            <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <Ionicons
                name="search"
                size={20}
                color={colors.slate[400]}
                className="mr-2"
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search exercises..."
                placeholderTextColor={colors.slate[400]}
                className="flex-1 font-medium text-slate-800 text-[15px] p-0"
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.slate[300]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {loadingExercises ? (
            <View className="flex-1 items-center justify-center mt-10">
              <ActivityIndicator size="large" color={colors.indigo[600]} />
              <Text className="text-slate-500 font-medium mt-4">
                Loading library...
              </Text>
            </View>
          ) : (
            <FlashList
              renderScrollComponent={SV}
              keyboardShouldPersistTaps="handled"
              {...({
                data: availableExercises.filter(
                  (ex) =>
                    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (ex.description &&
                      ex.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
                ),
                estimatedItemSize: 80,
                showsVerticalScrollIndicator: false,
                keyExtractor: (item: any) => item._id,
                contentContainerStyle: { paddingBottom: insets.bottom + 40 },
              } as any)}
              ListEmptyComponent={
                <View className="items-center justify-center py-10 mt-10">
                  <Ionicons
                    name="barbell-outline"
                    size={48}
                    color={colors.slate[300]}
                    className="mb-4"
                  />
                  <Text className="text-slate-500 font-medium">
                    No exercises found.
                  </Text>
                </View>
              }
              renderItem={({ item }: { item: any }) => {
                const isSelected = selectedExercises.some(
                  (e: any) => e.exerciseId === item._id,
                );
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleExerciseSelection(item)}
                    className={`flex-row items-center p-3 mb-3 border rounded-2xl ${isSelected ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200 bg-white"}`}
                  >
                    <View className="w-14 h-14 rounded-xl bg-slate-100 mr-4 items-center justify-center overflow-hidden border border-slate-100">
                      {item.thumbnailUrl ? (
                        <Image
                          source={{ uri: item.thumbnailUrl }}
                          className="w-full h-full"
                          contentFit="cover"
                        />
                      ) : (
                        <Ionicons
                          name="body"
                          size={24}
                          color={colors.slate[300]}
                        />
                      )}
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="font-bold text-slate-800 text-[15px] mb-1 leading-snug">
                        {item.name}
                      </Text>
                      <Text
                        className="text-slate-500 text-xs font-medium"
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-full border items-center justify-center ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </ActionSheet>
    </GradientBackground>
  );
}
