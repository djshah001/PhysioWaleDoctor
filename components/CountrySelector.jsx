import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  CountryButton,
  CountryPicker,
} from "react-native-country-codes-picker";

function ListHeaderComponent({ countries, lang, onPress }) {
  return (
    <View
      style={{
        paddingBottom: 20,
      }}
    >
      <Text>Popular countries</Text>
      {countries?.map((country, index) => {
        return (
          <CountryButton
            key={index}
            item={country}
            name={country?.name?.[lang || "en"]}
            onPress={() => onPress(country)}
          />
        );
      })}
    </View>
  );
}
export function CountrySelector({ country, setCountry }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <TouchableOpacity
        mode="outlined"
        icon="chevron-down"
        onPress={() => setShow(true)}
        className=" flex-row justify-center items-center mt-2 border-[1px] px-4 py-4 rounded-lg gap-1  bg-white-300"
      >
        <Text
          style={{
            color: "#565656",
            fontSize: 16,
          }}
        >
          {country.flag}
        </Text>
        <Text
          style={{
            color: "#565656",
            fontSize: 16,
          }}
        >
          {country.code}
        </Text>
        {/* <FontAwesome name="chevron-down" size={16} color="#565656" /> */}
      </TouchableOpacity>

      <CountryPicker
        show={show} // when picker button press you will get the country object with dial code
        style={{
          // Styles for whole modal [View]
          modal: {
            height: 500,
            // backgroundColor: "red",
          },
          // Styles for modal backdrop [View]
          backdrop: {},
          // Styles for bottom input line [View]
          line: {},
          // Styles for list of countries [FlatList]
          itemsList: {},
          // Styles for input [TextInput]
          textInput: {
            height: 50,
            borderRadius: 0,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
          },
          // Styles for country button [TouchableOpacity]
          countryButtonStyles: {
            height: 50,
          },
          // Styles for search message [Text]
          searchMessageText: {},
          // Styles for search message container [View]
          countryMessageContainer: {},
          // Flag styles [Text]
          flag: {},
          // Dial code styles [Text]
          dialCode: {},
          // Country name styles [Text]
          countryName: {},
        }}
        pickerButtonOnPress={(item) => {
          // console.log(item);
          setCountry({ code: item.dial_code, flag: item.flag });
          setShow(false);
        }}
        popularCountries={["ae", "in", "us", "gb", "ca", "au", "nz", "sa"]}
        searchPlaceholder="Search for a country"
        onBackdropPress={() => setShow(false)}
        ListHeaderComponent={ListHeaderComponent}
      />
    </>
  );
}
