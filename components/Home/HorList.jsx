import { View, Text, Animated, FlatList, Dimensions } from "react-native";
import React, { useRef, useState, useMemo } from "react";
import ListData from "./ListData";
import Pagination from "../Pagination";

// Get the screen width to ensure one item per screen
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HorList = ({ data, descriptionStyles, showIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Memoize viewabilityConfig to prevent recreation on each render
  const viewabilityConfig = useMemo(
    () => ({
      minimumViewTime: 300,
      viewAreaCoveragePercentThreshold: 50,
    }),
    []
  );

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Calculate the adjusted width to account for parent padding
  const adjustedWidth = SCREEN_WIDTH - 24; // Subtract the total horizontal padding (16px on each side)

  return (
    // <View className="w-full">
      <FlatList
        data={data}
        ref={ListRef}
        keyExtractor={(item, i) => i.toString()}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={adjustedWidth}
        decelerationRate={0.9}
        snapToAlignment="center"
        renderItem={({ item, index }) => (
          <ListData
            item={item}
            index={index}
            currentIndex={currentIndex}
            ListRef={ListRef}
            length={data.length}
            scrollX={scrollX}
            data={data}
            descriptionStyles={descriptionStyles}
            showIndex={showIndex}
            screenWidth={adjustedWidth}
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
          { useNativeDriver: false }
        )}
      />
    // </View>
  );
};

export default HorList;
