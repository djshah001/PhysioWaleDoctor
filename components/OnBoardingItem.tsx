import { Image } from "expo-image";
import React from "react";
import {
  Text,
  View,
  useWindowDimensions,
  ImageSourcePropType,
} from "react-native";

interface OnBoardingItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
  };
}

const OnBoardingItem: React.FC<OnBoardingItemProps> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="flex-1 justify-center items-center">
      <View className="flex-1 w-full justify-center items-center ">
        <Image source={item.image} className="w-full h-full" />
      </View>
      <View className="flex-[0.4] px-6 w-full items-center justify-start">
        <Text className="text-3xl text-center font-pbold mb-4 text-secondary-500">
          {item.title}
        </Text>
        <Text className="text-base text-center font-pregular text-gray-600 leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default OnBoardingItem;
