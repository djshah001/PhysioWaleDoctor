import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  const { width } = useWindowDimensions();
  const stepWidth = (width - 40) / totalSteps; // 40 is padding

  return (
    <View className="mb-6">
      {/* Progress Bar */}
      <View className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <Animated.View
          entering={FadeIn}
          className="h-full bg-sky-500"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </View>

      {/* Step Dots */}
      <View className="flex-row items-center justify-between px-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <View
              key={step}
              className="items-center"
              style={{ width: stepWidth }}
            >
              <View className="flex-row items-center w-full">
                {/* Line before dot (except first) */}
                <View
                  className={`flex-1 h-[2px] ${
                    index === 0
                      ? "bg-transparent"
                      : isCompleted || isActive
                        ? "bg-indigo-500"
                        : "bg-neutral-400"
                  }`}
                />

                {/* Dot */}
                <Animated.View
                  className={`w-5 h-5 rounded-full scale-125  flex items-center justify-center ${
                    isActive
                      ? "bg-indigo-600 "
                      : isCompleted
                        ? "bg-indigo-400"
                        : "bg-neutral-400"
                  }`}
                >
                  <View className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Text className="text-indigo-600 font-bold text-xs">
                      {index + 1}
                    </Text>
                  </View>
                </Animated.View>

                {/* Line after dot (except last) */}
                <View
                  className={`flex-1 h-[2px] ${
                    index === totalSteps - 1
                      ? "bg-transparent"
                      : isCompleted
                        ? "bg-indigo-500"
                        : "bg-neutral-400"
                  }`}
                />
              </View>

              {/* Label */}
              {/* {isActive && ( */}
              <Animated.Text
                entering={FadeInDown.springify()}
                className={`absolute top-6 text-[10px] font-bold ${isActive ? "text-indigo-600" : "text-neutral-400"}`}
                numberOfLines={1}
              >
                {step}
              </Animated.Text>
              {/* )} */}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default StepIndicator;
