import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import { toastAtom } from "../../store/uiAtoms";
import { otpConfirmationAtom } from "../../store/authAtoms";
import DynamicBackground from "~/components/authComp/DynamicBackground";
import { Button } from "~/components/ui/button";
import GlassInput from "~/components/GlassInput";

const VerifyOtp = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyAndRegister, verifyFirebaseOtp } = useAuth();
  const [, setToast] = useAtom(toastAtom);
  const [otpConfirmation] = useAtom(otpConfirmationAtom);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      setToast({
        visible: true,
        message: "Enter valid 6-digit OTP",
        type: "error",
      });
      return;
    }

    if (!otpConfirmation) {
      // Fallback or error if lost state (e.g. reload) -> should restart flow
      setToast({
        visible: true,
        message: "Session expired. Please sign up again.",
        type: "error",
      });
      router.replace("/(auth)/sign-up");
      return;
    }

    setLoading(true);

    try {
      // 1. Verify with Firebase
      const verifyRes = await verifyFirebaseOtp(otpConfirmation, otp);
      if (!verifyRes.success || !verifyRes.user) {
        throw new Error(verifyRes.error || "OTP verification failed");
      }

      const idToken = await verifyRes.user.getIdToken();

      // 2. Register on Backend
      const result = await verifyAndRegister({
        phoneNumber: params.phoneNumber as string,
        name: params.name as string,
        password: params.password as string,
        token: idToken,
        context: "patient",
      });

      if (result.success) {
        setToast({
          visible: true,
          message: "Verification Successful!",
          type: "success",
        });
        router.replace("/(auth)/complete-profile");
      } else {
        throw new Error(result.error || "Registration Failed");
      }
    } catch (error: any) {
      setToast({
        visible: true,
        message: error.message || "Verification Failed",
        type: "error",
      });
    } finally {
      setLoading(false);
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
            <View className="w-20 h-20 bg-sky-500/20 rounded-full items-center justify-center mb-4 border border-sky-500/30">
              <MaterialCommunityIcons
                name="message-lock-outline"
                size={40}
                color="#38bdf8"
              />
            </View>
            <Text className="text-3xl font-pextrabold text-white text-center">
              Verify OTP
            </Text>
            <Text className="text-base text-sky-200/70 text-center mt-2 px-4 font-pregular">
              We sent a code to{" "}
              <Text className="font-pbold text-sky-400">
                {params.phoneNumber}
              </Text>
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(800).springify()}
            className="w-full gap-6"
          >
            <GlassInput
              icon="message-processing-outline"
              iconFamily="MaterialCommunityIcons"
              placeholder="Enter 6-digit Code"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              containerStyle={{ marginBottom: 10 }}
              maxLength={6}
            />

            <Button
              title="Verify & Proceed"
              onPress={handleVerify}
              loading={loading}
              className="h-14 rounded-2xl bg-sky-500 flex-row justify-center items-center gap-2 shadow-xl shadow-sky-500"
            />

            <View className="flex-row justify-center">
              <Text className="text-slate-400 text-sm font-pregular">
                Didn't receive code?{" "}
              </Text>
              <TouchableOpacity>
                <Text className="text-sky-400 font-psemibold text-sm">
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyOtp;
