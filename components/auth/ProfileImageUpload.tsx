import React, { useState } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Button } from "../ui/button";

interface ProfileImageUploadProps {
  imageUri?: string;
  onImageSelected: (asset: ImagePicker.ImagePickerAsset) => void;
  uploading?: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  imageUri,
  onImageSelected,
  uploading = false,
}) => {
  const handleSelectImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Sorry, we need camera roll permissions to upload a profile picture!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0]);
    }
  };

  return (
    <View className="items-center gap-3">
      <Text className="text-white font-pmedium">Profile Picture</Text>

      <Button
        onPress={handleSelectImage}
        disabled={uploading}
        className="relative bg-transparent rounded-full p-0"
      >
        <Animated.View
          entering={ZoomIn.springify()}
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10"
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              contentFit="cover"
            />
          ) : (
            <BlurView
              intensity={20}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              className="w-full h-full items-center justify-center bg-white/5"
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={48}
                color="#94a3b8"
              />
            </BlurView>
          )}
        </Animated.View>

        {/* Upload Button */}
        <Animated.View
          entering={FadeIn.delay(200)}
          className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-rose-500 items-center justify-center border-4 border-slate-950"
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons
              name={imageUri ? "pencil" : "camera"}
              size={20}
              color="white"
            />
          )}
        </Animated.View>
      </Button>

      <Text className="text-sky-200/80 text-xs font-pregular text-center">
        {imageUri ? "Tap to change" : "Tap to upload"}
      </Text>
    </View>
  );
};

export default ProfileImageUpload;
