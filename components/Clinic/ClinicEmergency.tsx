import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlassInput from "../GlassInput";
import colors from "tailwindcss/colors";

interface ClinicEmergencyProps {
  emergencyServices: {
    available: boolean;
    contactNumber?: string;
  };
  setEmergencyServices: (value: any) => void;
}

const ClinicEmergency: React.FC<ClinicEmergencyProps> = ({
  emergencyServices,
  setEmergencyServices,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-pbold text-white mb-2">
          Emergency Services
        </Text>
        <Text className="text-sky-200/70 text-sm font-pregular">
          Do you provide emergency physiotherapy services?
        </Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          setEmergencyServices({
            ...emergencyServices,
            available: !emergencyServices.available,
          })
        }
        className={`p-4 rounded-2xl border flex-row items-center justify-between ${
          emergencyServices.available
            ? "bg-rose-500/20 border-rose-500"
            : "bg-white/5 border-white/10"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="ambulance"
            size={28}
            color={
              emergencyServices.available ? colors.rose[400] : colors.white
            }
          />
          <View>
            <Text
              className={`font-pmedium text-base ${
                emergencyServices.available ? "text-rose-400" : "text-white"
              }`}
            >
              Emergency Services Available
            </Text>
            <Text className="text-white/50 text-xs font-pregular mt-0.5">
              24/7 emergency physiotherapy care
            </Text>
          </View>
        </View>
        <View
          className={`w-12 h-6 rounded-full ${
            emergencyServices.available ? "bg-rose-500" : "bg-white/20"
          } justify-center ${emergencyServices.available ? "items-end" : "items-start"} px-1`}
        >
          <View className="w-4 h-4 rounded-full bg-white" />
        </View>
      </TouchableOpacity>

      {emergencyServices.available && (
        <Animated.View entering={FadeInDown} className="gap-3">
          <Text className="text-white/70 text-sm font-pmedium ml-1">
            Emergency Contact Number
          </Text>
          <GlassInput
            icon="phone-alert"
            iconFamily="MaterialCommunityIcons"
            placeholder="Emergency contact number"
            value={emergencyServices.contactNumber || ""}
            onChangeText={(text) =>
              setEmergencyServices({
                ...emergencyServices,
                contactNumber: text,
              })
            }
            keyboardType="phone-pad"
          />
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3">
            <Text className="text-amber-400 text-xs font-pmedium">
              💡 This number will be displayed for emergency contacts
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default ClinicEmergency;
