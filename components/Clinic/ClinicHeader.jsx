import React from "react";
import { View, StatusBar, TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import colors from "../../constants/colors";

/**
 * ClinicHeader component displays the header with gradient background and blur effect
 *
 * @param {Object} props - Component props
 * @param {Function} props.onRefresh - Function to call when refresh button is pressed
 * @param {boolean} props.refreshing - Whether the refresh is in progress
 * @param {Function} props.onSearch - Function to call when search button is pressed
 * @param {React.ReactNode} props.children - Child components to render inside the header
 * @returns {JSX.Element} - Rendered component
 */
const ClinicHeader = ({
  onRefresh,
  refreshing = false,
  onSearch = () => {},
  children,
}) => {
  return (
    <View
      className="rounded-b-3xl shadow-md overflow-hidden mb-2"
      // style={{ paddingTop: StatusBar.currentHeight }}
    >
      <LinearGradient
        colors={[colors.secondary[250], colors.secondary[300]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingBottom: 20 }}
      >
        {/* <BlurView intensity={20} tint="dark" className="overflow-hidden"> */}
          <Appbar.Header mode="center-aligned" className="bg-transparent">
            <Appbar.Content
              title="My Clinics"
              titleStyle={{
                fontFamily: "Poppins_700Bold",
                fontSize: 24,
                color: colors.white[400],
              }}
            />

            <Appbar.Action
              icon="chart-bar"
              onPress={() => router.push('/analytics')}
              color={colors.white[400]}
              style={{ marginRight: -8 }}
            />
            <Appbar.Action
              icon="refresh"
              onPress={onRefresh}
              disabled={refreshing}
              color={colors.white[400]}
            />
            <Appbar.Action
              icon="magnify"
              onPress={onSearch}
              color={colors.white[400]}
            />
          </Appbar.Header>
        {/* </BlurView> */}

        {children}
      </LinearGradient>
    </View>
  );
};

export default ClinicHeader;
