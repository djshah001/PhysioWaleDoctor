import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBtn from "../../components/CustomBtn";
import { router } from "expo-router";
import axios from "axios";
import {
  useSignInState,
  useToastSate,
  useUserDataState,
} from "../../atoms/store";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import CustomDropDown from "../../components/ReUsables/CustomDropDown";
import DatePicker from "../../components/ReUsables/DatePicker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { apiUrl, blurhash } from "../../components/Utility/Repeatables";

const SignUp = () => {
  const [userData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();

  const endYear = new Date().getFullYear();

  const OPTIONS = [
    { label: "Male", value: "male", icon: "mars" },
    { label: "Female", value: "female", icon: "venus" },
    { label: "Others", value: "others", icon: "circle-exclamation" },
  ];

  const [form, setForm] = useState({
    ...userData,
    profilePic: "",
    context: "doctor",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { IsLoading, setIsLoading } = useLoadingAndDialog();

  // const [data, setdata] = useSignInState();
  // console.log(data);

  const [date, setDate] = useState(null);
  const [uploading, setUploading] = useState(false);

  // console.log(date.toLocaleDateString());

  const [Img, setImg] = useState(null);

  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImg(result.assets[0]);
    }
  };

  const cloudUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("context", "doctor");
    if (!!Img) {
      formData.append("profilePic", {
        uri: Img.uri,
        type: Img.mimeType || "image/png",
        name: Img.fileName,
      });
    }

    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, profilePic: res.data.filePath });
      setToast({
        message: "Image uploaded successfully",
        visible: true,
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        message:
          error.response.data.errors[0].msg ||
          "Can't upload image. Please try again.",
        visible: true,
        type: "error",
      });
    }
    setUploading(false);
  };

  const handleSignUp = async () => {
    console.log(!!date);
    setIsLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/signup`, {
        ...form,
        DOB: date,
      });
      console.log(res.data);
      if (res.data.success) {
        // await AsyncStorage.setItem("isProfileComplete", JSON.stringify(false));
        setUserData({});
        setToast({
          message: "Signup Successfully",
          visible: true,
          type: "success",
        });
        router.replace("sign-in");
      } else {
        setToast({
          message: res.data.errors[0].msg,
          visible: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setToast({
        message: "Server Error",
        visible: true,
        type: "error",
      });
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className="bg-white-300 flex-1 ">
      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow px-10 w-full h-scree justify-evenly self-center "
      >
        {/* <View className=" px-4 w-full h-scree justify-evenl "> */}
        <View>
          <Text className="font-pbold text-2xl text-center">
            Let’s complete your profile
          </Text>
          <Text className="font-pextrathin text-center text-md">
            It will help us to know more about you!
          </Text>
        </View>

        <View className=" ">
          <CustomDropDown
            label=" Select Gender"
            data={OPTIONS}
            value={form.gender}
            onSelect={(value) => handleChange("gender", value)}
          />

          <DatePicker date={date} setDate={setDate} endYear={endYear} />

          <CustomBtn
            title={form.profilePic ? "Change Image" : "Select your image"}
            iconName="cloud-upload"
            handlePress={onSelectImage}
            // loading={IsLoading}
            customStyles="mt-4"
          />

          {Img && (
            // <View className="w-[30vw] justify-center">
            <>
              <Image
                source={{ uri: Img.uri }} // Correct usage with a URI
                placeholder={{ blurhash }}
                contentFit="contain"
                transition={1000}
                style={{
                  width: "200",
                  height: "200", // Adjust the height as needed
                  backgroundColor: "#055300",
                  alignSelf: "center",
                  marginVertical: 20,
                  borderRadius: 30,
                }}
                imageStyle={{}}
                blurRadius={0}
                // className="mt-5"
              />
              <CustomBtn
                title={uploading ? "Uploading..." : "Upload Image"}
                iconName="cloud-upload"
                handlePress={cloudUpload}
                loading={uploading}
                customStyles="mt-4"
              />
            </>
            // </View>
          )}
        </View>
        <CustomBtn
          title="Sign-Up"
          iconName="account-plus"
          handlePress={handleSignUp}
          loading={IsLoading}
        />
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
