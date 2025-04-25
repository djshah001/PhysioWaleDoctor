import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Title, Avatar, Button, Divider } from "react-native-paper";
import { router } from "expo-router";
import { format } from "date-fns";
import colors from "../../constants/colors";
import CustomBtn from "../CustomBtn";
import { Image } from "expo-image";

const UpcomingAppointments = ({ appointments = [] }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <Card
        className="mx-4 my-2 rounded-xl shadow-sm bg-white-100"
        elevation={2}
      >
        <Card.Content>
          <View className="flex-row justify-between items-center mb-3">
            <Title className="font-osbold text-lg text-gray-800">
              Upcoming Appointments
            </Title>
          </View>

          <View className="items-center py-4">
            <Avatar.Icon
              size={50}
              icon="calendar-check"
              backgroundColor={colors.primary["300"]}
              color={colors.white[100]}
            />
            <Text className="font-ossemibold text-base text-gray-700 mt-2">
              No Upcoming Appointments
            </Text>
            <Text className="text-center font-osregular text-sm text-gray-600 mt-1">
              You don't have any appointments scheduled for today.
            </Text>
          </View>
          <CustomBtn
            title="manage all appointments"
            iconName="calendar-check"
            className="rounded-xl"
            handlePress={() => router.push("/appointments/my-appointments")}
          />
        </Card.Content>
      </Card>
    );
  }

  const formatAppointmentTime = (time) => {
    if (!time) return "N/A";
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, "h:mm a");
    } catch (error) {
      return "Invalid Time";
    }
  };

  const formatAppointmentDate = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "EEE, MMM d");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <Card className="mx-4 my-2 rounded-xl shadow-sm bg-white-100" elevation={2}>
      <Card.Content>
        <View className="flex-row justify-between items-center mb-3">
          <Title className="font-osbold text-lg text-gray-800">
            Upcoming Appointments
          </Title>
        </View>

        {appointments.slice(0, 3).map((appointment, index) => (
          <React.Fragment key={appointment._id || index}>
            <TouchableOpacity
              onPress={() => router.push(`/appointments/${appointment._id}`)}
              className="mb-3"
            >
              <View className="flex-row items-center">
                {/* {console.log(appointment)} */}
                <Image
                  source={{ uri: appointment.patientImage }}
                  className="w-10 h-10 rounded-full"
                  contentFit="cover"
                  placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
                />
                <View className="ml-3 flex-1">
                  <Text className="font-ossemibold text-base text-gray-800">
                    {appointment.patientName}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="font-osregular text-xs text-gray-600">
                      {formatAppointmentDate(appointment.date)}
                    </Text>
                    <Text className="font-osregular text-xs text-gray-600 mx-1">
                      •
                    </Text>
                    <Text className="font-osregular text-xs text-gray-600">
                      {formatAppointmentTime(appointment.time)}
                    </Text>
                  </View>
                </View>
                <View
                  className="px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${getStatusColor(appointment.status)}20`,
                  }}
                >
                  <Text
                    className="font-osmedium text-xs capitalize"
                    style={{ color: getStatusColor(appointment.status) }}
                  >
                    {appointment.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {index < appointments.slice(0, 3).length - 1 && (
              <Divider className="mb-3" />
            )}
          </React.Fragment>
        ))}

        {appointments.length > 3 && (
          <Text className="text-center font-osregular text-sm text-gray-600 mt-1">
            +{appointments.length - 3} more appointments
          </Text>
        )}

        <TouchableOpacity
          onPress={() => router.push("/appointments/my-appointments")}
          className="self-center my-2"
        >
          <Text className="font-osmedium text-sm text-blue-500">View All</Text>
        </TouchableOpacity>

        {/* <CustomBtn
          title="Book Appointment"
          mode="outlined"
          className="mt-3"
          icon="calendar-plus"
          handlePress={() => router.push("/appointments/book")}
        /> */}
      </Card.Content>
    </Card>
  );
};

export default UpcomingAppointments;
