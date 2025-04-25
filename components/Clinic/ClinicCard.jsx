import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Icon, Chip, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import { format } from 'date-fns';
import colors from '../../constants/colors';

const ClinicCard = ({ clinic }) => {
  const defaultImage = 'https://via.placeholder.com/300x200?text=Clinic+Image';
  
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      default: return colors.gray[500];
    }
  };
  
  const handlePress = () => {
    router.push({
      pathname: `/clinics/${clinic._id}`,
      params: { clinicId: clinic._id }
    });
  };
  
  return (
    <Card 
      className="rounded-xl overflow-hidden shadow-sm bg-white-400 mb-4"
      onPress={handlePress}
    >
      <View className="relative">
        <Image
          source={{ uri: clinic.images?.[0] || defaultImage }}
          className="w-full h-32"
          style={{ width: '100%', height: 120 }}
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-white rounded-full p-1">
          <View className="flex-row items-center bg-white px-2 py-1 rounded-full">
            <Icon source="star" size={16} color="#FFC107" />
            <Text className="ml-1 font-ossemibold text-xs">
              {clinic.stats.averageRating || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      
      <Card.Content className="p-3">
        <Text className="text-lg font-pbold text-black-200">{clinic.name}</Text>
        <Text className="text-xs text-gray-500 mb-2">{clinic.address}, {clinic.city}</Text>
        
        <View className="flex-row flex-wrap mb-3">
          <View className="flex-row items-center mr-4 mb-1">
            <Icon source="calendar-check" size={16} color={colors.gray[600]} />
            <Text className="ml-1 text-xs text-gray-600">
              {clinic.stats.totalAppointments} Appointments
            </Text>
          </View>
          
          <View className="flex-row items-center mr-4 mb-1">
            <Icon source="account-group" size={16} color={colors.gray[600]} />
            <Text className="ml-1 text-xs text-gray-600">
              {clinic.stats.uniquePatientCount} Patients
            </Text>
          </View>
          
          <View className="flex-row items-center mb-1">
            <Icon source="currency-inr" size={16} color={colors.gray[600]} />
            <Text className="ml-1 text-xs text-gray-600">
              {formatCurrency(clinic.stats.totalRevenue)}
            </Text>
          </View>
        </View>
        
        {clinic.nextAppointment ? (
          <View className="bg-gray-50 p-2 rounded-lg">
            <Text className="text-xs font-ossemibold text-gray-700 mb-1">Next Appointment</Text>
            <View className="flex-row items-center">
              <Avatar.Image 
                size={24} 
                source={{ uri: clinic.nextAppointment.patientImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(clinic.nextAppointment.patientName) }} 
                className="mr-2"
              />
              <View className="flex-1">
                <Text className="text-xs font-osregular">{clinic.nextAppointment.patientName}</Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-gray-500">
                    {format(new Date(clinic.nextAppointment.date), 'MMM dd')} • {clinic.nextAppointment.time}
                  </Text>
                  <Chip 
                    mode="flat" 
                    textStyle={{ fontSize: 8, color: 'white' }}
                    style={{ 
                      backgroundColor: getStatusColor(clinic.nextAppointment.status),
                      height: 16,
                      marginLeft: 4
                    }}
                  >
                    {clinic.nextAppointment.status}
                  </Chip>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-gray-50 p-2 rounded-lg items-center">
            <Text className="text-xs text-gray-500">No upcoming appointments</Text>
          </View>
        )}
        
        <TouchableOpacity 
          className="flex-row items-center justify-center mt-3 py-2 bg-accent-DEFAULT rounded-lg"
          onPress={handlePress}
        >
          <Text className="text-white font-ossemibold">View Details</Text>
          <Icon source="chevron-right" size={16} color="white" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

export default ClinicCard;
