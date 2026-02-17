import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useToastSate, useUserDataState } from "../../atoms/store";
import { Button, TextInput } from "react-native-paper";
import CustomBtn from "../CustomBtn";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import { router } from "expo-router";

const OtpScreen = () => {
  const [OTP, setOTP] = useState("");
  const [userData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();

  const otpRef = useRef(null);

  const handleOTPChange = (otp) => {
    setOTP(otp);
  };

  const verifyOTP = async (otp) => {
    console.log("verifying otp");
    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/verifyotp`, {
        ...userData,
        otp: otp,
        countryCode: userData.countryCode,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data.errors[0].msg;
    }
  };

  const handleNextPress = async () => {
    console.log("pressing next");
    try {
      const res = await verifyOTP(OTP);

      console.log(res);
      if (res.success) {
        setToast({
          message: "OTP verified successfully",
          visible: true,
          type: "success",
        });
        setUserData({ ...res.newRecord, id: res.id });
        router.replace({
          pathname: "/sign-up",
        });
      } else {
        setToast({
          message: res,
          visible: true,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendCode = async () => {
    console.log("resend code op");
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
            {`An OTP has been sent to your phone Number:`}
          </Text>
          <TextInput
            ref={otpRef}
            mode="outlined"
            label="Enter OTP"
            placeholder="Enter OTP"
            placeholderTextColor="#6d6d6d"
            value={OTP}
            onChangeText={handleOTPChange}
            keyboardType="phone-pad"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="email" color="#6d6d6d" />}
          />

          <View className="flex-row justify-center items-center">
            <Text className="font-pmedium">Didn't receive code?</Text>

            <Button onPress={handleResendCode}>
              <Text className="text-secondary-200 leading-4 ">Resend code</Text>
            </Button>
          </View>
        </View>

        <View className="w-5/6 mt-5 justify-center">
          <CustomBtn
            title="Verify OTP"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            // loading={IsLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpScreen;
