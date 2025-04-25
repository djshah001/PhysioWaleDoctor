import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import colors from '../../constants/colors';

const AnalyticsSummaryCard = ({
  title,
  value,
  icon,
  iconColor,
  subtitle,
  trend,
  trendUp,
  onPress,
  gradientColors
}) => {
  // Default gradient colors based on icon type
  const defaultGradients = {
    'calendar-check': [colors.primary[50], colors.primary[100]],
    'currency-inr': ['#E6F7ED', '#D1F2E0'],
    'star': ['#FFF8E1', '#FFECB3'],
    'account-group': [colors.accent[50], colors.accent[100]],
  };

  const cardGradient = gradientColors || defaultGradients[icon] || ['#F5F5F5', '#FFFFFF'];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="flex-1 mx-1 mb-2"
    >
      <TouchableOpacity
        activeOpacity={onPress ? 0.7 : 1}
        onPress={onPress}
        className="flex-1"
      >
        <Card className="rounded-xl overflow-hidden shadow-sm bg-white-400 flex-1">
          <LinearGradient
            colors={cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-xs font-osmedium text-gray-600 mb-1">{title}</Text>
                <Text className="text-2xl font-pbold text-black-600">{value}</Text>

                {subtitle && (
                  <View className="flex-row items-center mt-1">
                    {trend && (
                      <Icon
                        source={trendUp ? 'arrow-up-bold' : 'arrow-down-bold'}
                        size={16}
                        color={trendUp ? colors.success : colors.error}
                        className="mr-1"
                      />
                    )}
                    <Text className="text-xs font-osregular text-gray-500">{subtitle}</Text>
                  </View>
                )}
              </View>

              <View className="bg-white-400 rounded-full p-2 shadow-sm" style={{
                shadowColor: iconColor,
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2
              }}>
                <Icon source={icon} size={24} color={iconColor || colors.accent.DEFAULT} />
              </View>
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    </MotiView>
  );
};

export default AnalyticsSummaryCard;
