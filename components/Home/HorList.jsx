import { View, Text, Animated, FlatList } from "react-native";
import React, { useRef, useState } from "react";
import ListData from "./ListData";
import Pagination from "../Pagination";

const viewabilityConfig = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 10,
};

const HorList = ({ data, descriptionStyles, showIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <>
      <FlatList
        data={data}
        ref={ListRef}
        keyExtractor={(item, i) => i.toString()}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
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
      {/* <Pagination
        data={data}
        scrollX={scrollX}
        customStyles="mt-0"
        divColor="#000000"
      /> */}
    </>
  );
};

export default HorList;
