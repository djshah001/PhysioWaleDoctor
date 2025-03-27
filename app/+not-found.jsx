import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";
import { router } from "expo-router";

const NotFound = () => {
  return (
    <SafeAreaView className="flex-1 bg-white-300">
      <Appbar.Header className="bg-white-300 mt-[-25px]" mode="center-aligned">
        <Appbar.BackAction icon="close" onPress={() => router.back()} />
        <Appbar.Content title="Not Found" />
      </Appbar.Header>
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold">
          Not Found Currently in Development
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NotFound;
