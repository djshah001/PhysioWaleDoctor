import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { IconMenuData } from "../../constants/Data";
import { router } from "expo-router";

export default function IconMenu() {
  return (
    <View className="">
      <View className="flex-row flex-wrap justify-evenly">
        {IconMenuData.map((item) => {
          let iconTitle = item.title.split("-");
          return (
            <TouchableOpacity
              key={item.id}
              className="md:w-[23%] w-[23%] rounded-lg items-center justify-center"
              onPress={() => router.navigate(`${item.title}`)}
            >
              <View className="bg-secondary-200 p-3 rounded-2xl mb-0 shadow-md shadow-black-200 w-16 h-16 items-center justify-center ">
                <Image
                  source={item.icon}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>
              <View className="w-full items-center h-10 justify-center">
                {/* {iconTitle.length > 1 ? (
                  <>
                    <Text className="text-center text-xs text-black font-psemibold">
                      {iconTitle[0]}
                    </Text>
                    <Text className="text-center text-xs text-black font-psemibold">
                      {iconTitle[1]}
                    </Text>
                  </>
                ) : ( */}
                  <Text className="text-center text-xs text-black font-psemibold">
                    {item.title}
                  </Text>
                {/* )} */}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
