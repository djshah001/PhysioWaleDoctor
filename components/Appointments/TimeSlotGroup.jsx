import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { MotiView } from "moti";
import colors from "../../constants/colors";

const TimeSlotGroup = ({ 
  title, 
  icon, 
  slots, 
  selectedSlot, 
  onSelectSlot 
}) => {
  if (!slots || slots.length === 0) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
      className="mb-4"
    >
      <View className="flex-row items-center mb-2">
        <IconButton
          icon={icon}
          size={20}
          iconColor={colors.secondary[300]}
          style={{ margin: 0 }}
        />
        <Text className="font-ossemibold text-md text-black-400 ml-1">
          {title}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {slots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            onPress={() => onSelectSlot(slot)}
            disabled={!slot.available}
            className={`py-2 px-4 rounded-lg border ${
              selectedSlot?.id === slot.id
                ? "bg-secondary-300 border-secondary-400"
                : slot.available
                ? "bg-white-300 border-secondary-100"
                : "bg-white-200 border-white-300"
            }`}
          >
            <Text
              className={`font-osregular text-sm ${
                selectedSlot?.id === slot.id
                  ? "text-white-100"
                  : slot.available
                  ? "text-black-300"
                  : "text-black-200"
              }`}
            >
              {slot.time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </MotiView>
  );
};

export default memo(TimeSlotGroup);