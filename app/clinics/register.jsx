import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MotiView } from "moti";

import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Appbar,
  IconButton,
  Divider,
  SegmentedButtons,
  ProgressBar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-actions-sheet";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useToastSate, useUserDataState } from "../../atoms/store";

import CustomBtn from "../../components/CustomBtn";
import { ChooseTimings } from "../../components/ChooseTimings";
import CustomInput from "./../../components/ReUsables/CustomInput";
import { SearchBarWithSugg } from "../../components/SearchBarWithSugg";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";

import colors from "./../../constants/colors";
import { Image } from "expo-image";
import { ImageGrid } from "../../components/ReUsables/ImageGrid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../../components/Utility/Repeatables";

const RegisterClinic = () => {
  const {
    IsLoading,
    Error,
    setError,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
  } = useLoadingAndDialog();

  /* -------------------------------------------------------------------------- */
  /*                                    States                                   */
  /* -------------------------------------------------------------------------- */
  const [UserData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [Places, setPlaces] = useState([]);
  const [ShowSuggestions, setShowSuggestions] = useState(false);
  const [Imgs, setImgs] = useState([]);
  const [UplaodLoading, setUplaodLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [ClinicData, setClinicData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    location: {},
    open24hrs: false,
    images: [],
    timing: {
      sunday: { isClosed: false, opening: "", closing: "" },
      monday: { isClosed: false, opening: "", closing: "" },
      tuesday: { isClosed: false, opening: "", closing: "" },
      wednesday: { isClosed: false, opening: "", closing: "" },
      thursday: { isClosed: false, opening: "", closing: "" },
      friday: { isClosed: false, opening: "", closing: "" },
      saturday: { isClosed: false, opening: "", closing: "" },
    },
  });

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [25, 50, 75, 100], []);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  const validateForm = () => {
    const errors = {};

    if (!ClinicData.name) errors.name = "Clinic name is required";
    if (!ClinicData.address) errors.address = "Address is required";
    if (!ClinicData.phoneNumber)
      errors.phoneNumber = "Contact number is required";
    if (ClinicData.phoneNumber && !/^\d{10}$/.test(ClinicData.phoneNumber))
      errors.phoneNumber = "Please enter a valid 10-digit phone number";
    if (!ClinicData.city) errors.city = "City is required";
    if (!ClinicData.state) errors.state = "State is required";
    if (!ClinicData.country) errors.country = "Country is required";
    if (ClinicData.images.length === 0)
      errors.images = "Please upload at least one image";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const changeQueryText = async (e) => {
    setSearchQuery(e);
    setIsLoading(true);

    if (e.length < 2) {
      setPlaces([]);
      setIsLoading(false);
      return;
    }

    try {
      const autoCompleteApi = `${apiUrl}/api/v/clinics/autocomplete`;
      const res = await axios.post(autoCompleteApi, {
        searchQuery: e,
        latitude: UserData.location?.latitude || 22.295076,
        longitude: UserData.location?.longitude || 73.2468642,
      });
      if (res.data && res.data.suggestions) {
        setPlaces(res.data.suggestions);
      } else {
        console.error("Unexpected response structure:", res.data);
      }
    } catch (error) {
      console.error(
        "Error fetching autocomplete suggestions:",
        error.response ? error.response.data : error.message
      );
    }
    setIsLoading(false);
  };

  const extractLocationDetails = (addressComponents, textToFetch) => {
    const txt = textToFetch || "longText";

    const country = addressComponents.find((component) =>
      component.types.includes("country")
    )?.[txt];

    const state = addressComponents.find((component) =>
      component.types.includes("administrative_area_level_1")
    )?.[txt];

    const city = addressComponents.find((component) =>
      component.types.includes("locality")
    )?.[txt];

    const pincode = addressComponents.find((component) =>
      component.types.includes("postal_code")
    )?.[txt];

    return { country, state, city, pincode };
  };

  const getPlaceDetails = async (item) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/v/clinics/${item.placePrediction.placeId}`
      );

      const { country, state, city, pincode } = extractLocationDetails(
        res.data.addressComponents
      );

      const address = res.data.formattedAddress
        .split(",")
        .slice(0, -3)
        .join(",");

      setClinicData((prev) => ({
        ...prev,
        name: item.placePrediction.structuredFormat.mainText.text,
        location: {
          latitude: res.data.location.latitude,
          longitude: res.data.location.longitude,
        },
        country: country,
        state: state,
        city: city,
        address: address,
        pincode: pincode,
      }));
      setShowSuggestions(false);
    } catch (error) {
      setToast({
        message: "Error fetching place details",
        visible: true,
        type: "error",
      });
    }
    setIsLoading(false);
  };

  const getClinicDataFromLocation = async () => {
    if (!UserData.location?.latitude || !UserData.location?.longitude) {
      setToast({
        message: "Location not available. Please enable location services.",
        visible: true,
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const API = `${apiUrl}/api/v/clinics/details/by-location?latitude=${UserData.location.latitude}&longitude=${UserData.location.longitude}`;
      const res = await axios.get(API);

      const { country, state, city } = extractLocationDetails(
        res.data.results[0].address_components,
        "long_name"
      );
      const address = res.data.results[0].formatted_address
        .split(",")
        .slice(0, -3)
        .join(",");

      setClinicData((prev) => ({
        ...prev,
        location: {
          latitude: UserData.location.latitude,
          longitude: UserData.location.longitude,
        },
        country: country,
        state: state,
        city: city,
        address: address,
      }));
    } catch (error) {
      setToast({
        message: "Error fetching location details",
        visible: true,
        type: "error",
      });
    }
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setClinicData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const onSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 4,
        orderedSelection: true,
        aspect: [16, 9],
        base64: false,
        // exif: false,
      });

      if (!result.canceled) {
        setImgs(result.assets);
      }
    } catch (error) {
      setToast({
        message: "Error selecting images",
        visible: true,
        type: "error",
      });
    }
  };

  const UploadImages = async () => {
    if (Imgs.length === 0) {
      setToast({
        message: "Please select images first",
        visible: true,
        type: "warning",
      });
      return;
    }

    setUplaodLoading(true);
    try {
      const formData = new FormData();

      for (let i = 0; i < Imgs.length; i++) {
        formData.append("images", {
          uri: Imgs[i].uri,
          name: `image${i}.jpg`,
          type: "image/jpg",
        });
      }

      const res = await axios.post(
        `${apiUrl}/api/v/clinics/upload-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setClinicData((prev) => ({ ...prev, images: res.data.imageUrls }));
        setToast({
          message: "Images Uploaded Successfully",
          visible: true,
          type: "success",
        });
      } else {
        setToast({
          message: res.data.errors[0].msg || "Error uploading images",
          visible: true,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Error uploading images",
        visible: true,
        type: "error",
      });
    }
    setUplaodLoading(false);
  };

  const createClinic = async () => {
    if (!validateForm()) {
      setToast({
        message: "Please fill all required fields",
        visible: true,
        type: "error",
      });
      return;
    }

    setCreateLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");

      const res = await axios.post(
        `${apiUrl}/api/v/clinics/register`,
        {
          ...ClinicData,
          coords: [ClinicData.location.latitude, ClinicData.location.longitude],
        },
        { headers: { authToken: authToken } }
      );

      if (res.data.success) {
        router.back();
        setToast({
          message: "Clinic Created Successfully",
          visible: true,
          type: "success",
        });
      } else {
        setToast({
          message: res.data.errors[0].msg || "Error creating clinic",
          visible: true,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Error creating clinic",
        visible: true,
        type: "error",
      });
    }
    setCreateLoading(false);
  };

  // Animation values for step transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Enhanced step change with animation
  const changeStep = (step) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(step);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Render form section based on current step
  const renderFormSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View style={{ opacity: fadeAnim }} className="gap-3">
            <Text className="text-lg font-pbold text-black-400 mb-2">
              Basic Information
            </Text>

            <CustomInput
              label="Clinic Name"
              placeholder="Enter clinic name"
              leftIcon="hospital-building"
              value={ClinicData.name}
              handleChange={(value) => handleChange("name", value)}
              error={formErrors.name}
              required
              noBR={true}
            />

            <CustomInput
              label="Description"
              placeholder="Describe your clinic and services"
              leftIcon="information-outline"
              value={ClinicData.description}
              handleChange={(value) => handleChange("description", value)}
              multiline={true}
              numberOfLines={4}
              noBR={true}
            />

            <CustomInput
              keyboardType="phone-pad"
              label="Contact Number"
              placeholder="Enter 10-digit phone number"
              leftIcon="phone"
              value={ClinicData.phoneNumber}
              handleChange={(value) => handleChange("phoneNumber", value)}
              error={formErrors.phoneNumber}
              required
              noBR={true}
            />

            <View className="flex-row justify-between mt-4">
              <CustomBtn
                title="Cancel"
                iconName="close"
                customStyles="flex-1 mr-2"
                secondScheme={false}
                handlePress={() => router.back()}
              />
              <CustomBtn
                title="Next"
                iconName="arrow-right"
                customStyles="flex-1 ml-2"
                secondScheme={true}
                handlePress={() => changeStep(2)}
              />
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={{ opacity: fadeAnim }} className="gap-3">
            <Text className="text-lg font-pbold text-black-400 mb-2">
              Location Details
            </Text>

            <CustomInput
              label="Address"
              placeholder="Street address"
              leftIcon="map-marker"
              value={ClinicData.address}
              handleChange={(value) => handleChange("address", value)}
              multiline={true}
              error={formErrors.address}
              required
              noBR={true}
            />

            <CustomInput
              label="Pin code"
              placeholder="Enter pin code"
              leftIcon="pin"
              value={ClinicData.pincode}
              handleChange={(value) => handleChange("pincode", value)}
              noBR={true}
            />

            <View className="flex-row gap-2">
              <View className="flex-1">
                <CustomInput
                  label="City"
                  placeholder="City"
                  leftIcon="city"
                  value={ClinicData.city}
                  handleChange={(value) => handleChange("city", value)}
                  error={formErrors.city}
                  required
                  noBR={true}
                />
              </View>
              <View className="flex-1">
                <CustomInput
                  label="State"
                  placeholder="State"
                  leftIcon="map"
                  value={ClinicData.state}
                  handleChange={(value) => handleChange("state", value)}
                  error={formErrors.state}
                  required
                  noBR={true}
                />
              </View>
            </View>

            <CustomInput
              label="Country"
              placeholder="Country"
              leftIcon="earth"
              value={ClinicData.country}
              handleChange={(value) => handleChange("country", value)}
              error={formErrors.country}
              required
              noBR={true}
            />

            <CustomBtn
              title="Use Current Location"
              iconName="map-marker-radius"
              customStyles="mt-2"
              loading={IsLoading}
              handlePress={getClinicDataFromLocation}
            />

            <View className="flex-row justify-between mt-4">
              <CustomBtn
                title="Back"
                iconName="arrow-left"
                customStyles="flex-1 mr-2"
                handlePress={() => changeStep(1)}
              />
              <CustomBtn
                title="Next"
                iconName="arrow-right"
                customStyles="flex-1 ml-2"
                secondScheme={true}
                handlePress={() => changeStep(3)}
              />
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={{ opacity: fadeAnim }} className="gap-3">
            <Text className="text-lg font-pbold text-black-400 mb-2">
              Clinic Hours & Images
            </Text>

            <CustomBtn
              title="Set Clinic Hours"
              iconName="clock-outline"
              customStyles="mb-4"
              handlePress={() => {
                bottomSheetRef.current?.show();
              }}
            />

            <Divider className="my-2" />

            <Text className="text-md font-psemibold text-black-300 mt-2">
              Clinic Images
            </Text>
            {formErrors.images && (
              <Text className="text-red-500 text-xs mt-1">
                {formErrors.images}
              </Text>
            )}

            <CustomBtn
              title="Select Images"
              iconName="image-plus"
              handlePress={onSelectImage}
              customStyles="mt-2"
            />

            <ImageGrid Imgs={Imgs} />

            {Imgs.length > 0 && (
              <CustomBtn
                title="Upload Images"
                iconName="cloud-upload"
                loading={UplaodLoading}
                handlePress={UploadImages}
                customStyles="mt-2"
              />
            )}

            <View className="flex-row justify-between mt-4">
              <CustomBtn
                title="Back"
                iconName="arrow-left"
                customStyles="flex-1 mr-2"
                handlePress={() => changeStep(2)}
              />
              <CustomBtn
                title="Create Clinic"
                iconName="check-circle"
                customStyles="flex-1 ml-2"
                secondScheme={true}
                loading={createLoading}
                handlePress={createClinic}
              />
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="bg-white-300 flex-1">
      <Appbar.Header
        mode="center-aligned"
        statusBarHeight={0}
        style={{
          backgroundColor: colors.white[300],
        }}
      >
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content
          title={
            <Text className="text-2xl font-psemibold text-black-200">
              Register Clinic
            </Text>
          }
        />
      </Appbar.Header>

      {/* Modern progress indicator with SegmentedButtons and ProgressBar */}
      <View className="px-4 mt-2 mb-4">
        <SegmentedButtons
          value={String(currentStep)}
          onValueChange={(value) => changeStep(Number(value))}
          theme={{
            // colors: [colors.secondary[300], colors.secondary[300]],
            colors: {
              secondaryContainer: colors.secondary[300],
            },
            // borderRadius: 3,
          }}
          buttons={[
            {
              value: "1",
              label: "Basic",
              icon: "information-outline",
              checkedColor: colors.white[300],
            },
            {
              value: "2",
              label: "Location",
              icon: "map-marker-outline",
              checkedColor: colors.white[300],
            },
            {
              value: "3",
              label: "Details",
              icon: "clock-outline",
              checkedColor: colors.white[300],
            },
          ]}
        />

        <View className="mt-3 mb-2">
          <Text className="text-xs text-gray-500 mb-1 text-right">
            Step {currentStep} of 3
          </Text>
          <ProgressBar
            progress={(currentStep - 1) / 2}
            color={colors.secondary[300]}
            style={{ height: 6, borderRadius: 3 }}
          />
        </View>
      </View>

      {(currentStep === 1 || currentStep === 2) && (
        <SearchBarWithSugg
          changeQueryText={changeQueryText}
          searchQuery={searchQuery}
          IsLoading={IsLoading}
          setShowSuggestions={setShowSuggestions}
          ShowSuggestions={ShowSuggestions}
          Places={Places}
          getPlaceDetails={getPlaceDetails}
        />
      )}

      <ScrollView
        contentContainerClassName="flex-grow px-8 w-full justify-around self-center gap-2 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {!ShowSuggestions && renderFormSection()}

        <ActionSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          initialSnapIndex={3}
          gestureEnabled={true}
        >
          <ChooseTimings data={ClinicData} setData={setClinicData} />
        </ActionSheet>
      </ScrollView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default RegisterClinic;
