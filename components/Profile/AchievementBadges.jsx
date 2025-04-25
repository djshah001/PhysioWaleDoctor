import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';
import { cssInterop } from 'nativewind';

cssInterop(Icon, { className: 'style' });

const AchievementBadges = ({ achievements = [] }) => {
  // If no achievements are provided, use default ones
  const defaultAchievements = [
    {
      id: 1,
      title: 'Top Rated',
      description: 'Consistently high patient ratings',
      icon: 'star',
      color: '#FFC107', // Amber
      unlocked: true
    },
    {
      id: 2,
      title: 'Experienced',
      description: '5+ years of professional experience',
      icon: 'clock-check',
      color: '#4CAF50', // Green
      unlocked: true
    },
    {
      id: 3,
      title: 'Specialist',
      description: 'Specialized in a specific field',
      icon: 'certificate',
      color: '#2196F3', // Blue
      unlocked: false
    },
    {
      id: 4,
      title: 'Dedicated',
      description: '100+ appointments completed',
      icon: 'calendar-check',
      color: '#9C27B0', // Purple
      unlocked: false
    }
  ];

  const badgesToDisplay = achievements.length > 0 ? achievements : defaultAchievements;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 200 }}
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
                <View className="bg-accent-100 rounded-full p-1.5 mr-2">
                  <Icon source="trophy" size={18} color={colors.accent.DEFAULT} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Achievements</Text>
              </View>
              
              <TouchableOpacity className="bg-accent-50 rounded-full px-2 py-1 flex-row items-center">
                <Text className="text-xs font-ossemibold text-accent-DEFAULT mr-1">View All</Text>
                <Icon source="chevron-right" size={14} color={colors.accent.DEFAULT} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {badgesToDisplay.map((badge, index) => (
                <MotiView
                  key={badge.id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 300 + (index * 100) }}
                  className="mr-3"
                >
                  <View 
                    className="w-[110px] h-[140px] rounded-xl p-3 items-center justify-center"
                    style={{ 
                      backgroundColor: badge.unlocked ? 'white' : '#F5F5F5',
                      borderWidth: 1,
                      borderColor: badge.unlocked ? badge.color : '#E0E0E0',
                      opacity: badge.unlocked ? 1 : 0.7,
                      shadowColor: badge.unlocked ? badge.color : '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: badge.unlocked ? 0.2 : 0.1,
                      shadowRadius: 3,
                      elevation: badge.unlocked ? 3 : 1,
                    }}
                  >
                    <View 
                      className="w-14 h-14 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      <Icon 
                        source={badge.icon} 
                        size={28} 
                        color={badge.unlocked ? badge.color : '#9E9E9E'} 
                      />
                      {!badge.unlocked && (
                        <View className="absolute top-0 right-0 bg-gray-400 rounded-full p-1">
                          <Icon source="lock" size={12} color="white" />
                        </View>
                      )}
                    </View>
                    
                    <Text 
                      className="text-center font-ossemibold text-sm mb-1"
                      style={{ color: badge.unlocked ? '#333' : '#9E9E9E' }}
                    >
                      {badge.title}
                    </Text>
                    
                    <Text 
                      className="text-center font-osregular text-[10px]"
                      style={{ color: badge.unlocked ? '#666' : '#9E9E9E' }}
                      numberOfLines={2}
                    >
                      {badge.description}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </ScrollView>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default AchievementBadges;
