import React from 'react';
import { View, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { CustomChip } from '../ReUsables/CustomChip';

/**
 * TimeframeSelector component for selecting time periods
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedTimeframe - Currently selected timeframe
 * @param {Function} props.onTimeframeChange - Function to call when timeframe changes
 * @returns {JSX.Element} - Rendered component
 */
const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }) => {
  const timeframes = [
    { id: 'week', label: 'This Week', icon: 'calendar-week' },
    { id: 'month', label: 'This Month', icon: 'calendar-month' },
    { id: 'year', label: 'This Year', icon: 'calendar-today' },
    { id: 'all', label: 'All Time', icon: 'calendar-range' },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="mb-4"
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
      >
        {timeframes.map((timeframe) => (
          <CustomChip
            key={timeframe.id}
            selected={selectedTimeframe === timeframe.id}
            text={timeframe.label}
            iconName={timeframe.icon}
            onPress={() => onTimeframeChange(timeframe.id)}
            otherStyles="rounded-full"
          />
        ))}
      </ScrollView>
    </MotiView>
  );
};

export default TimeframeSelector;
