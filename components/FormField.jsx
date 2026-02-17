import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChange,
  otherStyles,
  image,
  keyboardType,
  ...props
}) => {
  const [showPass, setshowPass] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles} w-full `}>
      {/* <Text className="text-secondary font-pmedium font-base">{title}</Text> */}
      <View className="w-full h-14 rounded-full bg-slate-100 px-4 border-2 border-gray-500 items-center justify-center flex-row focus:border-secondary ">

        {image && (
          <Image source={image} resizeMode="contain" className="w-6 h-6 mr-1" />
        )}

        <TextInput
          className="flex-1 font-semibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#5b5b67"
          onChangeText={handleChange}
          secureTextEntry={title === "password" && !showPass}
          keyboardType={keyboardType}
        />
        {title === "password" && (
          <TouchableOpacity
            onPress={() => {
              setshowPass(!showPass);
            }}
          >
            <Image
              source={!showPass ? icons.eye : icons.eyeHide}
              resizeMode="contain"
              className="w-6 h-6 "
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
