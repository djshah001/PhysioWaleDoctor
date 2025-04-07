import { Image } from "expo-image";
import { View, TouchableOpacity, Text } from "react-native";
import { cssInterop } from "nativewind";
import { ActivityIndicator } from "react-native-paper";
cssInterop(Image, { className: "style" });

export const ImageGrid = ({ 
  images = [], 
  onSelectImage, 
  onUpload, 
  isUploading = false,
  uploadedImages = []
}) => {
  const leftColumn = [];
  const rightColumn = [];
  
  // Check if images exists and is an array before using forEach
  if (images && Array.isArray(images)) {
    images.forEach((img, index) => {
      if (index % 2 === 0) {
        leftColumn.push(img);
      } else {
        rightColumn.push(img);
      }
    });
  }

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  // If no images are selected yet, show a placeholder with select button
  if ((!images || images.length === 0) && (!uploadedImages || uploadedImages.length === 0)) {
    return (
      <View className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg my-4">
        <Text className="text-gray-500 mb-4">No images selected</Text>
        <TouchableOpacity 
          onPress={onSelectImage}
          className="bg-secondary-300 py-2 px-4 rounded-full"
        >
          <Text className="text-white-300">Select Images</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="my-4">
      {/* Upload button */}
      {images && images.length > 0 && (
        <View className="mb-4 flex-row justify-end">
          <TouchableOpacity 
            onPress={onUpload}
            disabled={isUploading}
            className="bg-secondary-300 py-2 px-4 rounded-full flex-row items-center"
          >
            {isUploading ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white-300 ml-2">Uploading...</Text>
              </>
            ) : (
              <Text className="text-white-300">Upload Images</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Selected images */}
      {images && images.length > 0 && (
        <View className="flex-row justify-between px-2">
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
      )}

      {/* Uploaded images */}
      {uploadedImages && uploadedImages.length > 0 && (
        <View className="mt-4">
          <Text className="text-base font-pmedium text-black-200 mb-2">
            Uploaded Images
          </Text>
          <View className="flex-row flex-wrap">
            {uploadedImages.map((img, index) => (
              <View key={index} className="w-1/3 p-1">
                <Image
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                  source={{
                    uri: img,
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    borderRadius: 8,
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Select more images button */}
      <TouchableOpacity 
        onPress={onSelectImage}
        className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
      >
        <Text className="text-secondary-300">Select {images && images.length > 0 ? 'More ' : ''}Images</Text>
      </TouchableOpacity>
    </View>
  );
};
