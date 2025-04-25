import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import colors from '../../../constants/colors';

const AppointmentStatusChart = ({ stats }) => {
  const { total, byStatus } = stats;

  // Calculate percentages
  const getPercentage = (count) => {
    return total > 0 ? count / total : 0;
  };

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

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 200 }}
    >
      <Card className="rounded-xl overflow-hidden shadow-sm bg-white-400 mb-4">
        <LinearGradient
          colors={['#F8F9FF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-accent-100 rounded-full p-1.5 mr-2">
                  <Icon source="chart-bar" size={18} color={colors.accent.DEFAULT} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Appointment Status</Text>
              </View>

              <TouchableOpacity className="bg-accent-50 rounded-full px-2 py-1 flex-row items-center">
                <Text className="text-xs font-ossemibold text-accent-DEFAULT mr-1">Details</Text>
                <Icon source="chevron-right" size={14} color={colors.accent.DEFAULT} />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              {Object.entries(byStatus).map(([status, count]) => {
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
                      <View className="flex-row items-center flex-1 gap-1">
                        <Icon source={statusData.icon} size={16} color={statusData.color} className="mr-2" />
                        <Text className="font-osmedium text-sm text-gray-800">
                          {statusData.label}
                        </Text>
                      </View>
                      <Text className="font-ossemibold text-sm text-gray-800">
                        {count} ({total > 0 ? Math.round(count / total * 100) : 0}%)
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
              <View className="flex-row items-center gap-1">
                <Icon source="calendar-multiple" size={20} color={colors.accent.DEFAULT}  />
                <Text className="font-ossemibold text-sm text-gray-800">Total Appointments</Text>
              </View>
              <Text className="font-pbold text-lg text-black-200">{total}</Text>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default AppointmentStatusChart;
