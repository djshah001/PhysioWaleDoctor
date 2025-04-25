import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Button, Card, Divider, Chip } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO, addDays, isBefore, startOfDay } from "date-fns";
import { useToastSate } from "../../atoms/store.js";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import colors from "../../constants/colors";

const RescheduleScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [setToast] = useToastSate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Fetch appointment details
  useEffect(() => {
    fetchAppointmentDetails();
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setToast({
          visible: true,
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await axios.get(`${apiUrl}/api/v/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setAppointment(response.data.data);
        // Set the current appointment date as the initially selected date
        const currentDate = new Date(response.data.data.date);
        setSelectedDate(format(currentDate, "yyyy-MM-dd"));
      } else {
        throw new Error("Failed to fetch appointment details");
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      setToast({
        visible: true,
        message: "Failed to fetch appointment details",
        type: "error",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate && appointment) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, appointment]);

  const fetchAvailableTimeSlots = async () => {
    try {
      setLoadingTimeSlots(true);
      setAvailableTimeSlots([]);
      setSelectedTimeSlot(null);

      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setToast({
          visible: true,
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await axios.get(
        `${apiUrl}/api/v/appointments/available-slots`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            clinicId: appointment.clinicId._id,
            doctorId: appointment.doctorId._id,
            serviceId: appointment.serviceId._id,
            date: selectedDate,
          },
        }
      );

      if (response.data.success) {
        setAvailableTimeSlots(response.data.data);
      } else {
        throw new Error("Failed to fetch available time slots");
      }
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      setToast({
        visible: true,
        message: "Failed to fetch available time slots",
        type: "error",
      });
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      setToast({
        visible: true,
        message: "Please select a date and time",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setToast({
          visible: true,
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await axios.post(
        `${apiUrl}/api/v/appointments/${id}/reschedule`,
        {
          date: selectedDate,
          time: selectedTimeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          visible: true,
          message: "Appointment rescheduled successfully",
          type: "success",
        });
        router.replace(`/appointments/${id}`);
      } else {
        throw new Error("Failed to reschedule appointment");
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      setToast({
        visible: true,
        message: "Failed to reschedule appointment",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get marked dates for calendar
  const getMarkedDates = () => {
    const markedDates = {};
    
    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: colors.primary[500],
      };
    }
    
    return markedDates;
  };

  // Disable past dates
  const minDate = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50" edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Appbar.Header className="bg-white">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Reschedule Appointment" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView className="flex-1">
        <Card className="m-4 rounded-xl bg-white" elevation={2}>
          <Card.Content>
            <Text className="text-base font-semibold text-gray-800 mb-4">
              Current Appointment Details
            </Text>
            
            <View className="flex-row mb-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-0.5">Date</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {format(parseISO(appointment.date), "EEEE, MMMM dd, yyyy")}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-0.5">Time</Text>
                <Text className="text-sm font-medium text-gray-900">{appointment.time}</Text>
              </View>
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-0.5">Service</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {appointment.serviceId?.name || "N/A"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-0.5">Duration</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {appointment.serviceId?.duration || "N/A"} mins
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card className="mx-4 mb-4 rounded-xl bg-white" elevation={2}>
          <Card.Content>
            <Text className="text-base font-semibold text-gray-800 mb-4">
              Select New Date
            </Text>
            
            <Calendar
              minDate={minDate}
              maxDate={maxDate}
              markedDates={getMarkedDates()}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              theme={{
                todayTextColor: colors.primary[500],
                selectedDayBackgroundColor: colors.primary[500],
                selectedDayTextColor: "#ffffff",
                arrowColor: colors.primary[500],
                monthTextColor: colors.gray[800],
                textMonthFontWeight: "600",
                textDayFontSize: 14,
                textMonthFontSize: 16,
              }}
            />
          </Card.Content>
        </Card>

        {selectedDate && (
          <Card className="mx-4 mb-4 rounded-xl bg-white" elevation={2}>
            <Card.Content>
              <Text className="text-base font-semibold text-gray-800 mb-4">
                Select New Time
              </Text>
              
              {loadingTimeSlots ? (
                <View className="py-8 items-center">
                  <ActivityIndicator size="small" color={colors.primary[500]} />
                  <Text className="text-sm text-gray-500 mt-2">Loading available time slots...</Text>
                </View>
              ) : availableTimeSlots.length > 0 ? (
                <View className="flex-row flex-wrap">
                  {availableTimeSlots.map((slot) => (
                    <Chip
                      key={slot}
                      selected={selectedTimeSlot === slot}
                      onPress={() => setSelectedTimeSlot(slot)}
                      className={`m-1 ${
                        selectedTimeSlot === slot 
                          ? 'bg-primary-100' 
                          : 'bg-gray-100'
                      }`}
                      textStyle={{
                        color: selectedTimeSlot === slot 
                          ? colors.primary[700] 
                          : colors.gray[700]
                      }}
                    >
                      {slot}
                    </Chip>
                  ))}
                </View>
              ) : (
                <View className="py-8 items-center">
                  <Text className="text-sm text-gray-500">No available time slots for this date</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        <View className="m-4 mb-8">
          <Button
            mode="contained"
            onPress={handleReschedule}
            loading={submitting}
            disabled={submitting || !selectedDate || !selectedTimeSlot}
            className="rounded-lg py-1 bg-primary-500"
          >
            Reschedule Appointment
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RescheduleScreen;
