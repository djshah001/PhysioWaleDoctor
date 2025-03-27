import React from "react";
import { TextInput } from "react-native-paper";
import colors from "./../../constants/colors.js";
import { Keyboard, Text } from "react-native";
import { cssInterop, remapProps } from "nativewind";

remapProps(TextInput, {
  className: "style",
  contentClassName: "contentStyle",
});
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
  noBR,
}) {
  return (
    <TextInput
      // dense={true}
      editable={editable}
      mode="outlined"
      multiline={multiline || false}
      label={
        <Text className=" font-semibold text-base text-black-200 bg-transparent px-0">
          {label}
        </Text>
      }
      placeholder={placeholder}
      placeholderTextColor="#6d6d6d"
      value={value}
      onChangeText={handleChange}
      outlineColor="#6B7280"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      contentClassName={` ${multiline ? "mt-2 " : ""}  `}
      className=" bg-red-500 "
      style={{}}
      activeOutlineColor={`${
        activeOutlineColor ? activeOutlineColor : colors.secondary[200]
      }`}
      textColor={colors.black[300]}
      theme={{
        roundness: multiline || noBR ? 8 : 50,
        colors: {
          background: colors.white[300],
        },
        animation: {},
      }}
      left={
        leftIcon && (
          <TextInput.Icon
            icon={leftIcon}
            size={22}
            color="#6d6d6d"
            // color="#f7f7f7"
            // className="bg-secondary-300"
          />
        )
      }
      right={
        rightIcon && (
          <TextInput.Icon
            icon={rightIcon}
            color="#6d6d6d"
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
