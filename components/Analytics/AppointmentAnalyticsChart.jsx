import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Icon, ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';

const AppointmentAnalyticsChart = ({ data, timeframe }) => {
  // Status colors and icons
  const statusInfo = {
    confirmed: {
      color: '#4CAF50', // Green
      icon: 'check-circle',
      label: 'Confirmed',
      description: 'Appointments confirmed by patients'
    },
    pending: {
      color: '#FFC107', // Yellow
      icon: 'clock-outline',
      label: 'Pending',
      description: 'Awaiting patient confirmation'
    },
    completed: {
      color: '#2196F3', // Blue
      icon: 'check-all',
      label: 'Completed',
      description: 'Successfully completed appointments'
    },
    cancelled: {
      color: '#F44336', // Red
      icon: 'close-circle',
      label: 'Cancelled',
      description: 'Cancelled by patients'
    },
    rejected: {
      color: '#9C27B0', // Purple
      icon: 'cancel',
      label: 'Rejected',
      description: 'Rejected by clinic'
    },
    expired: {
      color: '#607D8B', // Gray
      icon: 'timer-off',
      label: 'Expired',
      description: 'Expired without action'
    }
  };

  // Get timeframe label
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'All Time';
    }
  };

  // Calculate percentages for the progress bars
  const getPercentage = (count) => {
    return data.total > 0 ? count / data.total : 0;
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 100 }}
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
                <Text className="text-lg font-pbold text-black-200">Appointment Status</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-primary-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/appointments')}
              >
                <Text className="text-xs font-ossemibold text-primary-400 mr-1">View All</Text>
                <Icon source="chevron-right" size={14} color={colors.primary[400]} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl text-primary-400">
                  {data.total || 0}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Total
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl text-blue-500">
                  {data.completed || 0}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Completed
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl" style={{ color: '#FFC107' }}>
                  {data.averageRating ? data.averageRating.toFixed(1) : "N/A"}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Avg. Rating
                </Text>
              </View>
            </View>
            
            <View className="mb-4">
              {Object.entries(data.byStatus || {}).map(([status, count]) => {
                const statusData = statusInfo[status] || {
                  color: colors.accent.DEFAULT,
                  icon: 'help-circle',
                  label: status.charAt(0).toUpperCase() + status.slice(1),
                  description: 'Appointment status'
                };
                
                return (
                  <MotiView 
                    key={status} 
                    className="mb-3"
                    from={{ opacity: 0, scaleX: 0.8 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ type: 'timing', duration: 500, delay: Object.keys(statusInfo).indexOf(status) * 100 }}
                  >
                    <View className="flex-row items-center mb-1">
                      <View className="flex-row items-center flex-1">
                        <Icon source={statusData.icon} size={16} color={statusData.color} className="mr-2" />
                        <Text className="font-osmedium text-sm text-gray-800">
                          {statusData.label}
                        </Text>
                      </View>
                      <Text className="font-ossemibold text-sm text-gray-800">
                        {count} ({data.total > 0 ? Math.round(count / data.total * 100) : 0}%)
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="flex-1 mr-2">
                        <ProgressBar
                          progress={getPercentage(count)}
                          color={statusData.color}
                          className="h-2.5 rounded-full"
                        />
                      </View>
                    </View>
                  </MotiView>
                );
              })}
            </View>
            
            <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
              <View className="flex-row items-center">
                <Icon source="calendar-range" size={20} color={colors.primary[400]} className="mr-2" />
                <Text className="font-ossemibold text-sm text-gray-800">{getTimeframeLabel()}</Text>
              </View>
              <Text className="font-pbold text-lg text-black-200">{data.total}</Text>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default AppointmentAnalyticsChart;
