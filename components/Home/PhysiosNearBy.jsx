import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Link, router } from "expo-router";
import { cssInterop } from "nativewind";
import { Icon, IconButton } from "react-native-paper";

import colors from "../../constants/colors";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import Animated from "react-native-reanimated";

cssInterop(Image, { className: "style" });

const PhysiosNearBy = ({ clinics, isLoading }) => {
  // Memoize date calculations to prevent recalculations on re-renders
  const { currentDay } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return { currentDay: days[dayOfWeek] };
  }, []);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  // Memoize the loading skeleton to prevent unnecessary re-renders
  const LoadingSkeleton = useMemo(
    () => (
      <MotiView
        transition={{ type: "timing" }}
        animate={{ backgroundColor: "#f7f8f8" }}
        className="px-4 w-screen rounded-3xl mb-4 gap-4"
      >
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-osbold text-xl ml-1 mb-1">Physios Near-Me</Text>
        </View>
        <MotiView
          transition={{ type: "timing" }}
          animate={{ backgroundColor: "#f7f8f8" }}
          className="w-full rounded-3xl mb-4 gap-5"
        >
          <Skeleton
            colorMode={"light"}
            width={"100%"}
            height={280}
            radius={30}
          />
          <Skeleton
            colorMode={"light"}
            width={"100%"}
            height={280}
            radius={30}
          />
        </MotiView>
      </MotiView>
    ),
    []
  );

  if (isLoading) {
    return LoadingSkeleton;
  }

  // Memoize the header component
  const Header = (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-osbold text-xl ml-1">Physios Near-Me</Text>
      <TouchableOpacity>
        <Text className="font-ossemibold text-md text-secondary-300 underline decoration-8 underline-offset-8">
          See All
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="px-4 gap-2">
      {Header}
      {clinics.map((clinic, i) => {
        const distance = (clinic.distance / 1000).toFixed(1);
        const opening = clinic.timing[currentDay]?.opening || "N/A";
        const closing = clinic.timing[currentDay]?.closing || "N/A";

        return (
          <MotiView
            from={{ opacity: 0, translateX: 100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: "spring",
              duration: 2000,
              delay: Math.min(100 * i, 500), // Cap the delay to prevent too long animations
              easing: "easeInOut",
              damping: 5,
              stiffness: 200,
            }}
            key={clinic._id}
            className="my-3 gap-3 justify-center bg-white-300 shadow-md shadow-black-200 rounded-[30px] overflow-hidden"
          >
            <Animated.Image
              source={{
                uri: clinic.images?.[0] || "https://via.placeholder.com/400",
              }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
              className="w-full h-80 rounded-3xl overflow-hidden"
              // sharedTransitionTag={`clinic-image-${clinic._id}`}
            />

            {/* Top right bookmark button */}
            <BlurView
              intensity={15}
              tint="systemChromeMaterialLight"
              experimentalBlurMethod="dimezisBlurView"
              className="absolute top-3 right-2 rounded-full overflow-hidden"
            >
              <IconButton
                icon="bookmark-outline"
                iconColor={colors.white["500"]}
                size={24}
                onPress={() => console.log("Pressed")}
              />
            </BlurView>

            {/* Top left distance indicator */}
            <BlurView
              intensity={15}
              tint="systemChromeMaterialLight"
              experimentalBlurMethod="dimezisBlurView"
              className="absolute top-3 left-2 rounded-full overflow-hidden flex-row items-center justify-around"
            >
              <IconButton
                icon="map-marker-radius-outline"
                iconColor={colors.white["500"]}
                className="bg-white-40 ml-0"
                size={24}
                onPress={() => console.log("Pressed")}
              />
              <View className="mr-5">
                <Text className="text-white-500">{distance} km</Text>
              </View>
            </BlurView>

            {/* Bottom info panel */}
            <BlurView
              intensity={30}
              tint="systemChromeMaterialDark"
              experimentalBlurMethod="dimezisBlurView"
              className="absolute bottom-0 w-full"
            >
              <View className="p-3 my-2 rounded-b-3xl shadow-xl flex-row items-center justify-around bg-blac-200/50">
                <View className="w-9/12 gap-1">
                  <Text className="text-xs font-oslight text-accent mb-1">
                    <Icon
                      source="clock-time-two-outline"
                      size={12}
                      color={colors.accent["DEFAULT"]}
                    />{" "}
                    {opening} - {closing}
                  </Text>
                  <Text className="text-xl font-pbold text-white-400 leading-6">
                    {clinic.name}
                  </Text>
                </View>
                <BlurView
                  intensity={20}
                  tint="systemChromeMaterialLight"
                  experimentalBlurMethod="dimezisBlurView"
                  className="rounded-full overflow-hidden"
                >
                  <Link 
                    href={{
                      pathname: `/clinics/${clinic._id}`,
                      params: {
                        clinicId: clinic._id,
                        distance: distance,
                      }
                    }} 
                    asChild
                  >
                    <IconButton
                      icon="arrow-top-right"
                      iconColor={colors.white["500"]}
                      size={30}
                      // onPress={() =>
                      //   router.push({
                      //     pathname: `/clinics/${clinic._id}`,
                      //     params: {
                      //       clinicId: clinic._id,
                      //       distance: distance,
                      //     },
                      //   })
                      // }
                    />
                  </Link>
                </BlurView>
              </View>
            </BlurView>
          </MotiView>
        );
      })}
    </View>
  );
};

export default React.memo(PhysiosNearBy);
