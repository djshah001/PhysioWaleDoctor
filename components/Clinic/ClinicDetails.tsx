import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Animated, { FadeInDown } from "react-native-reanimated";

import FreeformChips from "./FreeformChips";

interface ClinicDetailsProps {
  // Basic Info
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  consultationFee: string;
  setConsultationFee: (value: string) => void;
  // Metadata
  clinicType: string;
  setClinicType: (value: string) => void;
  specializations: string[];
  setSpecializations: (value: string[]) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  // Social Links
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  setSocialLinks: (value: any) => void;
}

const CLINIC_TYPES = [
  "Private Clinic",
  "Hospital",
  "Wellness Center",
  "Rehabilitation Center",
  "Sports Clinic",
];

export default function ClinicDetails({
  name,
  setName,
  description,
  setDescription,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  website,
  setWebsite,
  consultationFee,
  setConsultationFee,
  clinicType,
  setClinicType,
  specializations,
  setSpecializations,
  tags,
  setTags,
  socialLinks,
  setSocialLinks,
}: ClinicDetailsProps) {
  const [socialCollapsed, setSocialCollapsed] = useState(true);

  return (
    <View className="flex-1">
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} className="mb-6">
        <View className="flex-row items-center mb-2">
          <MaterialCommunityIcons
            name="hospital-building"
            size={28}
            color="#4f46e5"
          />
          <Text className="text-2xl font-bold text-gray-900 ml-3">
            Clinic Details
          </Text>
        </View>
        <Text className="text-gray-500 text-sm">
          Tell us about your clinic and what makes it special
        </Text>
      </Animated.View>

      {/* Basic Information */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <Text className="text-base font-semibold text-gray-900 mb-3">
          Basic Information
        </Text>

        {/* Clinic Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Clinic Name <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
            <MaterialCommunityIcons
              name="hospital-marker"
              size={20}
              color="#6b7280"
            />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="e.g., PhysioWale Clinic"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Description <Text className="text-red-500">*</Text>
          </Text>
          <View className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <TextInput
              className="text-base text-gray-900 min-h-[80px]"
              placeholder="Describe your clinic, services, and expertise..."
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Consultation Fee */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Consultation Fee (₹) <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
            <MaterialCommunityIcons
              name="currency-inr"
              size={20}
              color="#6b7280"
            />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="500"
              placeholderTextColor="#9ca3af"
              value={consultationFee}
              onChangeText={setConsultationFee}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Phone Number <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
            <Ionicons name="call" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="+91 98765 43210"
              placeholderTextColor="#9ca3af"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
            <Ionicons name="mail" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="clinic@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Website */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Website
          </Text>
          <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
            <Ionicons name="globe" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="www.yourwebsite.com"
              placeholderTextColor="#9ca3af"
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>
      </Animated.View>

      {/* Clinic Type & Specializations */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <Text className="text-base font-semibold text-gray-900 mb-3">
          Specialization
        </Text>

        {/* Clinic Type */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Clinic Type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CLINIC_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setClinicType(type)}
                className={`px-4 py-2 rounded-full border ${
                  clinicType === type
                    ? "bg-indigo-500 border-indigo-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    clinicType === type ? "text-white" : "text-gray-700"
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specializations */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Specializations
          </Text>
          <FreeformChips
            selectedItems={specializations}
            onSelectionChange={setSpecializations}
            placeholder="Add specialization (e.g., Sports Injury)"
          />
        </View>

        {/* Tags */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Tags</Text>
          <FreeformChips
            selectedItems={tags}
            onSelectionChange={setTags}
            placeholder="Add tag (e.g., Wheelchair Accessible)"
          />
        </View>
      </Animated.View>

      {/* Social Links (Collapsible) */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <TouchableOpacity
          onPress={() => setSocialCollapsed(!socialCollapsed)}
          className="flex-row items-center justify-between mb-3"
        >
          <Text className="text-base font-semibold text-gray-900">
            Social Media (Optional)
          </Text>
          <Ionicons
            name={socialCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>

        <Collapsible collapsed={socialCollapsed}>
          <View className="space-y-4">
            {/* Facebook */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Facebook
              </Text>
              <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
                <Ionicons name="logo-facebook" size={20} color="#1877f2" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="facebook.com/yourpage"
                  placeholderTextColor="#9ca3af"
                  value={socialLinks.facebook || ""}
                  onChangeText={(text) =>
                    setSocialLinks({ ...socialLinks, facebook: text })
                  }
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Instagram */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Instagram
              </Text>
              <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
                <Ionicons name="logo-instagram" size={20} color="#e4405f" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="instagram.com/yourpage"
                  placeholderTextColor="#9ca3af"
                  value={socialLinks.instagram || ""}
                  onChangeText={(text) =>
                    setSocialLinks({ ...socialLinks, instagram: text })
                  }
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* YouTube */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                YouTube
              </Text>
              <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
                <Ionicons name="logo-youtube" size={20} color="#ff0000" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="youtube.com/@yourchannel"
                  placeholderTextColor="#9ca3af"
                  value={socialLinks.youtube || ""}
                  onChangeText={(text) =>
                    setSocialLinks({ ...socialLinks, youtube: text })
                  }
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </Collapsible>
      </Animated.View>
    </View>
  );
}
