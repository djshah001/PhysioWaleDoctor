import React from "react";
import { View } from "react-native";
import { CountrySelector } from "./CountrySelector";
import { HelperText, TextInput } from "react-native-paper";
export default function OTPSignIn({
  setShow,
  country,
  show,
  setCountry,
  phoneNumber,
  handlePhoneNumberChange,
  isValid,
}) {
  return (
    <>
      <View className="mt-5 flex-row gap-2 ">
        <CountrySelector
          setShow={setShow}
          country={country}
          show={show} // item={item}
          setCountry={setCountry}
        />

        <TextInput
          mode="outlined"
          label="Phone Number"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          activeOutlineColor="#95AEFE"
          outlineColor="#6B7280"
          outlineStyle={{
            borderRadius: 10,
          }}
          className="w-[160px]"
          left={<TextInput.Icon icon="phone" />} // style={styles.textInput}
          // left={<TextInput.Affix text={countryCallingCode} />}
          // style={{
          //   height: "50px",
          // }}
        />
      </View>
      <HelperText type="error" visible={!isValid}>
        Invalid phone number
      </HelperText>
    </>
  );
}
