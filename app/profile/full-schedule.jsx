import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Icon, Divider, Switch } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useUserDataState, useToastSate } from '../../atoms/store';
import colors from '../../constants/colors';
import { cssInterop } from 'nativewind';
import CustomBtn from '../../components/CustomBtn';

cssInterop(Icon, { className: 'style' });
cssInterop(Divider, { className: 'style' });
cssInterop(Switch, { className: 'style' });

const FullSchedule = () => {
  const [userData] = useUserDataState();
  const [, setToast] = useToastSate();
  
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

  // Use user data schedule if available, otherwise use default
  const [schedule, setSchedule] = useState(userData.schedule || defaultSchedule);
  
  // Days of the week
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  // Toggle day availability
  const toggleDayAvailability = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active
      }
    }));
  };

  // Save schedule changes
  const saveSchedule = () => {
    // In a real app, you would save this to the backend
    setToast({
      message: 'Schedule updated successfully',
      visible: true,
      type: 'success'
    });
    
    // Navigate back
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white-300">
      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="mb-4"
        >
          <Card className="rounded-xl overflow-hidden shadow-sm">
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Card.Content className="p-4">
                <View className="flex-row items-center mb-4">
                  <View className="bg-secondary-100 rounded-full p-1.5 mr-2">
                    <Icon source="calendar-clock" size={18} color={colors.secondary[300]} />
                  </View>
                  <Text className="text-lg font-pbold text-black-200">Weekly Schedule</Text>
                </View>
                
                <View className="bg-white-400 rounded-xl p-3 shadow-sm">
                  {days.map((day, index) => (
                    <View key={day.key}>
                      <View className="flex-row items-center justify-between py-3">
                        <View className="flex-row items-center">
                          <View className={`w-2 h-2 rounded-full mr-2 ${schedule[day.key].active ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <Text className="font-ossemibold text-base text-gray-800">
                            {day.label}
                          </Text>
                        </View>
                        
                        <Switch
                          value={schedule[day.key].active}
                          onValueChange={() => toggleDayAvailability(day.key)}
                          color={colors.secondary[300]}
                        />
                      </View>
                      
                      {schedule[day.key].active && (
                        <View className="ml-4 mb-3">
                          {schedule[day.key].slots.map((slot, slotIndex) => (
                            <View key={slotIndex} className="flex-row items-center mb-2">
                              <Icon source="clock-outline" size={16} color={colors.gray[500]} />
                              <Text className="text-sm text-gray-600 ml-2">{slot}</Text>
                              
                              <TouchableOpacity 
                                className="ml-auto bg-gray-100 p-1 rounded-full"
                                onPress={() => {
                                  // In a real app, you would implement slot editing
                                  setToast({
                                    message: 'Slot editing not implemented in this demo',
                                    visible: true,
                                    type: 'info'
                                  });
                                }}
                              >
                                <Icon source="pencil" size={14} color={colors.gray[500]} />
                              </TouchableOpacity>
                            </View>
                          ))}
                          
                          <TouchableOpacity 
                            className="flex-row items-center mt-1 mb-2"
                            onPress={() => {
                              // In a real app, you would implement adding new slots
                              setToast({
                                message: 'Adding slots not implemented in this demo',
                                visible: true,
                                type: 'info'
                              });
                            }}
                          >
                            <Icon source="plus-circle" size={16} color={colors.secondary[300]} />
                            <Text className="text-sm font-ossemibold text-secondary-300 ml-1">
                              Add Time Slot
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      
                      {index < days.length - 1 && (
                        <Divider style={{ backgroundColor: colors.gray[100] }} />
                      )}
                    </View>
                  ))}
                </View>
                
                <View className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <View className="flex-row items-center mb-2">
                    <Icon source="information-outline" size={18} color={colors.secondary[300]} className="mr-2" />
                    <Text className="font-ossemibold text-sm text-gray-800">Schedule Information</Text>
                  </View>
                  <Text className="text-xs text-gray-600">
                    Your availability schedule is used to determine when patients can book appointments with you. 
                    Make sure to keep it updated to avoid scheduling conflicts.
                  </Text>
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
        >
          <CustomBtn
            title="Save Changes"
            iconName="content-save"
            handlePress={saveSchedule}
            useGradient={true}
            gradientColors={[colors.secondary[200], colors.secondary[300]]}
            className="mb-4"
          />
          
          <CustomBtn
            title="Cancel"
            iconName="close"
            handlePress={() => router.back()}
            bgColor={colors.gray[200]}
            textColor={colors.gray[700]}
          />
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FullSchedule;
