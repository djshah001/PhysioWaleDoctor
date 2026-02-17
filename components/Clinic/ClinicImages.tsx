import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useToast } from "~/store/toastStore";

export interface ImageUploadState {
  asset: ImagePicker.ImagePickerAsset;
  uploadedUrl: string | null;
  uploading: boolean;
  error: string | null;
}

interface ClinicImagesProps {
  imageStates: ImageUploadState[];
  onImagesSelected: (assets: ImagePicker.ImagePickerAsset[]) => void;
  onRemoveImage: (index: number) => void;
  onRetryUpload: (index: number) => void;
}

const ClinicImages: React.FC<ClinicImagesProps> = ({
  imageStates,
  onImagesSelected,
  onRemoveImage,
  onRetryUpload,
}) => {
  const { showToast } = useToast();

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10 - imageStates.length,
      });

      if (!result.canceled) {
        onImagesSelected(result.assets);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      showToast("error", "Failed to pick images");
    }
  };

  const getUploadedCount = () => {
    return imageStates.filter((state) => state.uploadedUrl !== null).length;
  };

  const getUploadingCount = () => {
    return imageStates.filter((state) => state.uploading).length;
  };

  const getFailedCount = () => {
    return imageStates.filter((state) => state.error !== null).length;
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Clinic Images
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Add photos of your clinic (at least 1 required, max 10)
        </Text>
      </View>

      {/* Upload Status Summary */}
      {imageStates.length > 0 && (
        <View className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="cloud-upload"
                size={20}
                color="#4f46e5"
              />
              <Text className="text-indigo-700 font-semibold text-sm">
                Upload Status
              </Text>
            </View>
            <Text className="text-indigo-600 font-bold text-sm">
              {getUploadedCount()}/{imageStates.length}
            </Text>
          </View>
          {getUploadingCount() > 0 && (
            <Text className="text-indigo-600 text-xs mt-1">
              Uploading {getUploadingCount()} image
              {getUploadingCount() > 1 ? "s" : ""}...
            </Text>
          )}
          {getFailedCount() > 0 && (
            <Text className="text-red-600 text-xs mt-1">
              {getFailedCount()} upload{getFailedCount() > 1 ? "s" : ""} failed
              - tap to retry
            </Text>
          )}
        </View>
      )}

      {/* Add Images Button */}
      <TouchableOpacity
        onPress={pickImages}
        disabled={imageStates.length >= 10}
        className={`p-6 rounded-2xl border-2 border-dashed ${
          imageStates.length >= 10
            ? "border-gray-200 bg-gray-50"
            : "border-indigo-300 bg-indigo-50"
        } items-center justify-center`}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="image-plus"
          size={48}
          color={imageStates.length >= 10 ? "#d1d5db" : "#4f46e5"}
          style={{ opacity: imageStates.length >= 10 ? 0.5 : 1 }}
        />
        <Text
          className={`mt-3 font-semibold ${
            imageStates.length >= 10 ? "text-gray-400" : "text-indigo-600"
          }`}
        >
          {imageStates.length >= 10
            ? "Maximum images reached"
            : "Add Clinic Photos"}
        </Text>
        <Text className="text-gray-400 text-xs mt-1 font-medium">
          {imageStates.length}/10 images
        </Text>
      </TouchableOpacity>

      {/* Images Grid */}
      {imageStates.length > 0 && (
        <View className="gap-3">
          <Text className="text-gray-800 font-semibold text-base ml-1">
            Selected Images
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {imageStates.map((imageState, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(index * 50)}
                exiting={FadeOut}
                className="relative"
              >
                <Image
                  source={{ uri: imageState.asset.uri }}
                  className="w-[110px] h-[110px] rounded-2xl border border-gray-100"
                  resizeMode="cover"
                />

                {/* Cover Badge */}
                {index === 0 && (
                  <View className="absolute top-2 left-2 bg-indigo-500 rounded-full px-2 py-1 shadow-sm">
                    <Text className="text-white text-[10px] font-bold">
                      COVER
                    </Text>
                  </View>
                )}

                {/* Upload Status Overlay */}
                {imageState.uploading && (
                  <View className="absolute inset-0 bg-black/40 rounded-2xl items-center justify-center">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="text-white text-[10px] font-semibold mt-1">
                      Uploading...
                    </Text>
                  </View>
                )}

                {/* Success Checkmark */}
                {imageState.uploadedUrl && !imageState.uploading && (
                  <View className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 shadow-sm">
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="white"
                    />
                  </View>
                )}

                {/* Error State */}
                {imageState.error && !imageState.uploading && (
                  <TouchableOpacity
                    onPress={() => onRetryUpload(index)}
                    className="absolute inset-0 bg-red-500/80 rounded-2xl items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={24}
                      color="white"
                    />
                    <Text className="text-white text-[10px] font-semibold mt-1">
                      Tap to retry
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Remove Button */}
                {!imageState.uploading && (
                  <TouchableOpacity
                    onPress={() => onRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm"
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={14}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
          </View>
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <Text className="text-amber-700 text-xs font-medium">
              💡 First image will be used as cover photo. Images upload
              automatically in the background.
            </Text>
          </View>
        </View>
      )}

      {imageStates.length === 0 && (
        <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <Text className="text-red-600 text-sm font-medium">
            ⚠️ At least one clinic image is required
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default ClinicImages;
