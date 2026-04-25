import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { TemplateCard } from "~/components/Prescription/TemplateCard";
import { ExerciseEditCard } from "~/components/Prescription/ExerciseEditCard";
import { AddExerciseModal } from "~/components/Prescription/AddExerciseModal";
import { Template, TestResult, Exercise } from "~/types/models";
import { clinicalApi } from "~/apis/clinical";
import { prescriptionsApi } from "~/apis/prescriptions";
import { Button } from "~/components/ui/button";
import { useToast } from "~/store/toastStore";

export default function PrescribeScreen() {
  const { id, testResultId } = useLocalSearchParams<{
    id: string;
    testResultId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data States
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Form States
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [activeExercises, setActiveExercises] = useState<any[]>([]);
  const [isAddExerciseVisible, setIsAddExerciseVisible] = useState(false);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState("5");
  const [durationWeeks, setDurationWeeks] = useState("4");
  const [title, setTitle] = useState("Recovery Plan");

  // Generate a unique ID for the UI exercise list since a user might add the same exercise twice
  const generateTempId = () => Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await prescriptionsApi.getTemplates();
      setTemplates(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.targetArea &&
        t.targetArea.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    if (template.name) setTitle(`${template.name} Plan`);

    // Map template exercises into editable state
    const mappedExercises = template.exercises.map((ex) => {
      const exerciseData =
        typeof ex.originalExerciseId === "string"
          ? { _id: ex.originalExerciseId, name: "Loading..." }
          : ex.exerciseId;

      return {
        _tempId: generateTempId(),
        ...exerciseData,
        targetSets: ex.targetSets || 3,
        targetReps: ex.targetReps || 10,
        holdTimeSecs: ex.holdTimeSecs || "",
      };
    });

    setActiveExercises(mappedExercises);
  };

  const handleUpdateExercise = (
    tempId: string,
    field: string,
    value: string,
  ) => {
    setActiveExercises((prev) =>
      prev.map((ex) =>
        ex._tempId === tempId ? { ...ex, [field]: value } : ex,
      ),
    );
  };

  const handleRemoveExercise = (tempId: string) => {
    setActiveExercises((prev) => prev.filter((ex) => ex._tempId !== tempId));
  };

  const handleAddExercise = (exercise: Exercise) => {
    setActiveExercises((prev) => [
      ...prev,
      {
        _tempId: generateTempId(),
        ...exercise,
        targetSets: 3,
        targetReps: 10,
        holdTimeSecs: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedTemplate && activeExercises.length === 0) return;

    setLoading(true);
    try {
      const payloadExercises = activeExercises.map((ex) => ({
        originalExerciseId: ex._id,
        targetSets: parseInt(ex.targetSets) || 3,
        targetReps: parseInt(ex.targetReps) || 10,
        holdTimeSecs: ex.holdTimeSecs ? parseInt(ex.holdTimeSecs) : undefined,
      }));

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(durationWeeks) * 7);

      if (testResultId) {
        await clinicalApi.prescribeFromTest({
          testResultId,
          patientId: id as string,
          originalTemplateId: selectedTemplate?._id,
          title,
          frequencyPerWeek: parseInt(frequencyPerWeek),
          startDate: new Date().toISOString(),
          endDate: endDate.toISOString(),
          exercises: payloadExercises,
        });
      } else {
        await prescriptionsApi.assignPrescription({
          patientId: id as string,
          originalTemplateId: selectedTemplate?._id,
          title,
          frequencyPerWeek: parseInt(frequencyPerWeek),
          startDate: new Date().toISOString(),
          endDate: endDate.toISOString(),
          exercises: payloadExercises,
        });
      }

      showToast("success", "Prescription assigned successfully!");
      router.back();
    } catch (err: any) {
      console.error("Error prescribing:", err?.response?.data || err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed to assign prescription.",
      );
    } finally {
      setLoading(false);
    }
  };

  const RenderStepIndicator = () => (
    <View className="flex-row items-center justify-center mb-6 px-4">
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${step >= 1 ? "bg-indigo-500" : "bg-white/50"}`}
      >
        <Text
          className={`font-bold ${step >= 1 ? "text-white" : "text-slate-500"}`}
        >
          1
        </Text>
      </View>
      <View
        className={`h-1 w-8 rounded-full ${step >= 2 ? "bg-indigo-500" : "bg-white/50"}`}
      />
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${step >= 2 ? "bg-indigo-500" : "bg-white/50"}`}
      >
        <Text
          className={`font-bold ${step >= 2 ? "text-white" : "text-slate-500"}`}
        >
          2
        </Text>
      </View>
      <View
        className={`h-1 w-8 rounded-full ${step >= 3 ? "bg-indigo-500" : "bg-white/50"}`}
      />
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${step >= 3 ? "bg-indigo-500" : "bg-white/50"}`}
      >
        <Text
          className={`font-bold ${step >= 3 ? "text-white" : "text-slate-500"}`}
        >
          3
        </Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View className="flex-1">
      <Text className="text-xl font-bold text-slate-800 mb-2">
        Select a Template
      </Text>
      <Text className="text-slate-500 mb-4">
        Choose a workout template to assign to this patient.
      </Text>

      <View className="flex-row items-center bg-white/60 rounded-xl px-4 py-3 mb-4 border border-white/80">
        <Ionicons name="search" size={20} color={colors.slate[400]} />
        <TextInput
          className="flex-1 ml-2 text-slate-800 font-medium"
          placeholder="Search templates..."
          placeholderTextColor={colors.slate[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
        {filteredTemplates.length === 0 ? (
          <Text className="text-center text-slate-500 mt-4">
            No templates found.
          </Text>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              isSelected={selectedTemplate?._id === template._id}
              onPress={() => handleTemplateSelect(template)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        disabled={!selectedTemplate}
        onPress={() => setStep(2)}
        className={`rounded-2xl py-4 items-center ${selectedTemplate ? "bg-indigo-600" : "bg-slate-300"}`}
      >
        <Text className="text-white font-bold text-base">Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-slate-800">
            Edit Exercises
          </Text>
          <Text className="text-slate-500">Customize the prescription</Text>
        </View>
        <Button
          title="Add Exercise"
          leftIcon={"add"}
          className="bg-indigo-600 text-white rounded-full px-4 py-2"
          onPress={() => setIsAddExerciseVisible(true)}
        />
      </View>

      <ScrollView
        className="flex-1 mb-4"
        contentContainerClassName="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {activeExercises.length === 0 ? (
          <View className="items-center py-10">
            <Ionicons
              name="barbell-outline"
              size={48}
              color={colors.slate[300]}
            />
            <Text className="text-slate-500 mt-4 font-medium">
              No exercises added yet.
            </Text>
          </View>
        ) : (
          activeExercises.map((ex) => (
            <ExerciseEditCard
              key={ex._tempId}
              exercise={ex}
              onUpdate={(field, value) =>
                handleUpdateExercise(ex._tempId, field, value)
              }
              onRemove={() => handleRemoveExercise(ex._tempId)}
            />
          ))
        )}
      </ScrollView>

      <View className="flex-row gap-3 justify-between">
        <Button
          title="Back"
          onPress={() => setStep(1)}
          className=" bg-indigo-600 rounded-2xl px-4 py-4"
          leftIcon="arrow-back-outline"
        />
        <Button
          title="Continue"
          onPress={() => setStep(3)}
          disabled={activeExercises.length === 0}
          className=" bg-rose-500 rounded-2xl px-4 py-4"
          rightIcon="arrow-forward-outline"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <Text className="text-xl font-bold text-slate-800 mb-4">
        Finalize Plan
      </Text>

      <GlassCard className="rounded-3xl mb-4" contentContainerClassName="p-5">
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
          Prescription Overview
        </Text>
        <Text className="text-lg font-bold text-slate-800">{title}</Text>
        <Text className="text-slate-500 mt-1">
          {activeExercises.length} Custom Exercises
        </Text>
      </GlassCard>

      <GlassCard className="rounded-3xl mb-6" contentContainerClassName="p-5">
        <View className="mb-4">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Prescription Title
          </Text>
          <TextInput
            className="bg-white/60 rounded-xl px-4 py-3 text-slate-800 font-medium border border-white/80"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Knee Rehab Level 1"
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Days / Week
            </Text>
            <View className="bg-white/60 rounded-xl px-4 py-3 border border-white/80 flex-row items-center">
              <TextInput
                className="flex-1 text-slate-800 font-bold"
                value={frequencyPerWeek}
                onChangeText={setFrequencyPerWeek}
                keyboardType="numeric"
                maxLength={1}
              />
              <Text className="text-slate-400 font-medium text-xs">Days</Text>
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Duration
            </Text>
            <View className="bg-white/60 rounded-xl px-4 py-3 border border-white/80 flex-row items-center">
              <TextInput
                className="flex-1 text-slate-800 font-bold"
                value={durationWeeks}
                onChangeText={setDurationWeeks}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text className="text-slate-400 font-medium text-xs">Weeks</Text>
            </View>
          </View>
        </View>
      </GlassCard>

      <View className="flex-row gap-3 flex-1 justify-between">
        <Button
          title="Back"
          onPress={() => setStep(2)}
          className="flex-1 bg-indigo-600 rounded-2xl px-4 py-4"
          leftIcon="arrow-back-outline"
        />
        <Button
          title="Assign Prescription"
          onPress={handleSubmit}
          disabled={loading}
          className="flex-1 bg-rose-500 rounded-2xl px-4 py-4"
          rightIcon="checkmark-circle-outline"
        />
      </View>
    </ScrollView>
  );

  return (
    <GradientBackground>
      <View
        className="flex-1"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center px-4 py-3 pb-2 gap-3 z-10 mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 w-10 h-10 rounded-xl items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-800 flex-1">
            Assign Workout
          </Text>
          {testResultId && (
            <View className="bg-amber-100 px-2 py-1 rounded-full border border-amber-200">
              <Text className="text-amber-700 font-bold text-[10px] uppercase">
                From Review
              </Text>
            </View>
          )}
        </View>

        <RenderStepIndicator />

        <View className="flex-1 px-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        <AddExerciseModal
          visible={isAddExerciseVisible}
          onClose={() => setIsAddExerciseVisible(false)}
          onAdd={handleAddExercise}
        />
      </View>
    </GradientBackground>
  );
}
