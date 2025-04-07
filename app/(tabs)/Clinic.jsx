import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserDataState, useToastSate } from "./../../atoms/store.js";
import CustomBtn from "./../../components/CustomBtn.jsx";
import colors from "./../../constants/colors.js";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables.jsx";
import { Appbar, Icon, IconButton, Chip, Badge, FAB } from "react-native-paper";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(Image, { className: "style" });
cssInterop(Appbar, { className: "style" });

const Clinic = () => {
  const [UserData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only fetch clinics if we need to refresh or don't have them already
  const fetchClinics = async (forceRefresh = false) => {
    // If we already have clinics and aren't forcing a refresh, don't fetch
    if (UserData.clinics.length > 0 && !forceRefresh && !refreshing) {
      return;
    }

    setLoading(true);
    const authToken = await AsyncStorage.getItem("authToken");
    try {
      const res = await axios.get(
        `${apiUrl}/api/v/clinics/by-doctor?id=${UserData._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (res.data.success) {
        setUserData((prev) => ({
          ...prev,
          clinics: res.data.data || [],
        }));
      }
    } catch (error) {
      console.error("Fetch clinics error:", error.response?.data);
      setToast({
        message: "Failed to fetch clinics",
        visible: true,
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClinics(true); // Force refresh
  }, []);

  // Only fetch clinics on focus if we don't have them already
  useFocusEffect(
    useCallback(() => {
      fetchClinics();
    }, [])
  );

  const EmptyClinicView = () => (
    <View className="flex-1 justify-center items-center px-6 py-10">
      <View className="bg-white-400 rounded-3xl p-8 shadow-lg items-center w-full max-w-md">
        <MaterialIcons
          name="add-location-alt"
          size={120}
          color={colors.blueishGreen[500]}
        />
        <Text className="text-2xl text-center text-black-200 font-pbold mt-6 mb-2">
          No Clinics Found
        </Text>
        <Text className="text-center text-black-300 mb-6">
          You haven't registered any clinics yet. Add your first clinic to
          manage appointments and patients.
        </Text>
        <CustomBtn
          title="Register New Clinic"
          iconName="hospital-building"
          handlePress={() => router.push("clinics/register")}
          customStyles="w-full"
          secondScheme={true}
        />
      </View>
    </View>
  );

  const renderClinicCard = useCallback(({ item: clinic }) => (
    <View className="my-2 mx-4 rounded-3xl overflow-hidden bg-white-400 shadow-lg shadow-black-200/20 elevation-3">
      <Image
        source={{
          uri: clinic.images?.[0] || "https://via.placeholder.com/400",
        }}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
        className="w-full h-72 rounded-t-3xl"
      />

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-pbold text-black-200 flex-1 mr-2">
            {clinic.name}
          </Text>
          <Chip
            icon={clinic.open24hrs ? "clock-check" : "clock-outline"}
            mode="outlined"
            textStyle={{ fontSize: 12 }}
            style={{
              backgroundColor: clinic.open24hrs
                ? colors.secondary[100]
                : colors.white[300],
            }}
          >
            {clinic.open24hrs ? "Open 24hrs" : "Custom Hours"}
          </Chip>
        </View>

        <View className="flex-row items-center mb-3">
          <Icon
            source="map-marker"
            size={18}
            color={colors.accent["DEFAULT"]}
          />
          <Text className="text-black-300 ml-1 flex-1" numberOfLines={1}>
            {clinic.address || "Address not available"}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <Badge size={24} style={{ backgroundColor: colors.secondary[300] }}>
              {clinic.appointments?.length || 0}
            </Badge>
            <Text className="text-black-300 ml-1">Appointments</Text>
          </View>

          <IconButton
            icon="arrow-right"
            mode="contained"
            containerColor={colors.secondary[300]}
            iconColor={colors.white[300]}
            size={20}
            onPress={() =>
              router.push({
                pathname: "/clinics/".concat(clinic._id),
                params: { clinicId: clinic._id },
              })
            }
          />
        </View>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView className="bg-white-300 flex-1">
      <Appbar.Header
        mode="center-aligned"
        statusBarHeight={0}
        className="bg-white-300"
      >
        <Appbar.Content
          title="Your Clinics"
          titleStyle={{ fontFamily: "Poppins_700Bold", fontSize: 20 }}
        />
        <Appbar.Action
          icon="refresh"
          onPress={onRefresh}
          disabled={refreshing}
        />
      </Appbar.Header>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.secondary[300]} />
          <Text className="mt-4 text-black-300">Loading your clinics...</Text>
        </View>
      ) : UserData.clinics?.length === 0 ? (
        <EmptyClinicView />
      ) : (
        <View className="flex-1">
          <FlashList
            data={UserData.clinics}
            renderItem={renderClinicCard}
            estimatedItemSize={400}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom:60 , }}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListEmptyComponent={<EmptyClinicView />}
          />
        </View>
      )}

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 5,
          bottom: 55,
          backgroundColor: colors.secondary[300],
        }}
        color={colors.white[300]}
        onPress={() => router.push("clinics/register")}
      />
    </SafeAreaView>
  );
};

export default Clinic;
