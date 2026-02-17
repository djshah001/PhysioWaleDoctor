import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { clsx } from "clsx";

interface PlacePrediction {
  placePrediction: {
    placeId: string;
    structuredFormat: {
      mainText: { text: string };
      secondaryText: { text: string };
    };
  };
}

interface SearchBarWithSuggProps {
  changeQueryText: (text: string) => void;
  searchQuery: string;
  IsLoading: boolean;
  setShowSuggestions: (show: boolean) => void;
  ShowSuggestions: boolean;
  Places: PlacePrediction[];
  getPlaceDetails: (item: PlacePrediction) => void;
}

export function SearchBarWithSugg({
  changeQueryText,
  searchQuery,
  IsLoading,
  setShowSuggestions,
  ShowSuggestions,
  Places,
  getPlaceDetails,
}: SearchBarWithSuggProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="relative px-8 mt-4 z-50">
      {/* Search Bar Container */}
      <View
        className={clsx(
          "flex-row items-center border border-gray-300 rounded-lg bg-white mb-2 shadow-sm px-3 h-12",
          ShowSuggestions && "border-blue-500"
        )}
      >
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={{ marginRight: 8 }}
        />

        <TextInput
          ref={inputRef}
          className="flex-1 text-base text-gray-800 h-full"
          placeholder="Search Your Clinic"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={changeQueryText}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            if (Places.length === 0) setShowSuggestions(false);
          }}
        />

        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => {
              changeQueryText("");
              setShowSuggestions(false);
              inputRef.current?.blur();
            }}
          >
            <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
          </Pressable>
        )}
      </View>

      {/* Suggestions List */}
      {ShowSuggestions && (
        <View className="absolute top-14 left-8 right-8 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 z-50 elevation-5">
          {Places.length === 0 ? (
            <ScrollView
              contentContainerStyle={{ alignItems: "center", padding: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={60}
                color="#e5e7eb"
              />
              <Text className="text-center text-lg text-gray-400 mt-2">
                Nothing To Show
              </Text>
            </ScrollView>
          ) : (
            <FlatList
              data={Places}
              keyExtractor={(item) => item.placePrediction.placeId}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  android_ripple={{ color: "#E6E6E6" }}
                  onPress={() => getPlaceDetails(item)}
                  className="px-4 py-3 border-b border-gray-100 bg-white active:bg-gray-50"
                  style={{
                    borderBottomWidth: 0.5,
                    borderColor: colors.blues[500] || "#e5e7eb",
                  }}
                >
                  <View className="items-start">
                    <Text
                      className="font-semibold text-base text-blue-700 leading-5"
                      numberOfLines={1}
                    >
                      {item.placePrediction.structuredFormat.mainText.text}
                    </Text>
                    <Text
                      className="text-sm text-blue-900 mt-1 opacity-70"
                      numberOfLines={2}
                    >
                      {item.placePrediction.structuredFormat.secondaryText.text}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}
