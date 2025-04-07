import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Appbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToastSate, useUserDataState } from "../../atoms/store";
import { ChooseTimings } from "../../components/ChooseTimings";
import { SearchBarWithSugg } from "../../components/SearchBarWithSugg";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import colors from "./../../constants/colors";
import ClinicRegistrationSteps from "../../components/clinics/ClinicRegistrationSteps";
import FormStepNavigation from "../../components/clinics/FormStepNavigation";
import { clinicRegistrationSchema } from "../../components/Utility/validationSchemas";
import {
  getPlaceDetails,
  getClinicDataFromLocation,
  uploadClinicImages,
  createClinic,
} from "../../components/Utility/clinicUtils";
import { initialClinicData } from "../../components/Utility/initialData";
import { apiUrl } from "../../components/Utility/Repeatables";
import axios from "axios";

const RegisterClinic = () => {
  const { IsLoading, setIsLoading } = useLoadingAndDialog();

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
  const [ClinicData, setClinicData] = useState(initialClinicData);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [25, 50, 75, 100], []);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  /* -------------------------------------------------------------------------- */
  /*                                  Function                                  */
  /* -------------------------------------------------------------------------- */

  const changeQueryText = useCallback(
    async (e) => {
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
    },
    [UserData.location, setIsLoading]
  );

  const handleChange = useCallback(
    (field, value) => {
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
    },
    [formErrors]
  );

  const onSelectImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 4,
        orderedSelection: true,
        aspect: [16, 9],
        base64: false,
      });

      if (!result.canceled) {
        setImgs(result.assets);
      }
    } catch (error) {
      console.log(error)
      setToast({
        message: "Error selecting images",
        visible: true,
        type: "error",
      });
    }
  }, [setToast]);

  const UploadImages = useCallback(async () => {
    setUplaodLoading(true);
    const success = await uploadClinicImages(Imgs, setClinicData, setToast);
    setUplaodLoading(false);
    return success;
  }, [Imgs, setToast]);

  const validateForm = useCallback(async () => {
    try {
      await clinicRegistrationSchema.validate(ClinicData, {
        abortEarly: false,
      });
      return {};
    } catch (err) {
      console.log("Validation error:", err.name);
      const errors = {};
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
      } else {
        // Handle non-standard Yup errors
        errors.general = err.message || "Validation failed";
      }
      return errors;
    }
  }, [ClinicData]);

  const createClinicHandler = useCallback(async () => {
    console.log('first of all')
    const errors = await validateForm();
    setFormErrors(errors);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setToast({
        message: "Please fill all required fields",
        visible: true,
        type: "error",
      });
      return;
    }

    setCreateLoading(true);
    await createClinic(ClinicData, setToast, router);
    setCreateLoading(false);
  }, [ClinicData, router, setToast, validateForm]);

  // Enhanced step change with animation
  const changeStep = useCallback(
    (step) => {
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
    },
    [fadeAnim]
  );

  // Update the formSteps array to include both Timings and Hours steps
  const formSteps = useMemo(
    () => [
      { label: "Basic", icon: "information-outline" },
      { label: "Location", icon: "map-marker-outline" },
      { label: "Services", icon: "medical-bag" },
      { label: "Info", icon: "information" },
      { label: "Hours", icon: "clock-outline" },
    ],
    []
  );

  const handlePlaceDetails = useCallback(
    (item) => {
      getPlaceDetails(item, setClinicData, setShowSuggestions, setToast);
    },
    [setToast]
  );

  const handleGetClinicDataFromLocation = useCallback(() => {
    console.log({ ud: UserData.location });
    getClinicDataFromLocation(UserData, setClinicData, setToast);
  }, [UserData, setToast]);

  // console.log({ dj: UserData.location });

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

      {/* Modern progress indicator with FormStepNavigation component */}
      <FormStepNavigation
        currentStep={currentStep}
        totalSteps={formSteps.length}
        changeStep={changeStep}
        steps={formSteps}
      />

      {(currentStep === 1 || currentStep === 2) && (
        <SearchBarWithSugg
          changeQueryText={changeQueryText}
          searchQuery={searchQuery}
          IsLoading={IsLoading}
          setShowSuggestions={setShowSuggestions}
          ShowSuggestions={ShowSuggestions}
          Places={Places}
          getPlaceDetails={handlePlaceDetails}
        />
      )}

      <ScrollView
        contentContainerClassName="flex-grow px-8 w-full justify-around self-center gap-2 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <ClinicRegistrationSteps
          currentStep={currentStep}
          fadeAnim={fadeAnim}
          ClinicData={ClinicData}
          handleChange={handleChange}
          formErrors={formErrors}
          searchQuery={searchQuery}
          changeQueryText={changeQueryText}
          IsLoading={IsLoading}
          setShowSuggestions={setShowSuggestions}
          ShowSuggestions={ShowSuggestions}
          Places={Places}
          getPlaceDetails={handlePlaceDetails}
          bottomSheetRef={bottomSheetRef}
          Imgs={Imgs}
          onSelectImage={onSelectImage}
          UploadImages={UploadImages}
          UplaodLoading={UplaodLoading}
          createLoading={createLoading}
          createClinic={createClinicHandler}
          router={router}
          changeStep={changeStep}
          getClinicDataFromLocation={handleGetClinicDataFromLocation}
          setClinicData={setClinicData}
        />

        <ActionSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          initialSnapIndex={3}
          gestureEnabled={true}
        >
          <ChooseTimings data={ClinicData} setData={setClinicData} />
        </ActionSheet>
      </ScrollView>

      <StatusBar style="inverted" />
    </SafeAreaView>
  );
};

export default RegisterClinic;
