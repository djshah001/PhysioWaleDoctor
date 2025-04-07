import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Card, Chip, Divider, IconButton } from "react-native-paper";
import colors from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const ClinicDetails = ({ clinic, onClose }) => {
  // Format timing display
  const formatTiming = (day) => {
    if (!clinic.timing || !clinic.timing[day]) return "Not available";
    const dayData = clinic.timing[day];
    return dayData.isClosed ? "Closed" : `${dayData.opening} - ${dayData.closing}`;
  };

  // Check if clinic is currently open
  const isCurrentlyOpen = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = days[new Date().getDay()];
    
    if (!clinic.timing || !clinic.timing[today] || clinic.timing[today].isClosed) {
      return false;
    }
    
    return true; // Simplified for now - would need actual time comparison
  };

  return (
    <Card className="rounded-lg overflow-hidden">
      <View className="relative">
        <Image
          source={{ uri: clinic.images?.[0] || "https://via.placeholder.com/400x200?text=No+Image" }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 flex-row">
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            className="bg-white/80 rounded-full"
          />
        </View>
        {isCurrentlyOpen() ? (
          <Chip 
            className="absolute bottom-2 left-2 bg-green-500" 
            textStyle={{ color: "white" }}
          >
            Open Now
          </Chip>
        ) : (
          <Chip 
            className="absolute bottom-2 left-2 bg-red-500" 
            textStyle={{ color: "white" }}
          >
            Closed
          </Chip>
        )}
      </View>
      
      <ScrollView className="p-4 max-h-96">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-pbold">{clinic.name}</Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <Text className="ml-1 font-bold">{clinic.rating?.overall || "New"}</Text>
            <Text className="text-gray-500 text-xs ml-1">
              ({clinic.rating?.reviewCount || 0} reviews)
            </Text>
          </View>
        </View>
        
        <Text className="text-gray-500 mt-1">{clinic.address}</Text>
        
        <View className="flex-row items-center mt-2">
          <MaterialCommunityIcons name="map-marker-distance" size={18} color={colors.primary[500]} />
          <Text className="ml-1">{clinic.distanceInKm?.toFixed(1) || "?"} km away</Text>
        </View>
        
        <Divider className="my-3" />
        
        <Text className="font-pbold text-lg">Services</Text>
        <View className="flex-row flex-wrap mt-1">
          {clinic.services?.map((service, index) => (
            <Chip 
              key={service._id || index} 
              className="mr-2 mt-2 bg-gray-100"
            >
              {service.name} {service.price > 0 ? `(₹${service.price})` : "(Free)"}
            </Chip>
          ))}
        </View>
        
        <Text className="font-pbold text-lg mt-4">Specializations</Text>
        <View className="flex-row flex-wrap mt-1">
          {clinic.specializations?.map((spec, index) => (
            <Chip 
              key={index} 
              className="mr-2 mt-2 bg-blue-100"
            >
              {spec}
            </Chip>
          ))}
        </View>
        
        <Text className="font-pbold text-lg mt-4">Facilities</Text>
        <View className="flex-row flex-wrap mt-1">
          {clinic.facilities?.map((facility, index) => (
            <Chip 
              key={index} 
              className="mr-2 mt-2 bg-green-100"
            >
              {facility}
            </Chip>
          ))}
        </View>
        
        <Text className="font-pbold text-lg mt-4">Hours</Text>
        <View className="mt-1">
          <View className="flex-row justify-between py-1">
            <Text>Sunday</Text>
            <Text>{formatTiming("sunday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Monday</Text>
            <Text>{formatTiming("monday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Tuesday</Text>
            <Text>{formatTiming("tuesday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Wednesday</Text>
            <Text>{formatTiming("wednesday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Thursday</Text>
            <Text>{formatTiming("thursday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Friday</Text>
            <Text>{formatTiming("friday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Saturday</Text>
            <Text>{formatTiming("saturday")}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View className="p-4 flex-row justify-between">
        <TouchableOpacity 
          className="bg-gray-200 rounded-full px-6 py-3 flex-row items-center"
          onPress={() => {
            // Handle call action
            // You can use Linking.openURL(`tel:${clinic.phoneNumber}`)
          }}
        >
          <MaterialCommunityIcons name="phone" size={18} color={colors.black[300]} />
          <Text className="ml-2 font-bold">Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-primary-500 rounded-full px-6 py-3 flex-row items-center"
          onPress={() => {
            // Navigate to booking screen with clinic data
            router.push({
              pathname: "/booking",
              params: { clinicId: clinic._id }
            });
          }}
        >
          <MaterialCommunityIcons name="calendar-check" size={18} color="white" />
          <Text className="ml-2 font-bold text-white">Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default ClinicDetails;