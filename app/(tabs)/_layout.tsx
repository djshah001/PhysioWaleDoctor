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
        backBehavior="history"
      >
        <Tabs.Screen
          name="index"
          options={{ title: "Home", icon: "home", focusedIcon: "home" }}
        />

        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appointments",
            icon: "calendar-outline",
            focusedIcon: "calendar",
          }}
        />

        <Tabs.Screen
          name="clinic"
          options={{
            title: "Clinic",
            icon: "business-outline",
            focusedIcon: "business",
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
