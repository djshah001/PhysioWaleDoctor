import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationsScreen = () => {
  const notifications = [
    {
      id: "1",
      title: "New Appointment",
      message: "You have a new appointment scheduled for tomorrow",
      time: "2 hours ago",
      type: "appointment",
    },
    {
      id: "2",
      title: "Reminder",
      message: "Upcoming session with patient in 1 hour",
      time: "5 hours ago",
      type: "reminder",
    },
  ];

  const renderNotification = ({ item }) => (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">
      <Text className="text-base font-bold text-gray-800 mb-1">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600 mb-2">{item.message}</Text>
      <Text className="text-xs text-gray-400">{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          className="flex-1"
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-400 font-regular">
            No notifications yet
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;