import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Card, Avatar, Divider, Chip, Icon } from 'react-native-paper';
import { format } from 'date-fns';
import { router } from 'expo-router';
import colors from '../../../constants/colors';

const RecentAppointmentsList = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <Card className="rounded-xl overflow-hidden shadow-sm bg-white-400 mb-4">
        <Card.Content className="p-4">
          <Text className="text-lg font-pbold text-black-200 mb-3">Recent Appointments</Text>
          <View className="items-center py-6">
            <Icon source="calendar-blank" size={48} color={colors.gray[400]} />
            <Text className="text-gray-500 mt-2 text-center">No recent appointments found</Text>
          </View>
        </Card.Content>
      </Card>
    );
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'completed': return colors.primary[500];
      case 'cancelled': return colors.error;
      case 'rejected': return '#9C27B0'; // Purple
      case 'expired': return colors.gray[500];
      default: return colors.gray[500];
    }
  };
  
  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const formattedDate = format(appointmentDate, 'MMM dd, yyyy');
    
    return (
      <View className="mb-3">
        <View className="flex-row items-center">
          <Avatar.Image 
            size={40} 
            source={{ uri: item.patientImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.patientName) }} 
            className="mr-3"
          />
          <View className="flex-1">
            <Text className="font-ossemibold text-black-200">{item.patientName}</Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500 mr-2">{formattedDate} • {item.time}</Text>
              <Chip 
                mode="flat" 
                textStyle={{ fontSize: 10, color: 'white' }}
                style={{ 
                  backgroundColor: getStatusColor(item.status),
                  height: 20,
                  marginVertical: 0
                }}
              >
                {item.status}
              </Chip>
            </View>
          </View>
          <TouchableOpacity 
            className="p-2"
            onPress={() => router.push({
              pathname: `/appointments/${item._id}`,
              params: { appointmentId: item._id }
            })}
          >
            <Icon source="chevron-right" size={24} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>
        <Divider className="mt-3" />
      </View>
    );
  };
  
  return (
    <Card className="rounded-xl overflow-hidden shadow-sm bg-white-400 mb-4">
      <Card.Content className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-pbold text-black-200">Recent Appointments</Text>
          <TouchableOpacity 
            onPress={() => router.push('/appointments')}
            className="flex-row items-center"
          >
            <Text className="text-sm text-accent-DEFAULT mr-1">View All</Text>
            <Icon source="chevron-right" size={16} color={colors.accent.DEFAULT} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item._id}
          scrollEnabled={false}
        />
      </Card.Content>
    </Card>
  );
};

export default RecentAppointmentsList;
