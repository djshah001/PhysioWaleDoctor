import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserDataState } from "./../../atoms/store.js";

import CustomBtn from "./../../components/CustomBtn.jsx";

import colors from "./../../constants/colors.js";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables.jsx";
import { Appbar, Icon, IconButton } from "react-native-paper";
import { BlurView } from "expo-blur";
cssInterop(Image, { className: "style" });
cssInterop(Appbar, { className: "style" });

const Clinic = () => {
  const [UserData, setUserData] = useUserDataState();

  // const getClinics = async () => {
  //   console.log(UserData.clinics)
  //   const res = await axios.get(
  //     `${apiUrl}/api/v/clinics/by-doctor?id=${UserData.id}`
  //   );
  //   console.log(res.data);
  // };

  useEffect(() => {
    // getClinics();
    // console.log(UserData.clinics)
  }, []);

  if (UserData.clinics.length === 0) {
    return (
      <SafeAreaView className="bg-white-300 flex-1 ">
        <ScrollView
          // className="px-4"
          contentContainerClassName=" w-full h-screen justify-center items-center gap-4 "
        >
          {/* <LinearGradient
            colors={[colors.blues[400], colors.blues[600], colors.blues[800]]} // Gradient colors (light to dark)
            start={{ x: 0, y: 0 }} // Start point of the gradient
            end={{ x: 0, y: 1 }} // End point of the gradient
            className="w-full h-screen justify-center items-center px-6 gap-6 "
          > */}
          <MaterialIcons
            name="add-location-alt"
            size={150}
            color={colors.blueishGreen[500]}
          />
          <Text className="text-2xl text-center text-black-200 ">
            You have not added any clinics yet
          </Text>
          <CustomBtn
            title="Register Clinic"
            //  iconName: any;
            handlePress={() => router.push("clinics/register")}
            //  loading: any;
            customStyles="w-4/6"
            secondScheme={true}
          />
          {/* </LinearGradient> */}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // console.log(UserData.clinics);

  return (
    <SafeAreaView className="bg-white-300 flex-1 ">
      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow w-full h-scree  "
      >
        <Appbar.Header
          mode="center-aligned"
          // safeAreaInsets={{ bottom }}
          elevated={true}
          // elevation={3}
          className="bg-white-300 mt-[-25px] "
        >
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Your Clinics" className=" font-bold" />
          <Appbar.Action
            icon="hospital-building"
            onPress={() => router.push("clinics/register")}
          />
        </Appbar.Header>
        <View className="p-4">
          {UserData.clinics.map((clinic, i) => {
            return (
              <View
                key={clinic._id}
                className={`my-3 gap-3 justify-center bg-white-300 shadow-md shadow-black-200 rounded-[30px] overflow-hidden `}
              >
                <Image
                  source={{
                    uri: clinic.images[0]
                      ? clinic.images[0]
                      : "https://via.placeholder.com/400",
                  }}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                  className=" w-full h-80 rounded-3xl overflow-hidden "
                />

                <BlurView
                  intensity={30}
                  tint="systemChromeMaterialDark"
                  experimentalBlurMethod="dimezisBlurView"
                  className=" absolute bottom-0 w-full "
                >
                  <View className="p-3 my-2  rounded-b-3xl shadow-xl flex-row items-center justify-around bg-blac-200/50 ">
                    {/* Overlayed content */}
                    <View className=" w-9/12 gap-1 ">
                      <Text className="text-lg font-pbold text-white-400 leading-6 ">
                        {clinic.name}
                      </Text>
                      <Text
                        className=" font-osmedium text-accent "
                        numberOfLines={1}
                      >
                        <Icon
                          source="map-marker"
                          size={16}
                          color={colors.accent["DEFAULT"]}
                        />
                        {clinic.address || "Address not available"}
                      </Text>
                    </View>
                    <BlurView
                      intensity={20}
                      tint="systemChromeMaterialLight"
                      experimentalBlurMethod="dimezisBlurView"
                      className=" rounded-full overflow-hidden "
                    >
                      <IconButton
                        icon="arrow-top-right"
                        iconColor={colors.white["500"]}
                        // className="bg-white-400"
                        size={30}
                        onPress={() =>
                          router.push({
                            pathname: "/clinics/".concat(clinic._id),
                            params: {
                              clinicId: clinic._id,
                            },
                          })
                        }
                      />
                    </BlurView>
                  </View>
                </BlurView>
                {/* </> */}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Clinic;
