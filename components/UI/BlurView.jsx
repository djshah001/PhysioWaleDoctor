import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView as ExpoBlurView } from 'expo-blur';
import colors from '../../constants/colors';

/**
 * A customizable blur view component that wraps expo-blur
 * 
 * @param {Object} props - Component props
 * @param {string} props.intensity - Blur intensity (default: 50)
 * @param {string} props.tint - Blur tint color (default: 'light')
 * @param {string} props.variant - Predefined variant ('light', 'dark', 'primary', 'accent')
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Child components
 */
const BlurView = ({ 
  intensity = 50, 
  tint = 'light', 
  variant,
  style,
  children,
  ...props 
}) => {
  // Set properties based on variant
  if (variant) {
    switch (variant) {
      case 'light':
        tint = 'light';
        intensity = 60;
        break;
      case 'dark':
        tint = 'dark';
        intensity = 80;
        break;
      case 'primary':
        tint = 'light';
        intensity = 70;
        break;
      case 'accent':
        tint = 'light';
        intensity = 70;
        break;
      default:
        break;
    }
  }

  return (
    <ExpoBlurView
      intensity={intensity}
      tint={tint}
      style={[styles.blur, style]}
      {...props}
    >
      {variant === 'primary' && (
        <View style={[styles.overlay, { backgroundColor: colors.blur.primary }]} />
      )}
      {variant === 'accent' && (
        <View style={[styles.overlay, { backgroundColor: colors.blur.accent }]} />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </ExpoBlurView>
  );
};

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  content: {
    flex: 1,
  },
});

export default BlurView;
