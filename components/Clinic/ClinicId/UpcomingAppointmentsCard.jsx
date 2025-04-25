import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Card, Icon, Divider } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../../constants/colors';

const UpcomingAppointmentsCard = ({ appointments }) => {
  if (!appointments || appointments.length === 0) return null;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Status colors and icons
  const statusInfo = {
    pending: {
      color: '#FFC107',
      icon: 'clock-outline',
      label: 'Pending'
    },
    confirmed: {
      color: '#4CAF50',
      icon: 'check-circle',
      label: 'Confirmed'
    }
  };
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 350 }}
      className="mb-4"
    >
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={[colors.primary[50], '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-primary-100 rounded-full p-1.5 mr-2">
                  <Icon source="calendar-clock" size={18} color={colors.primary[400]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Upcoming Appointments</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-primary-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/appointments')}
              >
                <Text className="text-xs font-ossemibold text-primary-400 mr-1">View All</Text>
                <Icon source="chevron-right" size={14} color={colors.primary[400]} />
              </TouchableOpacity>
            </View>
            
            {appointments.map((appointment, index) => (
              <MotiView
                key={appointment._id}
                from={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: index * 100 }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(`/appointments/${appointment._id}`)}
                  className="bg-white rounded-xl p-3 mb-3 shadow-sm"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-center">
                    <Image
                      source={{ 
                        uri: appointment.patientImage || 'https://via.placeholder.com/100?text=Patient' 
                      }}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    <View className="ml-3 flex-1">
                      <Text className="font-ossemibold text-base text-gray-800">
                        {appointment.patientName}
                      </Text>
                      
                      <View className="flex-row items-center mt-1">
                        <Icon source="calendar" size={14} color={colors.gray[500]} />
                        <Text className="text-xs font-osregular text-gray-500 ml-1">
                          {formatDate(appointment.date)}
                        </Text>
                        
                        <Icon source="clock-outline" size={14} color={colors.gray[500]} className="ml-2" />
                        <Text className="text-xs font-osregular text-gray-500 ml-1">
                          {appointment.time}
                        </Text>
                      </View>
                    </View>
                    
                    <View 
                      className="px-2 py-1 rounded-full flex-row items-center"
                      style={{ backgroundColor: `${statusInfo[appointment.status]?.color}20` }}
                    >
                      <Icon 
                        source={statusInfo[appointment.status]?.icon} 
                        size={14} 
                        color={statusInfo[appointment.status]?.color} 
                      />
                      <Text 
                        className="text-xs font-ossemibold ml-1"
                        style={{ color: statusInfo[appointment.status]?.color }}
                      >
                        {statusInfo[appointment.status]?.label}
                      </Text>
                    </View>
                  </View>
                  
                  {appointment.service && (
                    <View className="mt-2 pt-2 border-t border-gray-100">
                      <Text className="text-xs font-osregular text-gray-500">
                        Service: <Text className="font-ossemibold text-gray-700">{appointment.service}</Text>
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                {index < appointments.length - 1 && <View className="h-1" />}
              </MotiView>
            ))}
            
            <TouchableOpacity 
              className="flex-row items-center justify-center mt-2"
              onPress={() => router.push('/appointments')}
            >
              <Text className="font-ossemibold text-sm text-primary-400">Manage All Appointments</Text>
              <Icon source="arrow-right" size={16} color={colors.primary[400]} className="ml-1" />
            </TouchableOpacity>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default UpcomingAppointmentsCard;
