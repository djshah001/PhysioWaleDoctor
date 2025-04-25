import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';

const RevenueAnalyticsChart = ({ data, timeframe }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
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

  // Calculate growth percentage
  const growth = data.growth || 0;
  const isPositiveGrowth = growth >= 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 200 }}
      className="mb-4"
    >
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={['#F0F9F4', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-full p-1.5 mr-2">
                  <Icon source="currency-inr" size={18} color="#4CAF50" />
                </View>
                <Text className="text-lg font-pbold text-black-200">Revenue Overview</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-green-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => {}}
              >
                <Text className="text-xs font-ossemibold text-green-600 mr-1">Export</Text>
                <Icon source="export-variant" size={14} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            
            <View className="bg-green-50 p-4 rounded-xl mb-4">
              <Text className="font-osregular text-sm text-gray-600">
                Total Revenue
              </Text>
              <Text className="font-pbold text-3xl text-green-600 mt-1">
                {formatCurrency(data.total)}
              </Text>
              
              {growth !== 0 && (
                <View className="flex-row items-center mt-2">
                  <Icon
                    source={isPositiveGrowth ? 'arrow-up-bold' : 'arrow-down-bold'}
                    size={16}
                    color={isPositiveGrowth ? colors.success : colors.error}
                  />
                  <Text className="ml-1 font-ossemibold text-sm" style={{ 
                    color: isPositiveGrowth ? colors.success : colors.error 
                  }}>
                    {Math.abs(growth)}%
                  </Text>
                  <Text className="ml-1 font-osregular text-sm text-gray-600">
                    {isPositiveGrowth ? 'increase' : 'decrease'} from last period
                  </Text>
                </View>
              )}
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 bg-white shadow-sm rounded-xl p-3 mr-2" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Text className="font-osregular text-xs text-gray-600">
                  {timeframe === 'month' ? 'This Month' : timeframe === 'year' ? 'This Year' : 'Current Period'}
                </Text>
                <Text className="font-ossemibold text-lg text-gray-800 mt-1">
                  {formatCurrency(data.thisMonth || data.thisPeriod || 0)}
                </Text>
              </View>
              
              <View className="flex-1 bg-white shadow-sm rounded-xl p-3 ml-2" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Text className="font-osregular text-xs text-gray-600">
                  {timeframe === 'month' ? 'Last Month' : timeframe === 'year' ? 'Last Year' : 'Previous Period'}
                </Text>
                <Text className="font-ossemibold text-lg text-gray-800 mt-1">
                  {formatCurrency(data.lastMonth || data.lastPeriod || 0)}
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
              <View className="flex-row items-center">
                <Icon source="calendar-range" size={20} color="#4CAF50" className="mr-2" />
                <Text className="font-ossemibold text-sm text-gray-800">{getTimeframeLabel()}</Text>
              </View>
              <Text className="font-pbold text-lg text-green-600">{formatCurrency(data.total)}</Text>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default RevenueAnalyticsChart;
