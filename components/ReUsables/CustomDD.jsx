import { View, Text } from "react-native";
import React from "react";
import { Dropdown, MultiSelectDropdown } from "react-native-paper-dropdown";
import { TextInput } from "react-native-paper";

const CustomDD = ({
  label,
  placeholder,
  options,
  selected,
  setSelected,
  inputIcon,
  multiSelect,
}) => {
  const customInput = ({ label, placeholder, rightIcon, selectedLabel }) => {
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
          height:50,
        }}
        theme={{ roundness: 25 }}
        left={inputIcon && <TextInput.Icon icon={inputIcon} color="#6d6d6d" />}
        right={<TextInput.Icon icon="chevron-down" color="#6d6d6d" />}
      />
    );
  };

  return (
    <View className="my-2" >
      {multiSelect ? (
        <MultiSelectDropdown
          mode="outlined"
          label={label}
          placeholder={placeholder}
          options={options}
          value={selected}
          onSelect={setSelected}
          // CustomMultiSelectDropdownItem={CustomDropdownItem}

          menuContentStyle={{
            borderRadius: 25,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
          CustomMultiSelectDropdownInput={customInput}
        />
      ) : (
        <Dropdown
          mode="outlined"
          label={label}
          placeholder={placeholder}
          options={options}
          value={selected}
          onSelect={setSelected}
          // CustomMultiSelectDropdownItem={CustomDropdownItem}

          menuContentStyle={{
            borderRadius: 25,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
          CustomDropdownInput={customInput}
        />
      )}
    </View>
  );
};

export default CustomDD;
