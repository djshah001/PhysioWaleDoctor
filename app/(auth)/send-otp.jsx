import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelperText, TextInput } from "react-native-paper";
import CustomBtn from "../../components/CustomBtn";
import { Link, router } from "expo-router";
import axios from "axios";
import AlertBox from "../../components/AlertBox";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import { useUserDataState } from "../../atoms/store";
import CustomInput from "../../components/ReUsables/CustomInput";

const SendOtp = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [userData, setUserData] = useUserDataState();

  // const [Email, setEmail] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    context: "doctor",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [PasswordMatches, setPasswordMatches] = useState(false);
  const [IsValidEmail, setIsValidEmail] = useState(false);

  const handleConfirmPassword = (confirmPassword) => {
    setForm({ ...form, confirmPassword: confirmPassword });
    if (confirmPassword !== form.password) {
      setPasswordMatches(false);
    } else {
      setPasswordMatches(true);
    }
  };

  const handleEmailChange = (email) => {
    setForm((prev) => ({ ...prev, email }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const {
    IsLoading,
    setIsLoading,
    Error,
    setError,
    visible,
    showDialog,
    hideDialog,
  } = useLoadingAndDialog();

  const handleNextPress = async () => {
    setIsLoading(true);
    if (IsValidEmail) {
      try {
        const res = await axios.post(`${apiUrl}/api/v/auth/sendemail`, form);
        console.log(res.data);
        if (res.data.success) {
          setUserData(form);
          router.push({
            pathname: "/verify-otp",
          });
        } else {
          console.log("hi");

          setError(res.data.errors[0].msg);
          showDialog();
        }
      } catch (error) {
        console.error(error);
        setError("server error: ");
        showDialog();
      }
    } else {
      setError("Email cannot be empty");
      showDialog();
    }
    setIsLoading(false);
  };

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
          <CustomInput
            label="  Name"
            placeholder="Name"
            value={form.name}
            handleChange={(e) => {
              setForm({ ...form, name: e });
            }}
            leftIcon="account"
          />

          <CustomInput
            label="  Email"
            placeholder="Enter Your Email Address"
            value={form.email}
            handleChange={handleEmailChange}
            keyboardType="email-address"
            theme={{ roundness: 25 }}
            leftIcon="email"
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
            title="Next"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            disabled={IsLoading}
            loading={IsLoading}
          />
          <View className="mt-5 justify-center items-center">
            <Text className="text-black text-base">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-secondary-300">
                Sign In
              </Link>
            </Text>
          </View>
          <AlertBox
            visible={visible}
            hideDialog={hideDialog}
            content={Error || "Invalid Email "}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOtp;
