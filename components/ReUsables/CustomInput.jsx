import React from "react";
import { TextInput } from "react-native-paper";
import colors from "./../../constants/colors.js";
import { Keyboard } from "react-native";
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
  multiline,
  customStyles,
  showRightIconBordered,
  editable,
}) {
  return (
    <TextInput
      // dense={true}
      editable={editable}
      mode="outlined"
      multiline={multiline || false}
      label={label}
      placeholder={placeholder}
      placeholderTextColor="#6d6d6d"
      value={value}
      onChangeText={handleChange}
      outlineColor="#6B7280"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      contentStyle={{
        flexGrow: "auto",
      }}
      activeOutlineColor={`${
        activeOutlineColor ? activeOutlineColor : colors.secondary[200]
      }`}
      theme={{
        roundness: multiline ? 5 : 50,
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
        rightIcon && (
          <TextInput.Icon
            icon={rightIcon}
            // color="#6d6d6d"
            className={`${showRightIconBordered && "bg-secondary-200"}`}
            style={
              showRightIconBordered && {
                color: "#fff",
                borderWidth: 1,
                width: 35,
                height: 35,
              }
            }
            onPress={() => {
              Keyboard.dismiss();
              rightPress();
            }}
          />
        )
      }
    />
  );
}
