import React from "react";
import { View, Text } from "react-native";
import CustomInput from "../../ReUsables/CustomInput";
import CustomBtn from "../../CustomBtn";
import { IconButton } from "react-native-paper";
import colors from "../../../constants/colors";

const LocationStep = ({
  ClinicData,
  handleChange,
  formErrors,
  getClinicDataFromLocation,
  onNext,
  onBack,
}) => {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-psemibold text-black-200">
          Location Details
        </Text>
        <IconButton
          icon="crosshairs-gps"
          size={24}
          iconColor={colors.secondary[300]}
          onPress={getClinicDataFromLocation}
        />
      </View>

      <CustomInput
        label="Address"
        placeholder="Enter clinic address"
        value={ClinicData.address}
        onChangeText={(text) => handleChange("address", text)}
        error={formErrors.address}
        multiline={true}
        numberOfLines={4}
      />

      <CustomInput
        label="City"
        placeholder="Enter city"
        value={ClinicData.city}
        onChangeText={(text) => handleChange("city", text)}
        error={formErrors.city}
      />

      <CustomInput
        label="State"
        placeholder="Enter state"
        value={ClinicData.state}
        onChangeText={(text) => handleChange("state", text)}
        error={formErrors.state}
      />

      <CustomInput
        label="Country"
        placeholder="Enter country"
        value={ClinicData.country}
        onChangeText={(text) => handleChange("country", text)}
        error={formErrors.country}
      />
      <CustomInput
        label="Pin Code"
        placeholder="Enter pin code"
        value={ClinicData.pinCode}
        onChangeText={(text) => handleChange("pinCode", text)}
        error={formErrors.pinCode}
        keyboardType="numeric"
      />

      <View className="flex-row justify-between mt-4 gap-4">
        <CustomBtn
          title="Back"
          handlePress={onBack}
          className="flex-1"
          variant="outlined"
          iconName="arrow-left"
          iconPosition="left"
        />
        <CustomBtn
          title="Next"
          handlePress={onNext}
          className="flex-1"
          iconName="arrow-right"
          iconPosition="right"
        />
      </View>
    </View>
  );
};

export default React.memo(LocationStep);
