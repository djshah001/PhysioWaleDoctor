import React from "react";
import { View, Text } from "react-native";
import { Card, Title, Icon } from "react-native-paper";

const RevenueCard = ({ revenue = {} }) => {
  const { total = 0, thisMonth = 0, lastMonth = 0, growth = 0 } = revenue;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="mx-4 my-2 rounded-xl shadow-sm bg-white-100" elevation={2}>
      <Card.Content>
        <Title className="font-osbold text-lg text-gray-800 mb-2">
          Revenue Overview
        </Title>

        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text className="font-osregular text-sm text-gray-600">
            Total Revenue
          </Text>
          <Text className="font-osbold text-2xl text-blue-600 mt-1">
            {formatCurrency(total)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-1 bg-gray-50 p-3 rounded-lg mr-2">
            <Text className="font-osregular text-xs text-gray-600">
              This Month
            </Text>
            <Text className="font-ossemibold text-lg text-gray-800 mt-1">
              {formatCurrency(thisMonth)}
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 p-3 rounded-lg ml-2">
            <Text className="font-osregular text-xs text-gray-600">
              Last Month
            </Text>
            <Text className="font-ossemibold text-lg text-gray-800 mt-1">
              {formatCurrency(lastMonth)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mt-4">
          <Icon
            source={growth >= 0 ? "arrow-up-bold" : "arrow-down-bold"}
            size={20}
            color={growth >= 0 ? "#4CAF50" : "#F44336"}
          />
          <Text
            className="ml-1 font-ossemibold"
            style={{ color: growth >= 0 ? "#4CAF50" : "#F44336" }}
          >
            {Math.abs(growth)}%
          </Text>
          <Text className="ml-1 font-osregular text-sm text-gray-600">
            {growth >= 0 ? "increase" : "decrease"} from last month
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default RevenueCard;
