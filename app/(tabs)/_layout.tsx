import React from "react";
import { Tabs } from "expo-router";
import TabBarComp from "../../components/TabNav/TabBarComp";
import { tabScreenOptions } from "../../constants/navigationConfig";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        tabBar={(props) => <TabBarComp {...props} />}
        screenOptions={tabScreenOptions}
        // // This tells Expo Router to preserve the active tab when navigating back
        // // It will remember which tab was active and return to it
        // initialRouteName="home"
        backBehavior="history"
      >
        <Tabs.Screen
          name="index"
          options={{ title: "Home", icon: "home", focusedIcon: "home" }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            icon: "person",
            focusedIcon: "person",
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
