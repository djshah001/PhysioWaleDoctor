import React, { memo } from "react";
import { View, Text, Animated } from "react-native";
import CustomInput from "../ReUsables/CustomInput";
import CustomBtn from "../CustomBtn";
import { ImageGrid } from "../ReUsables/ImageGrid";
import { Divider, Switch } from "react-native-paper";
import colors from "../../constants/colors";

// Step components
import BasicInfoStep from "./steps/BasicInfoStep";
import LocationStep from "./steps/LocationStep";
// Removed FeesStep import
import ServicesStep from "./steps/ServicesStep";
import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import HoursStep from "./steps/HoursStep";

const ClinicRegistrationSteps = ({
  currentStep,
  fadeAnim,
  ClinicData,
  handleChange,
  formErrors,
  bottomSheetRef,
  Imgs,
  onSelectImage,
  UploadImages,
  UplaodLoading,
  createLoading,
  createClinic,
  router,
  changeStep,
  getClinicDataFromLocation,
  setClinicData,
  ...props
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            ClinicData={ClinicData}
            handleChange={handleChange}
            formErrors={formErrors}
            onNext={() => changeStep(2)}
          />
        );
      case 2:
        return (
          <LocationStep
            ClinicData={ClinicData}
            handleChange={handleChange}
            formErrors={formErrors}
            getClinicDataFromLocation={getClinicDataFromLocation}
            onNext={() => changeStep(3)}
            onBack={() => changeStep(1)}
            {...props}
          />
        );
      case 3:
        return (
          <ServicesStep
            ClinicData={ClinicData}
            setClinicData={setClinicData}
            formErrors={formErrors}
            onNext={() => changeStep(4)}
            onBack={() => changeStep(2)}
          />
        );
      case 4:
        return (
          <AdditionalInfoStep
            ClinicData={ClinicData}
            setClinicData={setClinicData}
            handleChange={handleChange}
            formErrors={formErrors}
            Imgs={Imgs}
            onSelectImage={onSelectImage}
            UploadImages={UploadImages}
            UplaodLoading={UplaodLoading}
            onNext={() => changeStep(5)}
            onBack={() => changeStep(3)}
          />
        );
      case 5:
        return (
          <HoursStep
            ClinicData={ClinicData}
            handleChange={handleChange}
            setClinicData={setClinicData}
            formErrors={formErrors}
            bottomSheetRef={bottomSheetRef}
            createClinic={createClinic}
            createLoading={createLoading}
            onBack={() => changeStep(4)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        width: "100%",
      }}
    >
      {renderStepContent()}
    </Animated.View>
  );
};

export default memo(ClinicRegistrationSteps);