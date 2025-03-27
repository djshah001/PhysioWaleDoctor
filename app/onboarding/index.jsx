import { View, FlatList, Animated, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "react-native-paper";

import { useRouter } from "expo-router";
import Svg, { Circle, Defs, G, LinearGradient, Stop } from "react-native-svg";

import { LinearGradient as LG } from "expo-linear-gradient";

import Pagination from "../../components/Pagination";
import OnBoardingItem from "../../components/OnBoardingItem";

import { OnBoardingItems } from "../../constants/Data";
import { motify, useDynamicAnimation } from "moti";
import { motifySvg } from "moti/svg";

const viewabilityConfig = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 10,
};

const index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  /* -------------------------------------------------------------------------- */
  /*                            For circle animation                            */
  /* -------------------------------------------------------------------------- */

  const length = OnBoardingItems.length;
  const size = 56;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const MotiCircle = motifySvg(Circle)();
  const CircleAnimation = useDynamicAnimation(() => ({
    strokeDashoffset:
      circumference - (circumference * (currentIndex + 1)) / length,
  }));

  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <FlatList
        data={OnBoardingItems}
        ref={ListRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        bounces={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <OnBoardingItem
            item={item}
            currentIndex={currentIndex}
            ListRef={ListRef}
            length={OnBoardingItems.length}
            scrollX={scrollX}
          />
        )}
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
          {
            useNativeDriver: false,
            listener: (event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );
              CircleAnimation.animateTo({
                strokeDashoffset:
                  circumference - (circumference * (index + 1)) / length,
              });
            },
          }
        )}
      />
      <View className="justify-center items-center w-full ">
        <Pagination
          data={OnBoardingItems}
          scrollX={scrollX}
          customStyles="mt-6"
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
              <MotiCircle
                // ref={animRef}
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#grad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                state={CircleAnimation}
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
              style={{
                borderRadius: 35,
                width: 70,
                height: 70,
                position: "absolute",
              }}
              onPress={() => {
                if (currentIndex < OnBoardingItems.length - 1) {
                  ListRef.current.scrollToIndex({ index: currentIndex + 1 });
                  CircleAnimation.animateTo(
                    {
                      strokeDashoffset:
                        circumference -
                        (circumference * (currentIndex + 1)) / length,
                    },
                    {
                      type: "timing",
                      duration: 500,
                      // easing: Easing.inOut(Easing.ease),
                    }
                  );
                } else {
                  router.replace("/sign-in");
                }
              }}
            />
          </LG>
        </View>
      </View>
    </ScrollView>
  );
};

export default index;
