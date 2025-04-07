import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useUserDataState,
  useToastSate,
  useClinicsState,
} from "./../../atoms/store.js";
import CustomBtn from "./../../components/CustomBtn.jsx";
import colors from "./../../constants/colors.js";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables.jsx";
import { Appbar, Icon, IconButton, Chip, Badge } from "react-native-paper";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import * as Location from "expo-location";
import ClinicItem from "../../components/Home/ClinicItem.jsx";
import HorList from "../../components/Home/HorList.jsx";
import IconMenu from "../../components/Home/IconMenu.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { HorizontalList } from "../../constants/Data.js";

cssInterop(Image, { className: "style" });
cssInterop(Appbar, { className: "style" });



const Home = () => {
  const [UserData, setUserData] = useUserDataState();
  const [Clinics, setClinics] = useClinicsState();
  const [setToast] = useToastSate();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadRef = useRef(false);

  // Memoize the welcome message to prevent re-renders
  const welcomeMessage = useMemo(
    () => (
      <View>
        <Text className="text-sm leading-4 font-bold text-gray-600">
          Hi, Welcome Back!
        </Text>
        <Text className="text-xl leading-6 font-pbold text-black-200">
          {UserData?.name}
        </Text>
      </View>
    ),
    [UserData.name]
  );

  // Optimize API calls with useCallback
  const getLoggedInData = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    setIsLoading(true);
    if (!authToken) {
      setToast({
        title: "No auth token found",
        visible: true,
        type: "error",
      });
      setIsLoading(false);
      setRefreshing(false);
      router.replace("/sign-in");
      return;
    }
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/auth/getLoggedInData/doctor`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.success) {
        setUserData(response.data.loggedInData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error);
      setToast({
        title: "Failed to fetch user data",
        visible: true,
        type: "error",
      });
      await AsyncStorage.multiRemove(["authToken", "isLoggedIn"]);
      router.replace("/sign-in");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [setUserData, setToast]);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    setRefreshing(true);

    // Check for location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setToast({
        title: "Location Permission Denied",
        visible: true,
        type: "error",
      });
      setRefreshing(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserData((prev) =>
        prev?.location?.latitude !== location.coords.latitude ||
        prev?.location?.longitude !== location.coords.longitude
          ? { ...prev, location: location.coords }
          : prev
      );
    } catch (error) {
      console.error("Location error:", error);
      setToast({
        title: "Location Permission Denied",
        visible: true,
        type: "error",
      });
    } finally {
      setRefreshing(false);
    }
  }, [setUserData, setToast]);

  // Get nearby hospitals
  const getNearbyHospitals = useCallback(async () => {
    if (!UserData?.location?.latitude || !UserData?.location?.longitude) {
      setRefreshing(false);
      return;
    }

    setIsLoading(true);
    const url = `${apiUrl}/api/v/clinics/nearby?latitude=${UserData.location.latitude}&longitude=${UserData.location.longitude}&radius=5`;

    try {
      const response = await axios.get(url);
      setClinics(response.data.data.clinics || []);
    } catch (error) {
      console.error(error?.response?.data || error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [UserData?.location?.latitude, UserData?.location?.longitude, setClinics]);

  // Use useEffect to handle location changes
  useEffect(() => {
    if (UserData?.location?.latitude && UserData?.location?.longitude) {
      getNearbyHospitals();
    }
  }, [UserData?.location, getNearbyHospitals]);

  // Use useFocusEffect to handle initial load only
  useFocusEffect(
    useCallback(() => {
      // Only run on initial load, not on every focus
      if (!UserData || Object.keys(UserData).length === 0) {
        getLoggedInData();
        getCurrentLocation();
        initialLoadRef.current = true;
      }
    }, [getLoggedInData, getCurrentLocation])
  );

  // Memoize the app bar actions to prevent re-renders
  const appBarActions = useCallback(
    () => (
      <>
        <Appbar.Action
          icon="bell-outline"
          color={colors.black[300]}
          onPress={() => router.push("/notifications")}
        />
        <Appbar.Action
          icon="qrcode-scan"
          onPress={() => router.push("Scanner/Scan")}
        />
      </>
    ),
    []
  );

  // Create a ListHeaderComponent for FlashList
  const ListHeaderComponent = useCallback(
    () => (
      <View className="gap-4">
        <HorList data={HorizontalList} />
        <IconMenu />
        <View className="px-4 mt-2">
          <Text className="text-xl font-pbold text-black-200">
            Nearby Clinics
          </Text>
          <Text className="text-sm font-oslight text-gray-600">
            Find clinics near your location
          </Text>
        </View>
      </View>
    ),
    []
  );

  // Create a dedicated refresh function
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <SafeAreaView className="bg-white-300 flex-1">
      <Appbar.Header
        // mode="center-aligned"
        statusBarHeight={0}
        className="bg-white-300"
      >
        <Appbar.Content title={welcomeMessage} />
        {appBarActions()}
      </Appbar.Header>

      <View className="flex-1">
        <FlashList
          data={Clinics}
          renderItem={({ item, index }) => (
            <ClinicItem clinic={item} index={index} IsLoading={refreshing} />
          )}
          estimatedItemSize={400}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center px-6 py-10">
              <View className="bg-white-400 rounded-3xl p-8 shadow-lg items-center w-full max-w-md">
                <Icon
                  source="map-search"
                  size={80}
                  color={colors.blueishGreen[500]}
                />
                <Text className="text-2xl text-center text-black-200 font-pbold mt-6 mb-2">
                  No Clinics Nearby
                </Text>
                <Text className="text-center text-black-300 mb-6">
                  We couldn't find any clinics near your current location. Try
                  increasing the search radius or check your location settings.
                </Text>
                <CustomBtn
                  title="Refresh Location"
                  iconName="refresh"
                  handlePress={getCurrentLocation}
                  customStyles="w-full"
                  secondScheme={true}
                />
              </View>
            </View>
          }
        />
      </View>
      <StatusBar style="inverted" />
    </SafeAreaView>
  );
};

export default Home;
