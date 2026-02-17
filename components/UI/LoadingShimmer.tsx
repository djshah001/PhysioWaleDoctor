import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "~/lib/utils";

interface LoadingShimmerProps {
  width?: number | string;
  height?: number;
  className?: string;
}

export const LoadingShimmer: React.FC<LoadingShimmerProps> = ({
  width = "100%",
  height = 100,
  className,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{ width, height, opacity }}
      className={cn("bg-gray-200 rounded-xl overflow-hidden", className)}
    >
      <LinearGradient
        colors={["#E5E7EB", "#F3F4F6", "#E5E7EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1"
      />
    </Animated.View>
  );
};

interface ShimmerCardProps {
  count?: number;
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({ count = 1 }) => {
  return (
    <View className="gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="bg-white rounded-2xl p-4">
          <View className="flex-row items-center gap-3">
            <LoadingShimmer width={50} height={50} className="rounded-full" />
            <View className="flex-1">
              <LoadingShimmer width="70%" height={16} />
              <LoadingShimmer width="50%" height={12} className="mt-2" />
            </View>
          </View>
          <LoadingShimmer width="100%" height={60} className="mt-4" />
        </View>
      ))}
    </View>
  );
};
