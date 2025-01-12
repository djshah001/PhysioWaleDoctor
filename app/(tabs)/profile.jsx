import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MotiText, MotiView } from "moti";
import { useUserDataState } from "../../atoms/store";
import { Avatar, Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Profile = () => {
  const [UserData, setUserData] = useUserDataState();
  console.log(UserData);
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
          <Avatar.Image
            source={images.no}
            size={100}
            style={{ backgroundColor: "transparent" }}
            className=""
          />
          <View className="mt-2">
            <Text className="text-center font-osbold text-2xl ">
              {UserData.firstName} {UserData.lastName}
            </Text>
            <Text className="text-center text-md font-ossemibold ">
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
