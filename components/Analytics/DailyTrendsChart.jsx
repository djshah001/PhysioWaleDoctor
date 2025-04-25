import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';

const DailyTrendsChart = ({ data, timeframe }) => {
  if (!data || data.length === 0) return null;
  
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };
  
  // Find the maximum values for appointments and revenue
  const maxCount = Math.max(...data.map(day => day.count || 0));
  const maxRevenue = Math.max(...data.map(day => day.revenue || 0));
  
  // Calculate bar heights
  const getAppointmentBarHeight = (count) => {
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  };
  
  // Calculate total appointments and revenue
  const totalAppointments = data.reduce((sum, day) => sum + (day.count || 0), 0);
  const totalRevenue = data.reduce((sum, day) => sum + (day.revenue || 0), 0);
  
  // Get timeframe label
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'Current Period';
    }
  };
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 300 }}
      className="mb-4"
    >
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={['#F8F9FF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-primary-100 rounded-full p-1.5 mr-2">
                  <Icon source="chart-bar" size={18} color={colors.primary[400]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Daily Activity</Text>
              </View>
              
              <TouchableOpacity className="bg-primary-50 rounded-full px-2 py-1 flex-row items-center">
                <Text className="text-xs font-ossemibold text-primary-400 mr-1">{getTimeframeLabel()}</Text>
                <Icon source="calendar" size={14} color={colors.primary[400]} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl text-primary-400">
                  {totalAppointments}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Total Appointments
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl text-green-600">
                  {formatCurrency(totalRevenue)}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Total Revenue
                </Text>
              </View>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <View className="h-[180px] flex-row">
                {data.map((day, index) => (
                  <View key={index} className="items-center mx-2 w-12">
                    <View className="flex-1 w-full items-center justify-end">
                      {/* Appointment bar */}
                      <MotiView
                        from={{ height: 0 }}
                        animate={{ height: `${getAppointmentBarHeight(day.count)}%` }}
                        transition={{ type: 'timing', duration: 800, delay: index * 30 }}
                        style={{ 
                          width: 12, 
                          backgroundColor: day.count > 0 ? colors.primary[400] : '#E0E0E0',
                          borderRadius: 6
                        }}
                      />
                      
                      {/* Appointment count */}
                      {day.count > 0 && (
                        <Text className="text-xs font-ossemibold text-primary-400 absolute -top-5">
                          {day.count}
                        </Text>
                      )}
                    </View>
                    
                    <View className="mt-2 items-center">
                      <Text className="text-xs font-ossemibold text-gray-800">
                        {day.day}
                      </Text>
                      <Text className="text-[10px] font-osregular text-gray-500">
                        {day.weekday}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            
            <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg mt-2">
              <View className="flex-row items-center">
                <Icon source="information-outline" size={20} color={colors.primary[400]} className="mr-2" />
                <Text className="font-osregular text-xs text-gray-600">
                  Scroll horizontally to see all days
                </Text>
              </View>
              <Text className="font-ossemibold text-sm text-primary-400">
                {getTimeframeLabel()}
              </Text>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default DailyTrendsChart;
