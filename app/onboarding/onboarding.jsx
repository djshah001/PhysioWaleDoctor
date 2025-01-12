import { View, FlatList, Animated, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { IconButton, MD3Colors } from "react-native-paper";

import { router } from "expo-router";
import Svg, { Circle, Defs, G, LinearGradient, Stop } from "react-native-svg";

import { LinearGradient as LG } from "expo-linear-gradient";

import CustomBtn from "../../components/CustomBtn";
import Pagination from "../../components/Pagination";
import OnBoardingItem from "../../components/OnBoardingItem";

import icons from "../../constants/icons";
import { OnBoardingItems } from "../../constants/Data";

const viewabilityConfig = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 10,
};

const OnBoarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(10)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  /* -------------------------------------------------------------------------- */
  /*                            For circle animation                            */
  /* -------------------------------------------------------------------------- */

  const length = OnBoardingItems.length;
  const size = 56;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const per = (currentIndex + 1) * (100 / length);

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);
  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(per);
  }, [per]);

  useEffect(() => {
    progressAnimation.addListener(
      (value) => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;
        if (animRef?.current) {
          animRef.current.setNativeProps({
            strokeDashoffset: strokeDashoffset,
          });
        }
      },
      [per]
    );
  });

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {/* <View className="flex"> */}
        <FlatList
          data={OnBoardingItems}
          ref={ListRef}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          bounces={false}
          pagingEnabled={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <OnBoardingItem
                item={item}
                currentIndex={currentIndex}
                ListRef={ListRef}
                length={OnBoardingItems.length}
                scrollX={scrollX}
              />
            );
          }}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            { useNativeDriver: false }
          )}
        />
      {/* </View> */}
      <View className="justify-center items-center w-full ">
      <Pagination
        data={OnBoardingItems}
        scrollX={scrollX}
        customStyles='mt-6'
      />
        <View style={{ position: "relative", width: 150, height: 125 }}>
          <Svg
            height="150"
            width="150"
            viewBox="0 0 100 100"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#92A3FD" stopOpacity="1" />
                <Stop offset="100%" stopColor="#9DCEFF" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <G rotation={-90} origin={50}>
              <Circle
                ref={animRef}
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#grad)"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={circumference}
              />
            </G>
          </Svg>
          <LG
            colors={["#92A3FD", "#9DCEFF"]}
            style={{
              borderRadius: 35,
              width: 65,
              height: 65,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 42,
              left: 43,
            }}
          >
            <IconButton
              icon={
                currentIndex < OnBoardingItems.length - 1
                  ? "chevron-right"
                  : "check"
              }
              size={30}
              iconColor="white"
              style={{ borderRadius: 35, width: 70, height: 70, position:'absolute' }}
              onPress={() => {
                if (currentIndex < OnBoardingItems.length - 1) {
                  ListRef.current.scrollToIndex({ index: currentIndex + 1 });
                } else {
                  router.replace("/sign-in");
                }
              }}
            />
          </LG>
        </View>
      </View>
      {/* </View> */}
    </ScrollView>
  );
};

export default OnBoarding;
