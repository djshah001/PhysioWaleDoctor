import React, { useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CustomInput from "./ReUsables/CustomInput";
import CustomBtn from "./CustomBtn";
import { Checkbox } from "react-native-paper";
import colors from "../constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";

export function ChooseTimings({ data, setData }) {
  const [SameTime, setSameTime] = useState(false);
  const [ActiveDay, setActiveDay] = useState("sunday");
  const ItemRef = useRef([]);
  const [ShowTimePicker, setShowTimePicker] = useState(false);
  const [isOpeningTime, setIsOpeningTime] = useState(true);

  const onChange = (event, selectedDate) => {
    // const selectedTime = selectedDate.toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });

    const selectedTime = selectedDate.toLocaleTimeString();

    console.log(
      selectedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setSameTime(false);
    setData((prev) => ({
      ...prev,
      open24hrs: false,
      timing: {
        ...prev.timing,
        [ActiveDay]: {
          ...prev.timing[ActiveDay],
          [isOpeningTime ? "opening" : "closing"]: selectedTime,
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
            opening: "00:00",
            closing: "00:00",
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
          opening: !prev.timing[ActiveDay].isClosed
            ? "00:00"
            : prev.timing[ActiveDay].opening,
          closing: !prev.timing[ActiveDay].isClosed
            ? "00:00"
            : prev.timing[ActiveDay].closing,
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

  return (
    <ScrollView contentContainerClassName="p-4 ">
      <Text className="text-center font-bold text-xl mb-2 ">
        Choose Timigs 🎉
      </Text>
      <ScrollView
        horizontal
        contentContainerClassName=" gap-2 my-3 "
        showsHorizontalScrollIndicator={false}
      >
        {/* <BottomSheetFlatList
          horizontal
          data={Object.keys(data.timing)}
          className=" p-2 "
          showsHorizontalScrollIndicator={false} // keyExtractor={keyExtractor}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                key={item}
                className={`${
                  ActiveDay === item
                    ? "bg-blues-400 text-white-100 "
                    : "bg-white-200"
                } w-[85px] h-[80px] rounded-xl p-2 mr-3 items-center justify-center shadow-lg shadow-black-300 `}
                onPress={() => {
                  setActiveDay(item);
                }}
              >
                <Text
                  className={`text-center font-osregular ${
                    ActiveDay === item ? "text-white-200" : "text-black-200"
                  } `}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          }} // estimatedItemSize={43.3}
        /> */}

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

        {/* <View className="bg-purple-500 w-1/6 h-[200px] "></View> */}
      </ScrollView>
      <View className=" p-4 gap-3  ">
        <Text className="font-ossemibold text-2xl text-center ">
          {ActiveDay.toUpperCase()}
        </Text>

        <CustomInput
          editable={false}
          label="Opening Time"
          value={data.timing[ActiveDay].opening}
          leftIcon="clock-time-three-outline"
          rightIcon="arrow-top-right"
          rightPress={() => {
            setShowTimePicker(true);
            setIsOpeningTime(true);
          }}
          showRightIconBordered={true}
        />

        <CustomInput
          editable={false}
          label="closing Time"
          value={data.timing[ActiveDay].closing}
          leftIcon="clock-time-three-outline"
          rightIcon="arrow-top-right"
          rightPress={() => {
            setShowTimePicker(true);
            setIsOpeningTime(false);
          }}
          showRightIconBordered={true}
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
              same timings for all days ?
            </Text>
          </View>
        </View>
      </View>
      {ShowTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode="time"
          display="spinner"
          // is24Hour={true}
          onChange={onChange}
        />
      )}
    </ScrollView>
  );
}
