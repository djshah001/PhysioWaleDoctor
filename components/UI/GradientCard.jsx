import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import colors from "../../constants/colors";

/**
 * A card component with gradient background and animation
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - Predefined variant ('primary', 'secondary', 'accent', 'light', 'dark', 'glass')
 * @param {Array} props.gradientColors - Custom gradient colors
 * @param {Object} props.style - Additional styles for the card
 * @param {Object} props.contentStyle - Additional styles for the card content
 * @param {boolean} props.animated - Whether to animate the card (default: true)
 * @param {Object} props.animationProps - Custom animation properties
 * @param {React.ReactNode} props.children - Child components
 */
const GradientCard = ({
  variant = "light",
  gradientColors,
  style,
  contentStyle,
  animated = true,
  animationProps = {},
  children,
  ...props
}) => {
  // Set gradient colors based on variant
  let colors1, colors2;

  if (!gradientColors) {
    switch (variant) {
      case "primary":
        colors1 = colors.gradients.primary;
        break;
      case "secondary":
        colors1 = colors.gradients.secondary;
        break;
      case "secondary2":
        colors1 = colors.gradients.secondary2;
        break;
      case "accent":
        colors1 = colors.gradients.accent;
        break;
      case "success":
        colors1 = colors.gradients.success;
        break;
      case "warning":
        colors1 = colors.gradients.warning;
        break;
      case "error":
        colors1 = colors.gradients.error;
        break;
      case "glass":
        colors1 = colors.gradients.glass;
        break;
      case "accentGlass":
        colors1 = colors.gradients.accentGlass;
        break;
      case "primaryGlass":
        colors1 = colors.gradients.primaryGlass;
        break;
      case "dark":
        colors1 = colors.gradients.dark;
        break;
      case "light":
      default:
        colors1 = colors.gradients.light;
        break;
    }
  } else {
    colors1 = gradientColors;
  }

  const cardContent = (
    <Card style={[styles.card, style]} {...props}>
      <LinearGradient
        colors={colors1}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Card.Content style={[styles.content, contentStyle]}>
          {children}
        </Card.Content>
      </LinearGradient>
    </Card>
  );

  // If animated, wrap in MotiView
  if (animated) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        {...animationProps}
      >
        {cardContent}
      </MotiView>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

export default GradientCard;
