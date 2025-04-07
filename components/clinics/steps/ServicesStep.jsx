import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import CustomInput from "../../ReUsables/CustomInput";
import CustomBtn from "../../CustomBtn";
import {
  Chip,
  IconButton,
  Dialog,
  Portal,
  Button,
  RadioButton,
} from "react-native-paper";
import colors from "../../../constants/colors";

// Mandatory service templates (without price and duration)
const mandatoryServices = [
  {
    name: "Initial Consultation",
    description:
      "Comprehensive initial assessment and consultation with detailed treatment planning",
    category: "consultation",
  },
  {
    name: "Follow-up Session",
    description: "Regular follow-up treatment session",
    category: "therapy",
  },
  {
    name: "Home Visit Session",
    description: "Physiotherapy treatment at patient's home",
    category: "therapy",
  },
];

const ServicesStep = ({
  ClinicData,
  setClinicData,
  formErrors,
  onNext,
  onBack,
}) => {
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    category: "consultation",
  });
  const [serviceError, setServiceError] = useState({});

  // Add mandatory services prompt on component mount if no services exist
  useEffect(() => {
    if (ClinicData.services.length === 0) {
      // Show prompt to add mandatory services with custom prices and durations
      Alert.alert(
        "Required Services",
        "We've added some standard services that are typically offered. Please set their prices and durations.",
        [{ text: "OK", onPress: () => setupMandatoryServices() }]
      );
    }
  }, []);

  const setupMandatoryServices = () => {
    // Add mandatory services with empty price and duration to prompt user to fill them
    const servicesWithEmptyPricing = mandatoryServices.map((service) => ({
      ...service,
      price: "",
      duration: "",
    }));

    setClinicData((prev) => ({
      ...prev,
      services: [...servicesWithEmptyPricing],
    }));
  };

  const addService = () => {
    const errors = {};
    if (!newService.name) errors.name = "Service name is required";
    if (!newService.duration) errors.duration = "Duration is required";
    if (!newService.price) errors.price = "Price is required";
    if (!newService.category) errors.category = "Category is required";

    if (Object.keys(errors).length > 0) {
      setServiceError(errors);
      return;
    }

    if (editingService !== null) {
      // Update existing service
      const updatedServices = [...ClinicData.services];
      updatedServices[editingService] = newService;

      setClinicData((prev) => ({
        ...prev,
        services: updatedServices,
      }));
    } else {
      // Add new service
      setClinicData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }));
    }

    setNewService({
      name: "",
      description: "",
      duration: "",
      price: "",
      category: "consultation",
    });
    setEditingService(null);
    setServiceError({});
    setShowServiceDialog(false);
  };

  const editService = (index) => {
    setNewService({ ...ClinicData.services[index] });
    setEditingService(index);
    setShowServiceDialog(true);
  };

  const removeService = (index) => {
    setClinicData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // Check if any mandatory service is missing price or duration
  const hasMissingPriceOrDuration = ClinicData.services.some(
    (service) => !service.price || !service.duration
  );

  // Category options for the service
  const categoryOptions = [
    { label: "Consultation", value: "consultation" },
    { label: "Therapy", value: "therapy" },
    { label: "Diagnostic", value: "diagnostic" },
    { label: "Other", value: "other" },
  ];

  return (
    <View className="gap-4">
      <Text className="text-xl font-psemibold text-black-200">
        Services Offered
      </Text>

      {formErrors.services && (
        <Text className="text-red-500">{formErrors.services}</Text>
      )}

      {hasMissingPriceOrDuration && (
        <View className="bg-yellow-100 p-3 rounded-lg mb-2">
          <Text className="text-yellow-800 font-pmedium">
            Please set price and duration for all services
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <Text className="text-base font-pmedium text-black-200">
          Add Services
        </Text>
        <IconButton
          icon="plus"
          size={24}
          iconColor={colors.secondary[300]}
          onPress={() => {
            setEditingService(null);
            setNewService({
              name: "",
              description: "",
              duration: "",
              price: "",
              category: "consultation",
            });
            setShowServiceDialog(true);
          }}
        />
      </View>

      {ClinicData.services.length > 0 ? (
        <View className="gap-2">
          <ScrollView contentContainerClassName="gap-2" >
            {ClinicData.services.map((item, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between p-3 rounded-xl mb-2 gap-2 ${
                  !item.price || !item.duration
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-blue-100"
                }`}
              >
                <View className="flex-1 m-2">
                  <Text className="font-pmedium">{item.name}</Text>
                  {item.description && (
                    <Text className="text-gray-500 text-xs">
                      {item.description}
                    </Text>
                  )}
                  <View className="flex-row items-center mt-1">
                    {item.duration && item.price ? (
                      <Text className="text-gray-600 mr-2">
                        {item.duration} min - ₹{item.price}
                      </Text>
                    ) : (
                      <Text className="text-yellow-700 mr-2 text-xs font-pmedium">
                        Set price and duration
                      </Text>
                    )}
                    <Chip
                      compact
                      // mode="outlined"
                      // style={{ height: 20 }}
                      textStyle={{
                        fontSize: 10,
                        color: colors.white[300],
                        marginHorizontal: 0,
                        marginVertical: 1,
                      }}
                      style={{
                        backgroundColor: colors.accent["DEFAULT"],
                        paddingHorizontal: 1,
                        paddingVertical: 2,
                        // height: 24,
                      }}
                    >
                      {item.category}
                    </Chip>
                  </View>
                </View>
                <View className="flex-row">
                  <IconButton
                    icon="pencil"
                    size={20}
                    iconColor={colors.secondary[300]}
                    onPress={() => editService(index)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor="red"
                    onPress={() => removeService(index)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View className="bg-gray-100 p-4 rounded-lg items-center">
          <Text className="text-gray-500">No services added yet</Text>
        </View>
      )}

      <Portal>
        <Dialog
          visible={showServiceDialog}
          onDismiss={() => setShowServiceDialog(false)}
        >
          <Dialog.Title>
            {editingService !== null ? "Edit Service" : "Add New Service"}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              <CustomInput
                label="Service Name"
                placeholder="Enter service name"
                value={newService.name}
                onChangeText={(text) =>
                  setNewService((prev) => ({ ...prev, name: text }))
                }
                error={serviceError.name}
                className="mb-2"
              />
              <CustomInput
                label="Description"
                placeholder="Enter service description"
                value={newService.description}
                onChangeText={(text) =>
                  setNewService((prev) => ({ ...prev, description: text }))
                }
                multiline
                numberOfLines={3}
                className="mb-2"
              />
              <CustomInput
                label="Duration (minutes)"
                placeholder="Enter duration"
                value={newService.duration}
                onChangeText={(text) =>
                  setNewService((prev) => ({ ...prev, duration: text }))
                }
                error={serviceError.duration}
                keyboardType="numeric"
                className="mb-2"
              />
              <CustomInput
                label="Price"
                placeholder="Enter price"
                value={newService.price}
                onChangeText={(text) =>
                  setNewService((prev) => ({ ...prev, price: text }))
                }
                error={serviceError.price}
                keyboardType="numeric"
                leftIcon="currency-inr"
                className="mb-2"
              />

              <Text className="font-pmedium mb-1">Category</Text>
              {serviceError.category && (
                <Text className="text-red-500 text-xs mb-1">
                  {serviceError.category}
                </Text>
              )}
              <RadioButton.Group
                onValueChange={(value) =>
                  setNewService((prev) => ({ ...prev, category: value }))
                }
                value={newService.category}
              >
                {categoryOptions.map((option) => (
                  <RadioButton.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    color={colors.secondary[300]}
                  />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowServiceDialog(false)}>Cancel</Button>
            <Button onPress={addService}>
              {editingService !== null ? "Update" : "Add"}
            </Button>
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
          disabled={hasMissingPriceOrDuration}
        />
      </View>
    </View>
  );
};

export default React.memo(ServicesStep);
