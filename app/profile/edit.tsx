import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import colors from "tailwindcss/colors";

import { useUpdateDoctorProfile } from "../../apis/hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../store/toastStore";
import { authApi } from "../../apis/auth";
import DatePickerInput from "~/components/auth/DatePickerInput";
import GenderSelector from "~/components/auth/GenderSelector";
import { Image } from "expo-image";
import { blurhash } from "~/components/Utility/Repeatables";
import { Button } from "~/components/ui/button";

export default function EditProfileScreen() {
  const { mutateAsync: updateProfile, isPending } = useUpdateDoctorProfile();
  const { user, refreshUser } = useAuth();
  const doctor = user;
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    bio: "",
    experience: "",
    fee: "",
    profilePic: "",
    licenseNumber: "",
    subSpecializations: [] as string[],
    qualifications: [] as any[],
    dob: "",
    gender: "",
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [newSubSpecInput, setNewSubSpecInput] = useState("");
  const [showSubSpecInput, setShowSubSpecInput] = useState(false);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        specialization: doctor.specialization || "",
        bio: doctor.bio || "",
        experience: doctor.experienceYears?.toString() || "",
        fee: doctor.consultationFee?.toString() || "",
        profilePic: doctor.profilePic || "",
        licenseNumber: doctor.licenseNumber || "",
        subSpecializations: doctor.subSpecializations || [],
        qualifications: doctor.qualifications || [],
        dob: doctor.DOB ? new Date(doctor.DOB).toISOString().split("T")[0] : "",
        gender: doctor.gender || "",
      });
    }
  }, [doctor]);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadingImage(true);

        const formData = new FormData();
        formData.append("context", "doctor");
        formData.append("id", doctor?._id || "");
        formData.append("phoneNumber", doctor?.phoneNumber || "");

        // @ts-ignore
        formData.append("profilePic", {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.fileName || `profile_${Date.now()}.jpg`,
        });

        const res = await authApi.uploadProfilePic(formData);
        // console.log(
        //   "Upload Profile Pic Response:",
        //   JSON.stringify(res.data, null, 2),
        // );
        const uploadedUrl = res.data.data?.filePath;
        console.log("uploadedUrl", uploadedUrl);

        if (uploadedUrl) {
          handleChange("profilePic", uploadedUrl);
          showToast(
            "success",
            "Image Uploaded",
            "Your profile picture was uploaded.",
          );
        }
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Upload Failed", "Could not upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  console.log("formData", JSON.stringify(formData.dob, null, 2));

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return showToast("error", "Validation Error", "Name cannot be empty.");
    }

    try {
      const payload = {
        name: formData.name,
        specialization: formData.specialization,
        bio: formData.bio,
        experienceYears: Number(formData.experience) || 0,
        consultationFee: Number(formData.fee) || 0,
        profilePic: formData.profilePic,
        licenseNumber: formData.licenseNumber,
        subSpecializations: formData.subSpecializations,
        qualifications: formData.qualifications,
        DOB: formData.dob ? new Date(formData.dob).toISOString() : undefined,
        gender: formData.gender,
      };

      await updateProfile(payload);
      await refreshUser(); // Sync global auth state

      showToast("success", "Profile Updated", "Your details have been saved.");
      router.back();
    } catch (error) {
      console.error(error);
      showToast("error", "Update Failed", "Could not update your profile.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      className="flex-1 bg-transparent"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <Button
          onPress={() => router.back()}
          className="p-2 bg-transparent shadow-none"
        >
          <Ionicons name="arrow-back" size={24} color={colors.gray[800]} />
        </Button>
        <Text className="text-lg font-bold text-gray-900">Edit Profile</Text>
        <Button
          onPress={handleSave}
          disabled={isPending || uploadingImage}
          loading={isPending}
          className="bg-transparent shadow-none p-2"
          textClassName="text-indigo-600 font-bold text-base"
          title={isPending ? undefined : "Save"}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View className="items-center mb-8 mt-4">
          <Button
            onPress={handleImagePicker}
            disabled={uploadingImage}
            className="relative bg-transparent rounded-full p-0 shadow-none"
          >
            <View className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm items-center justify-center">
              <Image
                source={{ uri: formData.profilePic }}
                className="w-full h-full self-center"
                style={{ width: 100, height: 100 }}
                contentFit="cover"
                transition={100}
                placeholder={blurhash}
              />
              {uploadingImage && (
                <View className="absolute inset-0 bg-black/40 items-center justify-center">
                  <ActivityIndicator color="white" />
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full items-center justify-center border-2 border-white">
              <Feather name="camera" size={14} color="white" />
            </View>
          </Button>
        </View>

        {/* Form Fields */}
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 gap-y-4">
          <View>
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Full Name
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 h-14">
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.gray[400]}
              />
              <TextInput
                value={formData.name}
                onChangeText={(val) => handleChange("name", val)}
                placeholder="Dr. John Doe"
                className="flex-1 ml-3 text-gray-800 font-medium text-base"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View className="z-50 relative mt-2">
            <DatePickerInput
              value={formData.dob ? new Date(formData.dob) : undefined}
              onChange={(date) => handleChange("dob", date.toISOString())}
              theme="light"
            />
          </View>

          <View className="z-10 relative mt-4">
            <GenderSelector
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              theme="light"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Specialization
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 h-14">
              <Ionicons
                name="medical-outline"
                size={20}
                color={colors.gray[400]}
              />
              <TextInput
                value={formData.specialization}
                onChangeText={(val) => handleChange("specialization", val)}
                placeholder="Physiotherapist"
                className="flex-1 ml-3 text-gray-800 font-medium text-base"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View>
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Professional Bio
            </Text>
            <View className="flex-row items-start bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 min-h-[100px]">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.gray[400]}
                className="mt-1"
              />
              <TextInput
                value={formData.bio}
                onChangeText={(val) => handleChange("bio", val)}
                placeholder="Tell patients about your expertise..."
                multiline
                textAlignVertical="top"
                className="flex-1 ml-3 text-gray-800 font-medium text-base h-full"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View>
            <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5 ml-1 mt-4">
              Advanced Operations
            </Text>
          </View>

          <View>
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Medical License
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 h-14">
              <Ionicons
                name="card-outline"
                size={20}
                color={colors.gray[400]}
              />
              <TextInput
                value={formData.licenseNumber}
                onChangeText={(val) => handleChange("licenseNumber", val)}
                placeholder="PHY-12345"
                className="flex-1 ml-3 text-gray-800 font-medium text-base"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          {/* Sub-Specializations */}
          <View>
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Sub-Specializations
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {formData.subSpecializations.map((sub, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-indigo-50 border border-indigo-200 pl-3 pr-2 py-1.5 rounded-full gap-1.5"
                >
                  <Text className="text-indigo-700 font-semibold text-sm">
                    {sub}
                  </Text>
                  <Button
                    onPress={() =>
                      handleChange(
                        "subSpecializations",
                        formData.subSpecializations.filter(
                          (_, i) => i !== index,
                        ),
                      )
                    }
                    className="w-5 h-5 rounded-full bg-indigo-200 items-center justify-center p-0 shadow-none"
                  >
                    <Ionicons
                      name="close"
                      size={12}
                      color={colors.indigo[700]}
                    />
                  </Button>
                </View>
              ))}
            </View>

            {showSubSpecInput ? (
              <View className="flex-row items-center mt-3 gap-2">
                <View className="flex-1 flex-row items-center bg-gray-50 rounded-2xl px-3 border border-indigo-300 h-12">
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color={colors.indigo[400]}
                  />
                  <TextInput
                    value={newSubSpecInput}
                    onChangeText={setNewSubSpecInput}
                    placeholder="e.g. Sports Therapy"
                    placeholderTextColor={colors.gray[400]}
                    className="flex-1 ml-2 text-gray-800 font-medium"
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      if (newSubSpecInput.trim()) {
                        handleChange("subSpecializations", [
                          ...formData.subSpecializations,
                          newSubSpecInput.trim(),
                        ]);
                        setNewSubSpecInput("");
                        setShowSubSpecInput(false);
                      }
                    }}
                  />
                </View>
                <Button
                  onPress={() => {
                    if (newSubSpecInput.trim()) {
                      handleChange("subSpecializations", [
                        ...formData.subSpecializations,
                        newSubSpecInput.trim(),
                      ]);
                      setNewSubSpecInput("");
                    }
                    setShowSubSpecInput(false);
                  }}
                  className="w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center p-0 shadow-none"
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                </Button>
                <Button
                  onPress={() => {
                    setNewSubSpecInput("");
                    setShowSubSpecInput(false);
                  }}
                  className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center p-0 shadow-none"
                >
                  <Ionicons name="close" size={20} color={colors.gray[500]} />
                </Button>
              </View>
            ) : (
              <Button
                onPress={() => setShowSubSpecInput(true)}
                className="flex-row items-center gap-2 mt-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 shadow-none"
                title="Add Sub-Specialization "
                leftIcon="add-circle-outline"
                leftIconColor={colors.indigo[600]}
                textClassName="text-indigo-600 font-semibold"
              ></Button>
            )}
          </View>

          {/* Qualifications History */}
          <View className="mt-2">
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Qualifications
            </Text>

            {formData.qualifications.map((qual, index) => (
              <View
                key={index}
                className="bg-white border border-gray-200 rounded-2xl mb-3 overflow-hidden shadow-sm"
              >
                {/* Card Header */}
                <View className="flex-row items-center justify-between bg-indigo-50 px-4 py-2.5 border-b border-indigo-100">
                  <View className="flex-row items-center gap-2">
                    <View className="w-7 h-7 rounded-full bg-indigo-100 items-center justify-center">
                      <Text className="text-indigo-700 font-bold text-xs">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-indigo-800 font-bold text-sm">
                      {qual.degree || "Qualification"}
                    </Text>
                  </View>
                  <Button
                    onPress={() =>
                      handleChange(
                        "qualifications",
                        formData.qualifications.filter((_, i) => i !== index),
                      )
                    }
                    className="p-1.5 rounded-xl bg-red-50 shadow-none"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={15}
                      color={colors.red[500]}
                    />
                  </Button>
                </View>

                {/* Fields */}
                <View className="px-4 pt-3 pb-4 gap-3">
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-3 border border-gray-100 h-12">
                    <Ionicons
                      name="school-outline"
                      size={17}
                      color={colors.indigo[400]}
                    />
                    <TextInput
                      value={qual.degree}
                      onChangeText={(val) => {
                        const next = [...formData.qualifications];
                        next[index] = { ...next[index], degree: val };
                        handleChange("qualifications", next);
                      }}
                      placeholder="Degree (e.g. BPT, MPT)"
                      placeholderTextColor={colors.gray[400]}
                      className="flex-1 ml-2 text-gray-800 font-medium text-sm"
                    />
                  </View>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-3 border border-gray-100 h-12">
                    <Ionicons
                      name="business-outline"
                      size={17}
                      color={colors.gray[400]}
                    />
                    <TextInput
                      value={qual.college}
                      onChangeText={(val) => {
                        const next = [...formData.qualifications];
                        next[index] = { ...next[index], college: val };
                        handleChange("qualifications", next);
                      }}
                      placeholder="College / University"
                      placeholderTextColor={colors.gray[400]}
                      className="flex-1 ml-2 text-gray-800 font-medium text-sm"
                    />
                  </View>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-3 border border-gray-100 h-12">
                    <Ionicons
                      name="calendar-outline"
                      size={17}
                      color={colors.gray[400]}
                    />
                    <TextInput
                      value={qual.year?.toString()}
                      keyboardType="numeric"
                      onChangeText={(val) => {
                        const next = [...formData.qualifications];
                        next[index] = { ...next[index], year: Number(val) };
                        handleChange("qualifications", next);
                      }}
                      placeholder="Graduation Year (e.g. 2020)"
                      placeholderTextColor={colors.gray[400]}
                      className="flex-1 ml-2 text-gray-800 font-medium text-sm"
                    />
                  </View>
                </View>
              </View>
            ))}

            <Button
              className="flex-row items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 h-12 justify-center mt-1 shadow-none"
              onPress={() =>
                handleChange("qualifications", [
                  ...formData.qualifications,
                  { degree: "", college: "", year: "" },
                ])
              }
              title="Add Qualification "
              leftIcon="add-circle-outline"
              leftIconColor={colors.indigo[600]}
              textClassName="text-indigo-600 font-semibold"
            ></Button>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Experience (Yrs)
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 h-14">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.gray[400]}
                />
                <TextInput
                  value={formData.experience}
                  onChangeText={(val) => handleChange("experience", val)}
                  placeholder="5"
                  keyboardType="numeric"
                  className="flex-1 ml-3 text-gray-800 font-medium text-base"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Fee (₹)
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 h-14">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={colors.gray[400]}
                />
                <TextInput
                  value={formData.fee}
                  onChangeText={(val) => handleChange("fee", val)}
                  placeholder="500"
                  keyboardType="numeric"
                  className="flex-1 ml-3 text-gray-800 font-medium text-base"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
