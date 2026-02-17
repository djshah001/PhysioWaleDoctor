import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DaySchedule, Shift } from "~/types";
import { Switch } from "react-native";
import colors from "tailwindcss/colors";

interface ClinicTimingsProps {
  open24hrs: boolean;
  setOpen24hrs: (value: boolean) => void;
  timing: {
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
  };
  setTiming: (value: any) => void;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

// Utility function to convert 24-hour format to 12-hour format
const formatTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const ClinicTimings: React.FC<ClinicTimingsProps> = ({
  open24hrs,
  setOpen24hrs,
  timing,
  setTiming,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedShiftIndex, setSelectedShiftIndex] = useState<number | null>(
    null,
  );
  const [timePickerMode, setTimePickerMode] = useState<"open" | "close" | null>(
    null,
  );
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  const toggleDayClosed = (day: string) => {
    setTiming({
      ...timing,
      [day]: {
        ...timing[day as keyof typeof timing],
        isClosed: !timing[day as keyof typeof timing].isClosed,
      },
    });
  };

  const addShift = (day: string) => {
    const currentShifts = timing[day as keyof typeof timing].shifts || [];
    setTiming({
      ...timing,
      [day]: {
        ...timing[day as keyof typeof timing],
        shifts: [...currentShifts, { open: "09:00", close: "18:00" }],
      },
    });
  };

  const removeShift = (day: string, shiftIndex: number) => {
    const currentShifts = timing[day as keyof typeof timing].shifts || [];
    setTiming({
      ...timing,
      [day]: {
        ...timing[day as keyof typeof timing],
        shifts: currentShifts.filter((_, index) => index !== shiftIndex),
      },
    });
  };

  const openTimePicker = (
    day: string,
    shiftIndex: number,
    mode: "open" | "close",
  ) => {
    setSelectedDay(day);
    setSelectedShiftIndex(shiftIndex);
    setTimePickerMode(mode);

    // Set initial time based on existing value
    const existingTime =
      timing[day as keyof typeof timing].shifts[shiftIndex][mode];
    if (existingTime) {
      const [hours, minutes] = existingTime.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      setTempTime(date);
    } else {
      setTempTime(new Date());
    }

    setTimePickerVisible(true);
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setTimePickerVisible(false);
    }

    if (event.type === "dismissed") {
      setTimePickerVisible(false);
      setSelectedDay(null);
      setSelectedShiftIndex(null);
      setTimePickerMode(null);
      return;
    }

    if (
      selectedDate &&
      selectedDay &&
      selectedShiftIndex !== null &&
      timePickerMode
    ) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      const daySchedule = timing[selectedDay as keyof typeof timing];
      const updatedShifts = [...daySchedule.shifts];
      updatedShifts[selectedShiftIndex] = {
        ...updatedShifts[selectedShiftIndex],
        [timePickerMode]: timeString,
      };

      setTiming({
        ...timing,
        [selectedDay]: {
          ...daySchedule,
          shifts: updatedShifts,
        },
      });

      if (Platform.OS === "ios") {
        setTempTime(selectedDate);
      } else {
        setTimePickerVisible(false);
        setSelectedDay(null);
        setSelectedShiftIndex(null);
        setTimePickerMode(null);
      }
    }
  };

  const confirmIOSTime = () => {
    setTimePickerVisible(false);
    setSelectedDay(null);
    setSelectedShiftIndex(null);
    setTimePickerMode(null);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5 mb-6"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Operating Hours
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Set your clinic's weekly schedule with multiple shifts per day
        </Text>
      </View>

      {/* 24/7 Toggle */}
      <View
        className={`p-4 rounded-2xl border flex-row items-center justify-between ${
          open24hrs
            ? "bg-indigo-50 border-indigo-500"
            : "bg-white border-gray-200"
        }`}
      >
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="clock-time-four"
            size={24}
            color={open24hrs ? "#4f46e5" : "#6b7280"}
          />
          <View>
            <Text
              className={`font-semibold ${
                open24hrs ? "text-indigo-700" : "text-gray-700"
              }`}
            >
              Open 24/7
            </Text>
            <Text className="text-gray-500 text-xs font-medium">
              Clinic operates round the clock
            </Text>
          </View>
        </View>
        <Switch
          value={open24hrs}
          onValueChange={setOpen24hrs}
          trackColor={{ false: colors.gray[200], true: colors.indigo[500] }}
          thumbColor={open24hrs ? colors.white : colors.gray[200]}
        />
      </View>

      {/* Weekly Schedule */}
      {!open24hrs && (
        <ScrollView className="gap-3" showsVerticalScrollIndicator={false}>
          {DAYS.map((day) => {
            const daySchedule = timing[day];
            return (
              <View
                key={day}
                className="bg-white border border-gray-200 rounded-2xl p-4 mb-2 shadow-sm shadow-gray-100"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-800 font-semibold text-base">
                    {DAY_LABELS[day]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleDayClosed(day)}
                    className={`px-3 py-1.5 rounded-full ${
                      daySchedule.isClosed
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        daySchedule.isClosed ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {daySchedule.isClosed ? "Closed" : "Open"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!daySchedule.isClosed && (
                  <View className="gap-3">
                    {/* Shifts */}
                    {daySchedule.shifts.map((shift, shiftIndex) => (
                      <View
                        key={shiftIndex}
                        className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-gray-600 text-xs font-semibold">
                            Shift {shiftIndex + 1}
                          </Text>
                          {daySchedule.shifts.length > 1 && (
                            <TouchableOpacity
                              onPress={() => removeShift(day, shiftIndex)}
                              className="p-1"
                            >
                              <MaterialCommunityIcons
                                name="close-circle"
                                size={18}
                                color="#ef4444"
                              />
                            </TouchableOpacity>
                          )}
                        </View>

                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() =>
                              openTimePicker(day, shiftIndex, "open")
                            }
                            className="flex-1 bg-white border border-gray-200 rounded-lg p-2 flex-row items-center gap-2"
                            activeOpacity={0.7}
                          >
                            <MaterialCommunityIcons
                              name="clock-start"
                              size={16}
                              color="#4f46e5"
                            />
                            <View className="flex-1">
                              <Text className="text-gray-500 text-xs">
                                Open
                              </Text>
                              <Text className="text-gray-900 font-semibold text-sm">
                                {formatTo12Hour(shift.open)}
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              openTimePicker(day, shiftIndex, "close")
                            }
                            className="flex-1 bg-white border border-gray-200 rounded-lg p-2 flex-row items-center gap-2"
                            activeOpacity={0.7}
                          >
                            <MaterialCommunityIcons
                              name="clock-end"
                              size={16}
                              color="#ef4444"
                            />
                            <View className="flex-1">
                              <Text className="text-gray-500 text-xs">
                                Close
                              </Text>
                              <Text className="text-gray-900 font-semibold text-sm">
                                {formatTo12Hour(shift.close)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    {/* Add Shift Button */}
                    <TouchableOpacity
                      onPress={() => addShift(day)}
                      className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex-row items-center justify-center gap-2"
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name="plus-circle"
                        size={20}
                        color="#4f46e5"
                      />
                      <Text className="text-indigo-600 font-semibold text-sm">
                        Add Another Shift
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Time Picker */}
      {timePickerVisible && (
        <>
          {Platform.OS === "ios" ? (
            <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl">
              <Text className="text-gray-900 font-semibold mb-3">
                Select {timePickerMode} time
              </Text>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
                textColor="#000000"
              />
              <TouchableOpacity
                onPress={confirmIOSTime}
                className="bg-indigo-600 rounded-xl p-3 mt-3"
              >
                <Text className="text-white font-semibold text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <DateTimePicker
              value={tempTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </>
      )}
    </Animated.View>
  );
};

export default ClinicTimings;
