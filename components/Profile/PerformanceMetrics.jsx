import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon, ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';
import { cssInterop } from 'nativewind';

cssInterop(Icon, { className: 'style' });
cssInterop(ProgressBar, { className: 'style' });

const PerformanceMetrics = ({ metrics = {} }) => {
  // Default metrics if none provided
  const defaultMetrics = {
    rating: 4.2,
    maxRating: 5,
    completionRate: 0.85,
    responseTime: '2.5 hours',
    patientSatisfaction: 0.92,
    totalReviews: 48
  };

  const data = { ...defaultMetrics, ...metrics };

  // Calculate star rating display
  const renderStars = (rating, maxRating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = Math.floor(maxRating - rating - (halfStar ? 0.5 : 0));
    
    return (
      <View className="flex-row">
        {[...Array(fullStars)].map((_, i) => (
          <Icon key={`full-${i}`} source="star" size={16} color="#FFC107" />
        ))}
        {halfStar && <Icon key="half" source="star-half" size={16} color="#FFC107" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon key={`empty-${i}`} source="star-outline" size={16} color="#FFC107" />
        ))}
      </View>
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 250 }}
      className="mb-4"
    >
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-primary-100 rounded-full p-1.5 mr-2">
                  <Icon source="chart-line" size={18} color={colors.primary[400]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Performance</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-primary-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/analytics')}
              >
                <Text className="text-xs font-ossemibold text-primary-400 mr-1">Analytics</Text>
                <Icon source="chevron-right" size={14} color={colors.primary[400]} />
              </TouchableOpacity>
            </View>
            
            <View className="bg-white-400 rounded-xl p-4 shadow-sm mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="font-ossemibold text-lg text-gray-800">
                    {data.rating.toFixed(1)}
                  </Text>
                  <View className="flex-row items-center">
                    {renderStars(data.rating, data.maxRating)}
                    <Text className="text-xs text-gray-500 ml-1">
                      ({data.totalReviews} reviews)
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity className="bg-primary-50 px-3 py-1 rounded-full">
                  <Text className="text-xs font-ossemibold text-primary-400">View Reviews</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="space-y-4">
              {/* Completion Rate */}
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="font-osregular text-xs text-gray-600">Appointment Completion</Text>
                  <Text className="font-ossemibold text-xs text-gray-800">
                    {Math.round(data.completionRate * 100)}%
                  </Text>
                </View>
                <ProgressBar 
                  progress={data.completionRate} 
                  color={colors.primary[400]} 
                  className="h-2 rounded-full"
                />
              </View>
              
              {/* Patient Satisfaction */}
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="font-osregular text-xs text-gray-600">Patient Satisfaction</Text>
                  <Text className="font-ossemibold text-xs text-gray-800">
                    {Math.round(data.patientSatisfaction * 100)}%
                  </Text>
                </View>
                <ProgressBar 
                  progress={data.patientSatisfaction} 
                  color="#4CAF50" 
                  className="h-2 rounded-full"
                />
              </View>
              
              {/* Response Time */}
              <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg mt-2">
                <View className="flex-row items-center">
                  <Icon source="clock-outline" size={18} color={colors.accent.DEFAULT} className="mr-2" />
                  <Text className="font-osregular text-sm text-gray-600">Average Response Time</Text>
                </View>
                <Text className="font-ossemibold text-sm text-gray-800">{data.responseTime}</Text>
              </View>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default PerformanceMetrics;
