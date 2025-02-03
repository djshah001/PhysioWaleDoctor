import { View, Text } from "react-native";
import React from "react";

const Repeatables = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const GoogleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  const GoogleApi = process.env.EXPO_PUBLIC_GOOGLE_API;
  return { apiUrl, GoogleApiKey, GoogleApi };
};

export default Repeatables;
