import { View, Text, LayoutChangeEvent } from "react-native";
import React, { useEffect, useState } from "react";
import TabButton from "./TabButton";
import { MotiView, useDynamicAnimation } from "moti";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { cssInterop } from "nativewind";

cssInterop(MotiView, { className: "style" });

const TabBarComp = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTabBarWidth(width);
  };

  const w = tabBarWidth / state.routes.length;

  const TranslateAnimation = useDynamicAnimation(() => ({
    left: w / 2 - 25,
    translateX: 0,
  }));

  return (
    <View
      onLayout={handleLayout}
      className="w-4/5 flex-row justify-between items-center absolute bottom-[20] left-[10%] py-3 rounded-full bg-slate-50 shadow-md shadow-black"
    >
      <MotiView
        className="bg-secondary-200 shadow-md shadow-blue-600 justify-center items-center w-[50px] h-[50px] rounded-full absolute"
        state={TranslateAnimation}
        transition={{
          type: "timing",
          duration: 300,
        }}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const iconName = (options as any).icon;
        const focusedIcon = (options as any).focusedIcon;
        const isFocused = state.index === index;

        const onPress = () => {
          TranslateAnimation.animateTo((current: any) => {
            return {
              ...current,
              translateX: w * index,
            };
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        console.log("route.name", iconName);

        return (
          <TabButton
            key={route.name}
            w={w}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            iconName={iconName}
            focusedIcon={focusedIcon}
            label={label as string}
            tabBarWidth={tabBarWidth}
            index={index}
            TranslateAnimation={TranslateAnimation}
          />
        );
      })}
    </View>
  );
};

export default TabBarComp;
