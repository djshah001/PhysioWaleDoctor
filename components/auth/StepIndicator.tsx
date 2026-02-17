import React from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progressWidth}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  return (
    <View className="mb-8">
      {/* Progress Bar */}
      <View className="h-1 bg-white/10 rounded-full overflow-hidden mb-6">
        <Animated.View
          style={progressStyle}
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
        />
      </View>

      {/* Step Indicators */}
      <View className="flex-row justify-between items-center px-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <View key={stepNumber} className="items-center flex-1">
              {/* Step Circle */}
              <Animated.View
                className={`w-10 h-10 rounded-full items-center justify-center self-center border-2 mb-2 ${
                  isCompleted
                    ? "bg-rose-500 border-rose-500"
                    : isCurrent
                      ? "bg-rose-500/20 border-rose-500"
                      : "bg-white/5 border-white/20"
                }`}
              >
                {isCompleted ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="white"
                  />
                ) : (
                  <Text
                    className={`font-pbold text-sm ${isCurrent ? "text-rose-400" : "text-white/40"}`}
                  >
                    {stepNumber}
                  </Text>
                )}
              </Animated.View>

              {/* Step Label */}
              <Text
                className={`text-xs font-pmedium text-center ${
                  isCurrent ? "text-white" : "text-white/40"
                }`}
                numberOfLines={2}
              >
                {stepLabels[index]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default StepIndicator;
