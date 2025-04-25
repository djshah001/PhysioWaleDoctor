import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useUserDataState } from "../../atoms/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Link } from "expo-router";
import { Image } from "expo-image";
import { Icon, Divider } from "react-native-paper";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables";
import CustomBtn from "../../components/CustomBtn";
import colors from "../../constants/colors";

// Import custom profile components
import ProfessionalDetailsCard from "../../components/Profile/ProfessionalDetailsCard";
import AchievementBadges from "../../components/Profile/AchievementBadges";
import PerformanceMetrics from "../../components/Profile/PerformanceMetrics";
import AvailabilitySchedule from "../../components/Profile/AvailabilitySchedule";
import RecentActivity from "../../components/Profile/RecentActivity";

cssInterop(Image, { className: "style" });
cssInterop(Icon, { className: "style" });
cssInterop(Divider, { className: "style" });

// Profile menu links component
function ProfileLinks({ href, title, icon }) {
  return (
    <>
      <Link href={href} asChild>
        <TouchableOpacity className="px-4 py-3 rounded-xl active:bg-gray-100">
          <View className="flex-row w-full justify-between items-center">
            <View className="flex-row items-center gap-3">
              <Icon source={icon} size={24} color={colors.secondary[300]} />
              <Text className="font-pmedium text-lg text-gray-800">{title}</Text>
            </View>
            <Icon source="chevron-right" size={24} color={colors.gray[400]} />
          </View>
        </TouchableOpacity>
      </Link>
      <Divider style={{ backgroundColor: colors.gray[200] }} />
    </>
  );
}

const Profile = () => {
  const [UserData, setUserData] = useUserDataState();

  const SignOut = async () => {
    setUserData({});
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/sign-in");
  };

  // Profile menu items
  const ProfileMenu = [
    {
      href: '/appointments/my-appointments',
      title: 'My Appointments',
      icon: 'calendar'
    },
    {
      href: '/profile/edit-profile',
      title: 'Edit Profile',
      icon: 'account-edit'
    },
    {
      href: '/analytics',
      title: 'Analytics Dashboard',
      icon: 'chart-bar'
    }
  ];

  return (
    <SafeAreaView className="h-full bg-white-300">
      <ScrollView
        className="px-4"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Gradient Background */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="mb-4 rounded-2xl overflow-hidden"
        >
          <LinearGradient
            colors={[colors.secondary[200], colors.secondary[300]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="p-6 items-center"
          >
            {/* Profile Image */}
            <View className="relative mb-3">
              <Image
                source={
                  UserData.profilePic ? { uri: UserData.profilePic } : images.no
                }
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
                className="w-28 h-28 rounded-full border-4 border-white-400"
              />
              <Link
                href="/profile/edit-profile"
                asChild
              >
                <TouchableOpacity className="absolute bottom-0 right-0 bg-white-400 p-2 rounded-full shadow-md">
                  <Icon source="pencil" size={18} color={colors.secondary[300]} />
                </TouchableOpacity>
              </Link>
            </View>

            {/* User Info */}
            <Text className="text-white-400 font-pbold text-2xl">
              {UserData.name}
            </Text>
            <Text className="text-white-300 font-osregular text-sm mt-1">
              {UserData.email}
            </Text>

            {/* Additional User Info */}
            {(UserData.phoneNumber || UserData.specialization) && (
              <View className="flex-row mt-3 bg-white-400/20 px-4 py-2 rounded-full">
                <Icon source="phone" size={16} color={colors.white[300]} />
                <Text className="text-white-300 font-osregular text-xs ml-1">
                  {UserData.phoneNumber || "Not available"}
                </Text>
                {UserData.specialization && (
                  <>
                    <Text className="text-white-300 mx-2">•</Text>
                    <Icon source="medical-bag" size={16} color={colors.white[300]} />
                    <Text className="text-white-300 font-osregular text-xs ml-1">
                      {UserData.specialization}
                    </Text>
                  </>
                )}
              </View>
            )}
          </LinearGradient>
        </MotiView>

        {/* Stats Summary */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 100 }}
          className="mb-4"
        >
          <View className="flex-row justify-between bg-white-100 rounded-2xl p-4 shadow-sm shadow-black-200">
            <View className="items-center flex-1 border-r border-gray-200">
              <Text className="font-pbold text-xl text-secondary-300">
                {UserData.stats?.totalAppointments || 0}
              </Text>
              <Text className="font-osregular text-xs text-gray-600">
                Appointments
              </Text>
            </View>

            <View className="items-center flex-1 border-r border-gray-200">
              <Text className="font-pbold text-xl text-secondary-300">
                {UserData.stats?.clinicsCount || 0}
              </Text>
              <Text className="font-osregular text-xs text-gray-600">
                Clinics
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="font-pbold text-xl text-secondary-300">
                {UserData.stats?.rating || "N/A"}
              </Text>
              <Text className="font-osregular text-xs text-gray-600">
                Rating
              </Text>
            </View>
          </View>
        </MotiView>

        {/* Professional Details */}
        <ProfessionalDetailsCard userData={UserData} />

        {/* Performance Metrics */}
        <PerformanceMetrics metrics={UserData.metrics} />

        {/* Achievement Badges */}
        <AchievementBadges achievements={UserData.achievements} />

        {/* Availability Schedule */}
        <AvailabilitySchedule schedule={UserData.schedule} />

        {/* Recent Activity */}
        <RecentActivity activities={UserData.activities} />

        {/* Menu Items */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 400 }}
          className="mb-4"
        >
          <View className="bg-white-100 rounded-2xl p-4 shadow-sm shadow-black-200">
            {ProfileMenu.map((item) => (
              <ProfileLinks key={item.title} {...item} />
            ))}
          </View>
        </MotiView>

        {/* Logout Button */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 450 }}
        >
          <CustomBtn
            title="Log Out"
            iconName="logout"
            handlePress={SignOut}
            className="rounded-xl"
            bgColor={"#E53E3E"}
            textColor={"#FFFFFF"}
          />
        </MotiView>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
