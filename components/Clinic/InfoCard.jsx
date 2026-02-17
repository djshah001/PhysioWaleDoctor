import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "react-native-paper";
import colors from "../../constants/colors";
import { MotiView } from "moti";
import { cssInterop } from "nativewind";

// Add cssInterop for Icon component
cssInterop(Icon, { className: "style" });

const InfoCard = ({
  icon = "information",
  title = "",
  value = "",
  subtitle,
  otherStyles = "flex-grow",
  actionIcon,
  onAction,
  onPress,
}) => {
  const CardContent = () => (
    <>
      <View className="flex-row items-center mb-2">
        <View
          className="rounded-full p-2 mr-2"
          style={{ backgroundColor: `${colors.primary[100]}` }}
        >
          <Icon source={icon} size={18} color={colors.secondary[300]} />
        </View>
        <Text className="text-sm font-ossemibold text-black-800">{title}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-pbold text-black-600">{value}</Text>
          {subtitle && (
            <Text
              className="text-xs font-osregular text-black-600 mt-1 "
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {actionIcon && onAction && (
          <TouchableOpacity
            onPress={onAction}
            className="ml-2 bg-secondary-100 p-2 rounded-full"
          >
            <Icon source={actionIcon} size={16} color={colors.secondary[400]} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      className={`bg-white-100 rounded-xl p-4 shadow-sm border border-secondary-100/10 mb-3 ${otherStyles}`}
    >
      {onPress ? (
        <TouchableOpacity
          onPress={onPress}
          className="w-full"
          activeOpacity={0.7}
        >
          <CardContent />
        </TouchableOpacity>
      ) : (
        <CardContent />
      )}
    </MotiView>
  );
};

export default InfoCard;
