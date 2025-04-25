import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon, Divider } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';
import { cssInterop } from 'nativewind';

cssInterop(Icon, { className: 'style' });
cssInterop(Divider, { className: 'style' });

const AvailabilitySchedule = ({ schedule = {} }) => {
  // Default schedule if none provided
  const defaultSchedule = {
    monday: { active: true, slots: ['09:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] },
    tuesday: { active: true, slots: ['09:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] },
    wednesday: { active: true, slots: ['09:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] },
    thursday: { active: true, slots: ['09:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] },
    friday: { active: true, slots: ['09:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] },
    saturday: { active: true, slots: ['09:00 AM - 01:00 PM'] },
    sunday: { active: false, slots: [] }
  };

  const data = { ...defaultSchedule, ...schedule };
  
  // Days of the week
  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  // Get today's day
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to our array index (0 = Monday)

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 300 }}
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
                <View className="bg-secondary-100 rounded-full p-1.5 mr-2">
                  <Icon source="calendar-clock" size={18} color={colors.secondary[300]} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Availability</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-secondary-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/profile/edit-schedule')}
              >
                <Text className="text-xs font-ossemibold text-secondary-300 mr-1">Edit</Text>
                <Icon source="pencil" size={14} color={colors.secondary[300]} />
              </TouchableOpacity>
            </View>
            
            {/* Days of week indicator */}
            <View className="flex-row justify-between mb-3 bg-gray-50 p-2 rounded-lg">
              {days.map((day, index) => (
                <View 
                  key={day.key}
                  className={`w-9 h-9 rounded-full items-center justify-center ${index === todayIndex ? 'bg-secondary-300' : data[day.key].active ? 'bg-white-400' : 'bg-gray-200'}`}
                >
                  <Text 
                    className={`text-xs font-ossemibold ${index === todayIndex ? 'text-white-400' : data[day.key].active ? 'text-gray-800' : 'text-gray-500'}`}
                  >
                    {day.label}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Schedule details */}
            <View className="bg-white-400 rounded-xl p-3 shadow-sm">
              {days.map((day, index) => (
                <MotiView
                  key={day.key}
                  from={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: index === todayIndex || index === (todayIndex + 1) % 7 || index === (todayIndex + 2) % 7 ? 1 : 0,
                    height: index === todayIndex || index === (todayIndex + 1) % 7 || index === (todayIndex + 2) % 7 ? 'auto' : 0
                  }}
                  transition={{ type: 'timing', duration: 300 }}
                >
                  {(index === todayIndex || index === (todayIndex + 1) % 7 || index === (todayIndex + 2) % 7) && (
                    <>
                      <View className="flex-row items-center py-2">
                        <View className={`w-2 h-2 rounded-full mr-2 ${data[day.key].active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <Text className="font-ossemibold text-sm text-gray-800 capitalize">
                          {index === todayIndex ? 'Today' : day.key}
                        </Text>
                        <View className={`ml-2 px-2 py-0.5 rounded-full ${data[day.key].active ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Text className={`text-xs ${data[day.key].active ? 'text-green-700' : 'text-gray-500'}`}>
                            {data[day.key].active ? 'Available' : 'Unavailable'}
                          </Text>
                        </View>
                      </View>
                      
                      {data[day.key].active && (
                        <View className="ml-4 mb-2">
                          {data[day.key].slots.map((slot, slotIndex) => (
                            <View key={slotIndex} className="flex-row items-center mb-1">
                              <Icon source="clock-outline" size={14} color={colors.gray[500]} />
                              <Text className="text-xs text-gray-600 ml-1">{slot}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
                      {index < days.length - 1 && (index === todayIndex || index === (todayIndex + 1) % 7) && (
                        <Divider style={{ backgroundColor: colors.gray[100] }} />
                      )}
                    </>
                  )}
                </MotiView>
              ))}
              
              <TouchableOpacity 
                className="flex-row items-center justify-center mt-2"
                onPress={() => router.push('/profile/full-schedule')}
              >
                <Text className="font-ossemibold text-xs text-secondary-300">View Full Schedule</Text>
                <Icon source="chevron-right" size={14} color={colors.secondary[300]} className="ml-1" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default AvailabilitySchedule;
