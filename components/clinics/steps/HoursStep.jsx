import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import CustomBtn from "../../CustomBtn";
import {
  Switch,
  Divider,
  IconButton,
  Chip,
  Dialog,
  Portal,
  Button,
  TextInput,
} from "react-native-paper";
import colors from "../../../constants/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

const HoursStep = ({
  ClinicData,
  handleChange,
  setClinicData,
  formErrors,
  bottomSheetRef,
  createClinic,
  createLoading,
  onBack,
}) => {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeType, setTimeType] = useState(""); // "opening" or "closing"
  const [showUnavailableSlotDialog, setShowUnavailableSlotDialog] =
    useState(false);
  const [selectedSlotDay, setSelectedSlotDay] = useState(null);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    reason: "",
  });
  const [slotError, setSlotError] = useState({});
  const [slotTimeType, setSlotTimeType] = useState(""); // "startTime" or "endTime"

  const toggleOpen24Hours = () => {
    handleChange("open24hrs", !ClinicData.open24hrs);

    // If switching to 24 hours, update all timings
    if (!ClinicData.open24hrs) {
      const updatedTimings = { ...ClinicData.timing };
      Object.keys(updatedTimings).forEach((day) => {
        updatedTimings[day] = {
          ...updatedTimings[day],
          opening: "00:00",
          closing: "23:59",
          isClosed: false,
        };
      });

      // Update the clinic data with the new timings
      handleChange("timing", updatedTimings);
    }
  };

  const openTimingSheet = () => {
    bottomSheetRef.current?.show();
  };

  const showTimePicker = (day, type) => {
    setSelectedDay(day);
    setTimeType(type);
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (date) => {
    const formattedTime = format(date, "HH:mm");

    setClinicData((prev) => ({
      ...prev,
      timing: {
        ...prev.timing,
        [selectedDay]: {
          ...prev.timing[selectedDay],
          [timeType]: formattedTime,
        },
      },
    }));

    hideTimePicker();
  };

  const openUnavailableSlotDialog = (day) => {
    setSelectedSlotDay(day);
    setNewSlot({
      startTime: "",
      endTime: "",
      reason: "",
    });
    setSlotError({});
    setShowUnavailableSlotDialog(true);
  };

  const showSlotTimePicker = (type) => {
    setSlotTimeType(type);
    setTimePickerVisible(true);
  };

  const handleSlotTimeConfirm = (date) => {
    const formattedTime = format(date, "hh:mm a");

    setNewSlot((prev) => ({
      ...prev,
      [slotTimeType]: formattedTime,
    }));

    hideTimePicker();
  };

  const addUnavailableSlot = () => {
    const errors = {};
    if (!newSlot.startTime) errors.startTime = "Start time is required";
    if (!newSlot.endTime) errors.endTime = "End time is required";

    if (Object.keys(errors).length > 0) {
      setSlotError(errors);
      return;
    }

    const slot12hr = {
      ...newSlot,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
    };

    setClinicData((prev) => {
      // Ensure unavailableSlots array exists
      const currentSlots = prev.timing[selectedSlotDay].unavailableSlots || [];

      return {
        ...prev,
        timing: {
          ...prev.timing,
          [selectedSlotDay]: {
            ...prev.timing[selectedSlotDay],
            unavailableSlots: [...currentSlots, slot12hr],
          },
        },
      };
    });

    setShowUnavailableSlotDialog(false);
  };

  const removeUnavailableSlot = (day, index) => {
    setClinicData((prev) => ({
      ...prev,
      timing: {
        ...prev.timing,
        [day]: {
          ...prev.timing[day],
          unavailableSlots: prev.timing[day].unavailableSlots.filter(
            (_, i) => i !== index
          ),
        },
      },
    }));
  };

  const renderTimingPreview = () => {
    const days = Object.keys(ClinicData.timing);

    return (
      <View className="bg-gray-100 p-3 rounded-lg">
        {days.map((day) => (
          <View
            key={day}
            className="flex-row justify-between py-1 border-b border-gray-200"
          >
            <Text className="capitalize font-pmedium">{day}</Text>
            <View className="flex-row items-center">
              <Text>
                {ClinicData.timing[day].isClosed
                  ? "Closed"
                  : `${ClinicData.timing[day].opening || "--:--"} - ${
                      ClinicData.timing[day].closing || "--:--"
                    }`}
              </Text>
              {!ClinicData.timing[day].isClosed && (
                <IconButton
                  icon="clock-edit-outline"
                  size={18}
                  iconColor={colors.secondary[300]}
                  onPress={() => openUnavailableSlotDialog(day)}
                />
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderUnavailableSlots = () => {
    const days = Object.keys(ClinicData.timing);
    const hasUnavailableSlots = days.some(
      (day) =>
        ClinicData.timing[day].unavailableSlots &&
        ClinicData.timing[day].unavailableSlots.length > 0
    );

    if (!hasUnavailableSlots) return null;

    return (
      <View className="mt-4">
        <Text className="font-pmedium mb-2">Unavailable Slots</Text>
        <ScrollView className="max-h-40">
          {days.map((day) => {
            const slots = ClinicData.timing[day].unavailableSlots || [];
            if (slots.length === 0) return null;

            return (
              <View key={day} className="mb-2">
                <Text className="capitalize font-pmedium">{day}</Text>
                <View className="flex-row flex-wrap gap-2 mt-1">
                  {slots.map((slot, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeUnavailableSlot(day, index)}
                      style={{ marginBottom: 4 }}
                      mode="outlined"
                    >
                      {slot.startTime} - {slot.endTime}
                    </Chip>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="gap-4">
      <Text className="text-xl font-psemibold text-black-200 mb-2">
        Clinic Hours
      </Text>

      <View className="flex-row items-center justify-between bg-gray-100 p-3 rounded-lg mb-4">
        <Text className="font-pmedium">Open 24 Hours</Text>
        <Switch
          value={ClinicData.open24hrs}
          onValueChange={toggleOpen24Hours}
          color={colors.secondary[300]}
        />
      </View>

      {!ClinicData.open24hrs && (
        <>
          <View className="mb-2">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-pmedium">Operating Hours</Text>
              <TouchableOpacity
                onPress={openTimingSheet}
                className="bg-secondary-300 px-3 py-1 rounded-full"
              >
                <Text className="text-white-300">Edit Hours</Text>
              </TouchableOpacity>
            </View>
            {renderTimingPreview()}
          </View>

          {renderUnavailableSlots()}
        </>
      )}

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={slotTimeType ? handleSlotTimeConfirm : handleTimeConfirm}
        onCancel={hideTimePicker}
        is24Hour={false}
      />

      <Portal>
        <Dialog
          visible={showUnavailableSlotDialog}
          onDismiss={() => setShowUnavailableSlotDialog(false)}
        >
          <Dialog.Title>
            Add Unavailable Slot for {selectedSlotDay}
          </Dialog.Title>
          <Dialog.Content>
            <View className="mb-4">
              <Text className="mb-2">Start Time</Text>
              <TouchableOpacity
                onPress={() => showSlotTimePicker("startTime")}
                className="bg-gray-100 p-3 rounded-md"
              >
                <Text>{newSlot.startTime || "Select start time"}</Text>
              </TouchableOpacity>
              {slotError.startTime && (
                <Text className="text-red-500 text-sm mt-1">
                  {slotError.startTime}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2">End Time</Text>
              <TouchableOpacity
                onPress={() => showSlotTimePicker("endTime")}
                className="bg-gray-100 p-3 rounded-md"
              >
                <Text>{newSlot.endTime || "Select end time"}</Text>
              </TouchableOpacity>
              {slotError.endTime && (
                <Text className="text-red-500 text-sm mt-1">
                  {slotError.endTime}
                </Text>
              )}
            </View>

            <TextInput
              label="Reason (Optional)"
              value={newSlot.reason}
              onChangeText={(text) =>
                setNewSlot((prev) => ({ ...prev, reason: text }))
              }
              mode="outlined"
              multiline
              numberOfLines={3}
              style={{ marginTop: 8 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowUnavailableSlotDialog(false)}>
              Cancel
            </Button>
            <Button onPress={addUnavailableSlot}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Divider className="my-2" />

      <View className="mt-4">
        <Text className="text-center text-gray-600 mb-4">
          Please review all information before submitting
        </Text>

        <View className="flex-row justify-between gap-4">
          <CustomBtn
            title="Back"
            handlePress={onBack}
            className="flex-1"
            variant="outlined"
            iconName="arrow-left"
            iconPosition="left"
          />
          <CustomBtn
            title="Register Clinic"
            handlePress={createClinic}
            loading={createLoading}
            iconName="check-circle"
            iconPosition="right"
            useGradient={true}
            gradientColors={[colors.secondary[200], colors.secondary[400]]}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(HoursStep);
