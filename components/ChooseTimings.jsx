import React, { useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CustomInput from "./ReUsables/CustomInput";
import CustomBtn from "./CustomBtn";
import { Checkbox, Portal } from "react-native-paper";
import colors from "../constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";
import { format, parse } from "date-fns";

export function ChooseTimings({ data, setData }) {
  const [SameTime, setSameTime] = useState(false);
  const [ActiveDay, setActiveDay] = useState("sunday");
  const ItemRef = useRef([]);
  const [ShowTimePicker, setShowTimePicker] = useState(false);
  const [isOpeningTime, setIsOpeningTime] = useState(true);

  // Create a date object from a time string (h:mm a)
  const getTimeDate = (timeString) => {
    if (!timeString) return new Date();
    try {
      return parse(timeString, "h:mm a", new Date());
    } catch (error) {
      return new Date();
    }
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "dismissed" || !selectedDate) {
      setShowTimePicker(false);
      return;
    }

    // Format time as h:mm a (12-hour with AM/PM) for both storage and display
    const formattedTime = format(selectedDate, "h:mm a");

    setSameTime(false);
    setData((prev) => ({
      ...prev,
      open24hrs: false,
      timing: {
        ...prev.timing,
        [ActiveDay]: {
          ...prev.timing[ActiveDay],
          [isOpeningTime ? "opening" : "closing"]: formattedTime,
          isClosed: false,
        },
      },
    }));
    setShowTimePicker(false);
  };

  const updateOpen24HoursStatus = () => {
    setData((prev) => ({
      ...prev,
      open24hrs: !prev.open24hrs,
      timing: Object.keys(data.timing).reduce((acc, day) => {
        return {
          ...acc,
          [day]: {
            ...prev.timing[day],
            opening: "12:00 AM",
            closing: "11:59 PM",
            isClosed: false,
          },
        };
      }, {}),
    }));
  };

  const updateClosedStatus = () => {
    setSameTime(false);
    setData((prev) => ({
      ...prev,
      open24hrs: false,
      timing: {
        ...prev.timing,
        [ActiveDay]: {
          ...prev.timing[ActiveDay],
          isClosed: !prev.timing[ActiveDay].isClosed,
          opening: prev.timing[ActiveDay].opening || "09:00",
          closing: prev.timing[ActiveDay].closing || "18:00",
          openingDisplay: prev.timing[ActiveDay].openingDisplay || "9:00 AM",
          closingDisplay: prev.timing[ActiveDay].closingDisplay || "6:00 PM",
        },
      },
    }));
  };

  const applySameTimings = (bool) => {
    setSameTime(bool);
    if (bool === true) {
      const currentDayTimings = data.timing[ActiveDay];
      const updatedTimings = Object.keys(data.timing).reduce((acc, day) => {
        acc[day] = { ...currentDayTimings };
        return acc;
      }, {});
      setData((prev) => ({ ...prev, timing: updatedTimings }));
    }
  };

  // Get display time or convert from 24h format if not available
  const getDisplayTime = (day, timeType) => {
    const timeKey =
      timeType === "opening" ? "openingDisplay" : "closingDisplay";
    const timeValue = data.timing[day][timeType];

    if (data.timing[day][timeKey]) {
      return data.timing[day][timeKey];
    }

    if (!timeValue) return "";

    try {
      const date = parse(timeValue, "HH:mm", new Date());
      return format(date, "h:mm a");
    } catch (error) {
      return timeValue;
    }
  };

  return (
    <ScrollView contentContainerClassName="p-4 ">
      <Text className="text-center font-bold text-xl mb-2 ">
        Choose Timings 🎉
      </Text>
      <ScrollView
        horizontal
        contentContainerClassName=" gap-2 my-3 "
        showsHorizontalScrollIndicator={false}
      >
        {Object.keys(data.timing).map((item, index) => {
          return (
            <TouchableOpacity
              ref={(el) => (ItemRef.current[index] = el)}
              key={index}
              className={`${
                ActiveDay === item ? "bg-secondary-300" : "bg-white-500"
              } w-[90px] h-[50px] rounded-xl p-2 mr-3 items-center justify-center shadow-sm shadow-black-300 `}
              onPress={() => {
                setActiveDay(item);
              }}
            >
              <Text
                className={`text-center font-semibold ${
                  ActiveDay === item ? "text-white-200" : "text-black-200"
                } `}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View className=" p-4 gap-3  ">
        <Text className="font-ossemibold text-2xl text-center ">
          {ActiveDay.toUpperCase()}
        </Text>

        <CustomInput
          editable={false}
          label="Opening Time"
          value={data.timing[ActiveDay].opening || ""}
          leftIcon="clock-time-three-outline"
          rightIcon="arrow-top-right"
          rightPress={() => {
            setIsOpeningTime(true);
            setShowTimePicker(true);
          }}
          showRightIconBordered={true}
          placeholder="Select opening time"
        />

        <CustomInput
          editable={false}
          label="Closing Time"
          value={data.timing[ActiveDay].closing || ""}
          leftIcon="clock-time-three-outline"
          rightIcon="arrow-top-right"
          rightPress={() => {
            setIsOpeningTime(false);
            setShowTimePicker(true);
          }}
          showRightIconBordered={true}
          placeholder="Select closing time"
        />

        <View className="  self-center  ">
          <View className="flex-row items-center ">
            <Checkbox
              color={colors.secondary["300"]}
              status={data.open24hrs ? "checked" : "unchecked"}
              onPress={updateOpen24HoursStatus}
            />
            <Text className="font-osregular text-black-200 text-sm ">
              Open 24 Hours
            </Text>
          </View>

          <View className="flex-row items-center ">
            <Checkbox
              color={colors.accent["DEFAULT"]}
              status={
                data.timing[ActiveDay]?.isClosed ? "checked" : "unchecked"
              }
              onPress={updateClosedStatus}
            />
            <Text className="font-osregular text-black-200 text-sm ">
              Closed on {ActiveDay}
            </Text>
          </View>

          <View className="flex-row items-center ">
            <Checkbox
              status={SameTime ? "checked" : "unchecked"}
              onPress={() => {
                applySameTimings(!SameTime);
              }}
            />

            <Text className="font-osregular text-black-200 text-sm ">
              Same timings for all days?
            </Text>
          </View>
        </View>
      </View>
      {ShowTimePicker && (
        <Portal>
          <DateTimePicker
            testID="dateTimePicker"
            value={getTimeDate(
              data.timing[ActiveDay][isOpeningTime ? "opening" : "closing"]
            )}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={onChange}
          />
        </Portal>
      )}
    </ScrollView>
  );
} 