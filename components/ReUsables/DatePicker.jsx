import { View, Text } from "react-native";
import React from "react";
import { DatePickerInput, DatePickerModal } from "react-native-paper-dates";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { TextInput } from "react-native-paper";
registerTranslation("en-GB", enGB);

const DatePicker = ({ date, setDate,endYear }) => {
  
  return (
    <View className=" ">
      <DatePickerInput
        mode="outlined"
        label='  Date'
        locale="en-GB"
        // visible={open}
        date={date}
        value={date}
        endYear={endYear}
        onChange={(d) => setDate(d)}
        presentationStyle="formSheet"
        inputMode="start"
        outlineStyle={{borderRadius:50}}
        activeOutlineColor="#95AEFE"
        iconColor='#f7f7f7'
        iconStyle={{backgroundColor: "#95AEFE"}}
        left={<TextInput.Icon icon="calendar-range" color="#6d6d6d" />}

      />
    </View>
  );
};

export default DatePicker;
