import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import colors from "../constants/colors";

const EmptyState = ({ icon, title, description }) => {
  return (
    <View style={styles.container}>
      <Icon source={icon} size={64} color={colors.gray[300]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: "center",
    maxWidth: "80%",
  },
});

export default EmptyState;
