import { View, Text } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useUserDataState } from "../../atoms/store";

import { Avatar, Badge, IconButton } from "react-native-paper";

const TopBar = ({ firstName, lastName, imageUrl }) => {
  const [UserData, setUserData] = useUserDataState();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return (
    <View
      className="w-full flex-row items-center justify-between py-1 px-2 rounded-e-2xl  "
      // style={{ borderBottomWidth: 2, borderBottomColor: "#000" }}
    >
      {/* <Avatar.Image
        size={60}
        style={{ backgroundColor: "transparent" }}
        className="ml-1"
        source={{ uri: imageUrl }}
      /> */}
      <View className=" items-center justify-center ">
        {/* <Text className="text-sm leading-4 font-pbold text-gray-600">
          Hi, Welcome Back!
        </Text>
        <Text className="text-xl leading-6 font-pbold text-black-200">
          {firstName} {lastName}
        </Text> */}
        <Text className="font-osextrabold text-2xl ml-1">PhysioWale</Text>
      </View>
      <View className="">
        <Badge className="absolute right-5 top-5 " size={6} />
        <IconButton
          icon="bell-outline"
          iconColor="#000"
          size={24}
          onPress={() => router.push("all-notifications")}
          // className="border-2 rounded-full"
        />
      </View>
    </View>
  );
};

export default TopBar;
