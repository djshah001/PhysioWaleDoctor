import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Animated, { FadeInDown } from "react-native-reanimated";

import { DaySchedule, AppointmentConfig, HomeVisitConfig } from "~/types";
import ClinicTimings from "./ClinicTimings";
import ClinicServices from "./ClinicServices";

interface ScheduleServicesProps {
  // Timings
  open24hrs: boolean;
  setOpen24hrs: (value: boolean) => void;
  timing: {
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
  };
  setTiming: (value: {
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
  }) => void;
  // Appointment Config
  appointmentConfig: Partial<AppointmentConfig>;
  setAppointmentConfig: (value: Partial<AppointmentConfig>) => void;
  // Home Visit Config
  homeVisitConfig: Partial<HomeVisitConfig>;
  setHomeVisitConfig: (value: Partial<HomeVisitConfig>) => void;
  // Services
  services: {
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }[];
  setServices: (value: any[]) => void;
}

export default function ScheduleServices({
  open24hrs,
  setOpen24hrs,
  timing,
  setTiming,
  appointmentConfig,
  setAppointmentConfig,
  homeVisitConfig,
  setHomeVisitConfig,
  services,
  setServices,
}: ScheduleServicesProps) {
  const [appointmentCollapsed, setAppointmentCollapsed] = useState(true);
  const [homeVisitCollapsed, setHomeVisitCollapsed] = useState(true);
  const [servicesCollapsed, setServicesCollapsed] = useState(true);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} className="mb-6">
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar" size={28} color="#0ea5e9" />
          <Text className="text-2xl font-bold text-gray-900 ml-3">
            Schedule & Services
          </Text>
        </View>
        <Text className="text-gray-500 text-sm">
          Set your operating hours and configure appointments
        </Text>
      </Animated.View>

      <ClinicTimings
        open24hrs={open24hrs}
        setOpen24hrs={setOpen24hrs}
        timing={timing}
        setTiming={setTiming}
      />

      {/* Appointment Configuration (Collapsible) */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        className="mb-6"
      >
        <TouchableOpacity
          onPress={() => setAppointmentCollapsed(!appointmentCollapsed)}
          className="flex-row items-center justify-between mb-3 bg-indigo-50 rounded-xl px-4 py-3"
        >
          <View className="flex-row items-center flex-1">
            <MaterialCommunityIcons
              name="calendar-clock"
              size={24}
              color="#4f46e5"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Appointment Settings
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                Configure booking preferences
              </Text>
            </View>
          </View>
          <Ionicons
            name={appointmentCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>

        <Collapsible collapsed={appointmentCollapsed}>
          <View className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            {/* Slot Duration */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Slot Duration (minutes)
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#6b7280"
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="30"
                  value={appointmentConfig.slotDuration?.toString() || ""}
                  onChangeText={(text) =>
                    setAppointmentConfig({
                      ...appointmentConfig,
                      slotDuration: parseInt(text) || 30,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Buffer Time */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Buffer Time (minutes)
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={20}
                  color="#6b7280"
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="5"
                  value={appointmentConfig.bufferTime?.toString() || ""}
                  onChangeText={(text) =>
                    setAppointmentConfig({
                      ...appointmentConfig,
                      bufferTime: parseInt(text) || 5,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Advance Booking Limit */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Advance Booking Limit (days)
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                <MaterialCommunityIcons
                  name="calendar-range"
                  size={20}
                  color="#6b7280"
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="30"
                  value={
                    appointmentConfig.advanceBookingLimit?.toString() || ""
                  }
                  onChangeText={(text) =>
                    setAppointmentConfig({
                      ...appointmentConfig,
                      advanceBookingLimit: parseInt(text) || 30,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Instant Booking */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  Instant Booking
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Allow patients to book without approval
                </Text>
              </View>
              <Switch
                value={appointmentConfig.instantBooking || false}
                onValueChange={(value) =>
                  setAppointmentConfig({
                    ...appointmentConfig,
                    instantBooking: value,
                  })
                }
                trackColor={{ false: "#d1d5db", true: "#818cf8" }}
                thumbColor={
                  appointmentConfig.instantBooking ? "#4f46e5" : "#f3f4f6"
                }
              />
            </View>

            {/* Virtual Consultation */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  Virtual Consultation
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Offer online video consultations
                </Text>
              </View>
              <Switch
                value={
                  appointmentConfig.isVirtualConsultationAvailable || false
                }
                onValueChange={(value) =>
                  setAppointmentConfig({
                    ...appointmentConfig,
                    isVirtualConsultationAvailable: value,
                  })
                }
                trackColor={{ false: "#d1d5db", true: "#818cf8" }}
                thumbColor={
                  appointmentConfig.isVirtualConsultationAvailable
                    ? "#4f46e5"
                    : "#f3f4f6"
                }
              />
            </View>
          </View>
        </Collapsible>
      </Animated.View>

      {/* Home Visit Configuration (Collapsible) */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        className="mb-6"
      >
        <TouchableOpacity
          onPress={() => setHomeVisitCollapsed(!homeVisitCollapsed)}
          className="flex-row items-center justify-between mb-3 bg-sky-50 rounded-xl px-4 py-3"
        >
          <View className="flex-row items-center flex-1">
            <MaterialCommunityIcons
              name="home-heart"
              size={24}
              color="#0ea5e9"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Home Visit Service
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                Offer at-home consultations
              </Text>
            </View>
          </View>
          <Ionicons
            name={homeVisitCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>

        <Collapsible collapsed={homeVisitCollapsed}>
          <View className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            {/* Available Toggle */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  Offer Home Visits
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Visit patients at their homes
                </Text>
              </View>
              <Switch
                value={homeVisitConfig.isAvailable || false}
                onValueChange={(value) =>
                  setHomeVisitConfig({
                    ...homeVisitConfig,
                    isAvailable: value,
                  })
                }
                trackColor={{ false: "#d1d5db", true: "#818cf8" }}
                thumbColor={homeVisitConfig.isAvailable ? "#4f46e5" : "#f3f4f6"}
              />
            </View>

            {homeVisitConfig.isAvailable && (
              <>
                {/* Service Radius */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Service Radius (km)
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                    <MaterialCommunityIcons
                      name="map-marker-radius"
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-900"
                      placeholder="5"
                      value={homeVisitConfig.radiusKm?.toString() || ""}
                      onChangeText={(text) =>
                        setHomeVisitConfig({
                          ...homeVisitConfig,
                          radiusKm: parseInt(text) || 5,
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Travel Fee */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Travel Fee (₹)
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-900"
                      placeholder="200"
                      value={homeVisitConfig.travelFee?.toString() || ""}
                      onChangeText={(text) =>
                        setHomeVisitConfig({
                          ...homeVisitConfig,
                          travelFee: parseInt(text) || 0,
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Minimum Booking Amount */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Minimum Booking Amount (₹)
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                    <MaterialCommunityIcons
                      name="cash-multiple"
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-900"
                      placeholder="500"
                      value={homeVisitConfig.minBookingAmount?.toString() || ""}
                      onChangeText={(text) =>
                        setHomeVisitConfig({
                          ...homeVisitConfig,
                          minBookingAmount: parseInt(text) || 0,
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </Collapsible>
      </Animated.View>

      {/* Services (Collapsible) */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        className="mb-6"
      >
        <TouchableOpacity
          onPress={() => setServicesCollapsed(!servicesCollapsed)}
          className="flex-row items-center justify-between mb-3 bg-emerald-50 rounded-xl px-4 py-3"
        >
          <View className="flex-row items-center flex-1">
            <MaterialCommunityIcons
              name="medical-bag"
              size={24}
              color="#10b981"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Services Offered (Optional)
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                {services.length > 0
                  ? `${services.length} service${services.length > 1 ? "s" : ""} added`
                  : "Add services you provide"}
              </Text>
            </View>
          </View>
          <Ionicons
            name={servicesCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>

        <Collapsible collapsed={servicesCollapsed}>
          <ClinicServices services={services} setServices={setServices} />
        </Collapsible>
      </Animated.View>
    </ScrollView>
  );
}
