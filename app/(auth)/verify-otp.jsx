import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, HelperText, TextInput } from "react-native-paper";
import CustomBtn from "../../components/CustomBtn";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import axios from "axios";
import AlertBox from "../../components/AlertBox";
import { useUserDataState } from "../../atoms/store";

const VerifyOtp = () => {
  const [OTP, setOTP] = useState("");
  const [userData, setUserData] = useUserDataState();
  const emailSplit = userData.email.split("@");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const hiddenEmail = userData.email[0] + "***@" + emailSplit[1];
  const otpRef = useRef(null);

  console.log(userData);

  const handleOTPChange = (otp) => {
    setOTP(otp);
  };

  const verifyOTP = async (otp) => {
    console.log(otp);
    const res = await axios.post(`${apiUrl}/api/v/auth/verifyotp`, {
      email: userData.email,
      verificationCode: otp,
    });
    return res.data;
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
    const res = await verifyOTP(OTP);
    console.log(res);
    if (res.success) {

      router.replace({
        pathname: "/sign-up",
      });

    } else {
      setError(res.errors[0].msg);
      showDialog();
    }
    setIsLoading(false);
  };

  const sendEmail = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/sendemail`, userData);
      console.log(res.data);
      if (res.data.success) {
        setError("Email sent successfully");
        showDialog();
      } else {
        showDialog();
      }
    } catch (error) {
      showDialog();
    }
  };

  const hideAlert = () => {
    hideDialog();
    // router.replace("/sign-in");
  };

  useEffect(() => {
    otpRef.current.focus();
  }, []);

  return (
    <SafeAreaView className="bg-white-300">
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
          <Text className="font-osbold text-2xl text-center">
            Create An Account
          </Text>
        </View>

        <View className="w-5/6 justify-center gap-2">
          <Text className="font-pregular text-center text-lg">
            {`An OTP has been sent to your email address: ${hiddenEmail}`}
          </Text>
          <TextInput
            ref={otpRef}
            mode="outlined"
            label="  OTP"
            placeholder="Enter OTP"
            placeholderTextColor="#6d6d6d"
            value={OTP}
            onChangeText={handleOTPChange}
            keyboardType="decimal-pad"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="email" color="#6d6d6d" />}
          />

          <View className="flex-row justify-center items-center">
            <Text className="font-pmedium">Didn't receive code?</Text>

            <Button onPress={sendEmail}>
              <Text className="text-secondary-200 leading-4 ">Resend code</Text>
            </Button>
          </View>
        </View>

        <View className="w-5/6 mt-5 justify-center">
          <CustomBtn
            title="Next"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            // loading={IsLoading}
          />
        </View>
        <AlertBox
          visible={visible}
          hideDialog={hideAlert}
          content={Error || "Entered OTP is wrong"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyOtp;
