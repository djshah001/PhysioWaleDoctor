import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { GlassCard } from "../ui/premium/GlassCard";
import { prescriptionsApi } from "~/apis/prescriptions";
import { Exercise } from "~/types/models";
import { Image } from "expo-image";
import { ScrollView } from "react-native-actions-sheet";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
}

export const AddExerciseModal = ({
  visible,
  onClose,
  onAdd,
}: AddExerciseModalProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const sheetRef = React.useRef<ActionSheetRef>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.show();
      if (exercises.length === 0) fetchExercises();
    } else {
      sheetRef.current?.hide();
    }
  }, [visible]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await prescriptionsApi.getExercises();
      setExercises(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load exercises", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    const query = searchQuery.toLowerCase();
    const matchName = ex.name.toLowerCase().includes(query);
    const matchCategory = ex.category?.toLowerCase().includes(query) || false;
    const matchMuscle =
      ex.targetMuscleGroups?.some((m) => m.toLowerCase().includes(query)) ||
      false;
    const matchEquipment =
      ex.equipmentNeeded?.some((e) => e.toLowerCase().includes(query)) || false;

    return matchName || matchCategory || matchMuscle || matchEquipment;
  });

  return (
    <ActionSheet
      ref={sheetRef}
      onClose={onClose}
      gestureEnabled={true}
      indicatorStyle={{ backgroundColor: colors.slate[300], width: 40 }}
      containerStyle={{ height: "90%", backgroundColor: colors.slate[50] }}
    >
      <View className="flex-1 bg-slate-50">
        <View className="flex-row items-center justify-between p-4 pt-2 border-b border-slate-200 bg-white rounded-t-3xl">
          <Text className="text-xl font-bold text-slate-800">
            Exercise Catalog
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 bg-slate-100 rounded-full"
          >
            <Ionicons name="close" size={20} color={colors.slate[600]} />
          </TouchableOpacity>
        </View>

        <View className="p-4 bg-white z-10">
          <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 border border-slate-200">
            <Ionicons name="search" size={20} color={colors.slate[400]} />
            <TextInput
              className="flex-1 ml-2 text-slate-800 font-medium"
              placeholder="Search catalog..."
              placeholderTextColor={colors.slate[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View className="flex-1 px-4 pt-2" style={{ minHeight: 400 }}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.indigo[500]}
              className="mt-8"
            />
          ) : filteredExercises.length === 0 ? (
            <Text className="text-center text-slate-500 mt-8">
              No exercises found.
            </Text>
          ) : (
            <FlashList
              data={filteredExercises}
              showsVerticalScrollIndicator={false}
              renderScrollComponent={ScrollView}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item: ex }) => (
                <View className="mb-3 rounded-2xl border border-slate-300 bg-white shadow-md shadow-slate-200 p-3 flex-row items-center">
                  {ex.thumbnailUrl ? (
                    <Image
                      source={{ uri: ex.thumbnailUrl }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        marginRight: 12,
                      }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="w-[60px] h-[60px] bg-slate-100 rounded-xl mr-3 items-center justify-center">
                      <Ionicons
                        name="fitness"
                        size={28}
                        color={colors.slate[400]}
                      />
                    </View>
                  )}
                  <View className="flex-1 justify-center mr-2">
                    <Text
                      className="text-slate-800 font-bold text-base mb-1"
                      numberOfLines={2}
                    >
                      {ex.name}
                    </Text>
                    {ex.targetMuscleGroups &&
                      ex.targetMuscleGroups.length > 0 && (
                        <Text
                          className="text-slate-400 text-xs font-medium"
                          numberOfLines={1}
                        >
                          {ex.targetMuscleGroups.join(", ")}
                        </Text>
                      )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      onAdd(ex);
                      onClose();
                    }}
                    className="bg-indigo-600 rounded-full w-10 h-10 items-center justify-center shadow-sm shadow-indigo-200"
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ActionSheet>
  );
};
