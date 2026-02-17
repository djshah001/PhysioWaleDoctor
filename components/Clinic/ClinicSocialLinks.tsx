import React from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SocialLinks } from "~/types";

interface ClinicSocialLinksProps {
  socialLinks: Partial<SocialLinks>;
  setSocialLinks: (value: Partial<SocialLinks>) => void;
}

const ClinicSocialLinks: React.FC<ClinicSocialLinksProps> = ({
  socialLinks,
  setSocialLinks,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Social Media
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Connect your social media profiles (optional)
        </Text>
      </View>

      {/* Facebook */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center gap-2">
          <FontAwesome5 name="facebook" size={20} color="#1877f2" />
          <Text className="text-lg font-bold text-gray-900">Facebook</Text>
        </View>
        <TextInput
          value={socialLinks.facebook || ""}
          onChangeText={(text) =>
            setSocialLinks({ ...socialLinks, facebook: text })
          }
          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
          placeholder="https://facebook.com/yourclinic"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      {/* Instagram */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center gap-2">
          <FontAwesome5 name="instagram" size={20} color="#e4405f" />
          <Text className="text-lg font-bold text-gray-900">Instagram</Text>
        </View>
        <TextInput
          value={socialLinks.instagram || ""}
          onChangeText={(text) =>
            setSocialLinks({ ...socialLinks, instagram: text })
          }
          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
          placeholder="https://instagram.com/yourclinic"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      {/* YouTube */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center gap-2">
          <FontAwesome5 name="youtube" size={20} color="#ff0000" />
          <Text className="text-lg font-bold text-gray-900">YouTube</Text>
        </View>
        <TextInput
          value={socialLinks.youtube || ""}
          onChangeText={(text) =>
            setSocialLinks({ ...socialLinks, youtube: text })
          }
          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
          placeholder="https://youtube.com/@yourclinic"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
    </Animated.View>
  );
};

export default ClinicSocialLinks;
