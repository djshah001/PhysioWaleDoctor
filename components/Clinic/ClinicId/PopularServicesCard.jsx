import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import colors from '../../../constants/colors';

const PopularServicesCard = ({ services }) => {
  if (!services || services.length === 0) {
    return null;
  }

  // Find the maximum count to calculate percentages
  const maxCount = Math.max(...services.map(service => service.count));

  // Service colors based on index
  const serviceColors = [
    colors.primary[400],
    colors.accent.DEFAULT,
    '#4CAF50',
    '#FFC107',
    '#9C27B0',
    '#2196F3'
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 300 }}
    >
      <Card className="rounded-xl overflow-hidden shadow-sm bg-white-400 mb-4">
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-primary-100 rounded-full p-1.5 mr-2">
                  <Icon source="medical-bag" size={18} color={colors.primary[400]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Popular Services</Text>
              </View>

              <TouchableOpacity className="bg-primary-50 rounded-full px-2 py-1 flex-row items-center">
                <Text className="text-xs font-ossemibold text-primary-400 mr-1">All Services</Text>
                <Icon source="chevron-right" size={14} color={colors.primary[400]} />
              </TouchableOpacity>
            </View>

            {services.map((service, index) => (
              <MotiView
                key={index}
                className="mb-3"
                from={{ opacity: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ type: 'timing', duration: 500, delay: index * 100 }}
              >
                <View className="flex-row justify-between mb-1">
                  <View className="flex-row items-center">
                    <View
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: serviceColors[index % serviceColors.length] }}
                    />
                    <Text className="font-osmedium text-sm text-gray-800">
                      {service.name}
                    </Text>
                  </View>
                  <Text className="font-ossemibold text-sm text-gray-800">
                    {service.count}
                  </Text>
                </View>
                <ProgressBar
                  progress={maxCount > 0 ? service.count / maxCount : 0}
                  color={serviceColors[index % serviceColors.length]}
                  className="h-2.5 rounded-full"
                />
              </MotiView>
            ))}

            <View className="mt-2 pt-2 border-t border-gray-100">
              <TouchableOpacity className="flex-row items-center justify-center">
                <Text className="text-sm font-ossemibold text-primary-400">Manage Services</Text>
                <Icon source="arrow-right" size={16} color={colors.primary[400]} className="ml-1" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default PopularServicesCard;
