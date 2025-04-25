import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Card,
  Avatar,
  Button,
  Menu,
  Divider,
  IconButton,
} from "react-native-paper";
import { format, parseISO } from "date-fns";
import colors from "../../constants/colors";
import { Image } from "expo-image";

const AppointmentCard = ({ appointment, onPress, onUpdateStatus }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusActions = () => {
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

  const statusActions = getStatusActions();
  

  return (
    <Card className="mb-4 rounded-xl bg-white shadow-sm" onPress={onPress}>
      <Card.Content>
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            {/* <Avatar.Text
              size={40}
              label={appointment.userId?.name?.charAt(0) || "U"}
              backgroundColor={colors.primary[100]}
              color={colors.primary[700]}
            /> */}
            <Image
              source={{
                uri:
                  appointment.userId?.profilePic ||
                  "https://via.placeholder.com/40",
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-base font-semibold text-gray-900">
                {appointment.userId?.name || "Unknown Patient"}
              </Text>
              <Text className="text-xs text-gray-500">
                ID: {appointment._id.slice(-6)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: getStatusColor(appointment.status) }}
            />
            <Text
              className="text-sm font-medium"
              style={{ color: getStatusColor(appointment.status) }}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        <Divider className="my-3" />

        <View className="mb-3">
          <View className="flex-row mb-2">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Date</Text>
              <Text className="text-sm font-medium text-gray-900">
                {formatDate(appointment.date)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Time</Text>
              <Text className="text-sm font-medium text-gray-900">
                {formatTime(appointment.time)}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Clinic</Text>
              <Text
                className="text-sm font-medium text-gray-900"
                numberOfLines={1}
              >
                {appointment.clinicId?.name || "Unknown Clinic"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Service</Text>
              <Text
                className="text-sm font-medium text-gray-900"
                numberOfLines={1}
              >
                {appointment.serviceId?.name || "Unknown Service"}
              </Text>
            </View>
          </View>
        </View>

        {statusActions.length > 0 && (
          <View className="flex-row justify-between items-center mt-2">
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <Button
                  mode="outlined"
                  onPress={openMenu}
                  className="rounded-lg"
                  labelStyle={{ color: colors.primary[600], fontSize: 14 }}
                  icon="chevron-down"
                  contentStyle={{ flexDirection: "row-reverse" }}
                  style={{ borderColor: colors.primary[200] }}
                >
                  Update Status
                </Button>
              }
            >
              {statusActions.map((action) => (
                <Menu.Item
                  key={action.value}
                  onPress={() => {
                    closeMenu();
                    onUpdateStatus(action.value);
                  }}
                  title={action.label}
                />
              ))}
            </Menu>

            <IconButton
              icon="arrow-right"
              size={20}
              onPress={onPress}
              className="bg-primary-50"
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default AppointmentCard;
