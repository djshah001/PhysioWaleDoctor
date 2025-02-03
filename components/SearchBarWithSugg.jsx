import { View } from "moti";
import React from "react";
import { Pressable, Text } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Divider, Icon, Searchbar } from "react-native-paper";
import colors from "../constants/colors";
import { Keyboard } from "react-native";
export function SearchBarWithSugg({
  changeQueryText,
  searchQuery,
  IsLoading,
  setShowSuggestions,
  ShowSuggestions,
  Places,
  getPlaceDetails,
}) {
  return (
    <View className="relative px-8 mt-4 ">
      <Searchbar
        placeholder="Search Your Clinic"
        mode="bar"
        onChangeText={changeQueryText}
        value={searchQuery}
        className=" "
        traileringIcon="close-circle-outline"
        style={{
          borderWidth: 1,
          backgroundColor: colors.white[100],
          marginBottom: 10,
        }}
        inputStyle={{
          marginVertical: -10,
        }}
        loading={IsLoading}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          if (Places.length === 0) {
            setShowSuggestions(false);
          }
        }}
        onTraileringIconPress={() => {
          setShowSuggestions(false);
          Keyboard.dismiss();
        }}
      />

      {
        ShowSuggestions && // <View className=" bg-white-100 shadow-md shadow-black-200 mt-1 w- self-center ">
          (Places.length === 0 ? (
            <ScrollView
              className=" h-full mt-5"
              contentContainerClassName=" self-center items-center "
            >
              <Icon source="close-outline" size={200} />
              <Text className=" text-center text-2xl ">Nothing To Show</Text>
            </ScrollView>
          ) : (
            <FlatList
              data={Places} // ref={ListRef}
              keyExtractor={(item) => item.placePrediction.placeId} // bounces={false}
              // pagingEnabled={true}
              // scrollEventThrottle={16}
              // showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    android_ripple={{
                      color: colors.black[100],
                    }}
                    onPress={() => {
                      getPlaceDetails(item);
                    }}
                  >
                    <View className="items-start px-4 py-3 ">
                      {/* <View className=""> */}
                      {/* <Icon source="map-marker-radius" size={25} /> */}
                      <Text
                        className="font-psemibold text-lg text-blues-700 leading-5 "
                        numberOfLines={1}
                      >
                        {item.placePrediction.structuredFormat.mainText.text}
                      </Text>
                      {/* </View> */}
                      <Text
                        className="font-plight text-blues-900"
                        numberOfLines={2}
                      >
                        {
                          item.placePrediction.structuredFormat.secondaryText
                            .text
                        }
                      </Text>
                    </View>
                    <Divider
                      bold={true}
                      className="w-screen"
                      style={{
                        // borderWidth: 1,
                        backgroundColor: colors.blues[500],
                      }}
                    />
                  </Pressable>
                );
              }}
            />
          )) // </View>
      }
    </View>
  );
}
