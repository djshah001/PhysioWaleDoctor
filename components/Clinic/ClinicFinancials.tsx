import React from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ClinicFinancialsProps {
  platformCommissionRate: number;
  setPlatformCommissionRate: (value: number) => void;
  gstNumber: string;
  setGstNumber: (value: string) => void;
}

const ClinicFinancials: React.FC<ClinicFinancialsProps> = ({
  platformCommissionRate,
  setPlatformCommissionRate,
  gstNumber,
  setGstNumber,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Financial Information
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Platform commission and tax details (optional)
        </Text>
      </View>

      {/* Platform Commission */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="percent-outline"
            size={22}
            color="#4f46e5"
          />
          <Text className="text-lg font-bold text-gray-900">
            Platform Commission
          </Text>
        </View>
        <Text className="text-gray-500 text-xs">
          Percentage of revenue shared with the platform (default: 10%)
        </Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            value={platformCommissionRate.toString()}
            onChangeText={(text) =>
              setPlatformCommissionRate(parseFloat(text) || 10)
            }
            keyboardType="decimal-pad"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
            placeholder="10"
          />
          <Text className="text-gray-600 font-semibold text-lg">%</Text>
        </View>
      </View>

      {/* GST Number */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="file-document-outline"
            size={22}
            color="#10b981"
          />
          <Text className="text-lg font-bold text-gray-900">GST Number</Text>
        </View>
        <Text className="text-gray-500 text-xs">
          15-digit GST registration number (optional)
        </Text>
        <TextInput
          value={gstNumber}
          onChangeText={(text) => setGstNumber(text.toUpperCase())}
          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
          placeholder="27AABCU9603R1ZM"
          maxLength={15}
          autoCapitalize="characters"
        />
        <Text className="text-gray-400 text-xs">
          Format: 2 digits + 10 alphanumeric + 1 digit + Z + 1 alphanumeric
        </Text>
      </View>
    </Animated.View>
  );
};

export default ClinicFinancials;
