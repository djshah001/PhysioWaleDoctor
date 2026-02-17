import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ObjectId } from "bson";

import { useAuth } from "~/hooks/useAuth";
import { clinicApi } from "~/apis/clinic";
import { authApi } from "~/apis/auth";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import {
  DaySchedule,
  AppointmentConfig,
  HomeVisitConfig,
  SocialLinks,
  Clinic,
  Service,
} from "~/types";
import ClinicDetails from "~/components/Clinic/ClinicDetails";
import ClinicLocation from "~/components/Clinic/ClinicLocation";
import ScheduleServices from "~/components/Clinic/ScheduleServices";
import FacilitiesGallery from "~/components/Clinic/FacilitiesGallery";
import StepIndicator from "~/components/Clinic/StepIndicator";
import { useToast } from "~/store/toastStore";
import { Button } from "~/components/ui/button";

const STEP_NAMES = [
  "Clinic Details",
  "Location & Contact",
  "Schedule & Services",
  "Facilities & Gallery",
  "Review & Submit",
];

const ClinicRegistration = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Generate clinic ID on mount
  const [clinicId, setClinicId] = useState("");

  React.useEffect(() => {
    const newClinicId = new ObjectId().toString();
    setClinicId(newClinicId);
  }, []);

  // Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [consultationFee, setConsultationFee] = useState("500");

  // Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [pincode, setPincode] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);

  // Timings (Shifts-based)
  const [open24hrs, setOpen24hrs] = useState(false);
  const [timing, setTiming] = useState<{
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
  }>({
    sunday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
    monday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
    tuesday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
    wednesday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
    thursday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
    friday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
    saturday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
  });

  // Configuration
  const [appointmentConfig, setAppointmentConfig] = useState<
    Partial<AppointmentConfig>
  >({
    slotDuration: 30,
    bufferTime: 5,
    advanceBookingLimit: 30,
    instantBooking: true,
    isVirtualConsultationAvailable: false,
  });
  const [homeVisitConfig, setHomeVisitConfig] = useState<
    Partial<HomeVisitConfig>
  >({
    isAvailable: false,
    radiusKm: 5,
    travelFee: 0,
    minBookingAmount: 0,
  });

  // Metadata
  const [clinicType, setClinicType] = useState("Private Clinic");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Facilities
  const [facilities, setFacilities] = useState<string[]>([]);

  // Images with upload state
  const [imageStates, setImageStates] = useState<
    {
      asset: ImagePicker.ImagePickerAsset;
      uploadedUrl: string | null;
      uploading: boolean;
      error: string | null;
    }[]
  >([]);

  // Services
  const [services, setServices] = useState<
    {
      name: string;
      description: string;
      duration: number;
      price: number;
      category: string;
    }[]
  >([]);

  // Financials
  const [platformCommissionRate, setPlatformCommissionRate] = useState(10);
  const [gstNumber, setGstNumber] = useState("");

  // Social Links
  const [socialLinks, setSocialLinks] = useState<Partial<SocialLinks>>({});

  // Upload a single image
  const uploadImage = async (
    asset: ImagePicker.ImagePickerAsset,
    index: number,
  ) => {
    try {
      const formData = new FormData();
      // console.log("asset", asset);
      formData.append("images", {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `clinic-${index}.jpg`,
      } as any);
      formData.append("clinicId", clinicId); // Add clinic ID

      const response = await clinicApi.uploadClinicImages(formData);
      if (response.data.success && response.data.data.filePaths.length > 0) {
        // Update state with uploaded URL
        setImageStates((prev) =>
          prev.map((state, i) =>
            i === index
              ? {
                  ...state,
                  uploadedUrl: response.data.data.filePaths[0],
                  uploading: false,
                  error: null,
                }
              : state,
          ),
        );
      } else {
        showToast("error", "Upload failed");
      }
    } catch (error: any) {
      showToast("error", "Upload failed");
      console.log("error", error.response.data.errors[0].msg);
      setImageStates((prev) =>
        prev.map((state, i) =>
          i === index
            ? {
                ...state,
                uploading: false,
                error: error.message || "Upload failed",
              }
            : state,
        ),
      );
    }
  };

  // Handle new images selected
  const handleImagesSelected = (assets: ImagePicker.ImagePickerAsset[]) => {
    // Add new images to state with uploading status
    const newImageStates = assets.map((asset) => ({
      asset,
      uploadedUrl: null,
      uploading: true,
      error: null,
    }));

    setImageStates((prev) => [...prev, ...newImageStates]);

    // Start uploading each image in background
    assets.forEach((asset, i) => {
      const actualIndex = imageStates.length + i;
      uploadImage(asset, actualIndex);
    });
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImageStates((prev) => prev.filter((_, i) => i !== index));
  };

  // Retry failed upload
  const handleRetryUpload = (index: number) => {
    setImageStates((prev) =>
      prev.map((state, i) =>
        i === index ? { ...state, uploading: true, error: null } : state,
      ),
    );
    uploadImage(imageStates[index].asset, index);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Clinic Details (Basic Info + Metadata + Social)
        if (!name.trim()) {
          showToast("error", "Clinic name is required");
          return false;
        }
        if (!description.trim()) {
          showToast("error", "Description is required");
          return false;
        }
        if (!phoneNumber.trim()) {
          showToast("error", "Phone number is required");
          return false;
        }
        if (!consultationFee || parseFloat(consultationFee) <= 0) {
          showToast("error", "Valid consultation fee is required");
          return false;
        }
        return true;

      case 1: // Location & Contact
        if (
          !address.trim() ||
          !city.trim() ||
          !state.trim() ||
          !country.trim()
        ) {
          showToast("error", "Complete address is required");
          return false;
        }
        if (coordinates[0] === 0 && coordinates[1] === 0) {
          showToast("error", "Please set location coordinates");
          return false;
        }
        return true;

      case 2: // Schedule & Services (Timings + Config + Services)
        if (!open24hrs) {
          const hasValidTiming = Object.values(timing).some(
            (day) => !day.isClosed && day.shifts.length > 0,
          );
          if (!hasValidTiming) {
            showToast("error", "Set timings for at least one day");
            return false;
          }
        }
        return true;

      case 3: // Facilities & Gallery
        if (facilities.length === 0) {
          showToast("error", "Select at least one facility");
          return false;
        }
        if (imageStates.length === 0) {
          showToast("error", "Add at least one clinic image");
          return false;
        }
        return true;

      case 4: // Review & Submit
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEP_NAMES.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Check if any images are still uploading
      const uploadingCount = imageStates.filter(
        (state) => state.uploading,
      ).length;
      const failedCount = imageStates.filter((state) => state.error).length;

      if (uploadingCount > 0) {
        showToast(
          "info",
          `Uploading ${uploadingCount} of ${imageStates.length} images...`,
        );

        // Wait for all uploads to complete
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            const stillUploading = imageStates.filter(
              (state) => state.uploading,
            ).length;
            if (stillUploading === 0) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 500);
        });
      }

      // Check for failed uploads after waiting
      const finalFailedCount = imageStates.filter(
        (state) => state.error,
      ).length;
      if (finalFailedCount > 0) {
        showToast(
          "error",
          `${finalFailedCount} image(s) failed to upload. Please retry or remove them.`,
        );
        setLoading(false);
        return;
      }

      // Get uploaded URLs
      const uploadedUrls = imageStates
        .map((state) => state.uploadedUrl)
        .filter((url): url is string => url !== null);

      if (uploadedUrls.length === 0) {
        showToast("error", "No images uploaded successfully");
        setLoading(false);
        return;
      }

      // Prepare clinic data with all new fields
      const clinicData = {
        _id: clinicId, // Use pre-generated ID
        name,
        description,
        address,
        city,
        state,
        country,
        pincode,
        phoneNumber,
        email: email || undefined,
        website: website || undefined,
        location: {
          type: "Point" as const,
          coordinates,
        },
        open24hrs,
        timing,
        images: uploadedUrls,
        facilities: facilities as any, // Type assertion for enum compatibility
        consultationFee: parseFloat(consultationFee),
        services: services as Service[], // Backend will create full Service objects
        // New fields
        appointmentConfig: appointmentConfig.slotDuration
          ? (appointmentConfig as AppointmentConfig)
          : undefined,
        homeVisitConfig: homeVisitConfig.isAvailable
          ? (homeVisitConfig as HomeVisitConfig)
          : undefined,
        clinicType: clinicType || undefined,
        specializations:
          specializations.length > 0 ? specializations : undefined,
        tags: tags.length > 0 ? tags : undefined,
        socialLinks:
          Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
        platformCommissionRate: platformCommissionRate || undefined,
        gstNumber: gstNumber || undefined,
      };

      const res = await clinicApi.createClinic(clinicData as Partial<Clinic>);
      if (res.data.success) {
        showToast("success", "Clinic registered successfully!");
        await refreshUser();
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error(
        "Clinic registration error:",
        error.response.data.errors[0].msg,
      );
      showToast(
        "error",
        error.response?.data?.errors[0].msg || "Failed to register clinic",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Clinic Details
        return (
          <ClinicDetails
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            email={email}
            setEmail={setEmail}
            website={website}
            setWebsite={setWebsite}
            consultationFee={consultationFee}
            setConsultationFee={setConsultationFee}
            clinicType={clinicType}
            setClinicType={setClinicType}
            specializations={specializations}
            setSpecializations={setSpecializations}
            tags={tags}
            setTags={setTags}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
          />
        );
      case 1: // Location & Contact
        return (
          <ClinicLocation
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            country={country}
            setCountry={setCountry}
            pincode={pincode}
            setPincode={setPincode}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        );
      case 2: // Schedule & Services
        return (
          <ScheduleServices
            open24hrs={open24hrs}
            setOpen24hrs={setOpen24hrs}
            timing={timing}
            setTiming={setTiming}
            appointmentConfig={appointmentConfig}
            setAppointmentConfig={setAppointmentConfig}
            homeVisitConfig={homeVisitConfig}
            setHomeVisitConfig={setHomeVisitConfig}
            services={services}
            setServices={setServices}
          />
        );
      case 3: // Facilities & Gallery
        return (
          <FacilitiesGallery
            facilities={facilities}
            setFacilities={setFacilities}
            imageStates={imageStates}
            onImagesSelected={handleImagesSelected}
            onRemoveImage={handleRemoveImage}
            onRetryUpload={handleRetryUpload}
          />
        );
      case 4: // Review & Submit
        return (
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Review Your Clinic
            </Text>
            <Text className="text-gray-600 mb-6">
              Please review all information before submitting
            </Text>
            {/* TODO: Add review summary sections */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <GradientBackground variant="secondary">
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          className="flex-1"
          style={{ flex: 1 }}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              className="mb-8"
            >
              <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="w-10 h-10 rounded-full bg-white/50 items-center justify-center border border-white/60 shadow-sm"
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={24}
                    color="#1f2937"
                  />
                </TouchableOpacity>
                <View className="bg-white/50 px-3 py-1 rounded-full border border-white/60">
                  <Text className="text-gray-600 text-xs font-semibold">
                    Step {currentStep + 1} of {STEP_NAMES.length}
                  </Text>
                </View>
              </View>

              <StepIndicator
                currentStep={currentStep}
                totalSteps={STEP_NAMES.length}
                steps={STEP_NAMES}
              />
            </Animated.View>

            {/* Step Content */}
            <Animated.View
              key={currentStep}
              entering={FadeInRight.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={{ minHeight: 400 }}
            >
              {renderStep()}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* Navigation Buttons */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="flex-row gap-3 border-t border-neutral-500 px-4 py-2 w-full rounded-t-2xl "
          style={{ paddingBottom: Platform.OS === "ios" ? 40 : 20 }}
        >
          {currentStep > 0 && (
            <Button
              onPress={handleBack}
              style={{ flex: 1 }}
              className="h-14 rounded-2xl bg-white border border-gray-200 items-center justify-center shadow-sm"
              textClassName="text-gray-700 font-semibold text-lg"
              title="Back"
            />
          )}

          <Button
            title={
              currentStep === STEP_NAMES.length - 1
                ? "Submit Registration"
                : "Next Step"
            }
            onPress={
              currentStep === STEP_NAMES.length - 1 ? handleSubmit : handleNext
            }
            style={{ flex: 1 }}
            className=" h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-300 items-center justify-center"
            textClassName="text-white font-semibold text-lg"
            loading={loading}
            disabled={loading}
          />
        </Animated.View>
      </GradientBackground>
    </View>
  );
};

export default ClinicRegistration;
