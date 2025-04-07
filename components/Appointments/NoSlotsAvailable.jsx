import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import colors from "../../constants/colors";

const NoSlotsAvailable = ({ message = "No slots available for this date" }) => {
  return (
    <View className="bg-white-300 rounded-xl p-6 shadow-sm mb-6 items-center border border-secondary-100/20">
      <IconButton
        icon="calendar-remove"
        size={40}
        iconColor={colors.black[200]}
      />
      <Text className="font-osregular text-md text-black-300">
        {message}
      </Text>
      <Text className="font-osregular text-sm text-black-200 text-center mt-1">
        Please select a different date
      </Text>
    </View>
  );
};

export default NoSlotsAvailable;