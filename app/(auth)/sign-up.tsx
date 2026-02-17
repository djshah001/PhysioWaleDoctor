import React, { useState, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as yup from "yup";
import parsePhoneNumberFromString from "libphonenumber-js";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../store/toastStore";
import DynamicBackground from "~/components/authComp/DynamicBackground";
import { Button } from "~/components/ui/button";
import CustomCountryPicker from "~/components/CustomCountryPicker";
import GlassInput from "~/components/GlassInput";
import StepIndicator from "~/components/auth/StepIndicator";
import GenderSelector from "~/components/auth/GenderSelector";
import ProfileImageUpload from "~/components/auth/ProfileImageUpload";
import SpecializationPicker from "~/components/auth/SpecializationPicker";
import DatePickerInput from "~/components/auth/DatePickerInput";
import { authApi } from "~/apis/auth";

// Validation Schemas for each step
const step1Schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null as any], "Passwords must match")
    .required("Confirm Password is required"),
});

const step2Schema = yup.object().shape({
  DOB: yup.date().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
});

const step3Schema = yup.object().shape({
  specialization: yup.string().required("Specialization is required"),
  licenseNumber: yup.string().required("License number is required"),
  experienceYears: yup.number().min(0, "Experience cannot be negative"),
});

const step4Schema = yup.object().shape({
  consultationFee: yup
    .number()
    .required("Consultation fee is required")
    .min(0, "Fee cannot be negative"),
});

const SignUp = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { register } = useAuth();

  // Step Management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const stepLabels = ["Account", "Personal", "Professional", "Consultation"];

  // Form Data
  const [formData, setFormData] = useState(
    __DEV__
      ? {
          // Step 1
          name: "John Doe",
          phoneNumber: "1234567890",
          countryCode: "+91",
          password: "password",
          confirmPassword: "password",

          // Step 2
          DOB: new Date("1990-01-01"),
          gender: "male",
          profilePic:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",

          // Step 3
          specialization: "Physical Therapy",
          licenseNumber: "123456",
          experienceYears: "5",

          // Step 4
          consultationFee: "100",
        }
      : {
          // Step 1
          name: "",
          phoneNumber: "",
          countryCode: "+91",
          password: "",
          confirmPassword: "",

          // Step 2
          DOB: undefined as Date | undefined,
          gender: "male",
          profilePic: "",

          // Step 3
          specialization: "",
          licenseNumber: "",
          experienceYears: "",

          // Step 4
          consultationFee: "",
        },
  );

  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  // Refs for inputs
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const licenseRef = useRef<TextInput>(null);
  const experienceRef = useRef<TextInput>(null);
  const feeRef = useRef<TextInput>(null);

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateStep = async (step: number) => {
    try {
      switch (step) {
        case 1:
          await step1Schema.validate(
            {
              name: formData.name,
              phoneNumber: formData.phoneNumber,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            },
            { abortEarly: false },
          );
          break;
        case 2:
          await step2Schema.validate(
            {
              DOB: formData.DOB,
              gender: formData.gender,
            },
            { abortEarly: false },
          );
          break;
        case 3:
          await step3Schema.validate(
            {
              specialization: formData.specialization,
              licenseNumber: formData.licenseNumber,
              experienceYears: formData.experienceYears,
            },
            { abortEarly: false },
          );
          break;
        case 4:
          await step4Schema.validate(
            {
              consultationFee: formData.consultationFee,
            },
            { abortEarly: false },
          );
          break;
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // Additional validation for step 1 (phone number)
    if (currentStep === 1) {
      const fullNumber = `${country.code}${formData.phoneNumber}`;
      const phoneNumberObj = parsePhoneNumberFromString(fullNumber);

      if (!phoneNumberObj?.isValid()) {
        showToast(
          "error",
          "Invalid Phone Number",
          "Please enter a valid phone number.",
        );
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageSelected = async (asset: ImagePicker.ImagePickerAsset) => {
    setSelectedImage(asset);

    // Auto-upload image
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("context", "doctor");
      formDataUpload.append("phoneNumber", formData.phoneNumber);

      // @ts-ignore
      formDataUpload.append("profilePic", {
        uri: asset.uri,
        type: asset.mimeType || "image/png",
        name: asset.fileName || "profile.png",
      });

      const res = await authApi.uploadProfilePic(formDataUpload);
      const resData = res.data as any;
      const profilePic = resData.data.profilePic;
      updateFormData("profilePic", profilePic);

      showToast(
        "success",
        "Profile Picture Uploaded",
        "Profile picture uploaded successfully",
      );
    } catch (error) {
      console.error(error);
      showToast("error", "Upload Failed", "Failed to upload profile picture");
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const isValid = await validateStep(4);
      if (!isValid) return;

      setLoading(true);

      const fullNumber = `${country.code}${formData.phoneNumber}`;

      const payload = {
        name: formData.name,
        phoneNumber: fullNumber,
        countryCode: country.code,
        password: formData.password,
        DOB: formData.DOB,
        gender: formData.gender,
        profilePic: formData.profilePic,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee),
        context: "doctor",
      };

      const res = await register(payload);
      if (res.success) {
        showToast(
          "success",
          "Registration Successful",
          "You have successfully registered!",
        );
        // router.replace("/(tabs)");
      } else {
        showToast(
          "error",
          "Registration Failed",
          "Failed to complete registration",
        );
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        "Registration Failed",
        error.response?.data?.message || "Failed to complete registration",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View
            entering={SlideInRight.springify()}
            exiting={SlideOutLeft.springify()}
            className="gap-4 w-full"
          >
            <GlassInput
              icon="person-outline"
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              error={errors.name}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              submitBehavior="blurAndSubmit"
            />

            <GlassInput
              ref={phoneRef}
              icon="phone-portrait-outline"
              placeholder="98765 43210"
              value={formData.phoneNumber}
              onChangeText={(value) => updateFormData("phoneNumber", value)}
              keyboardType="phone-pad"
              error={errors.phoneNumber}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              prefix={
                <CustomCountryPicker
                  countryCode={country.code}
                  countryFlag={country.flag}
                  onSelect={(item) =>
                    setCountry({
                      code: item.dial_code,
                      flag: item.flag,
                    })
                  }
                />
              }
            />

            <GlassInput
              ref={passwordRef}
              icon="lock-closed-outline"
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              isPassword
              error={errors.password}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              submitBehavior="blurAndSubmit"
            />

            <GlassInput
              ref={confirmPasswordRef}
              icon="lock-closed-outline"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              isPassword
              error={errors.confirmPassword}
              returnKeyType="go"
              onSubmitEditing={handleNext}
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            entering={SlideInRight.springify()}
            exiting={SlideOutLeft.springify()}
            className="gap-6 w-full"
          >
            <ProfileImageUpload
              imageUri={selectedImage?.uri}
              onImageSelected={handleImageSelected}
              uploading={uploading}
            />

            <DatePickerInput
              value={formData.DOB}
              onChange={(date) => updateFormData("DOB", date)}
              error={errors.DOB}
            />

            <GenderSelector
              value={formData.gender}
              onChange={(value) => updateFormData("gender", value)}
            />
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            entering={SlideInRight.springify()}
            exiting={SlideOutLeft.springify()}
            className="gap-4 w-full"
          >
            <SpecializationPicker
              value={formData.specialization}
              onChange={(value) => updateFormData("specialization", value)}
              error={errors.specialization}
            />

            <GlassInput
              ref={licenseRef}
              icon="card-outline"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChangeText={(value) => updateFormData("licenseNumber", value)}
              error={errors.licenseNumber}
              returnKeyType="next"
              onSubmitEditing={() => experienceRef.current?.focus()}
              submitBehavior="blurAndSubmit"
            />

            <GlassInput
              ref={experienceRef}
              icon="briefcase-outline"
              placeholder="Years of Experience"
              value={formData.experienceYears}
              onChangeText={(value) => updateFormData("experienceYears", value)}
              keyboardType="numeric"
              error={errors.experienceYears}
              returnKeyType="go"
              onSubmitEditing={handleNext}
            />
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View
            entering={SlideInRight.springify()}
            exiting={SlideOutLeft.springify()}
            className="gap-6 w-full"
          >
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="check-circle"
                size={64}
                color="#fb7185"
              />
              <Text className="text-white text-xl font-pbold mt-4">
                Almost Done!
              </Text>
              <Text className="text-sky-200/80 text-center mt-2 font-pregular">
                Set your consultation fee to complete registration
              </Text>
            </View>

            <GlassInput
              ref={feeRef}
              icon="cash-outline"
              placeholder="Consultation Fee (₹)"
              value={formData.consultationFee}
              onChangeText={(value) => updateFormData("consultationFee", value)}
              keyboardType="numeric"
              error={errors.consultationFee}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
            />

            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 gap-2">
              <Text className="text-white font-pmedium">Summary</Text>
              <View className="gap-1">
                <Text className="text-sky-200/80 text-sm font-pregular">
                  Name: <Text className="text-white">{formData.name}</Text>
                </Text>
                <Text className="text-sky-200/80 text-sm font-pregular">
                  Specialization:{" "}
                  <Text className="text-white">{formData.specialization}</Text>
                </Text>
                <Text className="text-sky-200/80 text-sm font-pregular">
                  License:{" "}
                  <Text className="text-white">{formData.licenseNumber}</Text>
                </Text>
              </View>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <DynamicBackground />

      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="mb-6"
          >
            <Button
              onPress={currentStep > 1 ? handleBack : () => router.back()}
              className="mb-4 w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/10 p-0"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="white"
              />
            </Button>

            <Text className="text-3xl font-pbold text-white mb-2">
              {currentStep === 1 && "Create Account"}
              {currentStep === 2 && "Personal Details"}
              {currentStep === 3 && "Professional Info"}
              {currentStep === 4 && "Final Step"}
            </Text>
            <Text className="text-sky-200/70 text-[15px] font-pregular">
              {currentStep === 1 && "Join us and start your journey"}
              {currentStep === 2 && "Tell us about yourself"}
              {currentStep === 3 && "Your professional credentials"}
              {currentStep === 4 && "Set your consultation fee"}
            </Text>
          </Animated.View>

          {/* Step Indicator */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          </Animated.View>

          {/* Form Steps */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(800).springify()}
            className="flex-1"
          >
            {renderStep()}
          </Animated.View>

          {/* Navigation Buttons */}
          <Animated.View entering={FadeInUp.delay(500)} className="mt-8 gap-3">
            {currentStep < totalSteps ? (
              <Button
                title="Continue"
                onPress={handleNext}
                className="h-14 rounded-2xl bg-rose-600 flex-row justify-center items-center gap-2 shadow-xl shadow-rose-500"
              />
            ) : (
              <Button
                title="Complete Registration"
                onPress={handleSubmit}
                disabled={loading}
                loading={loading}
                className="h-14 rounded-2xl bg-rose-600 flex-row justify-center items-center gap-2 shadow-xl shadow-rose-500"
              />
            )}
          </Animated.View>

          {/* Footer - Only on first step */}
          {currentStep === 1 && (
            <Animated.View
              entering={FadeInUp.delay(600)}
              className="mt-6 flex-row justify-center items-center"
            >
              <Text className="text-sky-200/80 text-[15px] font-pregular">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Button className="bg-transparent p-0">
                  <Text className="text-sky-400 font-bold text-[15px] font-pbold">
                    Sign In
                  </Text>
                </Button>
              </Link>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
