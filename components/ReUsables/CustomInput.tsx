import React, { useState } from "react";
import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeInDown,
} from "react-native-reanimated";
import clsx from "clsx";

interface CustomInputProps extends TextInputProps {
  label?: string;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightPress?: () => void;
  error?: string;
  containerStyles?: string;
  isPassword?: boolean; // explicit flag for password fields
}

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword,
  keyboardType,
  leftIcon,
  rightIcon,
  rightPress,
  error,
  containerStyles,
  ...props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleTextChange = (text: string) => {
    setHasValue(!!text);
    if (onChangeText) onChangeText(text);
  };

  // Animation for border color
  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = withTiming(
      error ? "#ef4444" : isFocused ? "#0ea5e9" : "#e2e8f0", // red-500 or sky-500 or slate-200
      { duration: 200 }
    );
    const borderWidth = withTiming(isFocused ? 2 : 1, { duration: 200 });

    return {
      borderColor,
      borderWidth,
    };
  });

  // Animation for Label position/color (Floating Label effect if we wanted, but sticking to clean distinct label for now)
  // Let's make the background slightly change on focus
  const animatedBgStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      isFocused ? "#f0f9ff" : "#ffffff", // light sky vs white
      { duration: 200 }
    );
    return { backgroundColor };
  });

  return (
    <View className={clsx("mb-5 w-full", containerStyles)}>
      {label && (
        <Text
          className={clsx(
            "font-bold text-sm mb-2 ml-1",
            error ? "text-red-500" : "text-slate-600"
          )}
        >
          {label}
        </Text>
      )}

      <Animated.View
        style={[animatedContainerStyle, animatedBgStyle]}
        className="flex-row items-center rounded-2xl px-4 py-1.5 h-[56px]"
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={22}
            color={isFocused ? "#0ea5e9" : "#94a3b8"} // sky-500 or slate-400
            style={{ marginRight: 10 }}
          />
        )}

        <TextInput
          className="flex-1 text-slate-800 text-base font-medium h-full"
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#cbd5e1"
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#0ea5e9"
          {...props}
        />

        {(isPassword || rightIcon) && (
          <Pressable
            onPress={isPassword ? togglePasswordVisibility : rightPress}
            hitSlop={10}
            className="ml-2"
          >
            <MaterialCommunityIcons
              name={
                isPassword ? (isPasswordVisible ? "eye-off" : "eye") : rightIcon
              }
              size={22}
              color={isFocused ? "#0ea5e9" : "#94a3b8"}
            />
          </Pressable>
        )}
      </Animated.View>

      {error && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          className="mt-1 ml-1"
        >
          <Text className="text-red-500 text-xs font-semibold">{error}</Text>
        </Animated.View>
      )}
    </View>
  );
}
