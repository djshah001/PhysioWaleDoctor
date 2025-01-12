import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

export function CountrySelector({ setShow, country, show, setCountry }) {
  return (
    <>
      <TouchableOpacity
        mode="outlined"
        icon="chevron-down"
        onPress={() => setShow(true)}
        className=" flex-row justify-center items-center mt-2 border-[1px] px-4 py-4 rounded-lg gap-1  bg-[#fff]"
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
        pickerButtonOnPress={(item) => {
          console.log(item);
          setCountry({ code: item.dial_code, flag: item.flag });
          setShow(false);
        }} // popularCountries={["en", "usa", "in"]}
      />
    </>
  );
}
