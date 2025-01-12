import { Image, Text, View } from "react-native";

const OnBoardingItem = ({ item, currentIndex }) => {
  return (
    <View className="">
      <View className="flex-1 w-[100vw] h-[58vh] ">
        <Image
          source={item.image}
          resizeMode="cover"
          className="w-full h-full"
        />
      </View>
      <View className="mx-5 w-[90vw] ">
        <Text className="text-4xl font-pbold mb-2 text-secondary-300 ">
          {currentIndex + 1}.
        </Text>
        <Text className="text-3xl font-pbold mb-2 text-secondary-300">
          {item.title}
        </Text>
        <Text className="text-lg font-pregular mx-3 ">{item.description}</Text>
      </View>
    </View>
  );
};

export default OnBoardingItem;
