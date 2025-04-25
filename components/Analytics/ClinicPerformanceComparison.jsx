import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Card, Icon, ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';

const ClinicPerformanceComparison = ({ clinics }) => {
  if (!clinics || clinics.length === 0) return null;
  
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };
  
  // Find the maximum values for appointments and revenue
  const maxAppointments = Math.max(...clinics.map(clinic => clinic.appointmentsCount || 0));
  const maxRevenue = Math.max(...clinics.map(clinic => clinic.revenue || 0));
  
  // Calculate percentages
  const getAppointmentPercentage = (count) => {
    return maxAppointments > 0 ? count / maxAppointments : 0;
  };
  
  const getRevenuePercentage = (amount) => {
    return maxRevenue > 0 ? amount / maxRevenue : 0;
  };
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 400 }}
      className="mb-4"
    >
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={[colors.secondary[50], '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-secondary-100 rounded-full p-1.5 mr-2">
                  <Icon source="hospital-building" size={18} color={colors.secondary[300]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Clinic Performance</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-secondary-100 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/clinics')}
              >
                <Text className="text-xs font-ossemibold text-secondary-300 mr-1">View All</Text>
                <Icon source="chevron-right" size={14} color={colors.secondary[300]} />
              </TouchableOpacity>
            </View>
            
            {clinics.map((clinic, index) => (
              <MotiView
                key={clinic._id || index}
                from={{ opacity: 0, translateY: 5 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500, delay: index * 100 }}
                className="mb-4"
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(`/clinics/${clinic._id}`)}
                  className="bg-white rounded-xl p-3 shadow-sm"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    <Image
                      source={{ uri: clinic.images?.[0] || 'https://via.placeholder.com/100?text=Clinic' }}
                      className="w-12 h-12 rounded-full"
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                    />
                    <View className="ml-3 flex-1">
                      <Text className="font-ossemibold text-base text-gray-800">{clinic.name}</Text>
                      <Text className="font-osregular text-xs text-gray-600" numberOfLines={1}>
                        {clinic.address}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Icon source="star" size={16} color="#FFC107" />
                      <Text className="ml-1 font-ossemibold text-sm">
                        {clinic.rating?.toFixed(1) || 'N/A'}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="mb-2">
                    <View className="flex-row justify-between mb-1">
                      <Text className="font-osregular text-xs text-gray-600">Appointments</Text>
                      <Text className="font-ossemibold text-xs text-gray-800">{clinic.appointmentsCount || 0}</Text>
                    </View>
                    <ProgressBar
                      progress={getAppointmentPercentage(clinic.appointmentsCount || 0)}
                      color={colors.primary[400]}
                      className="h-2 rounded-full"
                    />
                  </View>
                  
                  <View>
                    <View className="flex-row justify-between mb-1">
                      <Text className="font-osregular text-xs text-gray-600">Revenue</Text>
                      <Text className="font-ossemibold text-xs text-gray-800">{formatCurrency(clinic.revenue || 0)}</Text>
                    </View>
                    <ProgressBar
                      progress={getRevenuePercentage(clinic.revenue || 0)}
                      color="#4CAF50"
                      className="h-2 rounded-full"
                    />
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/clinics')}
              className="flex-row items-center justify-center mt-2"
            >
              <Text className="font-ossemibold text-sm text-secondary-300">View All Clinics</Text>
              <Icon source="arrow-right" size={16} color={colors.secondary[300]} className="ml-1" />
            </TouchableOpacity>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default ClinicPerformanceComparison;
