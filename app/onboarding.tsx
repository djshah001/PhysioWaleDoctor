import {
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import React, { useRef, useState, useCallback, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Svg, { Circle, Defs, G, LinearGradient, Stop } from "react-native-svg";
import { LinearGradient as LG } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedProps,
  withTiming,
  runOnJS,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";

import OnBoardingItem from "../components/OnBoardingItem";
import Pagination from "~/components/Pagination";
import { OnBoardingItems } from "../constants/Data";
import { useAtom } from "jotai";
import { isAppFirstOpenedAtom } from "~/store/authAtoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const OnboardingIndex = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isAppFirstOpened, setIsAppFirstOpened] = useAtom(isAppFirstOpenedAtom);

  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const updateCurrentIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      updateCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    minimumViewTime: 300,
    viewAreaCoveragePercentThreshold: 10,
  }).current;

  // Circle Animation Constants
  const size = 65; // increased slightly to match container
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const DATA_LENGTH = OnBoardingItems.length;

  const animatedCircleProps = useAnimatedProps(() => {
    // Calculate progress based on scroll position
    // We want the circle to fill up as we scroll through items
    // Item 0 -> 1 segment filled
    // Item 1 -> 2 segments filled
    // Item 2 -> 3 segments filled

    // Interpolate scrollX to a value between 0 and DATA_LENGTH
    const progress = interpolate(
      scrollX.value,
      [0, width * (DATA_LENGTH - 1)],
      [0, DATA_LENGTH - 1]
    );

    // Add 1 because we want to start with the first segment filled
    const currentProgress = progress + 1;

    const strokeDashoffset =
      circumference - (circumference * currentProgress) / DATA_LENGTH;

    return {
      strokeDashoffset,
    };
  });

  const handleNext = async () => {
    if (currentIndex < DATA_LENGTH - 1) {
      listRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem("isAppFirstOpened", "false");
      setIsAppFirstOpened(false);
      console.log("isAppFirstOpened onboarding", isAppFirstOpened);
      // router.replace("/sign-in");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="h-[80vh]">
        <AnimatedFlatList
          data={OnBoardingItems}
          renderItem={({ item }: any) => <OnBoardingItem item={item} />}
          keyExtractor={(item: any) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ref={listRef}
        />
      </View>

      <View className="flex-1 justify-center items-center w-full pb-10">
        <Pagination
          data={OnBoardingItems}
          scrollX={scrollX}
          customStyles="mb-10"
        />

        {/* Next Button Container */}
        <View
          className="relative justify-center items-center"
          style={{ width: 80, height: 80 }}
        >
          {/* Progress Circle ID */}
          <Svg
            height={80}
            width={80}
            viewBox={`0 0 ${size} ${size}`}
            style={{ position: "absolute" }}
          >
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#92A3FD" stopOpacity="1" />
                <Stop offset="100%" stopColor="#9DCEFF" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E6E7E8"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#grad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                animatedProps={animatedCircleProps}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          {/* Button */}
          <LG
            colors={["#92A3FD", "#9DCEFF"]}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
              shadowColor: "#92A3FD",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}
          >
            <Pressable
              onPress={handleNext}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              android_ripple={{
                color: "rgba(255,255,255,0.3)",
                borderless: true,
                radius: 30,
              }}
            >
              <MaterialCommunityIcons
                name={
                  currentIndex < DATA_LENGTH - 1 ? "chevron-right" : "check"
                }
                size={30}
                color="white"
              />
            </Pressable>
          </LG>
        </View>
      </View>
    </View>
  );
};

export default OnboardingIndex;
