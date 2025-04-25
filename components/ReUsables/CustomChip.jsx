import React from "react";
import { Chip, Icon } from "react-native-paper";
import colors from "../../constants/colors";
export function CustomChip({
  spec,
  otherStyles = "rounded-lg",
  compact,
  iconName,
  text,
  onPress,
  selected = true,
}) {
  return (
    <Chip
      icon={() =>
        iconName && (
          <Icon
            source={iconName}
            size={20}
            color={selected ? colors.white[300] : colors.black[800]}
          />
        )
      }
      className={`mr-2 mb-1 text-white-200
        shadow-md shadow-accent  ${otherStyles}`}
      textStyle={{
        fontSize: compact ? 10 : 12,
        color: selected ? colors.white[300] : colors.black[700],
        fontWeight: "bold",
        marginHorizontal: compact ? 0 : 4,
        marginVertical: compact ? 1 : 2,
      }}
      style={{
        backgroundColor: selected
          ? colors.accent["DEFAULT"]
          : colors.white[100],
        paddingHorizontal: compact ? 1 : 2,
        paddingVertical: compact ? 2 : 4, // height: 24,
        justifyContent: "center",
      }}
      elevated
      elevation={selected ? 3 : 0}
      compact
      onPress={onPress}
      selected={selected}
      mode={selected ? "flat" : "outlined"}
    >
      {spec || text || "No Spec"}
    </Chip>
  );
}
