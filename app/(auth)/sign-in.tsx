import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { useAtom } from "jotai";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import parsePhoneNumberFromString from "libphonenumber-js";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as yup from "yup";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../store/toastStore";
import DynamicBackground from "~/components/authComp/DynamicBackground";
import { Button } from "~/components/ui/button";
import CustomCountryPicker from "~/components/CustomCountryPicker";
import GlassInput from "~/components/GlassInput";

// Validation Schema
const signInSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  password: yup.string().required("Password is required"),
});

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const passwordRef = useRef<TextInput>(null);

  // Logo Animation
  const logoScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const validate = async () => {
    try {
      await signInSchema.validate(
        { phoneNumber, password },
        { abortEarly: false },
      );
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

  const handleLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const isValid = await validate();
    if (!isValid) return;

    const fullNumber = `${country.code}${phoneNumber}`;
    const phoneNumberObj = parsePhoneNumberFromString(fullNumber);

    if (!phoneNumberObj?.isValid()) {
      showToast(
        "error",
        "Invalid Phone Number",
        "Please enter a valid phone number.",
      );
      return;
    }

    setLoading(true);
    const result = await login({ phoneNumber: fullNumber, password });

    if (result.success) {
      showToast("success", "Welcome Back", "Logged in successfully.");
      router.replace("/(tabs)");
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      showToast("error", "Login Failed", result.error || "Login Failed");
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <DynamicBackground />

      <KeyboardAvoidingView behavior={"padding"} className="flex-1">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- 1. Brand Section --- */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="items-center mb-10"
          >
            <Animated.View
              style={animatedLogoStyle}
              className="mb-4 shadow-lg shadow-sky-500/50"
            >
              <View className="w-20 h-20 rounded-[24px] bg-sky-500 justify-center items-center border border-white/40">
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={42}
                  color="white"
                />
              </View>
            </Animated.View>

            <Text className="text-4xl font-pextrabold text-white tracking-widest">
              PhysioWale
            </Text>
            <Text className="text-sky-200/70 text-base mt-1.5 font-pmedium">
              Your dedicated partner in recovery and wellness
            </Text>
          </Animated.View>

          {/* --- 2. Form Section --- */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(800).springify()}
            className="w-full"
          >
            {/* Header Title inside form area */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-white mb-1.5 font-pbold">
                Doctor Portal
              </Text>
              <Text className="text-[15px] text-sky-200/70 font-pregular">
                Please sign in to manage your clinic
              </Text>
            </View>

            <View className="gap-4">
              {/* Phone Input */}
              <GlassInput
                icon="phone-portrait-outline"
                placeholder="98765 43210"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                error={errors.phoneNumber}
                containerStyle={{ marginBottom: 4 }}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
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

              {/* Password Input */}
              <GlassInput
                ref={passwordRef}
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                isPassword
                error={errors.password}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />

              {/* Forgot Password */}
              <TouchableOpacity className="self-end mb-2">
                <Link href="/(auth)/forgot-password" asChild>
                  <Text className="text-sky-400 font-psemibold text-sm">
                    Forgot Password?
                  </Text>
                </Link>
              </TouchableOpacity>

              {/* Sign In Button */}
              <Button
                title="Sign In"
                onPress={handleLogin}
                disabled={loading}
                loading={loading}
                className="h-14 rounded-2xl bg-rose-600 flex-row justify-center items-center gap-2 shadow-xl shadow-rose-500"
              />
            </View>
          </Animated.View>

          {/* --- 3. Footer --- */}
          <Animated.View
            entering={FadeInUp.delay(600)}
            className="mt-8 flex-row justify-center items-center"
          >
            <Text className="text-sky-200/80 text-[15px] font-pregular">
              New to PhysioPrep?{" "}
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-sky-400 font-bold text-[15px] font-pbold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
