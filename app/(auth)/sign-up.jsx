import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomBtn from "../../components/CustomBtn";
import { Link, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useSignInState, useUserDataState } from "../../atoms/store";
import { HelperText, TextInput } from "react-native-paper";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import AlertBox from "../../components/AlertBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/ReUsables/CustomInput";
import CustomDropDown from "../../components/ReUsables/CustomDropDown";
import DatePicker from "../../components/ReUsables/DatePicker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

const SignUp = () => {
  const [userData, setUserData] = useUserDataState();

  const endYear = new Date().getFullYear();

  const OPTIONS = [
    { label: "Male", value: "male", icon: "mars" },
    { label: "Female", value: "female", icon: "venus" },
    { label: "Others", value: "others", icon: "circle-exclamation" },
  ];

  const [form, setForm] = useState({
    ...userData,
    gender: "",
    contactNumber: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const {
    IsLoading,
    Error,
    setError,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
  } = useLoadingAndDialog();

  // const [data, setdata] = useSignInState();
  // console.log(data);

  const [date, setDate] = useState(null);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL; //API URL

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

  const handleSignUp = async () => {
    console.log(!!date);
    setIsLoading(true);

    // Create a new FormData object
    const formData = new FormData();

    for (let key in form) {
      formData.append(key, form[key]);
    }

    if (!!date) {
      console.log('hi')
      formData.append("DOB", date.toISOString());
    }
    //  else {
    //   setError("Please enter a valid date");
    // }

    if (!!Img) {
      formData.append("image", {
        uri: Img.uri,
        type: Img.mimeType || "image/png",
        name: Img.fileName,
      });
    }

    try {
      const res = await axios.post(
        `${apiUrl}/api/v/doctors/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(res.data);
      if (res.data.success) {
        // await AsyncStorage.setItem("isProfileComplete", JSON.stringify(false));
        setUserData({});
        router.replace("sign-in");
      } else {
        setError(res.data.errors[0].msg);
        showDialog();
      }
    } catch (error) {
      console.error(error);
      setError("Server Error");
      showDialog();
    }

    setIsLoading(false);
  };

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
            label="  Select Gender"
            data={OPTIONS}
            value={form.gender}
            onSelect={(value) => handleChange("gender", value)}
          />

          <DatePicker date={date} setDate={setDate} endYear={endYear} />

          <CustomInput
            label="  Mobile"
            placeholder="Mobiles"
            value={form.contactNumber}
            leftIcon="cellphone"
            handleChange={(value) => handleChange("contactNumber", value)}
          />

          <CustomBtn
            title="upload your image"
            iconName="cloud-upload"
            handlePress={onSelectImage}
            // loading={IsLoading}
            customStyles="mt-4"
          />

          {Img && (
            // <View className="w-[30vw] justify-center">
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
        <AlertBox visible={visible} hideDialog={hideDialog} content={Error} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
