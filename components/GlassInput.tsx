import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import Animated, { FadeInDown } from "react-native-reanimated";

interface GlassInputProps extends TextInputProps {
  icon: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  prefix?: React.ReactNode;
  error?: string;
  containerStyle?: any;
}

const GlassInput = React.forwardRef<TextInput, GlassInputProps>(
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
      containerStyle,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);

    return (
      <View style={containerStyle}>
        <BlurView
          tint="systemChromeMaterialLight"
          intensity={30}
          experimentalBlurMethod="none"
          className={`flex-row items-center h-[60px] rounded-2xl border px-4 overflow-hidden ${
            error
              ? "border-rose-500/50"
              : isFocused
                ? "border-white/80"
                : "border-white/10"
          }`}
        >
          <View className="mr-3">
            {iconFamily === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons
                name={icon as any}
                size={22}
                color={
                  error
                    ? colors.rose[500]
                    : isFocused
                      ? colors.white
                      : colors.sky[100]
                }
              />
            ) : (
              <Ionicons
                name={icon as any}
                size={22}
                color={
                  error
                    ? colors.rose[500]
                    : isFocused
                      ? colors.white
                      : colors.sky[100]
                }
              />
            )}
          </View>

          {prefix && (
            <View className="mr-3 flex-row items-center">
              {typeof prefix === "string" ? (
                <Text className="text-white text-base font-semibold">
                  {prefix}
                </Text>
              ) : (
                prefix
              )}
              <View className="ml-3 h-5 w-[2px] bg-sky-200/70" />
            </View>
          )}

          <TextInput
            ref={ref}
            className="flex-1 text-white text-base h-full font-pregular"
            placeholder={placeholder}
            placeholderTextColor={colors.sky[100]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !showPass}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor={colors.sky[400]}
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
                color={colors.sky[100]}
              />
            </TouchableOpacity>
          )}
        </BlurView>
        {error && (
          <Animated.Text
            entering={FadeInDown}
            className="text-rose-500 text-xs ml-1 mt-1 font-pmedium"
          >
            {error}
          </Animated.Text>
        )}
      </View>
    );
  }
);

export default GlassInput;
