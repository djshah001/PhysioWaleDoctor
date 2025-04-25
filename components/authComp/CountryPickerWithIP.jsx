import React from "react";
import { Text, View } from "react-native";
import { CountrySelector } from "../CountrySelector";
import { TextInput } from "react-native-paper";
import colors from "../../constants/colors";

const CountryPickerWithIP = ({
  country,
  setCountry,
  phoneNumber,
  handlePhoneNumberChange,
  activeOutlineColor,
}) => {
  return (
    <>
      <View className="mt-5 flex-row gap-2 w-full">
        <CountrySelector country={country} setCountry={setCountry} />

        <TextInput
          mode="outlined"
          label={
            <Text className=" font-semibold text-base text-black-600 bg-transparent px-0">
              Phone Number
            </Text>
          }
          placeholder="Enter your phone number"
          placeholderTextColor={colors.black[600]}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          activeOutlineColor={`${
            activeOutlineColor ? activeOutlineColor : colors.secondary[200]
          }`}
          outlineColor="#6B7280"
          outlineStyle={{
            borderRadius: 10,
          }}
          style={{
            flex: 1,
          }}
          theme={{
            roundness: 8,
            colors: {
              background: colors.white[300],
            },
            animation: {},
          }}
          textColor={colors.black[700]}
          left={<TextInput.Icon icon="phone" color={colors.black[600]} />} // style={styles.textInput}
          // left={<TextInput.Affix text={countryCallingCode} />}
          // style={{
          //   height: "50px",
          // }}
        />
      </View>
    </>
  );
};

export default CountryPickerWithIP;
