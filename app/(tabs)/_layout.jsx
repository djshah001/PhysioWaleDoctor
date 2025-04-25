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
        screenOptions={{ 
          headerShown: false,
          animation: "shift"
           
        }}
        // // This tells Expo Router to preserve the active tab when navigating back
        // // It will remember which tab was active and return to it
        // initialRouteName="home"
        // backBehavior="history"

      >
        <Tabs.Screen
          name="home"
          options={{ title: "Home", icon: "home-outline", focusedIcon: "home" }}
        />
        
        {/* Rest of your tabs remain unchanged */}
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            icon: "barbell-outline",
            focusedIcon: "barbell",
          }}
        />

        <Tabs.Screen
          name="Clinic"
          options={{
            title: "Clinic",
            icon: "medkit-outline",
            focusedIcon: "medkit",
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            icon: "person-outline",
            focusedIcon: "person",
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
