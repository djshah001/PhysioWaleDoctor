import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, IconButton } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { cssInterop } from "nativewind";

import colors from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import { useClinicsState } from "../../atoms/store";

cssInterop(Appbar, { className: "style" });

const BookAppointmentScreen = () => {
  const { clinicId } = useLocalSearchParams();
  const [clinics, setClinics] = useClinicsState();
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Get clinic data from state
  const clinicData = clinics.find((clinic) => clinic._id === clinicId);

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);

    // Fetch available slots for tomorrow
    if (clinicData) {
      fetchAvailableSlots(tomorrow);
    }
  }, [clinicData]);

  // Fetch available slots for the selected date
  const fetchAvailableSlots = async (date) => {
    setLoading(true);
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0];

      // Get day of week
      const dayOfWeek = date
        .toLocaleString("en-us", { weekday: "long" })
        .toLowerCase();

      if (clinicData?.timing?.[dayOfWeek]?.isClosed) {
        setAvailableSlots([]);
        return;
      }

      // Generate slots from opening to closing time
      const openingTime =
        clinicData?.timing?.[dayOfWeek]?.opening || "9:00:00 am";
      const closingTime =
        clinicData?.timing?.[dayOfWeek]?.closing || "6:00:00 pm";

      // Parse times (simplified for demo)
      const openHour = parseInt(openingTime.split(":")[0]);
      const closeHour =
        parseInt(closingTime.split(":")[0]) +
        (closingTime.includes("pm") ? 12 : 0);

      const slots = [];
      for (let hour = openHour; hour < closeHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour % 12 || 12}:${
            minute === 0 ? "00" : minute
          } ${hour >= 12 ? "PM" : "AM"}`;
          slots.push({
            id: `${hour}-${minute}`,
            time: timeString,
            available: Math.random() > 0.3, // Randomly mark some slots as unavailable
          });
        }
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error generating available slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDismissDatePicker = () => {
    setDatePickerVisible(false);
  };

  const onConfirmDate = (params) => {
    setDatePickerVisible(false);
    setSelectedDate(params.date);
    fetchAvailableSlots(params.date);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select both date and time slot");
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would send this data to your API
      const appointmentData = {
        clinicId,
        doctorId: clinicData?.doctor?._id,
        date: selectedDate.toISOString().split("T")[0],
        timeSlot: selectedSlot.time,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success and navigate back
      alert("Appointment booked successfully!");
      router.back();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!clinicData) {
    return (
      <SafeAreaView className="flex-1 bg-white-100 justify-center items-center">
        <Text className="font-pbold text-lg">Clinic not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-secondary-300 px-6 py-2 rounded-lg"
        >
          <Text className="text-white-100 font-ossemibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.BackAction
          onPress={() => router.back()}
          color={colors.blueishGreen[400]}
        />
        <Appbar.Content
          title="Book Appointment"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: colors.blueishGreen[400],
          }}
        />
      </Appbar.Header>

      <View className="flex-1">
        <ScrollView className="flex-1 px-4">
          {/* Rest of the component remains the same */}
          {/* Clinic Info */}
          <View className="bg-white-300 rounded-xl p-4 shadow-sm mb-6">
            <Text className="font-pbold text-xl text-black-400 mb-1">
              {clinicData?.name}
            </Text>
            <Text className="font-osregular text-sm text-gray-500 mb-2">
              {clinicData?.address}, {clinicData?.city}
            </Text>
            <Text className="font-ossemibold text-sm text-secondary-300">
              Dr. {clinicData?.doctor?.name}
            </Text>
          </View>

          {/* Date Selection */}
          <Text className="font-pbold text-lg text-black-400 mb-2">
            Select Date
          </Text>
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            className="bg-white-300 rounded-xl p-4 shadow-sm mb-6 flex-row justify-between items-center"
          >
            <Text className="font-osregular text-md">
              {formatDate(selectedDate)}
            </Text>
            <IconButton icon="calendar" size={24} />
          </TouchableOpacity>

          {/* Time Slots */}
          <Text className="font-pbold text-lg text-black-400 mb-2">
            Available Time Slots
          </Text>

          {loading ? (
            <View className="bg-white-300 rounded-xl p-6 shadow-sm mb-6 items-center">
              <ActivityIndicator size="small" color={colors.secondary[300]} />
              <Text className="font-osregular text-md text-gray-500 mt-2">
                Loading available slots...
              </Text>
            </View>
          ) : availableSlots.length === 0 ? (
            <View className="bg-white-300 rounded-xl p-6 shadow-sm mb-6 items-center">
              <Text className="font-osregular text-md text-gray-500">
                No slots available for this date
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2 mb-6">
              {availableSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={`py-2 px-4 rounded-lg ${
                    selectedSlot?.id === slot.id
                      ? "bg-secondary-300"
                      : slot.available
                      ? "bg-white-300"
                      : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`font-osregular text-sm ${
                      selectedSlot?.id === slot.id
                        ? "text-white-100"
                        : slot.available
                        ? "text-black-300"
                        : "text-gray-400"
                    }`}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Book Button - Fixed to bottom */}
        <View className="px-4 py-2 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleBookAppointment}
            disabled={!selectedDate || !selectedSlot || loading}
            className={`py-4 rounded-xl ${
              !selectedDate || !selectedSlot || loading
                ? "bg-gray-300"
                : "bg-secondary-300"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-pbold text-white-100 text-center text-lg">
                Confirm Booking
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerVisible}
        onDismiss={onDismissDatePicker}
        date={selectedDate}
        onConfirm={onConfirmDate}
        validRange={{
          startDate: new Date(), // Can't select dates before today
        }}
      />

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default BookAppointmentScreen;
