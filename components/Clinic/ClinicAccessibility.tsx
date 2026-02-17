import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface ClinicAccessibilityProps {
  parking: {
    available: boolean;
    type?: "Free" | "Paid" | "Valet";
    details?: string;
  };
  setParking: (value: any) => void;
  accessibility: {
    wheelchairAccess: boolean;
    elevator: boolean;
    accessibleBathroom: boolean;
    otherFeatures: string[];
  };
  setAccessibility: (value: any) => void;
}

const ClinicAccessibility: React.FC<ClinicAccessibilityProps> = ({
  parking,
  setParking,
  accessibility,
  setAccessibility,
}) => {
  const toggleFeature = (feature: keyof typeof accessibility) => {
    if (feature === "otherFeatures") return;
    setAccessibility({
      ...accessibility,
      [feature]: !accessibility[feature],
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-pbold text-white mb-2">
          Accessibility & Parking
        </Text>
        <Text className="text-sky-200/70 text-sm font-pregular">
          Make your clinic accessible to everyone
        </Text>
      </View>

      {/* Parking Section */}
      <View className="bg-white/5 border border-white/10 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="parking"
              size={24}
              color={parking.available ? colors.sky[400] : colors.white}
            />
            <Text
              className={`font-pmedium ${
                parking.available ? "text-sky-400" : "text-white"
              }`}
            >
              Parking Available
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              setParking({ ...parking, available: !parking.available })
            }
            className={`w-12 h-6 rounded-full ${
              parking.available ? "bg-sky-500" : "bg-white/20"
            } justify-center ${parking.available ? "items-end" : "items-start"} px-1`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </TouchableOpacity>
        </View>

        {parking.available && (
          <>
            <View className="flex-row gap-2">
              {(["Free", "Paid", "Valet"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setParking({ ...parking, type })}
                  className={`flex-1 py-2.5 rounded-xl border ${
                    parking.type === type
                      ? "bg-sky-500/20 border-sky-500"
                      : "bg-white/5 border-white/20"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-pmedium text-sm ${
                      parking.type === type ? "text-sky-400" : "text-white/70"
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              className="bg-white/5 border border-white/20 rounded-xl p-3 text-white font-pregular"
              placeholder="Parking details (optional)"
              placeholderTextColor="rgba(186, 230, 253, 0.4)"
              value={parking.details}
              onChangeText={(text) => setParking({ ...parking, details: text })}
            />
          </>
        )}
      </View>

      {/* Accessibility Features */}
      <View className="gap-3">
        <Text className="text-white font-pmedium text-base ml-1">
          Accessibility Features
        </Text>

        <TouchableOpacity
          onPress={() => toggleFeature("wheelchairAccess")}
          className={`p-4 rounded-2xl border flex-row items-center justify-between ${
            accessibility.wheelchairAccess
              ? "bg-sky-500/20 border-sky-500"
              : "bg-white/5 border-white/10"
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="wheelchair-accessibility"
              size={24}
              color={
                accessibility.wheelchairAccess ? colors.sky[400] : colors.white
              }
            />
            <Text
              className={`font-pmedium ${
                accessibility.wheelchairAccess ? "text-sky-400" : "text-white"
              }`}
            >
              Wheelchair Access
            </Text>
          </View>
          <View
            className={`w-12 h-6 rounded-full ${
              accessibility.wheelchairAccess ? "bg-sky-500" : "bg-white/20"
            } justify-center ${accessibility.wheelchairAccess ? "items-end" : "items-start"} px-1`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleFeature("elevator")}
          className={`p-4 rounded-2xl border flex-row items-center justify-between ${
            accessibility.elevator
              ? "bg-sky-500/20 border-sky-500"
              : "bg-white/5 border-white/10"
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="elevator-passenger"
              size={24}
              color={accessibility.elevator ? colors.sky[400] : colors.white}
            />
            <Text
              className={`font-pmedium ${
                accessibility.elevator ? "text-sky-400" : "text-white"
              }`}
            >
              Elevator Available
            </Text>
          </View>
          <View
            className={`w-12 h-6 rounded-full ${
              accessibility.elevator ? "bg-sky-500" : "bg-white/20"
            } justify-center ${accessibility.elevator ? "items-end" : "items-start"} px-1`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleFeature("accessibleBathroom")}
          className={`p-4 rounded-2xl border flex-row items-center justify-between ${
            accessibility.accessibleBathroom
              ? "bg-sky-500/20 border-sky-500"
              : "bg-white/5 border-white/10"
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="human-wheelchair"
              size={24}
              color={
                accessibility.accessibleBathroom
                  ? colors.sky[400]
                  : colors.white
              }
            />
            <Text
              className={`font-pmedium ${
                accessibility.accessibleBathroom ? "text-sky-400" : "text-white"
              }`}
            >
              Accessible Bathroom
            </Text>
          </View>
          <View
            className={`w-12 h-6 rounded-full ${
              accessibility.accessibleBathroom ? "bg-sky-500" : "bg-white/20"
            } justify-center ${accessibility.accessibleBathroom ? "items-end" : "items-start"} px-1`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ClinicAccessibility;
