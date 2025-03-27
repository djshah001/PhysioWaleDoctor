import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBtn from "../../components/CustomBtn";
import { Link, router } from "expo-router";
import axios from "axios";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import { useToastSate, useUserDataState } from "../../atoms/store";
import CustomInput from "../../components/ReUsables/CustomInput";
import OtpScreen from "../../components/authComp/OtpScreen";
import { apiUrl } from "../../components/Utility/Repeatables";
import CountryPickerWithIP from "../../components/authComp/CountryPickerWithIP";
import parsePhoneNumberFromString from "libphonenumber-js";

const SendOtp = () => {
  const [userData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();

  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳" });

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    context: "doctor",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [PasswordMatches, setPasswordMatches] = useState(false);
  const [IsValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const handleConfirmPassword = (confirmPassword) => {
    setForm({ ...form, confirmPassword: confirmPassword });
    if (confirmPassword !== form.password) {
      setPasswordMatches(false);
    } else {
      setPasswordMatches(true);
    }
  };

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    if (!phoneNumber || phoneNumber.length < 5) {
      setIsValidPhoneNumber(false);
      return;
    }

    const fullNumber = `${countryCode}${phoneNumber}`;
    const phoneNumberObj = parsePhoneNumberFromString(fullNumber);

    if (phoneNumberObj && phoneNumberObj.isValid()) {
      setIsValidPhoneNumber(true);
    } else {
      setIsValidPhoneNumber(false);
    }
  };

  // // Check if the phone number is valid for the selected country
  // validatePhoneNumber(form.phoneNumber, country.code);

  // Validate phone number whenever it changes or country code changes
  useEffect(() => {
    validatePhoneNumber(form.phoneNumber, country.code);
  }, [form.phoneNumber, country.code]);

  const handlePhoneNumberChange = (phoneNumber) => {
    setForm((prev) => ({ ...prev, phoneNumber }));
  };

  const { IsLoading, setIsLoading } = useLoadingAndDialog();

  const handleNextPress = async () => {
    setIsLoading(true);
    if (IsValidPhoneNumber) {
      try {
        const res = await axios.post(`${apiUrl}/api/v/auth/sendotp`, {
          ...form,
          phoneNumber: `${country.code}${form.phoneNumber}`,
        });
        console.log(res.data);
        if (res.data.success) {
          setUserData({
            ...form,
            phoneNumber: `${country.code}${form.phoneNumber}`,
            countryCode: country.code,
          });
          setShowOtpScreen(true);
        }
      } catch (error) {
        // console.error(error.response.data);
        if (error.response.data) {
          setToast({
            message: error.response.data.errors[0].msg,
            visible: true,
            type: "error",
          });
        } else {
          setToast({
            message: "server error: ",
            visible: true,
            type: "error",
          });
        }
      }
    } else {
      setToast({
        message: "Invalid Phone Number",
        visible: true,
        type: "error",
      });
    }
    setIsLoading(false);
  };

  if (showOtpScreen) {
    return <OtpScreen />;
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "100%",
        }}
      >
        <View>
          <Text className="font-pregular text-center text-xl">
            New To PhysioWale ?,
          </Text>
          <Text className="font-pextrabold tracking-wide text-2xl text-center">
            Create An Account
          </Text>
        </View>

        <View className="w-5/6 justify-center gap-2">
          <CountryPickerWithIP
            country={country}
            setCountry={setCountry}
            phoneNumber={form.phoneNumber}
            handlePhoneNumberChange={handlePhoneNumberChange}
          />

          <CustomInput
            label="  Name"
            placeholder="Name"
            value={form.name}
            handleChange={(e) => {
              setForm({ ...form, name: e });
            }}
            leftIcon="account"
          />

          {/* <HelperText
            type="error"
            visible={!IsValidEmail}
            padding="normal"
            style={{ paddingVertical: 0, paddingLeft: 25 }}
          >
            invalid email
          </HelperText> */}

          <CustomInput
            label="  Password"
            placeholder="Password"
            placeholderTextColor="#6d6d6d"
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            secureTextEntry={!passwordVisible}
            leftIcon="lock"
            rightIcon={passwordVisible ? "eye-off" : "eye"}
            rightPress={() => setPasswordVisible(!passwordVisible)}
          />

          <CustomInput
            mode="outlined"
            label="  Confirm Password"
            placeholder="Confirm Password"
            value={form.confirmPassword} //
            handleChange={handleConfirmPassword}
            secureTextEntry={!passwordVisible}
            activeOutlineColor={`${PasswordMatches ? "#95AEFE" : "#b00000"}`}
            leftIcon="lock"
            rightIcon={passwordVisible ? "eye-off" : "eye"}
            rightPress={() => setPasswordVisible(!passwordVisible)}
          />
        </View>

        <View className="w-5/6 mt-5 justify-center">
          <CustomBtn
            title="Get OTP"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            disabled={IsLoading}
            loading={IsLoading}
            colorScheme={2}
          />
          <View className="mt-5 justify-center items-center">
            <Text className="text-black text-base">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-secondary-300">
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOtp;
