import React from "react";
import { View, Text } from "react-native";
import CustomInput from "../../ReUsables/CustomInput";
import CustomBtn from "../../CustomBtn";
import colors from "../../../constants/colors";

const BasicInfoStep = ({ ClinicData, handleChange, formErrors, onNext }) => {
  return (
    <View className="gap-4">
      <Text className="text-xl font-psemibold text-black-200">
        Basic Information
      </Text>

      <CustomInput
        noBR={true}
        label="Clinic Name"
        placeholder="Enter clinic name"
        value={ClinicData.name}
        onChangeText={(text) => handleChange("name", text)}
        error={formErrors.name}
      />

      <CustomInput
        label="Description"
        placeholder="Enter clinic description"
        value={ClinicData.description}
        onChangeText={(text) => handleChange("description", text)}
        error={formErrors.description}
        multiline
        numberOfLines={4}
      />

      <CustomInput
        label="Phone Number"
        placeholder="Enter clinic phone number"
        value={ClinicData.phoneNumber}
        onChangeText={(text) => handleChange("phoneNumber", text)}
        error={formErrors.phoneNumber}
        keyboardType="phone-pad"
      />

      <View className="mt-4">
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

export default React.memo(BasicInfoStep);
