import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBtn from "../../components/CustomBtn";
import { router } from "expo-router";
import axios from "axios";
import { useToastSate, useUserDataState } from "../../atoms/store";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { apiUrl, blurhash } from "../../components/Utility/Repeatables";
import CustomInput from "../../components/ReUsables/CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cssInterop } from "nativewind";
import { Icon } from "react-native-paper";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/colors";

cssInterop(Image, { className: "style" });
cssInterop(Icon, { className: "style" });

const EditProfile = () => {
  const [userData, setUserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const { IsLoading, setIsLoading } = useLoadingAndDialog();

  const [img, setImg] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phoneNumber: userData.phoneNumber || "",
    specialization: userData.specialization || "",
    experience: userData.experience ? userData.experience.toString() : "",
    profilePic: userData.profilePic || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImg(result.assets[0]);
        await cloudUpload(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setToast({
        message: "Error selecting image",
        visible: true,
        type: "error",
      });
    }
  };

  const cloudUpload = async (image) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("context", "doctor");
    formData.append("id", userData._id);
    formData.append("phoneNumber", userData.phoneNumber || "doctor");

    if (image) {
      formData.append("profilePic", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || "profile.jpg",
      });
    }

    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({
        ...prev,
        profilePic: res.data.filePath,
      }));

      setToast({
        message: "Image uploaded successfully",
        visible: true,
        type: "success",
      });
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      setToast({
        message:
          error.response?.data?.errors?.[0]?.msg || "Failed to upload image",
        visible: true,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    if (!form.name) {
      setToast({
        message: "Name is required",
        visible: true,
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    const authToken = await AsyncStorage.getItem("authToken");

    try {
      const updateData = {
        ...form,
        experience: form.experience ? parseInt(form.experience) : undefined,
      };

      const response = await axios.put(
        `${apiUrl}/api/v/doctors/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Update the user data in state
        setUserData((prev) => ({
          ...prev,
          ...response.data.data,
        }));

        setToast({
          message: "Profile updated successfully",
          visible: true,
          type: "success",
        });

        // Navigate back to profile
        router.back();
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      setToast({
        message:
          error.response?.data?.errors?.[0]?.msg || "Failed to update profile",
        visible: true,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white-300">
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="items-center my-6"
        >
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <View className="relative">
              <Image
                source={
                  form.profilePic
                    ? { uri: form.profilePic }
                    : img
                    ? { uri: img.uri }
                    : userData.profilePic 
                      ? { uri: userData.profilePic }
                      : require("../../assets/images/no.png")
                }
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
                className="w-32 h-32 rounded-full border-4 border-white-400"
              />
              <View className="absolute bottom-0 right-0 bg-secondary-300 p-2 rounded-full shadow-md">
                <Icon source="camera" size={18} color={colors.white[400]} />
              </View>
            </View>
          </TouchableOpacity>
          {uploading && (
            <Text className="text-gray-500 mt-2">Uploading...</Text>
          )}
        </MotiView>

        {/* Form Fields */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 100 }}
          className="bg-white-100 rounded-2xl p-4 shadow-sm shadow-black-200 mb-4"
        >
          <View className="gap-4">
            <CustomInput
              label="Full Name"
              value={form.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="Enter your full name"
              leftIcon="account"
            />

            <CustomInput
              label="Email"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              leftIcon="email"
            />

            <CustomInput
              label="Phone Number"
              value={form.phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              leftIcon="phone"
              editable={false} // Phone number shouldn't be editable as it's used for authentication
            />

            <CustomInput
              label="Specialization"
              value={form.specialization}
              onChangeText={(text) => handleChange("specialization", text)}
              placeholder="E.g., Orthopedic, Sports Physio"
              leftIcon="medical-bag"
            />

            <CustomInput
              label="Years of Experience"
              value={form.experience}
              onChangeText={(text) => handleChange("experience", text)}
              placeholder="Years of professional experience"
              keyboardType="numeric"
              leftIcon="calendar-clock"
            />
          </View>
        </MotiView>

        {/* Save Button */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 200 }}
        >
          <CustomBtn
            title="Save Changes"
            iconName="content-save"
            handlePress={updateProfile}
            loading={IsLoading}
            disabled={IsLoading || uploading}
            useGradient={true}
            gradientColors={[colors.secondary[200], colors.secondary[300]]}
          />
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
