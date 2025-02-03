import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import colors from "../constants/colors";
export default function CustomBtn({
  title,
  iconName,
  handlePress,
  loading,
  disabled,
  iconFirst,
  customStyles,
  secondScheme,
}) {
  return (
    <View className={`${customStyles} `}>
      <LinearGradient
        // colors={[colors.blueishGreen[500],colors.blueishGreen[100]]}
        colors={
          secondScheme
            ? ["#56BBF1", "#63a4ff"]
            : [colors.blueishGreen[500], colors.blueishGreen[100]]
        }
        // locations={[0.2, 0.5, 0.8]}
        start={{
          x: 0.7,
          y: 0.4,
        }}
        end={{
          x: 0.4,
          y: 0.1,
        }}
        className=" py-2 px-2 rounded-full overflow-hidden shadow-xl shadow-black-200 "
      >
        <Button
          icon={iconName}
          // size={30}
          loading={loading || false}
          disabled={disabled || false}
          // buttonColor="#95AEFE"
          textColor="#F7F8F8"
          contentStyle={{
            flexDirection: `${iconFirst ? "row" : "row-reverse"}`,
          }}
          labelStyle={
            {
              // fontFamily: "OpenSans-SemiBold",
              // fontSize: 14,
            }
          }
          onPress={() => {
            handlePress();
          }}
        >
          {title}
        </Button>
      </LinearGradient>
    </View>
  );
}
