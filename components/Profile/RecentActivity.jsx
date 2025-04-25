import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon, Avatar, Divider } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { format, formatDistanceToNow } from 'date-fns';
import colors from '../../constants/colors';
import { cssInterop } from 'nativewind';

cssInterop(Icon, { className: 'style' });
cssInterop(Avatar, { className: 'style' });
cssInterop(Divider, { className: 'style' });

const RecentActivity = ({ activities = [] }) => {
  // Default activities if none provided
  const defaultActivities = [
    {
      id: 1,
      type: 'appointment',
      status: 'completed',
      patientName: 'John Doe',
      patientImage: null,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      description: 'Completed an appointment'
    },
    {
      id: 2,
      type: 'review',
      rating: 5,
      patientName: 'Sarah Smith',
      patientImage: null,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      description: 'Received a 5-star review'
    },
    {
      id: 3,
      type: 'appointment',
      status: 'confirmed',
      patientName: 'Michael Johnson',
      patientImage: null,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      description: 'New appointment confirmed'
    }
  ];

  const activitiesToDisplay = activities.length > 0 ? activities : defaultActivities;

  // Get icon and color based on activity type
  const getActivityDetails = (activity) => {
    switch (activity.type) {
      case 'appointment':
        if (activity.status === 'completed') {
          return { 
            icon: 'check-circle', 
            color: '#4CAF50',
            route: `/appointments/${activity.id}`
          };
        } else if (activity.status === 'confirmed') {
          return { 
            icon: 'calendar-check', 
            color: colors.primary[400],
            route: `/appointments/${activity.id}`
          };
        } else {
          return { 
            icon: 'calendar-clock', 
            color: colors.accent.DEFAULT,
            route: `/appointments/${activity.id}`
          };
        }
      case 'review':
        return { 
          icon: 'star', 
          color: '#FFC107',
          route: '/profile/reviews'
        };
      case 'clinic':
        return { 
          icon: 'hospital-building', 
          color: colors.secondary[300],
          route: `/clinics/${activity.clinicId}`
        };
      default:
        return { 
          icon: 'bell', 
          color: colors.gray[500],
          route: '/notifications'
        };
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 350 }}
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
                  <Icon source="history" size={18} color={colors.accent.DEFAULT} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Recent Activity</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-accent-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/notifications')}
              >
                <Text className="text-xs font-ossemibold text-accent-DEFAULT mr-1">View All</Text>
                <Icon source="chevron-right" size={14} color={colors.accent.DEFAULT} />
              </TouchableOpacity>
            </View>
            
            <View className="bg-white-400 rounded-xl p-3 shadow-sm">
              {activitiesToDisplay.map((activity, index) => {
                const { icon, color, route } = getActivityDetails(activity);
                
                return (
                  <MotiView
                    key={activity.id}
                    from={{ opacity: 0, translateX: -10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: index * 100 }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => router.push(route)}
                    >
                      <View className="flex-row py-2">
                        <View 
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon source={icon} size={20} color={color} />
                        </View>
                        
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text className="font-ossemibold text-sm text-gray-800 flex-1">
                              {activity.description}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                            </Text>
                          </View>
                          
                          {activity.patientName && (
                            <View className="flex-row items-center mt-1">
                              <Avatar.Image 
                                size={16} 
                                source={{ uri: activity.patientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.patientName)}&size=32` }} 
                              />
                              <Text className="text-xs text-gray-600 ml-1">
                                {activity.patientName}
                              </Text>
                              
                              {activity.type === 'review' && activity.rating && (
                                <View className="flex-row items-center ml-2">
                                  <Icon source="star" size={12} color="#FFC107" />
                                  <Text className="text-xs text-gray-600 ml-0.5">
                                    {activity.rating}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    {index < activitiesToDisplay.length - 1 && (
                      <Divider style={{ backgroundColor: colors.gray[100] }} />
                    )}
                  </MotiView>
                );
              })}
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default RecentActivity;
