import { View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface PaginationProps {
  data: any[];
  scrollX: SharedValue<number>;
  customStyles?: string;
  divColor?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  data,
  scrollX,
  customStyles,
  divColor,
}) => {
  const { width } = useWindowDimensions();
  const activeColor = divColor ? divColor : "#95AEFE";
  const inactiveColor = "#E5E5E5";

  return (
    <View className={`flex-row justify-center items-center ${customStyles}`}>
      {data.map((_, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          const widthVal = interpolate(
            scrollX.value,
            [(i - 1) * width, i * width, (i + 1) * width],
            [8, 20, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            [(i - 1) * width, i * width, (i + 1) * width],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          );

          const color = interpolate(
            scrollX.value,
            [(i - 1) * width, i * width, (i + 1) * width],
            [0, 1, 0] // Map to 0-1 for color interpolation if needed, but for now simple opacity works well
          );

          return {
            width: widthVal,
            opacity,
            // backgroundColor: color > 0.5 ? activeColor : inactiveColor // Simple color switch
          };
        });

        return (
          <Animated.View
            key={i}
            className={`h-2 rounded-full mx-1 bg-[${activeColor}]`}
            style={[{ backgroundColor: activeColor }, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;
