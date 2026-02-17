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
      </TouchableOpacity>

      <CountryPicker
        show={show}
        style={{
          modal: {
            height: 500,
          },
          backdrop: {},
          line: {},
          itemsList: {},
          textInput: {
            height: 50,
            borderRadius: 0,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
          },
          countryButtonStyles: {
            height: 50,
          },
          searchMessageText: {},
          countryMessageContainer: {},
          flag: {},
          dialCode: {},
          countryName: {},
        }}
        pickerButtonOnPress={(item) => {
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
