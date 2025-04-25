import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  Avatar,
  Button,
  Divider,
  Appbar,
  Dialog,
  Portal,
  RadioButton,
} from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from "date-fns";
import { useToastSate } from "../../atoms/store.js";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import colors from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import CustomBtn from "../../components/CustomBtn.jsx";

const AppointmentDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [toast,setToast] = useToastSate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

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

      // First try to get the appointment using the doctor-specific endpoint
      try {
        const response = await axios.get(
          `${apiUrl}/api/v/appointments/doctor/appointments`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.data.success) {
          const foundAppointment = response.data.data.find(
            (apt) => apt._id === id
          );
          if (foundAppointment) {
            setAppointment(foundAppointment);
            return;
          }
        }
      } catch (err) {
        console.log(
          "Error fetching from doctor appointments, trying direct fetch"
        );
      }

      // If doctor-specific endpoint fails, try the general endpoint
      const response = await axios.get(`${apiUrl}/api/v/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setAppointment(response.data.data);
      } else {
        throw new Error("Failed to fetch appointment details");
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      setToast({
        visible: true,
        message:
          "Failed to fetch appointment details. You may not have permission to view this appointment.",
        type: "error",
      });
      setTimeout(() => {
        router.back();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setToast({
          visible: true,
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await axios.patch(
        `${apiUrl}/api/v/appointments/${id}/status`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setAppointment(response.data.data);
        setToast({
          visible: true,
          message: `Appointment ${selectedStatus} successfully`,
          type: "success",
        });
      } else {
        throw new Error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setToast({
        visible: true,
        message: "Failed to update appointment status",
        type: "error",
      });
    } finally {
      setStatusDialogVisible(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return colors.warning;
      case "confirmed":
        return colors.primary[500];
      case "completed":
        return colors.success;
      case "cancelled":
      case "rejected":
      case "expired":
        return colors.error;
      default:
        return colors.gray[500];
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "EEEE, MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getAvailableStatusOptions = () => {
    if (!appointment) return [];

    switch (appointment.status) {
      case "pending":
        return [
          { label: "Confirm", value: "confirmed" },
          { label: "Reject", value: "rejected" },
        ];
      case "confirmed":
        return [
          { label: "Mark as Completed", value: "completed" },
          { label: "Cancel", value: "cancelled" },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center bg-gray-50"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center bg-gray-50 p-6"
        edges={["top"]}
      >
        <Text className="text-lg text-gray-700 mb-4 text-center">
          Appointment not found
        </Text>
        <Button mode="contained" onPress={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  const statusOptions = getAvailableStatusOptions();

  return (
    <View className="flex-1 bg-gray-50" edges={["top"]}>
      <LinearGradient
        colors={[colors.secondary[250], colors.secondary[300]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingVertical: 5 }}
        className=""
      >
        <Appbar.Header className="bg-transparent" mode="center-aligned">
          <Appbar.BackAction
            onPress={() => router.back()}
            color={colors.white[400]}
          />
          <Appbar.Content
            title="Appointment Details"
            titleStyle={{ fontWeight: "bold", color: colors.white[400] }}
          />
        </Appbar.Header>
      </LinearGradient>

      <ScrollView className="flex-1">
        <Card className="m-4 rounded-xl bg-white" elevation={2}>
          <Card.Content>
            <View className="flex-row items-center mb-4">
              <View
                className="w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor(appointment.status) }}
              />
              <Text
                className="text-base font-semibold"
                style={{ color: getStatusColor(appointment.status) }}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Text>
            </View>

            <View className="my-3">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Patient Information
              </Text>
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri:
                      appointment.userId?.profilePic ||
                      "https://via.placeholder.com/40",
                  }}
                  className="w-10 h-10 rounded-full"
                />
                {/* <Avatar.Text
                  size={50}
                  label={appointment.userId?.name?.charAt(0) || "U"}
                  backgroundColor={colors.primary[100]}
                  color={colors.primary[700]}
                /> */}
                <View className="ml-4">
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    {appointment.userId?.name || "Unknown Patient"}
                  </Text>
                  {appointment.userId?.phoneNumber && (
                    <Text className="text-sm text-gray-600 mb-0.5">
                      {appointment.userId.phoneNumber}
                    </Text>
                  )}
                  {appointment.userId?.email && (
                    <Text className="text-sm text-gray-600">
                      {appointment.userId.email}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <Divider className="my-4" />

            <View className="my-3">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Appointment Details
              </Text>
              <View className="mb-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Date</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {formatDate(appointment.date)}
                  </Text>
                </View>
              </View>

              <View className="flex-row mb-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Time</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {appointment.time}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Duration</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {appointment.serviceId?.duration || "N/A"} mins
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Service</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {appointment.serviceId?.name || "N/A"}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Price</Text>
                  <Text className="text-base font-medium text-gray-900">
                    ₹{appointment.serviceId?.price || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            <Divider className="my-4" />

            <View className="my-3">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Clinic Information
              </Text>
              <View className="mb-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">
                    Clinic Name
                  </Text>
                  <Text className="text-base font-medium text-gray-900">
                    {appointment.clinicId?.name || "N/A"}
                  </Text>
                </View>
              </View>

              <View className="mb-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Address</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {appointment.clinicId?.address || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            {appointment.notes && (
              <>
                <Divider className="my-4" />
                <View className="my-3">
                  <Text className="text-base font-semibold text-gray-800 mb-3">
                    Notes
                  </Text>
                  <Text className="text-sm text-gray-700 leading-5">
                    {appointment.notes}
                  </Text>
                </View>
              </>
            )}

            {statusOptions.length > 0 && (
              <>
                <Divider className="my-4" />
                <View className="my-3">
                  <Text className="text-base font-semibold text-gray-800 mb-3">
                    Actions
                  </Text>
                  <CustomBtn
                    title="Update Status"
                    iconName="arrow-top-right"
                    className="rounded-xl"
                    handlePress={() => setStatusDialogVisible(true)}
                    useGradient
                    iconPosition="right"
                  />
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={statusDialogVisible}
          onDismiss={() => setStatusDialogVisible(false)}
        >
          <Dialog.Title>Update Appointment Status</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => setSelectedStatus(value)}
              value={selectedStatus}
            >
              {statusOptions.map((option) => (
                <RadioButton.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color={colors.primary[500]}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setStatusDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={updateAppointmentStatus}
              disabled={!selectedStatus}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default AppointmentDetails;
