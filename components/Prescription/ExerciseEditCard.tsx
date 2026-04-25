import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { Image } from "expo-image";

interface ExerciseEditCardProps {
  exercise: any;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
}

export const ExerciseEditCard = ({
  exercise,
  onUpdate,
  onRemove,
}: ExerciseEditCardProps) => {
  return (
    <View className="bg-white/60 rounded-2xl p-4 mb-3 border border-white/80 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row flex-1 mr-2">
          {exercise.thumbnailUrl ? (
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                marginRight: 12,
              }}
              contentFit="cover"
            />
          ) : (
            <View className="w-[50px] h-[50px] bg-slate-100 rounded-xl mr-3 items-center justify-center">
              <Ionicons name="fitness" size={24} color={colors.slate[400]} />
            </View>
          )}
          <View className="flex-1 justify-center">
            <Text
              className="text-slate-800 font-bold text-base mb-1"
              numberOfLines={2}
            >
              {exercise.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onRemove} className="p-1" hitSlop={10}>
          <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3 pt-3 border-t border-slate-200/50">
        <View className="flex-1">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Sets
          </Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2 text-slate-800 font-bold text-center border border-slate-100"
            value={String(exercise.targetSets || "")}
            onChangeText={(val) => onUpdate("targetSets", val)}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View className="flex-1">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Reps
          </Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2 text-slate-800 font-bold text-center border border-slate-100"
            value={String(exercise.targetReps || "")}
            onChangeText={(val) => onUpdate("targetReps", val)}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View className="flex-[1.5]">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Hold (sec)
          </Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2 text-slate-800 font-bold text-center border border-slate-100"
            value={String(exercise.holdTimeSecs || "")}
            onChangeText={(val) => onUpdate("holdTimeSecs", val)}
            keyboardType="numeric"
            maxLength={3}
            placeholder="-"
          />
        </View>
      </View>
    </View>
  );
};
