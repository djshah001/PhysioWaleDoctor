import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Icon, ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '../../constants/colors';

const PatientDemographics = ({ data }) => {
  if (!data) return null;
  
  // Gender colors
  const genderColors = {
    male: colors.blues[500],
    female: colors.accent.DEFAULT,
    other: colors.gray[500]
  };
  
  // Age group colors
  const ageGroupColors = {
    '0-18': '#4FC3F7',
    '19-35': '#7986CB',
    '36-50': '#9575CD',
    '51+': '#BA68C8'
  };
  
  // Calculate gender percentages
  const totalPatients = data.total || 0;
  const malePercentage = totalPatients > 0 ? (data.male / totalPatients) * 100 : 0;
  const femalePercentage = totalPatients > 0 ? (data.female / totalPatients) * 100 : 0;
  const otherPercentage = totalPatients > 0 ? (data.other / totalPatients) * 100 : 0;
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 300 }}
      className="mb-4"
    >
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <LinearGradient
          colors={[colors.accent[50], '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-accent-100 rounded-full p-1.5 mr-2">
                  <Icon source="account-group" size={18} color={colors.accent.DEFAULT} />
                </View>
                <Text className="text-lg font-pbold text-black-200">Patient Demographics</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-accent-50 rounded-full px-2 py-1 flex-row items-center"
                onPress={() => router.push('/patients')}
              >
                <Text className="text-xs font-ossemibold text-accent-DEFAULT mr-1">View All</Text>
                <Icon source="chevron-right" size={14} color={colors.accent.DEFAULT} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl text-accent-DEFAULT">
                  {totalPatients}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Total Patients
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl" style={{ color: genderColors.male }}>
                  {data.male || 0}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Male
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="font-osbold text-2xl" style={{ color: genderColors.female }}>
                  {data.female || 0}
                </Text>
                <Text className="font-osregular text-xs text-gray-600 mt-1">
                  Female
                </Text>
              </View>
            </View>
            
            {/* Gender Distribution */}
            <View className="mb-4">
              <Text className="font-ossemibold text-sm text-gray-800 mb-2">
                Gender Distribution
              </Text>
              
              <View className="h-5 bg-gray-100 rounded-full overflow-hidden flex-row">
                <MotiView 
                  from={{ width: '0%' }}
                  animate={{ width: `${malePercentage}%` }}
                  transition={{ type: 'timing', duration: 1000 }}
                  style={{ backgroundColor: genderColors.male }}
                />
                <MotiView 
                  from={{ width: '0%' }}
                  animate={{ width: `${femalePercentage}%` }}
                  transition={{ type: 'timing', duration: 1000 }}
                  style={{ backgroundColor: genderColors.female }}
                />
                <MotiView 
                  from={{ width: '0%' }}
                  animate={{ width: `${otherPercentage}%` }}
                  transition={{ type: 'timing', duration: 1000 }}
                  style={{ backgroundColor: genderColors.other }}
                />
              </View>
              
              <View className="flex-row justify-between mt-2">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: genderColors.male }} />
                  <Text className="text-xs font-osregular text-gray-600">Male ({Math.round(malePercentage)}%)</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: genderColors.female }} />
                  <Text className="text-xs font-osregular text-gray-600">Female ({Math.round(femalePercentage)}%)</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: genderColors.other }} />
                  <Text className="text-xs font-osregular text-gray-600">Other ({Math.round(otherPercentage)}%)</Text>
                </View>
              </View>
            </View>
            
            {/* Age Distribution */}
            <View className="mb-2">
              <Text className="font-ossemibold text-sm text-gray-800 mb-2">
                Age Distribution
              </Text>
              
              {Object.entries(data.ageGroups || {}).map(([ageGroup, percentage]) => (
                <MotiView 
                  key={ageGroup} 
                  className="mb-3"
                  from={{ opacity: 0, scaleX: 0.8 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ type: 'timing', duration: 500, delay: Object.keys(data.ageGroups || {}).indexOf(ageGroup) * 100 }}
                >
                  <View className="flex-row justify-between mb-1">
                    <View className="flex-row items-center">
                      <View 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: ageGroupColors[ageGroup] }}
                      />
                      <Text className="font-osmedium text-sm text-gray-800">
                        {ageGroup} years
                      </Text>
                    </View>
                    <Text className="font-ossemibold text-sm text-gray-800">
                      {percentage}%
                    </Text>
                  </View>
                  <ProgressBar
                    progress={percentage / 100}
                    color={ageGroupColors[ageGroup]}
                    className="h-2.5 rounded-full"
                  />
                </MotiView>
              ))}
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </MotiView>
  );
};

export default PatientDemographics;
