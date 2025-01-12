import { View, Text, Image } from "react-native";
import React from "react";
import Pagination from "../Pagination";

const ListData = ({
  item,
  scrollX,
  data,
  descriptionStyles,
  showIndex,
  index,
}) => {
  return (
    <View className="w-screen px-4 justify-center ">
      <View className=" overflow-hidden bg-secondary-200 rounded-3xl flex-row justify-between items-center shadow-lg shadow-black-200 ">
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
            <Text className="font-osbold text-3xl text-white-300">{index+1}.</Text>
          )}
          <Text
            className={`font-pregular text-[10px] text-white-300 mx-2 ${descriptionStyles}`}
            numberOfLines={3}
            adjustsFontSizeToFit
          >
            {item.description}
          </Text>
          <Pagination
            data={data}
            scrollX={scrollX}
            divColor="#fff"
            customStyles="mt-0 ml-1 "
          />
        </View>
        {item.image && (
          <Image
            source={item.image}
            resizeMode="cover"
            className="w-1/3 h-full mt-5 "
          />
        )}
      </View>
    </View>
  );
};

export default ListData;
