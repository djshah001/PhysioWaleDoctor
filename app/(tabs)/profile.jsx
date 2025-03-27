import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useUserDataState } from "../../atoms/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image } from "expo-image";

import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables";
cssInterop(Image, { className: "style" });

const Profile = () => {
  const [UserData, setUserData] = useUserDataState();
  // console.log(UserData);
  const SignOut = async () => {
    setUserData({});
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        className="px-4 "
        contentContainerStyle={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View className=" w-full h-full gap-3 items-center justify-center ">
          <Image
            source={
              UserData.profilePic ? { uri: UserData.profilePic } : images.no
            }
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={1000}
            // style={{
            //   width: "200",
            //   height: "200", // Adjust the height as needed
            //   backgroundColor: "#055300",
            //   alignSelf: "center",
            //   marginVertical: 20,
            //   borderRadius: 100,
            // }}
            className="w-36 h-36 rounded-full  "
          />

          <View className="mt-2">
            <Text className="text-center font-osbold text-2xl ">
              {UserData.name}
            </Text>
            <Text className="text-center text-md font-osthin ">
              {UserData.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => SignOut()}
          className=" bg-white-100 py-3 px-4 rounded-2xl shadow-xl shadow-black-200"
        >
          <View className=" flex-row w-full justify-between items-center ">
            <View className=" bg-secondary-200 p-3 rounded-full ">
              <FontAwesome name="power-off" size={22} color="#F7F8F8" />
            </View>
            <Text className="text-center font-pmedium text-xl ">Log Out</Text>
            <FontAwesome name="chevron-right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
