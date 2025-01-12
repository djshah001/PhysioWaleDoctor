import React from "react";
import { TextInput } from "react-native-paper";
import colors from './../../constants/colors.js';
export default function CustomInput({
  label,
  placeholder,
  value,
  handleChange,
  leftIcon,
  rightIcon,
  activeOutlineColor,
  keyboardType,
  secureTextEntry,
  rightPress,
}) {
  return (
    <TextInput
      mode="outlined"
      // className="bg-blueishGreen-200"
      // style={{
      //   backgroundColor:colors.blues[100]
      // }}
      label={label}
      placeholder={placeholder}
      placeholderTextColor="#6d6d6d"
      value={value}
      onChangeText={handleChange}
      activeOutlineColor={`${
        activeOutlineColor ? activeOutlineColor : colors.secondary[200]
      }`}
      outlineColor="#6B7280"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      theme={{
        roundness: 50,
      }}
      left={
        <TextInput.Icon
          icon={leftIcon}
          size={22}
          color="#6d6d6d"
          // color="#f7f7f7"
          // className="bg-secondary-300"
        />
      }
      right={
        <TextInput.Icon icon={rightIcon} color="#6d6d6d" onPress={rightPress} />
      }
    />
  );
}
