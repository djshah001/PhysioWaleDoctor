import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FreeformChipsProps {
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  placeholder: string;
}

const FreeformChips: React.FC<FreeformChipsProps> = ({
  selectedItems,
  onSelectionChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !selectedItems.includes(trimmed)) {
      onSelectionChange([...selectedItems, trimmed]);
      setInputValue("");
    }
  };

  const removeItem = (item: string) => {
    onSelectionChange(selectedItems.filter((i) => i !== item));
  };

  return (
    <View className="gap-3">
      {/* Input */}
      <View className="flex-row gap-2">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={addItem}
          className="bg-indigo-600 rounded-xl px-4 items-center justify-center"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {selectedItems.map((item) => (
            <Animated.View
              key={item}
              entering={FadeIn}
              exiting={FadeOut}
              className="bg-indigo-100 border border-indigo-500 px-3 py-2 rounded-full flex-row items-center gap-2"
            >
              <Text className="text-indigo-700 font-medium text-sm">
                {item}
              </Text>
              <TouchableOpacity
                onPress={() => removeItem(item)}
                className="ml-1"
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color="#4f46e5"
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
};

export default FreeformChips;
