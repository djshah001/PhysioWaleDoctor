import React from "react";
import { View, StatusBar, TouchableOpacity } from "react-native";
import { Appbar, Text, Icon } from "react-native-paper";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import colors from "../../../constants/colors";

/**
 * ClinicDetailHeader component displays the header with blur effect
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Clinic name to display
 * @param {string} props.id - Clinic ID for edit functionality
 * @returns {JSX.Element} - Rendered component
 */
const ClinicDetailHeader = ({ title, id }) => {
  return (
    <View className="overflow-hidden">
      <LinearGradient
        colors={[colors.secondary[250], colors.secondary[300]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-0"
        style={{ paddingTop: StatusBar.currentHeight }}
      >
        <Appbar.Header className="bg-transparent" statusBarHeight={0}>
          <Appbar.BackAction
            onPress={() => router.back()}
            color={colors.white[400]}
          />

          <Appbar.Content
            title={title || "Clinic Details"}
            titleStyle={{
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              color: colors.white[400],
            }}
          />

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/clinics/edit",
                params: { id },
              });
            }}
            className="mr-2 bg-white-400/20 rounded-full p-2"
          >
            <Icon source="pencil" size={20} color={colors.white[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            className="mr-2 bg-white-400/20 rounded-full p-2"
          >
            <Icon source="share-variant" size={20} color={colors.white[400]} />
          </TouchableOpacity>
        </Appbar.Header>
      </LinearGradient>
    </View>
  );
};

export default ClinicDetailHeader;
