import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import axios from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Appbar, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-actions-sheet";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useToastSate, useUserDataState } from "../../atoms/store";

import CustomBtn from "../../components/CustomBtn";
import Repeatables from "../../components/Utility/Repeatables";
import { ChooseTimings } from "../../components/ChooseTimings";
import CustomInput from "./../../components/ReUsables/CustomInput";
import { SearchBarWithSugg } from "../../components/SearchBarWithSugg";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";

import colors from "./../../constants/colors";
import { Image } from "expo-image";
import { ImageGrid } from "../../components/ReUsables/ImageGrid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertBox from "../../components/AlertBox";

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

  const { apiUrl, GoogleApi, GoogleApiKey } = Repeatables();

  /* -------------------------------------------------------------------------- */
  /*                                    States                                   */
  /* -------------------------------------------------------------------------- */
  const [UserData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();

  const [ClinicData, setClinicData] = useState({
    name: "",
    description: "",
    contact: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    location: {},
    open24hrs: false,
    images: [],
    timing: {
      sunday: {
        isClosed: false,
        opening: "",
        closing: "",
      },
      monday: { isClosed: false, opening: "", closing: "" },
      tuesday: { isClosed: false, opening: "", closing: "" },
      wednesday: {
        isClosed: false,
        opening: "",
        closing: "",
      },
      thursday: { isClosed: false, opening: "", closing: "" },
      friday: { isClosed: false, opening: "", closing: "" },
      saturday: { isClosed: false, opening: "", closing: "" },
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [Places, setPlaces] = useState([]);
  const [ShowSuggestions, setShowSuggestions] = useState(false);
  const [Imgs, setImgs] = useState([]);
  const [ImgUrls, setImgUrls] = useState([]);
  const [UplaodLoading, setUplaodLoading] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [25, 50, 75, 100], []);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  const changeQueryText = async (e) => {
    setSearchQuery(e);
    // console.log(UserData.location.latitude, GoogleApiKey);
    setIsLoading(true);

    const autoCompleteApi = `${GoogleApi}/places:autocomplete?includedPrimaryTypes=physiotherapist`;
    const res = await axios.post(
      autoCompleteApi,
      {
        input: searchQuery,
        locationBias: {
          circle: {
            center: {
              latitude: UserData.location.latitude || 22.295076,
              longitude: UserData.location.longitude || 73.2468642,
            },
            radius: 500,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GoogleApiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat.mainText,suggestions.placePrediction.structuredFormat.secondaryText",
        },
      }
    );
    setPlaces(res.data.suggestions);
    setIsLoading(false);
  };

  const extractLocationDetails = (addressComponents, textToFetch) => {
    // const addressComponents = response.addressComponents;

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
    const res = await axios.get(
      `${GoogleApi}/places/${item.placePrediction.placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GoogleApiKey,
          "X-Goog-FieldMask":
            "id,displayName,location,formattedAddress,addressComponents,googleMapsUri",
        },
      }
    );

    // console.log(res.data);

    const { country, state, city, pincode } = extractLocationDetails(
      res.data.addressComponents
    );

    const address = res.data.formattedAddress.split(",").slice(0, -3).join(",");

    console.log(pincode);

    setClinicData((prev) => ({
      ...prev,
      name: item.placePrediction.structuredFormat.mainText.text,
      // address: res.data.formattedAddress,
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
  };

  const getClinicDataFromLocation = async (latitude, longitude) => {
    setIsLoading(true);
    // console.log(latitude, longitude);
    const API = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GoogleApiKey}`;

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
      // name: item.placePrediction.structuredFormat.mainText.text,
      // address: res.data.formattedAddress,
      location: {
        // latitude: res.data.results[0].geometry.location.latitude,
        // longitude: res.data.results[0].geometry.location.longitude,
        latitude: UserData.location.latitude,
        longitude: UserData.location.longitude,
      },
      country: country,
      state: state,
      city: city,
      address: address,
    }));

    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setClinicData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      // aspect: [4, 5],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4,
      orderedSelection: true,
      legacy: true,
    });
    if (!result.canceled) {
      setImgs(result.assets);
      console.log(result.assets[0]);
    }
  };

  const UploadImages = async () => {
    setUplaodLoading(true);

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

    console.log(res.data);
    if (res.data.success) {
      setClinicData((prev) => ({ ...prev, images: res.data.imageUrls }));
      setToast({
        message: "Images Uploaded Successfully.",
        visible: true,
      });
    } else {
      setError(res.data.errors[0].msg);
      showDialog();
    }

    setUplaodLoading(false);
  };

  const createClinic = async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await axios.post(
      `${apiUrl}/api/v/clinics/register`,
      {
        ...ClinicData,
        coords: [ClinicData.location.latitude, ClinicData.location.longitude],
      },
      { headers: { authToken: authToken } }
    );
    console.log(res.data);

    if (true) {
      // router.replace('/(tabs)/Clinic')
      router.back();
      setToast({
        message: "Clinic Created Successfully.",
        visible: true,
      });
    } else {
      setError(res.data.errors[0].msg);
      showDialog();
    }
  };

  return (
    <SafeAreaView className="bg-white-300 flex-1 ">
      <Appbar.Header
        mode="center-aligned"
        // safeAreaInsets={{ bottom }}
        // elevated={true}
        // elevation={3}
        className=" mt-[-25px] "
        style={{
          // height: 60,
          backgroundColor: colors.white[300],
          // marginTop:-20,
          // paddingVertical:10
        }}
      >
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content
          // title="Register Clinic"
          title={
            <Text className="text-2xl font-psemibold text-black-200 ">
              Register Clinic
            </Text>
          }
        />
        {/* <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>

      <SearchBarWithSugg
        changeQueryText={changeQueryText}
        searchQuery={searchQuery}
        IsLoading={IsLoading}
        setShowSuggestions={setShowSuggestions}
        ShowSuggestions={ShowSuggestions}
        Places={Places}
        getPlaceDetails={getPlaceDetails}
      />

      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow px-8 w-full h-scree justify-around self-center gap-2 "
      >
        {!ShowSuggestions && (
          <>
            <View className="gap-3">
              <CustomInput
                label="Clinic Name"
                placeholder="Name"
                leftIcon="hospital-building"
                value={ClinicData.name}
                handleChange={(value) => handleChange("name", value)}
                multiline={true}
              />

              <CustomInput
                label="Address"
                placeholder="Address"
                leftIcon="hospital-building"
                value={ClinicData.address}
                handleChange={(value) => handleChange("adrees", value)}
                multiline={true}
              />

              <CustomInput
                keyboardType="phone-pad"
                label="Contact"
                placeholder="Contact No."
                leftIcon="phone"
                value={ClinicData.contact}
                handleChange={(value) => handleChange("contact", value)}
                multiline={true}
              />

              <CustomInput
                label="Pin code"
                placeholder="Pin code"
                leftIcon="pin"
                value={ClinicData.pincode}
                handleChange={(value) => handleChange("pincode", value)}
                multiline={true}
              />

              <CustomInput
                label="City"
                placeholder="City"
                leftIcon="map-marker-radius-outline"
                value={ClinicData.city}
                handleChange={(value) => handleChange("city", value)}
                multiline={true}
              />
              <CustomInput
                label="State"
                placeholder="State"
                leftIcon="map-marker-radius-outline"
                value={ClinicData.state}
                handleChange={(value) => handleChange("state", value)}
                multiline={true}
              />
              <CustomInput
                label="Country"
                placeholder="Country"
                leftIcon="map-marker-radius-outline"
                value={ClinicData.country}
                handleChange={(value) => handleChange("country", value)}
                multiline={true}
              />
              <CustomBtn
                title="Use Current Location"
                iconName="map-marker-radius-outline"
                customStyles="mt-2"
                loading={IsLoading}
                // secondScheme={true}
                handlePress={() => {
                  getClinicDataFromLocation(
                    UserData.location.latitude,
                    UserData.location.longitude
                  );
                }}
              />

              <CustomBtn
                title="Choose Timings"
                iconName="map-marker-radius-outline"
                customStyles="mt-2"
                loading={IsLoading}
                // secondScheme={true}
                handlePress={() => {
                  bottomSheetRef.current?.show();
                }}
              />

              {/* <Text>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime
                fugiat suscipit eum, voluptates quaerat esse nobis laborum quae
                error ea iusto tenetur et distinctio necessitatibus nulla
                dignissimos, possimus blanditiis illo! Ratione quaerat obcaecati
                nemo fuga libero quisquam, omnis odio consequatur autem
                inventore ducimus? Saepe perferendis, ullam vitae et beatae
                voluptate?
              </Text> */}

              <CustomInput
                label="Clinic Descrpiption"
                placeholder="Descrpiption"
                leftIcon="hospital-building"
                value={ClinicData.description}
                handleChange={(value) => handleChange("description", value)}
                multiline={true}
              />

              <CustomBtn
                title="Select images of your clinic"
                iconName="image-plus"
                handlePress={onSelectImage}
                customStyles="mt-4"
              />

              <ImageGrid Imgs={Imgs} />

              {Imgs.length > 0 && (
                <View className="w-4/5 self-center mb-4 ">
                  <CustomBtn
                    title="Upload Images"
                    iconName="file-upload"
                    iconColor={colors.black["400"]}
                    loading={UplaodLoading}
                    handlePress={UploadImages}
                  />
                </View>
              )}
            </View>
            <CustomBtn
              title="Create My Clinic"
              iconName="chevron-double-right"
              secondScheme={true}
              customStyles="mb-4"
              handlePress={createClinic}
            />
          </>
        )}
        <ActionSheet
          // index={-1}
          snapPoints={snapPoints}
          ref={bottomSheetRef}
          initialSnapIndex={3}
          gestureEnabled={true}
        >
          <ChooseTimings data={ClinicData} setData={setClinicData} />
        </ActionSheet>
      </ScrollView>

      <AlertBox visible={visible} hideDialog={hideDialog} content={Error} />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default RegisterClinic;
