import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { IconMenuData } from "../../constants/Data";
import { router } from "expo-router";

export default function IconMenu() {
  return (
    <View className=" my-4 ">
      <View className="flex-row flex-wrap justify-center gap-1 ">
        {IconMenuData.map((item) => {
          let iconTitle = item.title.split("-");
          return (
            <TouchableOpacity
              key={item.id}
              className="md:w-[48%] w-[22%] rounded-lg items-center"
              onPress={() => router.navigate(`${item.title}`)}
            >
              <View className="bg-secondary-200 p-3 rounded-2xl mb-1 shadow-md shadow-black-200 ">
                <Image
                  source={item.icon}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-center text-sm text-black font-psemibold">
                {iconTitle[0]}
              </Text>
              {/* <Text className="text-center text-sm text-black font-psemibold ">
                {iconTitle[1]}
              </Text> */}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
