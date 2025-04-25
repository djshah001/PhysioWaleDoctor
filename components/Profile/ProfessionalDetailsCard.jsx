import React from 'react';
import { View, Text } from 'react-native';
import { Card, Icon, Divider } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';
import { cssInterop } from 'nativewind';

cssInterop(Icon, { className: 'style' });
cssInterop(Divider, { className: 'style' });

const ProfessionalDetailsCard = ({ userData }) => {
  // Define detail items to display
  const detailItems = [
    {
      icon: 'medical-bag',
      label: 'Specialization',
      value: userData.specialization || 'Not specified',
      color: colors.primary[400]
    },
    {
      icon: 'calendar-clock',
      label: 'Experience',
      value: userData.experience ? `${userData.experience} years` : 'Not specified',
      color: colors.secondary[300]
    },
    {
      icon: 'certificate',
      label: 'Qualification',
      value: userData.qualification || 'Not specified',
      color: colors.accent.DEFAULT
    },
    {
      icon: 'hospital-building',
      label: 'Clinics',
      value: userData.clinics?.length || 0,
      color: '#4CAF50' // Green
    }
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 150 }}
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
              <View className="bg-primary-100 rounded-full p-1.5 mr-2">
                <Icon source="account-tie" size={18} color={colors.primary[400]} />
              </View>
              <Text className="text-lg font-pbold text-black-200">Professional Details</Text>
            </View>
            
            <View className="bg-white-400 rounded-xl p-3 shadow-sm">
              {detailItems.map((item, index) => (
                <View key={index}>
                  <View className="flex-row items-center py-2">
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon source={item.icon} size={16} color={item.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-osregular text-gray-500">
                        {item.label}
                      </Text>
                      <Text className="text-sm font-ossemibold text-gray-800">
                        {item.value}
                      </Text>
                    </View>
                  </View>
                  {index < detailItems.length - 1 && (
                    <Divider style={{ backgroundColor: colors.gray[100] }} />
                  )}
                </View>
              ))}
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default ProfessionalDetailsCard;
