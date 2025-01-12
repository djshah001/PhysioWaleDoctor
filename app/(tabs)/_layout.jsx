import TabIcon from "../../components/TabIcon";
import React from "react";

import { router, Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import TabBarComp from "../../components/TabNav/TabBarComp";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        tabBar={(props) => <TabBarComp {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen
          name="home"
          options={{ title: "Home", icon: "home-outline", focusedIcon: "home" }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            icon: "barbell-outline",
            focusedIcon: "barbell",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            // headerShown: true,
            // headerTitleStyle: {
            //   fontFamily: "OpenSans-Bold",
            //   // fontWeight: 600,
            //   fontSize: 24,
            //   color: "#5CAFFF",
            //   letterSpacing: 1.2,
            // },
            // headerTitleAlign: "center",
            // headerStyle: { height: 80 },

            // headerTransparent: true,
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => router.back()}
            //     style={{ marginLeft: 10 }}
            //   >
            //     <Ionicons name="arrow-undo" size={25} color="#5CAFFF" />
            //   </TouchableOpacity>
            // ),

            title: "Profile",
            icon: "person-outline",
            focusedIcon: "person",
          }}
        />
        {/* <Tabs.Screen
          name="(notifications)"
          options={{
            href: null,
          }}
        /> */}
      </Tabs>
    </>
  );
};

export default TabsLayout;
