import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Pagination from "../Pagination";

const ListData = ({
  item,
  scrollX,
  data,
  descriptionStyles,
  showIndex,
  index,
  length,
  screenWidth,
}) => {
  return (
    <View
      style={{ width: screenWidth }}
      className="justify-center overflow-hidden "
    >
      <View className=" mx-2 overflow-hidden bg-secondary-200 rounded-3xl flex-row justify-between items-center shadow-lg shadow-black-200">
        <View
          className={`${
            item.image ? "w-2/3" : "w-11/12"
          } px-4 justify-center items-start gap-2 py-6`}
        >
          {item.title && (
            <Text className="font-osbold text-2xl text-white-300">
              {item.title}
            </Text>
          )}
          {showIndex && (
            <Text className="font-osbold text-3xl text-white-300">
              {index + 1}/{length || data.length}
            </Text>
          )}
          <Text
            className={`font-pregular text-sm text-white-300 ${
              descriptionStyles || ""
            }`}
            numberOfLines={3}
          >
            {item.description}
          </Text>
          <Pagination
            data={data}
            scrollX={scrollX}
            divColor="#fff"
            customStyles="mt-2"
          />
        </View>
        {item.image && (
          <Image
            source={item.image}
            contentFit="cover"
            className="w-1/3 h-full"
            // style={{ height: 150 }}
          />
        )}
      </View>
    </View>
  );
};

export default ListData;
