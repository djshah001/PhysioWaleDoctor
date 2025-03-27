import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Repeatables, {
  apiUrl,
  blurhash,
} from "../../components/Utility/Repeatables";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Appbar, Icon, IconButton } from "react-native-paper";
import { cssInterop } from "nativewind";
import { StatusBar } from "expo-status-bar";
import colors from "../../constants/colors";
import Animated from "react-native-reanimated";
import { Skeleton } from "moti/skeleton";
import { useClinicsState } from "../../atoms/store";

import { MotiView, AnimatePresence } from "moti";
cssInterop(Appbar, { className: "style" });
cssInterop(Icon, { className: "style" });

const Details = ({ title, icon }) => {
  return (
    <View className="flex-row items-center gap-2 rounded-xl min-w-[45%] flex-wrap flex-grow my-1 bg-white-200 p-3 shadow-sm">
      <View className="bg-secondary-200 overflow-hidden rounded-full p-3 shadow-md shadow-black-200 ">
        <Icon source={icon} size={24} color={colors.white[300]} />
      </View>
      <Text className="text-xsm font-ossemibold self-center text-black-400">
        {title}
      </Text>
    </View>
  );
};

const ClincScreen = () => {
  const { clinicId, distance } = useLocalSearchParams();
  const [Clinics, setClinics] = useClinicsState();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { width } = Dimensions.get("window");
  const flatListRef = React.useRef(null);

  const ClinicData = Clinics?.find((clinic) => clinic._id === clinicId);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date()
    .toLocaleString("en-us", { weekday: "long" })
    .toLowerCase();

  // Function to handle image change from flatlist
  const handleImageChange = (index) => {
    setActiveImageIndex(index);
  };

  // Image carousel item renderer
  const renderImageItem = ({ item }) => (
    <MotiView
      from={{ opacity: 0.8, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 300 }}
      style={{ width }}
    >
      <Animated.Image
        source={{
          uri: item ? item : "https://via.placeholder.com/400",
        }}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={500}
        className="w-full h-[500px] rounded-b-3xl shadow-xl shadow-black-400 "
      />
    </MotiView>
  );

  // Function to navigate to next/previous image
  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (activeImageIndex + 1) % ClinicData.images.length
      : (activeImageIndex - 1 + ClinicData.images.length) % ClinicData.images.length;
    
    setActiveImageIndex(newIndex);
    
    // Scroll the FlatList to the new index
    flatListRef.current?.scrollToIndex({
      index: newIndex,
      animated: true
    });
  };

  
  // const loader = useMemo(() => {
  //   return (
  //     <ScrollView
  //       contentContainerClassName="flex-grow w-full"
  //       showsVerticalScrollIndicator={false}
  //     >
  //       <Appbar.Header
  //         className="absolute top-6 bg-transparent z-50 w-full flex justify-between px-4 mt-1 "
  //         statusBarHeight={0}
  //         safeAreaInsets={{ top: 0, bottom: 0 }}
  //         mode="center-aligned"
  //       >
  //         <BlurView
  //           intensity={80}
  //           tint="systemChromeMaterial"
  //           experimentalBlurMethod="dimezisBlurView"
  //           className=" rounded-full overflow-hidden shadow-lg shadow-black-100  "
  //         >
  //           <Appbar.BackAction
  //             icon="chevron-left"
  //             size={24}
  //             onPress={() => router.back()}
  //             color={colors.blueishGreen[400]}
  //           />
  //         </BlurView>
  //         <BlurView
  //           intensity={80}
  //           tint="systemChromeMaterialLight"
  //           experimentalBlurMethod="dimezisBlurView"
  //           className=" rounded-full overflow-hidden shadow-lg shadow-black-100  "
  //         >
  //           <IconButton icon="heart-outline" onPress={() => {}} />
  //         </BlurView>
  //       </Appbar.Header>

  //       <MotiView
  //         transition={{
  //           type: "timing",
  //         }}
  //         animate={{ backgroundColor: "#f7f8f8" }}
  //         className=" w-screen rounded-3xl mb-4 gap-4"
  //       >
  //         <Skeleton
  //           colorMode="light"
  //           width="100%"
  //           height={500}
  //           radius={30}
  //           className="bg-slate-600"
  //         />

  //         <View className="px-4 gap-4 ">
  //           {[...Array(2)].map((_, i) => (
  //             <Skeleton
  //               key={i}
  //               colorMode="light"
  //               width="100%"
  //               height={48}
  //               radius={10}
  //               className="mb-1 bg-slate-600"
  //             />
  //           ))}

  //           <View className="flex-row gap-2 items-center">
  //             <Skeleton
  //               colorMode="light"
  //               width={56}
  //               height={56}
  //               radius={28}
  //               className="bg-slate-600"
  //             />
  //             <Skeleton
  //               colorMode="light"
  //               width="60%"
  //               height={40}
  //               radius={10}
  //               className="mb-1 bg-slate-600"
  //             />
  //           </View>

  //           {/* Staggered items */}
  //           <View className="flex-row items-center gap-2 rounded-xl flex-wrap flex-1 my-1">
  //             {[...Array(4)].map((_, i) => (
  //               <View key={i} className="flex-row gap-2 items-center">
  //                 <Skeleton
  //                   colorMode="light"
  //                   width={56}
  //                   height={56}
  //                   radius={28}
  //                   className="bg-slate-600"
  //                 />
  //                 <Skeleton
  //                   colorMode="light"
  //                   width={`${i % 2 === 0 ? "80%" : "60%"}`}
  //                   height={40}
  //                   radius={10}
  //                   className="mb-1 bg-slate-600"
  //                 />
  //               </View>
  //             ))}

  //             {/* Staggered lines */}
  //             {[...Array(8)].map((_, i) => (
  //               <Skeleton
  //                 key={i}
  //                 colorMode="light"
  //                 width="100%"
  //                 height={20}
  //                 radius={10}
  //                 className="mb-1 bg-slate-600"
  //               />
  //             ))}
  //           </View>
  //         </View>
  //       </MotiView>
  //     </ScrollView>
  //   );
  // }, [isLoading]);

  // if (isLoading) {
  //   return loader;
  // }

  // console.log({cl:ClinicData.doctor})

  return (
    <ScrollView
      // className="px-4"
      // contentContainerStyle={{ flexGrow: 1 }}
      //  contentContainerClassName="flex-grow w-full justify-around self-center gap-2 "
      showsVerticalScrollIndicator={false}
    >
      <Appbar.Header
        className="absolute top-6 bg-transparent z-50 w-full flex justify-between px-4 mt-1 "
        statusBarHeight={0}
        safeAreaInsets={{ top: 0, bottom: 0 }}
        mode="center-aligned"
      >
        <BlurView
          intensity={80}
          tint="systemChromeMaterial"
          experimentalBlurMethod="dimezisBlurView"
          className=" rounded-full overflow-hidden shadow-lg shadow-black-100  "
        >
          <Appbar.BackAction
            icon="chevron-left"
            size={24}
            onPress={() => router.back()}
            color={colors.blueishGreen[400]}
          />
        </BlurView>
        <BlurView
          intensity={80}
          tint="systemChromeMaterialLight"
          experimentalBlurMethod="dimezisBlurView"
          className=" rounded-full overflow-hidden shadow-lg shadow-black-100  "
        >
          <IconButton icon="heart-outline" onPress={() => {}} />
        </BlurView>
      </Appbar.Header>

      <View className=" ">
        {/* <Animated.Image
          source={{
            uri: ClinicData.images[activeImageIndex]
              ? ClinicData.images[activeImageIndex]
              : "https://via.placeholder.com/400",
          }}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
          // style={{
          //   height: 350,
          // }}
          className="w-full h-[450px] rounded-b-3xl overflow-hidden shadow-2xl shadow-black-300"
        /> */}
        <BlurView
          intensity={70}
          tint="systemChromeMaterialLight"
          experimentalBlurMethod="dimezisBlurView"
          className="absolute bottom-4 mx-4 px-4 py-4 gap-1 rounded-2xl overflow-hidden"
        >
          <Text className="text-2xl font-pbold text-black-400">
            {ClinicData.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Animated.Image
              source={{ uri: ClinicData.doctor?.profilePic }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
              className="w-10 h-10 rounded-full border-2 border-white-200"
            />
            <Text className="text-md font-ossemibold self-center">
              Dr. {ClinicData.doctor?.name}
            </Text>
          </View>
        </BlurView>
      </View>

      <View className="relative">
        {/* Image gallery with FlatList */}
        <FlatList
          ref={flatListRef}
          data={ClinicData.images || []}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            handleImageChange(newIndex);
          }}
          initialScrollIndex={activeImageIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            // Handle scroll failure (happens if the list isn't fully rendered yet)
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ 
                index: info.index, 
                animated: true 
              });
            });
          }}
        />
        
        {/* Navigation buttons */}
        <View className="absolute inset-y-0 left-2 justify-center z-20">
          <TouchableOpacity 
            onPress={() => navigateImage('prev')}
            className="bg-black-100/30 rounded-full p-3"
          >
            <Icon source="chevron-left" size={28} color={colors.white[100]} />
          </TouchableOpacity>
        </View>
        
        <View className="absolute inset-y-0 right-2 justify-center z-20">
          <TouchableOpacity 
            onPress={() => navigateImage('next')}
            className="bg-black-100/30 rounded-full p-3"
          >
            <Icon source="chevron-right" size={28} color={colors.white[100]} />
          </TouchableOpacity>
        </View>

        {/* Enhanced image pagination indicator */}
        <View className="absolute bottom-1 left-0 right-0 flex-row justify-center gap-2 z-10">
          {ClinicData.images?.map((_, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => setActiveImageIndex(index)}
            >
              <MotiView
                className="rounded-full overflow-hidden"
                animate={{
                  width: index === activeImageIndex ? 24 : 8,
                  height: 8,
                  backgroundColor: index === activeImageIndex 
                    ? colors.secondary[300] 
                    : colors.white[200],
                  borderWidth: index === activeImageIndex ? 1 : 0,
                  borderColor: colors.white[100]
                }}
                transition={{
                  type: "timing",
                  duration: 300,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <BlurView
          intensity={70}
          tint="systemChromeMaterialLight"
          experimentalBlurMethod="dimezisBlurView"
          className="absolute bottom-4 mx-4 px-4 py-4 gap-1 rounded-2xl overflow-hidden"
        >
          <Text className="text-2xl font-pbold text-black-400">
            {ClinicData.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Animated.Image
              source={{ uri: ClinicData.doctor?.profilePic }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
              className="w-10 h-10 rounded-full border-2 border-white-200"
            />
            <Text className="text-md font-ossemibold self-center">
              Dr. {ClinicData.doctor?.name}
            </Text>
          </View>
        </BlurView>
      </View>

      <View className="px-4  gap-2 my-4  ">
        {/* <View className="p-4 self-center">
          <BlurView
            intensity={15}
            tint="systemChromeMaterialLight"
            // experimentalBlurMethod="dimezisBlurView"
            className="flex-row gap-3 justify-center rounded-xl overflow-hidden"
          >
            {ClinicData.images?.map((image, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  className="w-16 h-16 shadow-xl shadow-black-300 "
                  onPress={() => {
                    setActiveImageIndex(i);
                  }}
                >
                  <Image
                    source={{
                      uri: image ? image : "https://via.placeholder.com/400",
                    }}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                    className="w-full h-full rounded-md"
                  />
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </View> */}
        <View className="flex-row gap-4 flex-wrap justify-evenly ">
          <Details
            title={
              ClinicData?.open24hrs
                ? "Open 24 Hours"
                : ClinicData?.timing?.isClosed
                ? "Closed"
                : `${ClinicData?.timing?.[today]?.opening} - ${ClinicData?.timing?.[today]?.closing}`
            }
            icon="clock"
          />
          <Details title={ClinicData?.phoneNumber} icon="phone" />
          <Details title={`${distance} km`} icon="map-marker" />
          <Details title={ClinicData?.city} icon="city" />
        </View>

        {/* Description with show more button */}
        <View className="bg-white-200 p-4 rounded-xl shadow-sm mt-3">
          <Text className="text-lg font-pbold text-black-400 mb-2">About</Text>
          <Text
            className="text-sm font-osregular text-black-300 leading-5"
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {ClinicData?.description || "No description available."}
          </Text>
          {ClinicData?.description && ClinicData.description.length > 120 && (
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
              className="mt-2"
            >
              <Text className="text-secondary-300 font-ossemibold">
                {showFullDescription ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Address */}
        <View className="bg-white-200 p-4 rounded-xl shadow-sm mt-1">
          <Text className="text-lg font-pbold text-black-400 mb-2">
            Location
          </Text>
          <Text className="text-sm font-osregular text-black-300 leading-5">
            {ClinicData?.address || "Address not available"}, {ClinicData?.city}
          </Text>
        </View>

        {/* Appointment Booking Button */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/appointments/book`,
              params: {
                clinicId: ClinicData._id,
                doctorId: ClinicData.doctor._id,
              },
            })
          }
          className="bg-secondary-300 py-4 px-6 rounded-xl mt-4 shadow-lg shadow-black-200 elevation-3"
        >
          <Text className="text-white-100 font-pbold text-center text-lg">
            Book Appointment
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default ClincScreen;
