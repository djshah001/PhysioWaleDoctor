import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MotiView, MotiText } from "moti";

const TabIcon = ({ iconName, focusedIcon, color, name, focused }) => {
  return (
    <View
      className={`items-center justify-center w-14 h-14 rounded-full ${
        focused ? "bg-[#95AEFE]" : "bg-white-300"
      } overflow-hidden `}
    >
      <MotiView
        animate={{ marginTop: focused ? 12 : 0 }}
        transition={{
          type: "spring",
          duration: 350,
        }}
      >
        <Ionicons
          name={`${focused ? focusedIcon : iconName}`}
          size={20} // color={`${focused ? "#000" : "#8a939f"}`}
          color={color}
        />
      </MotiView>
      <MotiText
        className={`text-[11px] ${
          focused ? "text-white-300" : "text-black-100"
        }`}
        animate={{ opacity: focused ? 0 : 1 }}
        transition={{
          type: "timing",
          duration: 350,
        }}
      >
        {name}
      </MotiText>
    </View>
  );
};

export default TabIcon;
