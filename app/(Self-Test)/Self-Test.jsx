import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HorList from "../../components/Home/HorList";
import { TestSteps } from "../../constants/Data";
import axios from "axios";
import { router } from "expo-router";

const SelfTest = () => {
  const [selfTestCategories, setselfTestCategories] = useState([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const getSelfTestCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v/selfTestCategories`);
      console.log(response.data);
      setselfTestCategories(response.data.allSelfTestCategories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSelfTestCategories();
  }, []);

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          width: "100vw",
          // backgroundColor: "#fff",
        }}
      >
        <HorList
          data={TestSteps}
          showIndex={true}
          descriptionStyles="text-lg mx-0"
        />

        <View className=" mt-2 flex-1 p-4 ">
          <Text className=" text-2xl text-center font-pbold text-secondary-200 mb-4 ">
            {/* *Please consult with your physician before starting any exercise
            program. */}
            "Select the painful joint."
          </Text>
          <View className="flex-row flex-wrap justify-around gap-1 ">
            {selfTestCategories.map((item) => (
              <TouchableOpacity
                key={item._id}
                className=" min-[320px]:w-[30%] items-center mb-2"
                onPress={() =>
                  router.push({
                    pathname: "/questions/".concat(item._id),
                    params: {
                      categoryId: item._id,
                      title: capitalizeFirstLetter(item.name),
                    },
                  })
                }
              >
                <View className="bg-white-100 p-2 w-24 h-24 mb-2 rounded-xl shadow-black-200 shadow-lg ">
                  <Image
                    source={{ uri: item.imgUrl }}
                    className="w-full h-full mix-blend-color-burn"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-center text-gray-600 text-sm font-psemibold leading-5 ">
                  {capitalizeFirstLetter(item.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelfTest;
