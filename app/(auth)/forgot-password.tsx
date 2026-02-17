import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { useAtom } from "jotai";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as yup from "yup";

import { useAuth } from "../../hooks/useAuth";
import { toastAtom } from "../../store/uiAtoms";
import DynamicBackground from "~/components/authComp/DynamicBackground";
import { Button } from "~/components/ui/button";
import CustomCountryPicker from "~/components/CustomCountryPicker";
import GlassInput from "~/components/GlassInput";

const forgotPasswordSchema = yup.object().shape({
  phoneNumber: yup.string().required("Phone number is required").min(10),
});

const ForgotPassword = () => {
  const router = useRouter();
  const [, setToast] = useAtom(toastAtom);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleReset = async () => {
    try {
      await forgotPasswordSchema.validate(
        { phoneNumber },
        { abortEarly: false }
      );
      setErrors({});

      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setToast({
          visible: true,
          message: "Reset link sent (Simulation)",
          type: "success",
        });
        router.back();
      }, 1500);
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
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
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="items-center mb-8"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-4 w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/10 self-start"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <View className="w-20 h-20 bg-rose-500/20 rounded-full items-center justify-center mb-4 border border-rose-500/30">
              <MaterialCommunityIcons
                name="lock-reset"
                size={40}
                color="#fb7185"
              />
            </View>
            <Text className="text-3xl font-pextrabold text-white text-center">
              Forgot Password?
            </Text>
            <Text className="text-base text-sky-200/70 text-center mt-2 px-4 font-pregular">
              Enter your phone number to receive reset instructions.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(800).springify()}
            className="w-full gap-6"
          >
            <GlassInput
              icon="phone-portrait-outline"
              placeholder="98765 43210"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              error={errors.phoneNumber}
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

            <Button
              title="Send Reset Link"
              onPress={handleReset}
              loading={loading}
              className="h-14 rounded-2xl bg-rose-600 flex-row justify-center items-center gap-2 shadow-xl shadow-rose-500"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;
