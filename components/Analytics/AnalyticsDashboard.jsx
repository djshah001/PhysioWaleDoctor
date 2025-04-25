import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';

const AnalyticsDashboard = ({ data }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };

  // Calculate growth indicators
  const appointmentGrowth = data.appointmentStats.trend || 0;
  const revenueGrowth = data.revenue.growth || 0;
  const patientGrowth = data.patientDemographics?.trend || 0;
  const ratingGrowth = data.ratings?.trend || 0;

  // Dashboard metrics
  const metrics = [
    {
      title: 'Appointments',
      value: data.appointmentStats.total || 0,
      icon: 'calendar-check',
      iconColor: colors.primary[400],
      growth: appointmentGrowth,
      route: '/appointments',
      gradientColors: [colors.primary[50], colors.primary[100]],
    },
    {
      title: 'Revenue',
      value: formatCurrency(data.revenue.total || 0),
      icon: 'currency-inr',
      iconColor: '#4CAF50',
      growth: revenueGrowth,
      route: '/analytics',
      gradientColors: ['#E6F7ED', '#D1F2E0'],
    },
    {
      title: 'Patients',
      value: data.patientDemographics?.total || 0,
      icon: 'account-group',
      iconColor: colors.accent.DEFAULT,
      growth: patientGrowth,
      route: '/patients',
      gradientColors: [colors.accent[50], colors.accent[100]],
    },
    {
      title: 'Rating',
      value: data.appointmentStats.averageRating?.toFixed(1) || 'N/A',
      icon: 'star',
      iconColor: '#FFC107',
      growth: ratingGrowth,
      route: '/reviews',
      gradientColors: ['#FFF8E1', '#FFECB3'],
    },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="mb-4"
    >
      <View className="flex-row flex-wrap justify-between">
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => router.push(metric.route)}
            className="w-[48%] mb-4"
          >
            <Card className="rounded-xl overflow-hidden shadow-sm">
              <LinearGradient
                colors={metric.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4"
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-xs font-osmedium text-gray-600 mb-1">
                      {metric.title}
                    </Text>
                    <Text className="text-xl font-pbold text-black-200">
                      {metric.value}
                    </Text>
                    
                    {metric.growth !== 0 && (
                      <View className="flex-row items-center mt-1">
                        <Icon
                          source={metric.growth > 0 ? 'arrow-up-bold' : 'arrow-down-bold'}
                          size={14}
                          color={metric.growth > 0 ? colors.success : colors.error}
                        />
                        <Text className="text-xs font-osregular ml-1" style={{ 
                          color: metric.growth > 0 ? colors.success : colors.error 
                        }}>
                          {Math.abs(metric.growth)}%
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="bg-white-400 rounded-full p-2 shadow-sm" style={{ 
                    shadowColor: metric.iconColor,
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2
                  }}>
                    <Icon source={metric.icon} size={20} color={metric.iconColor} />
                  </View>
                </View>
              </LinearGradient>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </MotiView>
  );
};

export default AnalyticsDashboard;
