import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Dropdown } from "react-native-paper-dropdown";
import { TextInput } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const CustomDropDown = ({ label, data, value, onSelect }) => {
  return (
    <Dropdown
      mode="outlined"
      label={label}
      //   placeholder="Select Gender"
      options={data}
      value={value}
      onSelect={onSelect}
      activeOutlineColor="#95AEFE"
      menuContentStyle={{
        borderRadius: 25,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
      CustomDropdownInput={({
        label,
        placeholder,
        rightIcon,
        selectedLabel,
      }) => {
        // console.log(drp);
        return (
          <TextInput
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={selectedLabel}
            placeholderTextColor="#6d6d6d"
            activeOutlineColor="#95AEFE"
            outlineColor="#6B7280"
            style={{
              borderRadius: 25,
              overflow: "hidden",
            }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="gender-male-female" color="#6d6d6d" />}
            right={<TextInput.Icon icon="chevron-down" color="#6d6d6d" />}
          />
        );
      }}
      CustomDropdownItem={({
        option,
        isLast,
        toggleMenu,
        onSelect,
        ...dep
      }) => {
        return (
          <TouchableOpacity
            className={`flex-row p-4 justify-Start items-center gap-2 ${
              isLast ? "border-b-0" : "border-b-[1px]"
            } `}
            onPress={() => {
              toggleMenu();
              onSelect(option.value);
            }}
          >
            {option.icon && (
              <FontAwesome6 name={option.icon} size={24} color="#6d6d6d" />
            )}
            <Text className="font-ossemibold text-black-200 text-lg">
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default CustomDropDown;
