import { View, useWindowDimensions, Animated } from "react-native";
import React from "react";

const Pagination = ({ data, scrollX, customStyles, divColor }) => {
  const { width } = useWindowDimensions();
  const pag = divColor ? divColor : "#95AEFE";
  
  return (
    <View className={`flex-row justify-center ${customStyles} `}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i}
            className={` h-[8px] rounded-full mx-1 `}
            style={{ width: dotWidth, backgroundColor: pag }}
          />
        );
      })}
    </View>
  );
};

export default Pagination;
