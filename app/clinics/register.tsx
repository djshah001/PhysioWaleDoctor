import React, { useState, useReducer } from "react";
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
import * as Localization from "expo-localization";
import { ObjectId } from "bson";

import { useAuth } from "~/hooks/useAuth";
import { clinicApi } from "~/apis/clinic";
// import { authApi } from "~/apis/auth"; // Unused in original
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

// Helper to update our centralized form state
const formReducer = (state: any, action: any) => ({ ...state, ...action });

const ClinicRegistration = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  // 1. UI & Logic States
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageStates, setImageStates] = useState<
    {
      asset: ImagePicker.ImagePickerAsset;
      uploadedUrl: string | null;
      uploading: boolean;
      error: string | null;
    }[]
  >([]);

  // Initialize once on mount without triggering a re-render via useEffect
  const [clinicId] = useState(() => new ObjectId().toString());

  // Get device timezone via expo-localization
  const timezone = Localization.getCalendars()[0]?.timeZone || "UTC";

  // 2. Centralized Form Data State
  const [formData, updateForm] = useReducer(formReducer, {
    name: "",
    description: "",
    phoneNumber: user?.phoneNumber || "",
    email: "",
    website: "",
    consultationFee: "500",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    coordinates: [0, 0] as [number, number],
    open24hrs: false,
    timing: {
      sunday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
      monday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
      tuesday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
      wednesday: {
        isClosed: false,
        shifts: [{ open: "09:00", close: "18:00" }],
      },
      thursday: {
        isClosed: false,
        shifts: [{ open: "09:00", close: "18:00" }],
      },
      friday: { isClosed: false, shifts: [{ open: "09:00", close: "18:00" }] },
      saturday: {
        isClosed: false,
        shifts: [{ open: "09:00", close: "18:00" }],
      },
    },
    appointmentConfig: {
      slotDuration: 30,
      bufferTime: 5,
      advanceBookingLimit: 30,
      instantBooking: true,
      isVirtualConsultationAvailable: false,
    } as Partial<AppointmentConfig>,
    homeVisitConfig: {
      isAvailable: false,
      radiusKm: 5,
      travelFee: 0,
      minBookingAmount: 0,
    } as Partial<HomeVisitConfig>,
    clinicType: "Private Clinic",
    specializations: [] as string[],
    tags: [] as string[],
    facilities: [] as string[],
    services: [] as Service[],
    platformCommissionRate: 10,
    gstNumber: "",
    socialLinks: {} as Partial<SocialLinks>,
    timezone,
  });

  // Image Upload Logic
  const uploadImage = async (
    asset: ImagePicker.ImagePickerAsset,
    index: number,
  ) => {
    try {
      const uploadData = new FormData();
      uploadData.append("images", {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `clinic-${index}.jpg`,
      } as any);
      uploadData.append("clinicId", clinicId);

      const response = await clinicApi.uploadClinicImages(uploadData);
      if (response.data.success && response.data.data.filePaths.length > 0) {
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
      console.log("error", error.response?.data?.errors?.[0]?.msg);
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

  const handleImagesSelected = (assets: ImagePicker.ImagePickerAsset[]) => {
    const newImageStates = assets.map((asset) => ({
      asset,
      uploadedUrl: null,
      uploading: true,
      error: null,
    }));

    setImageStates((prev) => [...prev, ...newImageStates]);

    assets.forEach((asset, i) => {
      const actualIndex = imageStates.length + i;
      uploadImage(asset, actualIndex);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageStates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRetryUpload = (index: number) => {
    setImageStates((prev) =>
      prev.map((state, i) =>
        i === index ? { ...state, uploading: true, error: null } : state,
      ),
    );
    uploadImage(imageStates[index].asset, index);
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.name.trim()) {
          showToast("error", "Clinic name is required");
          return false;
        }
        if (!formData.description.trim()) {
          showToast("error", "Description is required");
          return false;
        }
        if (!formData.phoneNumber.trim()) {
          showToast("error", "Phone number is required");
          return false;
        }
        if (
          !formData.consultationFee ||
          parseFloat(formData.consultationFee) <= 0
        ) {
          showToast("error", "Valid consultation fee is required");
          return false;
        }
        return true;

      case 1:
        if (
          !formData.address.trim() ||
          !formData.city.trim() ||
          !formData.state.trim() ||
          !formData.country.trim()
        ) {
          showToast("error", "Complete address is required");
          return false;
        }
        if (formData.coordinates[0] === 0 && formData.coordinates[1] === 0) {
          showToast("error", "Please set location coordinates");
          return false;
        }
        return true;

      case 2:
        if (!formData.open24hrs) {
          const hasValidTiming = Object.values(formData.timing).some(
            (day: any) => !day.isClosed && day.shifts.length > 0,
          );
          if (!hasValidTiming) {
            showToast("error", "Set timings for at least one day");
            return false;
          }
        }
        return true;

      case 3:
        if (formData.facilities.length === 0) {
          showToast("error", "Select at least one facility");
          return false;
        }
        if (imageStates.length === 0) {
          showToast("error", "Add at least one clinic image");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < STEP_NAMES.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setLoading(true);

    try {
      const uploadingCount = imageStates.filter(
        (state) => state.uploading,
      ).length;

      if (uploadingCount > 0) {
        showToast(
          "info",
          `Uploading ${uploadingCount} of ${imageStates.length} images...`,
        );
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

      const uploadedUrls = imageStates
        .map((state) => state.uploadedUrl)
        .filter((url): url is string => url !== null);

      if (uploadedUrls.length === 0) {
        showToast("error", "No images uploaded successfully");
        setLoading(false);
        return;
      }

      const clinicData = {
        _id: clinicId,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined,
        website: formData.website || undefined,
        location: {
          type: "Point" as const,
          coordinates: formData.coordinates,
        },
        open24hrs: formData.open24hrs,
        timing: formData.timing,
        images: uploadedUrls,
        facilities: formData.facilities,
        consultationFee: parseFloat(formData.consultationFee),
        services: formData.services,
        appointmentConfig: formData.appointmentConfig.slotDuration
          ? formData.appointmentConfig
          : undefined,
        homeVisitConfig: formData.homeVisitConfig.isAvailable
          ? formData.homeVisitConfig
          : undefined,
        clinicType: formData.clinicType || undefined,
        specializations:
          formData.specializations.length > 0
            ? formData.specializations
            : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        socialLinks:
          Object.keys(formData.socialLinks).length > 0
            ? formData.socialLinks
            : undefined,
        platformCommissionRate: formData.platformCommissionRate || undefined,
        gstNumber: formData.gstNumber || undefined,
        timezone: formData.timezone,
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
        error.response?.data?.errors?.[0]?.msg,
      );
      showToast(
        "error",
        error.response?.data?.errors?.[0]?.msg || "Failed to register clinic",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClinicDetails
            name={formData.name}
            setName={(val) => updateForm({ name: val })}
            description={formData.description}
            setDescription={(val) => updateForm({ description: val })}
            phoneNumber={formData.phoneNumber}
            setPhoneNumber={(val) => updateForm({ phoneNumber: val })}
            email={formData.email}
            setEmail={(val) => updateForm({ email: val })}
            website={formData.website}
            setWebsite={(val) => updateForm({ website: val })}
            consultationFee={formData.consultationFee}
            setConsultationFee={(val) => updateForm({ consultationFee: val })}
            clinicType={formData.clinicType}
            setClinicType={(val) => updateForm({ clinicType: val })}
            specializations={formData.specializations}
            setSpecializations={(val) => updateForm({ specializations: val })}
            tags={formData.tags}
            setTags={(val) => updateForm({ tags: val })}
            socialLinks={formData.socialLinks}
            setSocialLinks={(val) => updateForm({ socialLinks: val })}
          />
        );
      case 1:
        return (
          <ClinicLocation
            address={formData.address}
            setAddress={(val) => updateForm({ address: val })}
            city={formData.city}
            setCity={(val) => updateForm({ city: val })}
            state={formData.state}
            setState={(val) => updateForm({ state: val })}
            country={formData.country}
            setCountry={(val) => updateForm({ country: val })}
            pincode={formData.pincode}
            setPincode={(val) => updateForm({ pincode: val })}
            coordinates={formData.coordinates}
            setCoordinates={(val) => updateForm({ coordinates: val })}
          />
        );
      case 2:
        return (
          <ScheduleServices
            open24hrs={formData.open24hrs}
            setOpen24hrs={(val) => updateForm({ open24hrs: val })}
            timing={formData.timing}
            setTiming={(val) => updateForm({ timing: val })}
            appointmentConfig={formData.appointmentConfig}
            setAppointmentConfig={(val) =>
              updateForm({ appointmentConfig: val })
            }
            homeVisitConfig={formData.homeVisitConfig}
            setHomeVisitConfig={(val) => updateForm({ homeVisitConfig: val })}
            services={formData.services}
            setServices={(val) => updateForm({ services: val })}
          />
        );
      case 3:
        return (
          <FacilitiesGallery
            facilities={formData.facilities}
            setFacilities={(val) => updateForm({ facilities: val })}
            imageStates={imageStates}
            onImagesSelected={handleImagesSelected}
            onRemoveImage={handleRemoveImage}
            onRetryUpload={handleRetryUpload}
          />
        );
      case 4:
        return (
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Review Your Clinic
            </Text>
            <Text className="text-gray-600 mb-6">
              Please review all information before submitting
            </Text>
            {/* Add review summary sections */}
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
            className="h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-300 items-center justify-center"
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
