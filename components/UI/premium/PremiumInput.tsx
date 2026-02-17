import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Text,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { cn } from "~/lib/utils";

interface PremiumInputProps extends TextInputProps {
  icon?: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  prefix?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  containerStyle?: import("react-native").StyleProp<
    import("react-native").ViewStyle
  >;
  label?: string;
}

export const PremiumInput = React.forwardRef<TextInput, PremiumInputProps>(
  (
    {
      icon,
      iconFamily = "Ionicons",
      placeholder,
      value,
      onChangeText,
      isPassword = false,
      keyboardType = "default",
      prefix,
      error,
      containerClassName,
      containerStyle,
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);

    return (
      <View className={cn("mb-4", containerClassName)} style={containerStyle}>
        {label && (
          <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
            {label}
          </Text>
        )}

        <View
          className={cn(
            "flex-row items-center min-h-[56px] rounded-2xl border px-4 overflow-hidden bg-white/60",
            error
              ? "border-red-300 bg-red-50/50"
              : isFocused
                ? "border-indigo-500 bg-white"
                : "border-gray-200",
            props.multiline && "items-start py-3",
          )}
        >
          {icon && (
            <View className={cn("mr-3", props.multiline && "mt-1")}>
              {iconFamily === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={icon as any}
                  size={20}
                  color={error ? "#ef4444" : isFocused ? "#4f46e5" : "#9ca3af"}
                />
              ) : (
                <Ionicons
                  name={icon as any}
                  size={20}
                  color={error ? "#ef4444" : isFocused ? "#4f46e5" : "#9ca3af"}
                />
              )}
            </View>
          )}

          {prefix && (
            <View
              className={cn(
                "mr-3 flex-row items-center",
                props.multiline && "mt-1",
              )}
            >
              {typeof prefix === "string" ? (
                <Text className="text-gray-700 text-base font-semibold">
                  {prefix}
                </Text>
              ) : (
                prefix
              )}
              <View className="ml-3 h-5 w-[1px] bg-gray-200" />
            </View>
          )}

          <TextInput
            ref={ref}
            className={cn(
              "flex-1 text-gray-800 text-base font-medium",
              className,
              props.multiline && "h-full min-h-[80px]", // improved multiline support
            )}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !showPass}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor="#4f46e5"
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              className="p-2"
            >
              <Feather
                name={showPass ? "eye" : "eye-off"}
                size={18}
                color="#6b7280"
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Animated.Text
            entering={FadeInDown}
            className="text-red-500 text-xs ml-1 mt-1 font-medium"
          >
            {error}
          </Animated.Text>
        )}
      </View>
    );
  },
);
