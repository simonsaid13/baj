import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/tokens';

/**
 * DragComponent - A draggable component that morphs between two states
 * 
 * Features:
 * - No text state: Small horizontal line (6px height, 40px width)
 * - With text state: Expands to fit text content with padding
 * - Smooth transitions between states using spring animations
 * - Backdrop blur effect matching design system
 * 
 * @param {string} text - Text content to display (empty string for no-text state)
 * @param {Object} style - Additional container styles
 */
export default function DragComponent({ text = '', style }) {
  // Dimensions for no-text state (hardcoded as per requirements)
  const NO_TEXT_HEIGHT = 6;
  const NO_TEXT_WIDTH = 40;
  
  // Padding for with-text state
  const TEXT_PADDING_H = 10;
  const TEXT_PADDING_V = 6;
  
  // Text line height from Typography tokens
  const TEXT_LINE_HEIGHT = Typography.interactiveLine.lineHeight; // 14px
  
  // Height for with-text state: line height (14px) + padding top (6px) + padding bottom (6px) = 26px
  const WITH_TEXT_HEIGHT = TEXT_LINE_HEIGHT + (TEXT_PADDING_V * 2); // 14 + 12 = 26px
  
  // Measure text width (approximate calculation)
  // Using fontSize 11, we can estimate width: ~6.5px per character for semi-bold font
  const estimateTextWidth = (text) => {
    if (!text || text.trim().length === 0) return 0;
    // Approximate: 6.5px per character for 11px semi-bold font
    return text.length * 6.5;
  };
  
  // Calculate initial dimensions based on text presence
  const hasText = text && text.trim().length > 0;
  const getInitialDimensions = () => {
    if (hasText) {
      const textWidth = estimateTextWidth(text);
      return {
        width: textWidth + (TEXT_PADDING_H * 2),
        height: WITH_TEXT_HEIGHT, // 26px
      };
    }
    return {
      width: NO_TEXT_WIDTH,
      height: NO_TEXT_HEIGHT,
    };
  };
  
  const initialDimensions = getInitialDimensions();
  
  // Animated values
  const width = useSharedValue(initialDimensions.width);
  const height = useSharedValue(initialDimensions.height);
  const textOpacity = useSharedValue(hasText ? 1 : 0);
  const containerOpacity = useSharedValue(1);
  
  // Update dimensions when text changes
  useEffect(() => {
    const hasTextNow = text && text.trim().length > 0;
    
    if (hasTextNow) {
      // With text: expand to fit content
      const textWidth = estimateTextWidth(text);
      const targetWidth = textWidth + (TEXT_PADDING_H * 2);
      const targetHeight = WITH_TEXT_HEIGHT; // 26px (14px line height + 12px padding)
      
      // Animate to expanded state
      width.value = withSpring(targetWidth, {
        damping: 15,
        stiffness: 200,
        mass: 0.5,
      });
      height.value = withSpring(targetHeight, {
        damping: 15,
        stiffness: 200,
        mass: 0.5,
      });
      
      // Fade in text
      textOpacity.value = withTiming(1, { duration: 200 });
    } else {
      // No text: collapse to minimal state
      width.value = withSpring(NO_TEXT_WIDTH, {
        damping: 15,
        stiffness: 200,
        mass: 0.5,
      });
      height.value = withSpring(NO_TEXT_HEIGHT, {
        damping: 15,
        stiffness: 200,
        mass: 0.5,
      });
      
      // Fade out text
      textOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [text]);
  
  // Animated container style
  const containerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      opacity: containerOpacity.value,
    };
  });
  
  // Animated text style
  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });
  
  return (
    <Animated.View style={[styles.container, containerStyle, style]}>
      <BlurView
        intensity={2}
        tint="light"
        style={styles.blurContainer}
      >
        <Animated.View style={[styles.textContainer, textStyle]}>
          {hasText && (
            <Text style={styles.text} numberOfLines={1}>
              {text}
            </Text>
          )}
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    paddingHorizontal: Spacing.interactiveLinePaddingH,
    paddingVertical: Spacing.interactiveLinePaddingV,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: Typography.interactiveLine.fontSize,
    fontWeight: Typography.interactiveLine.fontWeight,
    lineHeight: Typography.interactiveLine.lineHeight,
    color: Colors.white,
    opacity: Typography.interactiveLine.opacity,
    textAlign: 'center',
  },
});

