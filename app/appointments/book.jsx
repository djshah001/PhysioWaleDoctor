import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Chip } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { en, registerTranslation } from 'react-native-paper-dates';
import { cssInterop } from "nativewind";
import { MotiView } from "moti";
import { format, parse, isWithinInterval } from "date-fns";

// Register the English locale
registerTranslation('en', en);

import colors from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import { useClinicsState } from "../../atoms/store";
import CustomBtn from "../../components/CustomBtn";

// Import the components we created earlier
import TimeSlotGroup from "../../components/Appointments/TimeSlotGroup";
import NoSlotsAvailable from "../../components/Appointments/NoSlotsAvailable";
import DateSelector from "../../components/Appointments/DateSelector";
import { Image } from "expo-image";

cssInterop(Appbar, { className: "style" });
cssInterop(MotiView, { className: "style" });

// Helper function to convert time string to minutes for comparison
const timeToMinutes = (timeString) => {
  if (!timeString) return 0;

  const isPM = timeString.toLowerCase().includes("pm");
  const isAM = timeString.toLowerCase().includes("am");

  // Extract hours and minutes
  const timeParts = timeString.replace(/\s?[ap]m$/i, "").split(":");
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1] || 0);

  // Convert to 24-hour format
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper function to check if a slot is unavailable
const isSlotUnavailable = (slotStart, slotEnd, unavailableSlots, date) => {
  // Check if slot is in the past for today
  if (date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // If the selected date is today, check if the slot is in the past
    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      // Get current time in minutes
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Add a buffer of 30 minutes
      const bufferMinutes = 30;

      // If slot is in the past or too close to current time, mark as unavailable
      if (slotStart <= currentTimeInMinutes + bufferMinutes) {
        return true;
      }
    }
  }

  // Check if slot overlaps with any unavailable slots
  if (
    !unavailableSlots ||
    !Array.isArray(unavailableSlots) ||
    unavailableSlots.length === 0
  ) {
    return false;
  }

  return unavailableSlots.some((slot) => {
    const unavailableStart = timeToMinutes(slot.startTime);
    const unavailableEnd = timeToMinutes(slot.endTime);

    // Check for overlap
    return (
      (slotStart >= unavailableStart && slotStart < unavailableEnd) ||
      (slotEnd > unavailableStart && slotEnd <= unavailableEnd) ||
      (slotStart <= unavailableStart && slotEnd >= unavailableEnd)
    );
  });
};

const BookAppointmentScreen = () => {
  const { clinicId } = useLocalSearchParams();
  const [clinics] = useClinicsState();
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Get clinic data from state using useMemo for better performance
  const clinicData = useMemo(() => {
    return clinics.find((clinic) => clinic._id === clinicId);
  }, [clinics, clinicId]);

  // Group time slots by morning, afternoon, evening for better organization
  const groupedSlots = useMemo(() => {
    if (!availableSlots.length) return {};

    return availableSlots.reduce((acc, slot) => {
      const time = slot.time;
      if (time.includes("AM")) {
        acc.morning = [...(acc.morning || []), slot];
      } else if (time.includes("PM") && parseInt(time.split(":")[0]) < 5) {
        acc.afternoon = [...(acc.afternoon || []), slot];
      } else {
        acc.evening = [...(acc.evening || []), slot];
      }
      return acc;
    }, {});
  }, [availableSlots]);

  // Format date for display
  const formatDate = useCallback((date) => {
    if (!date) return "Select Date";
    return format(date, "EEEE, MMMM d, yyyy");
  }, []);

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
    setSelectedSlot(null); // Reset selected slot when date changes

    try {
      // Get day of week
      const dayOfWeek = format(date, "EEEE").toLowerCase();

      // Check if clinic is closed on selected day
      if (
        !clinicData?.timing ||
        !clinicData.timing[dayOfWeek] ||
        clinicData.timing[dayOfWeek].isClosed
      ) {
        setAvailableSlots([]);
        setLoading(false);
        return;
      }

      // Get clinic timing for selected day
      const dayTiming = clinicData.timing[dayOfWeek];
      const openingTime = dayTiming.opening || "9:00 AM";
      const closingTime = dayTiming.closing || "6:00 PM";
      const unavailableSlots = dayTiming.unavailableSlots || [];

      // Convert opening and closing times to minutes
      const openingMinutes = timeToMinutes(openingTime);
      const closingMinutes = timeToMinutes(closingTime);

      // Generate slots with 30-minute intervals
      const slots = [];
      const SLOT_DURATION = 30; // 30 minutes per slot

      for (
        let time = openingMinutes;
        time < closingMinutes;
        time += SLOT_DURATION
      ) {
        const slotStart = time;
        const slotEnd = time + SLOT_DURATION;

        // Format time for display
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        const timeString = `${displayHour}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;

        // Check if this slot overlaps with any unavailable slots
        // Inside fetchAvailableSlots function
        // Check if this slot is unavailable (either due to clinic settings or being in the past)
        const isUnavailable = isSlotUnavailable(
          slotStart,
          slotEnd,
          unavailableSlots,
          date
        );

        slots.push({
          id: `slot-${time}`,
          time: timeString,
          available: !isUnavailable,
          startMinutes: slotStart,
          endMinutes: slotEnd,
        });
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
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedSlot.time,
        startTime: selectedSlot.time,
        endTime: `${Math.floor(selectedSlot.endMinutes / 60) % 12 || 12}:${(
          selectedSlot.endMinutes % 60
        )
          .toString()
          .padStart(2, "0")} ${
          selectedSlot.endMinutes / 60 >= 12 ? "PM" : "AM"
        }`,
      };

      console.log("Booking appointment:", appointmentData);

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
          color={colors.blueishGreen?.[400] || colors.secondary[400]}
        />
        <Appbar.Content
          title="Book Appointment"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: colors.blueishGreen?.[400] || colors.secondary[400],
          }}
        />
      </Appbar.Header>

      <View className="flex-1">
        <ScrollView className="flex-1 px-4">
          {/* Clinic Info Card */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            className="bg-white-300 rounded-xl p-4 shadow-md mb-6 border border-secondary-100/20"
          >
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-secondary-100 items-center justify-center mr-3">
                {/* <Text className="font-pbold text-lg text-secondary-300">
                  {clinicData?.name?.charAt(0) || "C"}
                </Text> */}
                <Image
                  source={{ uri: clinicData?.images[0] }}
                  contentFit="cover"
                  className="w-10 h-10 rounded-full"
                />
              </View>
              <View className="flex-1">
                <Text className="font-pbold text-xl text-black-400">
                  {clinicData?.name}
                </Text>
                <Text className="font-osregular text-sm text-black-300">
                  Dr. {clinicData?.doctor?.name}
                </Text>
              </View>
            </View>
            <Text className="font-osregular text-sm text-black-300 mb-2">
              {clinicData?.address}, {clinicData?.city}
            </Text>

            {clinicData?.specializations?.length > 0 && (
              <View className="flex-row flex-wrap mt-1">
                {clinicData.specializations.map((spec, idx) => (
                  // <View
                  //   key={idx}
                  //   className="bg-secondary-200/60 mr-1 mb-1 px-2 py-1 rounded-full"
                  // >
                  //   <Text className="text-accent text-xs">{spec}</Text>
                  // </View>
                  <Chip
                    key={idx}
                    className="mr-2 mb-1 text-white-200 shadow-md shadow-accent rounded-full "
                    textStyle={{
                      fontSize: 10,
                      color: colors.white[300],
                      fontWeight: "bold",
                      marginHorizontal: 0,
                      marginVertical: 1,
                    }}
                    style={{
                      backgroundColor: colors.accent["DEFAULT"],
                      paddingHorizontal: 1,
                      paddingVertical: 2,
                      // height: 24,
                    }}
                    elevated
                    elevation={3}
                    compact
                  >
                    {spec}
                  </Chip>
                ))}
              </View>
            )}
          </MotiView>

          {/* Date Selection - Using DateSelector component */}
          <DateSelector
            selectedDate={selectedDate}
            onPress={() => setDatePickerVisible(true)}
            formatDate={formatDate}
          />

          {/* Time Slots */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 200 }}
          >
            <Text className="font-pbold text-lg text-black-400 mb-2">
              Available Time Slots
            </Text>

            {loading ? (
              <View className="bg-white-300 rounded-xl p-6 shadow-sm mb-6 items-center border border-secondary-100/20">
                <ActivityIndicator size="small" color={colors.secondary[300]} />
                <Text className="font-osregular text-md text-black-300 mt-2">
                  Loading available slots...
                </Text>
              </View>
            ) : availableSlots.length === 0 ? (
              <NoSlotsAvailable message="No slots available for this date" />
            ) : (
              <View className="mb-6">
                {/* Morning slots - Using TimeSlotGroup component */}
                <TimeSlotGroup
                  title="Morning"
                  icon="weather-sunny"
                  slots={groupedSlots.morning}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />

                {/* Afternoon slots - Using TimeSlotGroup component */}
                <TimeSlotGroup
                  title="Afternoon"
                  icon="weather-partly-cloudy"
                  slots={groupedSlots.afternoon}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />

                {/* Evening slots - Using TimeSlotGroup component */}
                <TimeSlotGroup
                  title="Evening"
                  icon="weather-night"
                  slots={groupedSlots.evening}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              </View>
            )}
          </MotiView>
        </ScrollView>

        {/* Book Button - Fixed to bottom with improved UI */}
        <View className="px-4 py-3 border-t border-white-200 bg-white-100">
          {selectedSlot && (
            <View className="flex-row justify-between items-center mb-3 px-2">
              <Text className="font-osregular text-black-300">
                Selected slot:
              </Text>
              <View className="bg-secondary-100/30 px-3 py-1 rounded-lg">
                <Text className="font-ossemibold text-secondary-400">
                  {selectedDate ? format(selectedDate, "MMM d") : ""} •{" "}
                  {selectedSlot.time}
                </Text>
              </View>
            </View>
          )}

          <CustomBtn
            useGradient
            title="Confirm Booking"
            iconName="calendar-check"
            className="rounded-xl"
            handlePressPress={handleBookAppointment}
            disabled={!selectedDate || !selectedSlot || loading}
            loading={loading}
          />
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
          startDate: new Date(new Date().setHours(0, 0, 0, 0)), // Allow selection from today
        }}
      />

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default BookAppointmentScreen;
