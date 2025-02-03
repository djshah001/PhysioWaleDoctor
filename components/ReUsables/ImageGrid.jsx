import { Image } from "expo-image";
import { View } from "react-native";
import { cssInterop } from "nativewind";
cssInterop(Image, { className: "style" });

export const ImageGrid = ({ Imgs }) => {
  const leftColumn = [];
  const rightColumn = [];
  Imgs.forEach((img, index) => {
    if (index % 2 === 0) {
      leftColumn.push(img);
    } else {
      rightColumn.push(img);
    }
  });

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View className="flex-row justify-between px-2 my-4">
      {/* Left Column */}
      <View className="w-[48%]">
        {leftColumn.map((img, index) => (
          <Image
            key={index}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={1000}
            source={{
              uri: img.uri,
            }}
            style={{
              width: "100%",
              aspectRatio: img.width / img.height,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
        ))}
      </View>

      {/* Right Column */}
      <View className="w-[48%]">
        {rightColumn.map((img, index) => (
          <Image
            key={index}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={1000}
            source={{
              uri: img.uri,
            }}
            style={{
              width: "100%",
              aspectRatio: img.width / img.height,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
        ))}
      </View>
    </View>
  );
};
