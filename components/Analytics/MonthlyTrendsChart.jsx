import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';

const MonthlyTrendsChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };
  
  // Find the maximum values for appointments and revenue
  const maxCount = Math.max(...data.map(month => month.count || 0));
  const maxRevenue = Math.max(...data.map(month => month.revenue || 0));
  
  // Calculate bar heights
  const getAppointmentBarHeight = (count) => {
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  };
  
  const getRevenueBarHeight = (revenue) => {
    return maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  };
  
  // Calculate total appointments and revenue
  const totalAppointments = data.reduce((sum, month) => sum + (month.count || 0), 0);
  const totalRevenue = data.reduce((sum, month) => sum + (month.revenue || 0), 0);
  
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
                <View className="bg-secondary-100 rounded-full p-1.5 mr-2">
                  <Icon source="chart-line" size={18} color={colors.secondary[300]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Monthly Trends</Text>
              </View>
              
              <TouchableOpacity className="bg-secondary-50 rounded-full px-2 py-1 flex-row items-center">
                <Text className="text-xs font-ossemibold text-secondary-300 mr-1">This Year</Text>
                <Icon source="calendar" size={14} color={colors.secondary[300]} />
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
            
            <View className="h-[200px] mt-4">
              <View className="flex-row justify-between h-full">
                {data.map((month, index) => (
                  <View key={index} className="items-center flex-1">
                    <View className="flex-1 w-full items-center justify-end">
                      {/* Revenue bar */}
                      <MotiView
                        from={{ height: 0 }}
                        animate={{ height: `${getRevenueBarHeight(month.revenue)}%` }}
                        transition={{ type: 'timing', duration: 1000, delay: index * 50 }}
                        className="w-3 bg-green-500 rounded-t-md mx-0.5"
                        style={{ opacity: 0.7 }}
                      />
                      
                      {/* Appointment bar */}
                      <MotiView
                        from={{ height: 0 }}
                        animate={{ height: `${getAppointmentBarHeight(month.count)}%` }}
                        transition={{ type: 'timing', duration: 1000, delay: index * 50 + 200 }}
                        className="w-3 bg-primary-400 rounded-t-md absolute bottom-0 mx-0.5"
                        style={{ opacity: 0.9 }}
                      />
                    </View>
                    
                    <Text className="text-xs font-osregular text-gray-600 mt-2">
                      {month.month}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View className="flex-row justify-center mt-4">
              <View className="flex-row items-center mr-4">
                <View className="w-3 h-3 rounded-full bg-primary-400 mr-1" />
                <Text className="text-xs font-osregular text-gray-600">Appointments</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                <Text className="text-xs font-osregular text-gray-600">Revenue</Text>
              </View>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default MonthlyTrendsChart;
