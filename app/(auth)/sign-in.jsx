import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CustomBtn from "../../components/CustomBtn";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Link, router } from "expo-router";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import {
  useSignInState,
  useUserDataState,
  useToastSate,
} from "../../atoms/store";

import { LinearGradient } from "expo-linear-gradient";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import colors from "./../../constants/colors.js";
import CountryPickerWithIP from "../../components/authComp/CountryPickerWithIP";
import CustomInput from "../../components/ReUsables/CustomInput";
import { apiUrl } from "../../components/Utility/Repeatables";
import { StatusBar } from "expo-status-bar";

const SignIn = () => {
  const [data, setdata] = useSignInState();
  const [UserData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();

  /* -------------------------------------------------------------------------- */
  /*                            Loading and alert box states                    */
  /* -------------------------------------------------------------------------- */

  const {
    IsLoading,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
    Error,
    setError,
  } = useLoadingAndDialog();

  /* -------------------------------------------------------------------------- */
  /*                               for Number otp                               */
  /* -------------------------------------------------------------------------- */

  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳" });
  const [isValid, setIsValid] = useState(true);
  const [password, setPassword] = useState("");

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    const fullNumber = `${country.code}${text}`;
    const phoneNumberObj = parsePhoneNumberFromString(fullNumber);
    setIsValid(phoneNumberObj ? phoneNumberObj.isValid() : false);
  };

  /* -------------------------------------------------------------------------- */
  /*                           Phone verification function                      */
  /* -------------------------------------------------------------------------- */

  const handlePhoneVerification = async () => {
    if (!isValid) {
      setToast({
        message: "Please enter a valid phone number",
        visible: true,
        type: "error",
      });
      return;
    }

    // console.log(password);

    setIsLoading(true);
    try {
      const fullNumber = `${country.code}${phoneNumber}`;
      const res = await axios.post(`${apiUrl}/api/v/auth/signin/doctor`, {
        phoneNumber: fullNumber,
        password: password,
      });
      // console.log(res.data);

      if (res.data.success) {
        setToast({
          message: "OTP sent successfully",
          visible: true,
          type: "success",
        });
        setdata(res.data.authToken);
        // setUserData(res.data.userCred);
        await AsyncStorage.setItem("authToken", res.data.authToken);
        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
        router.replace("/home");
      }
    } catch (error) {
      console.log(error.response.data.errors[0].msg);
      setToast({
        message:
          error.response.data.errors[0].msg ||
          "An error occurred. Please try again.",
        visible: true,
        type: "error",
      });
    }
    setIsLoading(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                           Verify OTP function                              */
  /* -------------------------------------------------------------------------- */

  const verifyOTP = async (otp) => {
    setIsLoading(true);
    try {
      const fullNumber = `${country.code}${phoneNumber}`;
      const res = await axios.post(`${apiUrl}/api/v/auth/verifyotp`, {
        phoneNumber: fullNumber,
        otp,
      });

      if (res.data.success) {
        setdata(res.data.authToken);
        await AsyncStorage.setItem("authToken", res.data.authToken);
        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
        router.replace("/home");
      } else {
        setToast({
          message: res.data.message || "Invalid OTP",
          visible: true,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message:
          error.response.data.errors[0].msg ||
          "An error occurred. Please try again.",
        visible: true,
        type: "error",
      });
    }
    setIsLoading(false);
  };

  return (
    // <SafeAreaView className="bg-[#f5f5f5] h-full ">
    <ScrollView contentContainerClassName="h-full">
      <LinearGradient
        colors={[colors.blues[400], colors.blues[600], colors.blues[800]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 justify-around items-center px-6 "
      >
        <View className="self-start mt-4 ">
          <Text className="text-5xl font-osextrabold text-blues-900 mb-3 ">
            PhysioWale
          </Text>
          <Text className="font-pbold text-2xl text-white-300 ml w-[250px] ">
            Sign in with your phone number to continue
          </Text>
        </View>

        <View className="w-full justify-center gap-4 ">
          <CountryPickerWithIP
            country={country}
            setCountry={setCountry}
            phoneNumber={phoneNumber}
            handlePhoneNumberChange={handlePhoneNumberChange}
          />

          <CustomInput
            placeholder="Enter your password"
            label="Password"
            value={password}
            handleChange={setPassword}
            secureTextEntry={true}
            leftIcon={"lock"}
            noBR={true}
            customStyles="mt-2"
          />

          <CustomBtn
            title="Continue"
            iconName="arrow-right"
            handlePress={handlePhoneVerification}
            loading={IsLoading}
            customStyles="mt-2"
            colorScheme={2}
            // disabled={!isValid || phoneNumber.length < 10}
          />

          <View className="mt-4 justify-center items-center w-full">
            <Text className="text-white-200 text-base">
              New to PhysioWale?{" "}
              <Link href="/send-otp" className="text-primary-400 ">
                {" "}
                Sign Up{" "}
              </Link>
            </Text>
          </View>
        </View>
        <View className="mt-5 justify-center items-center w-full">
          <Text className="text-white-200 text-center text-base">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </LinearGradient>

      <StatusBar style="inverted" translucent />
    </ScrollView>
    // </SafeAreaView>
  );
};

export default SignIn;
