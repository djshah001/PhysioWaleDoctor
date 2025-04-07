import React from "react";
import { View, Text } from "react-native";
import CustomInput from "../../ReUsables/CustomInput";
import CustomBtn from "../../CustomBtn";

const FeesStep = ({ ClinicData, handleChange, formErrors, onNext, onBack }) => {
  return (
    <View className="gap-4">
      <Text className="text-xl font-psemibold text-black-200">
        Appointment Fees
      </Text>
      
      <CustomInput
        label="Initial Assessment Fee"
        placeholder="Enter fee amount"
        value={ClinicData.appointmentFee.initialAssessment}
        onChangeText={(text) => 
          handleChange("appointmentFee", {
            ...ClinicData.appointmentFee,
            initialAssessment: text,
          })
        }
        error={formErrors.initialAssessment}
        keyboardType="numeric"
        leftIcon="currency-inr"
      />
      
      <CustomInput
        label="Follow-up Fee"
        placeholder="Enter fee amount"
        value={ClinicData.appointmentFee.followUp}
        onChangeText={(text) => 
          handleChange("appointmentFee", {
            ...ClinicData.appointmentFee,
            followUp: text,
          })
        }
        keyboardType="numeric"
        leftIcon="currency-inr"
      />
      
      <CustomInput
        label="Emergency Fee"
        placeholder="Enter fee amount"
        value={ClinicData.appointmentFee.emergency}
        onChangeText={(text) => 
          handleChange("appointmentFee", {
            ...ClinicData.appointmentFee,
            emergency: text,
          })
        }
        keyboardType="numeric"
        leftIcon="currency-inr"
      />
      
      <CustomInput
        label="Home Visit Fee"
        placeholder="Enter fee amount"
        value={ClinicData.appointmentFee.homeVisit}
        onChangeText={(text) => 
          handleChange("appointmentFee", {
            ...ClinicData.appointmentFee,
            homeVisit: text,
          })
        }
        keyboardType="numeric"
        leftIcon="currency-inr"
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
        //   variant="outlined"
          className="flex-1"
          iconName="arrow-right"
          iconPosition="right"
        />
      </View>
    </View>
  );
};

export default React.memo(FeesStep);