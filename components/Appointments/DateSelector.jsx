import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { MotiView } from "moti";
import { cssInterop } from "nativewind";

cssInterop(MotiView, { className: "style" });

const DateSelector = ({ selectedDate, onPress, formatDate }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 100 }}
    >
      <Text className="font-pbold text-lg text-black-800 mb-2">
        Select Date
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className="bg-white-300 rounded-xl p-4 shadow-sm mb-6 flex-row justify-between items-center border border-secondary-100/20"
      >
        <View className="flex-row gap-1">
          <Icon
            source="calendar"
            size={24}
            color="#4A90E2"
          />
          <Text className="font-osregular text-md">
            {formatDate(selectedDate)}
          </Text>
        </View>
        <Icon
          source="chevron-down"
          size={24}
          color="#333333"
        />
      </TouchableOpacity>
    </MotiView>
  );
};

export default memo(DateSelector);