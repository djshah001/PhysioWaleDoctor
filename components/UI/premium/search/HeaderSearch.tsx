import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface HeaderSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const HeaderSearch = ({
  value,
  onChangeText,
  placeholder = "Search...",
}: HeaderSearchProps) => {
  return (
    <View className="flex-row items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm">
      <Ionicons
        name="search"
        size={20}
        color={colors.slate[400]}
        className="mr-2"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.slate[400]}
        className="flex-1 font-medium text-slate-800 text-[15px] p-0"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color={colors.slate[300]}
          suppressHighlighting
          onPress={() => onChangeText("")}
        />
      )}
    </View>
  );
};
