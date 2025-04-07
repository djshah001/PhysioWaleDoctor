import React from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { SegmentedButtons, ProgressBar } from 'react-native-paper';
import colors from '../../constants/colors';

const FormStepNavigation = ({ currentStep, totalSteps, changeStep, steps }) => {
  return (
    <View className="px-4 mt-2 mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SegmentedButtons
          value={String(currentStep)}
          onValueChange={(value) => changeStep(Number(value))}
          theme={{
            colors: {
              secondaryContainer: colors.secondary[300],
            },
          }}
          buttons={steps.map((step, index) => ({
            value: String(index + 1),
            label: step.label,
            icon: step.icon,
            checkedColor: colors.white[300],
          }))}
        />
      </ScrollView>

      <View className="mt-3 mb-2">
        <Text className="text-xs text-gray-500 mb-1 text-right">
          Step {currentStep} of {totalSteps}
        </Text>
        <ProgressBar
          progress={(currentStep - 1) / (totalSteps - 1)}
          color={colors.secondary[300]}
          style={{ height: 6, borderRadius: 3 }}
        />
      </View>
    </View>
  );
};

export default React.memo(FormStepNavigation);