import { View, Text, TouchableOpacity, Share } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";
import { useToastSate } from "../../atoms/store";

cssInterop(Image, { className: "style" });

interface QRCodeDisplayProps {
  qrCode?: string;
  userName?: string;
}

const QRCodeDisplay = ({ qrCode, userName }: QRCodeDisplayProps) => {
  const [, setToast] = useToastSate(); // Only setter needed

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Scan this QR code to view ${userName}'s PhysioWale profile`,
        url: qrCode || "",
        title: "PhysioWale Profile QR Code",
      });
    } catch (error) {
      setToast({
        message: "Failed to share QR code",
        visible: true,
        type: "error",
      });
    }
  };

  if (!qrCode) {
    return null;
  }

  return (
    <View className="bg-white-100 rounded-2xl p-4 shadow-sm shadow-black-200 mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-pbold text-lg">My QR Code</Text>
        <TouchableOpacity
          onPress={handleShare}
          className="bg-secondary-100 p-2 rounded-full"
        >
          <FontAwesome name="share-alt" size={16} color="#055300" />
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image
          source={{ uri: qrCode }}
          className="w-48 h-48 mb-2"
          contentFit="contain"
        />
        <Text className="text-sm text-gray-500 text-center">
          Scan this QR code to share your profile with doctors
        </Text>
      </View>
    </View>
  );
};

export default QRCodeDisplay;
