import { View, Text } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useUserDataState } from "../../atoms/store";

import { Avatar, Badge, IconButton } from "react-native-paper";
import { images } from "../../constants";

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import Repeatables from "../Utility/Repeatables";
cssInterop(Image, { className: "style" });

const TopBar = ({ name, imageUrl }) => {
  const [UserData, setUserData] = useUserDataState();
  const { blurhash } = Repeatables();

  return (
    <View
      className="w-full flex-row items-center justify-between py-1 px-4 rounded-e-2xl  "
      // style={{ borderBottomWidth: 2, borderBottomColor: "#000" }}
    >
      <View className="flex-row items-center justify-center gap-2 ">
        {/* <Avatar.Image
          size={50}
          style={{ backgroundColor: "transparent" }}
          className="ml-1"
          source={{ uri: imageUrl }}
        /> */}
        <Image
          source={imageUrl ? { uri: imageUrl } : images.no}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={1000}
          className="w-12 h-12 rounded-full self-center my- "
        />
        <View>
          <Text className="text-sm leading-4 font-pbold text-gray-600">
            Hi, Welcome Back!
          </Text>
          <Text className="text-xl leading-6 font-pbold text-black-200">
            {name}
          </Text>
        </View>
        {/* <Text className="font-osextrabold text-2xl ml-1">PhysioWale</Text> */}
      </View>

      <View className="flex-row">
        <Text className="self-center">
          <IconButton
            icon="qrcode-scan"
            iconColor="#000"
            size={24}
            onPress={() => router.push("all-notifications")}
            // className="border-2 rounded-full"
          />
        </Text>
        <Text className="self-center ">
          <Badge className="absolute right-5 top-5 " size={6} />
          <IconButton
            icon="bell-outline"
            iconColor="#000"
            size={24}
            onPress={() => router.push("all-notifications")}
            // className="border-2 rounded-full p-0"
          />
        </Text>
      </View>
    </View>
  );
};

export default TopBar;
