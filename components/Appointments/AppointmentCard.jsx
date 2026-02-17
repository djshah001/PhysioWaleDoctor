import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Card, IconButton, Badge, Icon } from "react-native-paper";
import { Image } from "expo-image";
import { format } from "date-fns";

import { router } from "expo-router";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../atoms/store";
import CustomBtn from "../CustomBtn";

const getStatusClassName = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-green-500";
    case "completed":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    case "rejected":
      return "bg-red-500";
    case "expired":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const AppointmentCard = ({ appointment, onCancelSuccess }) => {
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.post(
                `${apiUrl}/api/v/appointments/${appointment._id}/cancel`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${UserData?.authToken}`,
                  },
                }
              );

              if (response.data.success) {
                setToast({
                  visible: true,
                  message: "Appointment cancelled successfully",
                  type: "success",
                });

                // Call the callback to refresh the appointments list
                if (onCancelSuccess) {
                  onCancelSuccess();
                }
              }
            } catch (error) {
              console.error(
                "Error cancelling appointment:",
                error.response?.data || error.message
              );
              setToast({
                visible: true,
                message:
                  (error.response?.data?.errors &&
                    error.response?.data?.errors[0]?.msg) ||
                  "Failed to cancel appointment. Please try again.",
                type: "error",
              });
            }
          },
        },
      ]
    );
  };

  // Format the appointment date
  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");

  // Check if appointment can be cancelled or rescheduled (not completed, cancelled, rejected, or expired)
  const canCancel = !["completed", "cancelled", "rejected", "expired"].includes(
    appointment.status
  );

  const canReschedule = !["completed", "cancelled", "rejected", "expired"].includes(
    appointment.status
  );

  return (
    <Card className="mb-4 overflow-hidden border border-white-200 rounded-xl shadow-md">
      {/* Status Badge */}
      <View className="absolute top-3 right-3 z-10">
        <Badge
          style={{
            color: "white",
            fontFamily: "OpenSans-SemiBold",
            paddingHorizontal: 10,
            height: 24,
            borderRadius: 12,
            elevation: 3,
          }}
          className={`${getStatusClassName(appointment.status)} capitalize`}
          size={20}
        >
          {appointment.status}
        </Badge>
      </View>

      {/* Clinic Image */}
      <View className="h-36 w-full">
        <Image
          source={{ uri: appointment.clinicId?.images?.[0] }}
          contentFit="cover"
          className="w-full h-full"
          placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
          transition={300}
        />
      </View>

      {/* Appointment Details */}
      <Card.Content className="p-5 bg-white-100">
        <View className="mb-2">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-2">
              <Text className="font-pbold text-lg text-black-800">
                {appointment.clinicId?.name}
              </Text>
              <Text className="font-osregular text-sm text-black-600">
                Dr. {appointment.doctorId?.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Date and Time */}
        <View className="flex-row items-center mt-3 gap-2">
          <Icon
            source="calendar-check-outline"
            size={20}
            color="#4A90E2"
          />
          <Text className="font-ossemibold text-black-600 text-sm">
            {formattedDate}
          </Text>
        </View>

        <View className="flex-row items-center mt-2 gap-2">
          <Icon
            source="clock-outline"
            size={20}
            color="#4A90E2"
          />
          <Text className="font-ossemibold text-black-600 text-sm">
            {appointment.time}
          </Text>
        </View>

        {/* Service Details */}
        <View className="bg-blue-50 p-4 rounded-xl mt-4 shadow-sm border border-blue-100">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-ossemibold text-black-800">
                {appointment.serviceId?.name}
              </Text>
              <Text className="font-osregular text-sm text-black-600 mt-1">
                {appointment.serviceId?.duration} min
              </Text>
            </View>
            <Text className="font-pbold text-blue-500 text-lg">
              ₹{appointment.serviceId?.price}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className=" justify-between mt-5 gap-3">


          <View className="flex-row justify-between px-1">
            {canReschedule && (
              <CustomBtn
                title="Reschedule"
                iconName="calendar-clock"
                className="rounded-xl"
                variant="outlined"
                borderColor="#4A90E2"
                textColor="#4A90E2"
                handlePress={() =>
                  router.push({
                    pathname: '/appointments/reschedule',
                    params: { appointmentId: appointment._id },
                  })
                }
              />
            )}

            {canCancel && (
              <CustomBtn
                title="Cancel"
                variant="outlined"
                iconName="close-circle-outline"
                className="rounded-xl"
                borderColor="#E53E3E"
                textColor="#E53E3E"
                handlePress={handleCancelAppointment}
              />
            )}
          </View>
          <CustomBtn
            title="Details"
            iconName="information-outline"
            className="rounded-xl flex-1"
            handlePress={() =>
              router.push({
                pathname: `/appointments/${appointment._id}`,
                params: { appointmentId: appointment._id },
              })
            }
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default AppointmentCard;
