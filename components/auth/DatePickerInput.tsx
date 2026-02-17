import React, { useState } from "react";
import { View, Text, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "../ui/button";
import RNDateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerInputProps {
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  label?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  error,
  label = "Date of Birth",
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const maxDate = new Date(2010, 11, 31);
  const minDate = new Date(1950, 0, 1);

  return (
    <View className="gap-2">
      <Text className="text-white ml-1 font-pmedium">{label}</Text>

      <Button
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          setShow(true);
        }}
        className="overflow-hidden rounded-2xl border-0 p-0 bg-white/5"
      >
        <BlurView
          intensity={20}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          className={`flex-1 flex-row items-center justify-between p-4 border rounded-2xl overflow-hidden ${
            error ? "border-red-500" : "border-white/10"
          } bg-white/5`}
        >
          <View className="flex-1 flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={value ? "#fb7185" : "#94a3b8"}
            />
            <Text
              className={`font-pregular ${value ? "text-white" : "text-slate-400"}`}
            >
              {formatDate(value) || "Select Date"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#94a3b8"
          />
        </BlurView>
      </Button>

      {error && (
        <Animated.Text
          entering={FadeIn}
          className="text-red-400 text-xs ml-1 font-pregular"
        >
          {error}
        </Animated.Text>
      )}

      {/* Date Picker */}
      {show && (
        <RNDateTimePicker
          value={value || new Date(2000, 0, 1)}
          mode="date"
          // design="material"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={maxDate}
          minimumDate={minDate}
          themeVariant="dark"
          accentColor="#fb7185"
          textColor="#ffffff"
        />
      )}
    </View>
  );
};

export default DatePickerInput;
