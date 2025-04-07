import React, { useState } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import CustomInput from "../../ReUsables/CustomInput";
import CustomBtn from "../../CustomBtn";
import {
  Chip,
  IconButton,
  Switch,
  Dialog,
  Portal,
  Button,
} from "react-native-paper";
import colors from "../../../constants/colors";
import { ImageGrid } from "../../ReUsables/ImageGrid";

// Hardcoded options
const FACILITY_OPTIONS = [
  "Wheelchair Access",
  "Parking",
  "Waiting Room",
  "Treatment Rooms",
  "Exercise Area",
  "Hydrotherapy",
  "Electrotherapy",
  "Massage Therapy",
  "Acupuncture",
  "Other",
];

const SPECIALIZATION_OPTIONS = [
  "Sports Physiotherapy",
  "Geriatric Physiotherapy",
  "Pediatric Physiotherapy",
  "Neurological Physiotherapy",
  "Cardiopulmonary Physiotherapy",
  "Orthopedic Physiotherapy",
  "Women's Health",
  "Other",
];

const LANGUAGE_OPTIONS = ["English", "Hindi", "Gujarati", "Marathi", "Other"];

const PARKING_TYPES = ["Free", "Paid", "Valet"];

const AdditionalInfoStep = ({
  ClinicData,
  setClinicData,
  handleChange,
  formErrors,
  Imgs,
  onSelectImage,
  UploadImages,
  UplaodLoading,
  onNext,
  onBack,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [newItem, setNewItem] = useState("");
  const [itemError, setItemError] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const getOptionsForType = (type) => {
    switch (type) {
      case "facilities":
        return FACILITY_OPTIONS;
      case "specializations":
        return SPECIALIZATION_OPTIONS;
      case "languages":
        return LANGUAGE_OPTIONS;
      default:
        return [];
    }
  };

  const openDialog = (type) => {
    setDialogType(type);
    setNewItem("");
    setItemError("");
    setShowDialog(true);
    setShowOptions(true);
  };

  const addItem = () => {
    if (!newItem.trim()) {
      setItemError(`${dialogType} name is required`);
      return;
    }

    if (!ClinicData[dialogType].includes(newItem.trim())) {
      setClinicData((prev) => ({
        ...prev,
        [dialogType]: [...prev[dialogType], newItem.trim()],
      }));
    }

    setNewItem("");
    setShowDialog(false);
  };

  const addPredefinedItem = (item) => {
    if (!ClinicData[dialogType].includes(item)) {
      setClinicData((prev) => ({
        ...prev,
        [dialogType]: [...prev[dialogType], item],
      }));
    }
  };

  const removeItem = (type, index) => {
    setClinicData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const toggleEmergencyServices = () => {
    setClinicData((prev) => ({
      ...prev,
      emergencyServices: {
        ...prev.emergencyServices,
        available: !prev.emergencyServices.available,
      },
    }));
  };

  const toggleParking = () => {
    setClinicData((prev) => ({
      ...prev,
      parking: {
        ...prev.parking,
        available: !prev.parking.available,
      },
    }));
  };

  const selectParkingType = (type) => {
    setClinicData((prev) => ({
      ...prev,
      parking: {
        ...prev.parking,
        type,
      },
    }));
  };

  const renderChips = (type, title) => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-pmedium text-black-200">{title}</Text>
        <IconButton
          icon="plus"
          size={20}
          iconColor={colors.secondary[300]}
          onPress={() => openDialog(type)}
        />
      </View>

      {formErrors[type] && (
        <Text className="text-red-500 mb-2">{formErrors[type]}</Text>
      )}

      <View className="flex-row flex-wrap gap-2">
        {ClinicData[type]?.map((item, index) => (
          <Chip
            key={index}
            onClose={() => removeItem(type, index)}
            style={{ marginBottom: 8 }}
            mode="outlined"
          >
            {item}
          </Chip>
        ))}
      </View>
    </View>
  );

  return (
    <View className="gap-4">
      <Text className="text-xl font-psemibold text-black-200 mb-2">
        Additional Information
      </Text>

      {/* Facilities */}
      {renderChips("facilities", "Facilities")}

      {/* Languages */}
      {renderChips("languages", "Languages")}

      {/* Specializations */}
      {renderChips("specializations", "Specializations")}

      {/* Emergency Services */}
      <View className="bg-gray-100 p-3 rounded-lg mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-pmedium">Emergency Services</Text>
          <Switch
            value={ClinicData?.emergencyServices?.available}
            onValueChange={toggleEmergencyServices}
            color={colors.secondary[300]}
          />
        </View>

        {ClinicData?.emergencyServices?.available && (
          <CustomInput
            label="Emergency Contact Number"
            placeholder="Enter emergency contact"
            value={ClinicData.emergencyServices.contactNumber}
            onChangeText={(text) =>
              setClinicData((prev) => ({
                ...prev,
                emergencyServices: {
                  ...prev.emergencyServices,
                  contactNumber: text,
                },
              }))
            }
            error={formErrors.emergencyServices}
            keyboardType="phone-pad"
          />
        )}
      </View>

      {/* Parking */}
      <View className="bg-gray-100 p-3 rounded-lg mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-pmedium">Parking Available</Text>
          <Switch
            value={ClinicData.parking.available}
            onValueChange={toggleParking}
            color={colors.secondary[300]}
          />
        </View>

        {ClinicData?.parking?.available && (
          <>
            <Text className="text-sm font-pmedium mb-2">Parking Type</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {PARKING_TYPES?.map((type, index) => (
                <Chip
                  key={index}
                  selected={ClinicData.parking.type === type}
                  onPress={() => selectParkingType(type)}
                  style={{ marginBottom: 4 }}
                  mode="outlined"
                  selectedColor={
                    ClinicData.parking.type === type 
                      ? colors.white[300] 
                      : colors.black[300]
                  }
                  theme={{
                    colors: {
                      surface: ClinicData.parking.type === type 
                        ? colors.accent.DEFAULT
                        : undefined,
                      primary: ClinicData.parking.type === type
                        ? colors.accent.DEFAULT 
                        : colors.secondary[300]
                    }
                  }}
                >
                  {type}
                </Chip>
              ))}
            </View>

            <CustomInput
              label="Parking Details (Optional)"
              placeholder="Additional parking information"
              value={ClinicData.parking.details}
              onChangeText={(text) =>
                setClinicData((prev) => ({
                  ...prev,
                  parking: {
                    ...prev.parking,
                    details: text,
                  },
                }))
              }
              multiline
            />
          </>
        )}
      </View>

      {/* Clinic Images */}
      <View className="mb-4">
        <Text className="text-base font-pmedium text-black-200 mb-2">
          Clinic Images
        </Text>

        {formErrors.images && (
          <Text className="text-red-500 mb-2">{formErrors.images}</Text>
        )}

        <ImageGrid
          images={Imgs}
          onSelectImage={onSelectImage}
          onUpload={UploadImages}
          isUploading={UplaodLoading}
          uploadedImages={ClinicData.images}
        />
      </View>

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title className='capitalize' >Add {dialogType}</Dialog.Title>
          <Dialog.Content>
            <CustomInput
              label={`${dialogType} Name`}
              placeholder={`Enter ${dialogType} name`}
              value={newItem}
              onChangeText={setNewItem}
              error={itemError}
            />

            {showOptions && (
              <View className="mt-4">
                <Text className="text-sm font-pmedium mb-2">
                  Select from options:
                </Text>
                <ScrollView style={{ maxHeight: 200 }}>
                  <View className="flex-row flex-wrap gap-2">
                    {getOptionsForType(dialogType).map((option, index) => (
                      <Chip
                        key={index}
                        onPress={() => {
                          setNewItem(option);
                          if (option !== "Other") {
                            addPredefinedItem(option);
                            // setShowDialog(false);
                          }
                        }}
                        style={{ marginBottom: 8 }}
                        mode="outlined"
                        disabled={ClinicData[dialogType].includes(option)}
                      >
                        {option}
                      </Chip>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            <Button onPress={addItem}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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

export default React.memo(AdditionalInfoStep);
