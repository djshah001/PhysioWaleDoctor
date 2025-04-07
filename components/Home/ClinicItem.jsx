import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MotiView } from "moti";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { IconButton, Icon, Card, Chip } from "react-native-paper";
import { Link } from "expo-router";
import colors from "../../constants/colors";
import { Skeleton } from "moti/skeleton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ClinicDetails from "./ClinicDetails";

// Add blurhash for image placeholder
const blurhash = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

const ClinicItem = ({ clinic, index, IsLoading }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const today = new Date()
    .toLocaleString("en-us", { weekday: "long" })
    .toLowerCase();

  // Calculate distance (you might need to adjust this based on your data)
  const distance = clinic?.distanceInKm
    ? clinic.distanceInKm.toFixed(1)
    : "N/A";
  // Get opening and closing times (adjust based on your data structure)
  const opening = clinic?.timing?.[today]?.opening || "5:00 AM";
  const closing = clinic?.timing?.[today]?.closing || "6:00 PM";

  // Check if clinic is currently open
  const isOpen = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    if (
      !clinic?.timing ||
      !clinic.timing[today] ||
      clinic.timing[today].isClosed
    ) {
      return false;
    }

    // Parse opening hours
    const [openingHour, openingMinute] = clinic.timing[today].opening
      .match(/(\d+):(\d+)\s*(AM|PM)/i)
      .slice(1);
    const [closingHour, closingMinute] = clinic.timing[today].closing
      .match(/(\d+):(\d+)\s*(AM|PM)/i)
      .slice(1);

    // Convert to 24-hour format
    let openingTime = parseInt(openingHour);
    let closingTime = parseInt(closingHour);

    // Adjust for PM times
    if (
      clinic.timing[today].opening.toUpperCase().includes("PM") &&
      openingTime !== 12
    ) {
      openingTime += 12;
    }
    if (
      clinic.timing[today].closing.toUpperCase().includes("PM") &&
      closingTime !== 12
    ) {
      closingTime += 12;
    }

    // Create comparable time values
    const currentTimeValue = currentHours * 60 + currentMinutes;
    const openingTimeValue = openingTime * 60 + parseInt(openingMinute);
    const closingTimeValue = closingTime * 60 + parseInt(closingMinute);

    return (
      currentTimeValue >= openingTimeValue &&
      currentTimeValue <= closingTimeValue
    );
  };

  const LoadingSkeleton = useMemo(
    () => (
      <MotiView
        transition={{ type: "timing" }}
        animate={{ backgroundColor: "#f7f8f8" }}
        className="rounded-3xl mb-4 gap-4"
      >
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

  if (IsLoading) {
    return LoadingSkeleton;
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "spring",
            duration: 800,
            delay: Math.min(50 * index, 200),
            damping: 15,
            stiffness: 200,
          }}
          key={clinic._id}
          className="my-3 gap-3 justify-center bg-white-300 shadow-lg shadow-black-200/20 rounded-[30px] overflow-hidden"
          style={styles.cardShadow}
        >
          <Image
            source={{
              uri: clinic.images?.[0] || "https://via.placeholder.com/400",
            }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={300}
            className="w-full h-80 rounded-3xl overflow-hidden"
          />

          {/* Top right bookmark button */}
          <BlurView
            intensity={25}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            className="absolute top-3 right-3 rounded-full overflow-hidden"
            style={styles.blurButton}
          >
            <IconButton
              icon="bookmark-outline"
              iconColor={colors.white["500"]}
              size={22}
              onPress={() => console.log("Pressed")}
            />
          </BlurView>

          {/* Top left distance indicator */}
          <View className="absolute top-3 left-3 flex-row gap-2 ">
            <BlurView
              intensity={25}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              className=" rounded-full overflow-hidden flex-row items-center p-4"
              // style={styles.blurDistance}
              style={isOpen() ? styles.openStatus : styles.closedStatus}
            >
              <Icon
                source="map-marker-radius"
                size={16}
                color={colors.white["500"]}
              />
              <Text className="text-white-500 text-sm font-osbold ml-1 mr-2">
                {distance} km - {isOpen() ? "Open Now" : "Closed"}
              </Text>
            </BlurView>

            {/* Status indicator (open/closed) */}
            {/* <BlurView
              intensity={25}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              className=" rounded-full overflow-hidden flex-row items-center p-4"
              style={isOpen() ? styles.openStatus : styles.closedStatus}
            >
              <Text className="text-white-500 text-sm font-osbold ml-1 mr-2">
                {isOpen() ? "Open Now" : "Closed"}
              </Text>
            </BlurView> */}
          </View>

          {/* Bottom info panel */}
          <BlurView
            intensity={40}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            className="absolute bottom-0 w-full"
            style={styles.infoPanel}
          >
            <View className="p-5 rounded-b-3xl flex-row items-center justify-between">
              <View className="w-9/12 gap-1">
                <View className="flex-row items-center mb-1 self-start py-1 rounded-full">
                  <Icon
                    source="clock-time-two"
                    size={12}
                    color={colors.accent["DEFAULT"]}
                  />
                  <Text className="text-xs font-oslight text-white-400 ml-1">
                    {opening} - {closing}
                  </Text>
                </View>
                <Text
                  className="text-xl font-pbold text-white-400 leading-6"
                  numberOfLines={1}
                >
                  {clinic.name}
                </Text>

                {/* Specializations */}
                <View className="flex-row flex-wrap mt-2">
                  {clinic.specializations?.slice(0, 2).map((spec, idx) => (
                    <View
                      key={idx}
                      className="mr-1 mb-1 py-0 px-2 bg-white-400/20 rounded-full"
                    >
                      <Text className="text-white-400 text-xs">{spec}</Text>
                    </View>
                  ))}
                  {clinic.specializations?.length > 2 && (
                    <View className="mr-1 mb-1 py-0 px-2 bg-white-400/20 rounded-full">
                      <Text className="text-white-400 text-xs">
                        +{clinic.specializations.length - 2} more
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Link
                href={{
                  pathname: `/clinics/${clinic._id}`,
                  params: {
                    clinicId: clinic._id,
                    distance: distance,
                  },
                }}
              >
                <View
                  className="bg-accent/80 rounded-full p-3"
                  style={styles.viewButton}
                >
                  <Icon
                    source="arrow-top-right"
                    size={24}
                    color={colors.white["500"]}
                  />
                </View>
              </Link>
            </View>
          </BlurView>
        </MotiView>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center p-4 bg-black/50">
          <ClinicDetails
            clinic={clinic}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    elevation: 8,
  },
  blurButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  blurDistance: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  openStatus: {
    backgroundColor: "rgba(0,128,0,0.4)",
  },
  closedStatus: {
    backgroundColor: "rgba(255,0,0,0.4)",
  },
  infoPanel: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  viewButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ClinicItem;
