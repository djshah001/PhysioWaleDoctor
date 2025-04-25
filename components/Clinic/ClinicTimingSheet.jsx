import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Modal, Portal, Surface, Icon } from "react-native-paper";
import { BlurView } from "expo-blur";
import colors from "../../constants/colors";
import { MotiView } from "moti";
import { cssInterop } from "nativewind";

cssInterop(Icon, { className: "style" });
cssInterop(Surface, { className: "style" });
cssInterop(Modal, { className: "style" });
cssInterop(BlurView, { className: "style" });
cssInterop(MotiView, { className: "style" });

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DEFAULT_TIMINGS = DAYS.reduce((acc, day) => {
  acc[day] = {
    isClosed: true,
    opening: "",
    closing: "",
  };
  return acc;
}, {});

const ClinicTimingSheet = ({
  visible,
  onDismiss,
  timings = DEFAULT_TIMINGS,
  open24hrs = false,
}) => {
  // Get current day
  const today = new Date()
    .toLocaleString("en-us", { weekday: "long" })
    .toLowerCase();

  // Ensure timings is a valid object with expected structure
  const safeTimings = React.useMemo(() => {
    // If timings is not an object or is null, use default
    if (typeof timings !== "object" || timings === null) {
      return DEFAULT_TIMINGS;
    }

    // Create a new object with default values for any missing days
    return DAYS.reduce((acc, day) => {
      // Use the provided timing for this day if it exists, otherwise use default
      acc[day] = {
        isClosed: timings[day]?.isClosed ?? true,
        opening: timings[day]?.opening || "",
        closing: timings[day]?.closing || "",
      };
      return acc;
    }, {});
  }, [timings]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        className="flex-1 justify-end"
      >
        {/* <BlurView intensity={20} tint="light" className="flex-1 justify-end"> */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          className="mx-5 mb-8"
        >
          <Surface className="rounded-3xl bg-white-100 overflow-hidden shadow-md">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white-200">
              <Text className="text-lg font-pbold text-black-400">
                Clinic Hours
              </Text>
              <TouchableOpacity onPress={onDismiss} className="p-1">
                <Icon source="close" size={24} color={colors.black[300]} />
              </TouchableOpacity>
            </View>

            {open24hrs ? (
              <View className="p-8 items-center justify-center">
                <View className="bg-secondary-100/50 p-4 rounded-full">
                  <Icon
                    source="clock-time-four"
                    size={40}
                    color={colors.secondary[300]}
                  />
                </View>
                <Text className="text-2xl font-pbold text-secondary-300 mt-4">
                  Open 24 Hours
                </Text>
                <Text className="text-sm font-osregular text-black-300 text-center mt-2">
                  This clinic is available all day, every day
                </Text>
              </View>
            ) : (
              <View className="p-4">
                {DAYS.map((day) => {
                  const isToday = day === today;
                  const dayData = safeTimings[day] || { isClosed: true };
                  const isClosed = dayData.isClosed;

                  return (
                    <MotiView
                      key={day}
                      from={{ opacity: 0, translateX: -10 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{
                        delay: DAYS.indexOf(day) * 50,
                        type: "timing",
                        duration: 300,
                      }}
                      className={`flex-row justify-between items-center py-3 border-b border-gray-100 mb-1 ${
                        isToday
                          ? "bg-secondary-100/30 rounded-lg px-2 my-1"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center">
                        {isToday && (
                          <View className="w-2 h-2 rounded-full bg-secondary-300 mr-2" />
                        )}
                        <Text
                          className={`text-base ${
                            isToday
                              ? "font-ossemibold text-secondary-300"
                              : "font-ossemibold text-black-300"
                          }`}
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                          {day === today && " (Today)"}
                        </Text>
                      </View>

                      <View
                        className={`px-3 py-1 rounded-lg ${
                          isClosed ? "bg-gray-100/40" : "bg-secondary-100/30"
                        }`}
                      >
                        <Text
                          className={`text-base ${
                            isClosed
                              ? "text-gray-400 font-osregular"
                              : isToday
                              ? "text-secondary-300 font-ossemibold"
                              : "text-black-300 font-osregular"
                          }`}
                        >
                          {isClosed
                            ? "Closed"
                            : `${dayData.opening || "N/A"} - ${
                                dayData.closing || "N/A"
                              }`}
                        </Text>
                      </View>
                    </MotiView>
                  );
                })}
              </View>
            )}
          </Surface>
        </MotiView>
        {/* </BlurView> */}
      </Modal>
    </Portal>
  );
};

export default ClinicTimingSheet;
