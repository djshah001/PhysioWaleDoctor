import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HorList from "../../components/Home/HorList";
import { TestSteps } from "../../constants/Data";
import axios from "axios";
import { router } from "expo-router";
import { apiUrl } from "../../components/Utility/Repeatables";
import { Appbar } from "react-native-paper";
import colors from "../../constants/colors";

const SelfTest = () => {
  const [selfTestCategories, setselfTestCategories] = useState([]);

  const getSelfTestCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v/self-test/categories`);
      console.log(response.data);
      setselfTestCategories(response.data.allSelfTestCategories);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    getSelfTestCategories();
  }, []);

  return (
    <SafeAreaView className="h-full bg-white-300">
      <ScrollView
        contentContainerStyle={{
          width: "100vw",
          // backgroundColor: "#fff",
        }}
      >
        <Appbar.Header
          mode="center-aligned"
          // safeAreaInsets={{ bottom }}
          elevated={true}
          // elevation={3}
          className=" mt-[-25px] "
          style={{
            // height: 60,
            backgroundColor: colors.white[300],
            // marginTop:-20,
            // paddingVertical:10
          }}
        >
          <Appbar.BackAction
            onPress={() => {
              router.back();
            }}
          />
          <Appbar.Content
            title={
              <Text className="text-2xl font-psemibold text-black-200 ">
                Self Test
              </Text>
            }
          />
          {/* <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} /> */}
        </Appbar.Header>
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
                className=" min-[320px]:w-[23%] items-center mb-2"
                onPress={() =>
                  router.push({
                    pathname: "/questions/".concat(item._id),
                    params: {
                      categoryId: item._id,
                      title: item.name,
                    },
                  })
                }
              >
                <View className="bg-white-100 w-20 h-20 mb-1 rounded-xl shadow-black-200 shadow-lg items-center justify-center">
                  <Image
                    source={{ uri: item.imgUrl }}
                    className="w-12 h-12 mix-blend-color-burn"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-center text-gray-700 text-xs font-psemibold leading-5 capitalize ">
                  {item.name}
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
