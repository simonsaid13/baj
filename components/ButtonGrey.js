import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius, Sizes, Opacity } from '../constants/tokens';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * ButtonGrey - Reusable button component with icon and label
 * 
 * Props:
 * @param {React.Component} icon - Icon component to display (must accept size and color props)
 * @param {string} label - Text label to display below the icon
 * @param {function} onPress - Callback function when button is pressed
 * @param {boolean} disabled - Whether button is disabled (default: false)
 * @param {SharedValue} scaleProgress - Optional: animated progress (0-1) for proportional scaling
 *                                     When provided, button scales proportionally and content appears at 80%
 * @param {SharedValue} containerScaleY - Optional: container's vertical scale for counter-scaling
 */
export default function ButtonGrey({ 
  icon: Icon, 
  label, 
  onPress, 
  disabled = false,
  scaleProgress = null,
  containerScaleY = null
}) {
  // Shared value for press scale animation
  const pressScale = useSharedValue(1);

  // Handle press with haptic feedback and scale animation
  const handlePressIn = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      pressScale.value = withTiming(0.95, {
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      pressScale.value = withTiming(1, {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      });
    }
  };

  // Animated style for button background - scales proportionally
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    let scaleX = pressScale.value;
    let scaleY = pressScale.value;
    
    // If scaleProgress is provided, combine with proportional scaling
    if (scaleProgress) {
      const proportionalScale = scaleProgress.value;
      scaleX = scaleX * proportionalScale;
      scaleY = scaleY * proportionalScale;
    }
    
    // Counter-scale Y axis if container is scaling vertically
    // This prevents double scaling when container uses scaleY
    if (containerScaleY) {
      const containerScale = containerScaleY.value;
      if (containerScale > 0.01) {
        scaleY = scaleY / containerScale; // Counter-scale to maintain button size
      }
    }
    
    return {
      transform: [{ scaleX }, { scaleY }],
    };
  });

  // Animated style for content (icon and text) - appears at 80% scale
  const contentAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    if (!scaleProgress) {
      return {
        opacity: 1,
      };
    }
    
    const progress = scaleProgress.value;
    
    // Content appears only when button reaches 80% of its scale
    // Fade in from 0.8 to 1.0
    if (progress < 0.8) {
      return {
        opacity: 0,
      };
    }
    
    // Smooth fade in from 0.8 to 1.0
    const fadeProgress = (progress - 0.8) / 0.2; // 0 to 1 as progress goes from 0.8 to 1.0
    return {
      opacity: fadeProgress,
    };
  });

  return (
    <AnimatedTouchable
      style={[styles.button, disabled && styles.buttonDisabled, buttonAnimatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Animated.View style={[styles.content, contentAnimatedStyle]} pointerEvents="none">
        {Icon && <Icon size={Sizes.actionCardIconSize} color={Colors.white} />}
        {label && (
          <Animated.Text style={[styles.label, disabled && styles.labelDisabled]}>
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: Sizes.actionCardHeight,
    backgroundColor: Colors.white10,
    borderRadius: 20, // 20px from Figma design
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    minWidth: 0, // Allow button to shrink in flex container
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs, // 4px gap between icon and label
  },
  label: {
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    opacity: Opacity.disabled, // 0.5 from Figma design
    textAlign: 'center',
  },
  labelDisabled: {
    opacity: 0.3,
  },
});

