import React from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppointmentConfig, HomeVisitConfig } from "~/types";
import colors from "tailwindcss/colors";

interface ClinicConfigProps {
  appointmentConfig: Partial<AppointmentConfig>;
  setAppointmentConfig: (value: Partial<AppointmentConfig>) => void;
  homeVisitConfig: Partial<HomeVisitConfig>;
  setHomeVisitConfig: (value: Partial<HomeVisitConfig>) => void;
}

const ClinicConfig: React.FC<ClinicConfigProps> = ({
  appointmentConfig,
  setAppointmentConfig,
  homeVisitConfig,
  setHomeVisitConfig,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Clinic Configuration
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Configure appointment and home visit settings
        </Text>
      </View>

      {/* Appointment Configuration */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-4">
        <View className="flex-row items-center gap-2 mb-2">
          <MaterialCommunityIcons
            name="calendar-clock"
            size={22}
            color="#4f46e5"
          />
          <Text className="text-lg font-bold text-gray-900">
            Appointment Settings
          </Text>
        </View>

        {/* Slot Duration */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2">
            Slot Duration (minutes)
          </Text>
          <TextInput
            value={appointmentConfig.slotDuration?.toString() || "30"}
            onChangeText={(text) =>
              setAppointmentConfig({
                ...appointmentConfig,
                slotDuration: parseInt(text) || 30,
              })
            }
            keyboardType="number-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
            placeholder="30"
          />
        </View>

        {/* Buffer Time */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2">
            Buffer Time (minutes)
          </Text>
          <TextInput
            value={appointmentConfig.bufferTime?.toString() || "5"}
            onChangeText={(text) =>
              setAppointmentConfig({
                ...appointmentConfig,
                bufferTime: parseInt(text) || 5,
              })
            }
            keyboardType="number-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
            placeholder="5"
          />
        </View>

        {/* Advance Booking Limit */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2">
            Advance Booking Limit (days)
          </Text>
          <TextInput
            value={appointmentConfig.advanceBookingLimit?.toString() || "30"}
            onChangeText={(text) =>
              setAppointmentConfig({
                ...appointmentConfig,
                advanceBookingLimit: parseInt(text) || 30,
              })
            }
            keyboardType="number-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
            placeholder="30"
          />
        </View>

        {/* Instant Booking */}
        <View
          className={`p-3 rounded-xl border flex-row items-center justify-between ${
            appointmentConfig.instantBooking
              ? "bg-indigo-50 border-indigo-500"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold ${
              appointmentConfig.instantBooking
                ? "text-indigo-700"
                : "text-gray-700"
            }`}
          >
            Allow Instant Booking
          </Text>
          {/* <View
            className={`w-10 h-5 rounded-full ${
              appointmentConfig.instantBooking ? "bg-indigo-500" : "bg-gray-300"
            } justify-center ${appointmentConfig.instantBooking ? "items-end" : "items-start"} px-0.5`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </View> */}
          <Switch
            trackColor={{ false: colors.gray[200], true: colors.indigo[500] }}
            thumbColor={
              appointmentConfig.instantBooking ? colors.white : colors.gray[200]
            }
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            ios_backgroundColor="#3e3e3e"
            value={appointmentConfig.instantBooking}
            onValueChange={(value) =>
              setAppointmentConfig({
                ...appointmentConfig,
                instantBooking: value,
              })
            }
          />
        </View>

        {/* Virtual Consultation */}
        {/* <TouchableOpacity
          onPress={() =>
            setAppointmentConfig({
              ...appointmentConfig,
              isVirtualConsultationAvailable:
                !appointmentConfig.isVirtualConsultationAvailable,
            })
          }
          className={`p-3 rounded-xl border flex-row items-center justify-between ${
            appointmentConfig.isVirtualConsultationAvailable
              ? "bg-indigo-50 border-indigo-500"
              : "bg-gray-50 border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              appointmentConfig.isVirtualConsultationAvailable
                ? "text-indigo-700"
                : "text-gray-700"
            }`}
          >
            Virtual Consultation Available
          </Text>
          <View
            className={`w-10 h-5 rounded-full ${
              appointmentConfig.isVirtualConsultationAvailable
                ? "bg-indigo-500"
                : "bg-gray-300"
            } justify-center ${appointmentConfig.isVirtualConsultationAvailable ? "items-end" : "items-start"} px-0.5`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </View>
        </TouchableOpacity> */}

        <View
          className={`p-3 rounded-xl border flex-row items-center justify-between ${
            appointmentConfig.instantBooking
              ? "bg-indigo-50 border-indigo-500"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold ${
              appointmentConfig.instantBooking
                ? "text-indigo-700"
                : "text-gray-700"
            }`}
          >
            Allow Virtual Consultation
          </Text>
          <Switch
            trackColor={{ false: colors.gray[200], true: colors.indigo[500] }}
            thumbColor={
              appointmentConfig.instantBooking ? colors.white : colors.gray[200]
            }
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            ios_backgroundColor="#3e3e3e"
            value={appointmentConfig.isVirtualConsultationAvailable}
            onValueChange={(value) =>
              setAppointmentConfig({
                ...appointmentConfig,
                isVirtualConsultationAvailable: value,
              })
            }
          />
        </View>
      </View>

      {/* Home Visit Configuration */}
      <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-4">
        <View className="flex-row items-center gap-2 mb-2">
          <MaterialCommunityIcons name="home-heart" size={22} color="#10b981" />
          <Text className="text-lg font-bold text-gray-900">
            Home Visit Settings
          </Text>
        </View>

        {/* Available Toggle */}
        <TouchableOpacity
          onPress={() =>
            setHomeVisitConfig({
              ...homeVisitConfig,
              isAvailable: !homeVisitConfig.isAvailable,
            })
          }
          className={`p-3 rounded-xl border flex-row items-center justify-between ${
            homeVisitConfig.isAvailable
              ? "bg-green-50 border-green-500"
              : "bg-gray-50 border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              homeVisitConfig.isAvailable ? "text-green-700" : "text-gray-700"
            }`}
          >
            Home Visits Available
          </Text>
          <View
            className={`w-10 h-5 rounded-full ${
              homeVisitConfig.isAvailable ? "bg-green-500" : "bg-gray-300"
            } justify-center ${homeVisitConfig.isAvailable ? "items-end" : "items-start"} px-0.5`}
          >
            <View className="w-4 h-4 rounded-full bg-white" />
          </View>
        </TouchableOpacity>

        {homeVisitConfig.isAvailable && (
          <>
            {/* Radius */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">
                Service Radius (km)
              </Text>
              <TextInput
                value={homeVisitConfig.radiusKm?.toString() || "5"}
                onChangeText={(text) =>
                  setHomeVisitConfig({
                    ...homeVisitConfig,
                    radiusKm: parseFloat(text) || 5,
                  })
                }
                keyboardType="decimal-pad"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
                placeholder="5"
              />
            </View>

            {/* Travel Fee */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">
                Travel Fee (₹)
              </Text>
              <TextInput
                value={homeVisitConfig.travelFee?.toString() || "0"}
                onChangeText={(text) =>
                  setHomeVisitConfig({
                    ...homeVisitConfig,
                    travelFee: parseFloat(text) || 0,
                  })
                }
                keyboardType="decimal-pad"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
                placeholder="0"
              />
            </View>

            {/* Min Booking Amount */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">
                Minimum Booking Amount (₹)
              </Text>
              <TextInput
                value={homeVisitConfig.minBookingAmount?.toString() || "0"}
                onChangeText={(text) =>
                  setHomeVisitConfig({
                    ...homeVisitConfig,
                    minBookingAmount: parseFloat(text) || 0,
                  })
                }
                keyboardType="decimal-pad"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
                placeholder="0"
              />
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default ClinicConfig;
