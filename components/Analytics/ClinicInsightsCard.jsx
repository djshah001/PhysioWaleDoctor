import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';

const ClinicInsightsCard = ({ insights }) => {
  if (!insights) return null;
  
  const { busiestDay, busiestTimeSlot } = insights;
  
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };
  
  const insightItems = [
    {
      title: 'Busiest Day',
      value: busiestDay?.day || 'N/A',
      icon: 'calendar-week',
      color: colors.primary[400],
      subtitle: busiestDay?.count > 0 ? `${busiestDay.count} appointments` : 'No data'
    },
    {
      title: 'Peak Hours',
      value: busiestTimeSlot?.formattedTime || 'N/A',
      icon: 'clock-outline',
      color: colors.accent.DEFAULT,
      subtitle: busiestTimeSlot?.count > 0 ? `${busiestTimeSlot.count} appointments` : 'No data'
    },
    {
      title: 'Avg. Revenue',
      value: formatCurrency(insights.averageRevenue || 0),
      icon: 'currency-inr',
      color: '#4CAF50',
      subtitle: 'Per appointment'
    }
  ];
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 250 }}
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
                  <Icon source="lightbulb-on" size={18} color={colors.secondary[300]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Clinic Insights</Text>
              </View>
            </View>
            
            <View className="bg-white rounded-xl p-3 shadow-sm mb-3" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}>
              <Text className="font-ossemibold text-sm text-gray-800 mb-1">
                Optimize Your Schedule
              </Text>
              <Text className="font-osregular text-xs text-gray-600">
                Based on your clinic's data, consider allocating more staff or resources on {busiestDay?.day || 'weekends'} and during {busiestTimeSlot?.formattedTime || 'afternoon'} hours to handle peak patient flow.
              </Text>
            </View>
            
            <View className="flex-row flex-wrap justify-between">
              {insightItems.map((item, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 300 + (index * 100) }}
                  className="w-[31%] bg-white rounded-xl p-3 shadow-sm mb-2"
                  style={{
                    shadowColor: item.color,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View className="items-center">
                    <View className="rounded-full p-2 mb-2" style={{ backgroundColor: `${item.color}20` }}>
                      <Icon source={item.icon} size={20} color={item.color} />
                    </View>
                    <Text className="font-ossemibold text-base text-gray-800 text-center">
                      {item.value}
                    </Text>
                    <Text className="font-osregular text-xs text-gray-500 text-center mt-1">
                      {item.title}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </View>
            
            <TouchableOpacity className="flex-row items-center justify-center mt-3">
              <Text className="font-ossemibold text-sm text-secondary-300">View More Insights</Text>
              <Icon source="arrow-right" size={16} color={colors.secondary[300]} className="ml-1" />
            </TouchableOpacity>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default ClinicInsightsCard;
