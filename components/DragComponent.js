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
  
  // InteractiveLine height: line height (14px) + padding top (6px) + padding bottom (6px) = 26px
  const INTERACTIVE_LINE_HEIGHT = TEXT_LINE_HEIGHT + (TEXT_PADDING_V * 2); // 14 + 12 = 26px
  
  // Gap between outer container and InteractiveLine (from Figma: gap-[12px])
  const CONTAINER_GAP = 12;
  
  // Total DragComponent height when with text: InteractiveLine height + gap
  const WITH_TEXT_HEIGHT = INTERACTIVE_LINE_HEIGHT + CONTAINER_GAP; // 26 + 12 = 38px
  
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
        containerHeight: WITH_TEXT_HEIGHT, // 38px (outer container)
        interactiveLineHeight: INTERACTIVE_LINE_HEIGHT, // 26px (inner pill)
      };
    }
    return {
      width: NO_TEXT_WIDTH,
      containerHeight: NO_TEXT_HEIGHT,
      interactiveLineHeight: NO_TEXT_HEIGHT,
    };
  };
  
  const initialDimensions = getInitialDimensions();
  
  // Top margin values (container already has 7px paddingTop from ResizableSplitView)
  // No text state: needs 17px total, so 10px additional margin
  // Text state: needs 7px total, so 0px additional margin
  const NO_TEXT_MARGIN_TOP = 10;
  const TEXT_MARGIN_TOP = 0;
  
  // Animated values
  const width = useSharedValue(initialDimensions.width);
  const containerHeight = useSharedValue(initialDimensions.containerHeight);
  const interactiveLineHeight = useSharedValue(initialDimensions.interactiveLineHeight);
  const textOpacity = useSharedValue(hasText ? 1 : 0);
  const containerOpacity = useSharedValue(1);
  const marginTop = useSharedValue(hasText ? TEXT_MARGIN_TOP : NO_TEXT_MARGIN_TOP);
  
  // Update dimensions when text changes
  useEffect(() => {
    const hasTextNow = text && text.trim().length > 0;
    
    const springConfig = {
      damping: 15,
      stiffness: 200,
      mass: 0.5,
    };
    
    if (hasTextNow) {
      // With text: expand to fit content
      const textWidth = estimateTextWidth(text);
      const targetWidth = textWidth + (TEXT_PADDING_H * 2);
      
      // Animate to expanded state
      width.value = withSpring(targetWidth, springConfig);
      containerHeight.value = withSpring(WITH_TEXT_HEIGHT, springConfig); // 38px outer container
      interactiveLineHeight.value = withSpring(INTERACTIVE_LINE_HEIGHT, springConfig); // 26px inner pill
      marginTop.value = withSpring(TEXT_MARGIN_TOP, springConfig); // 0px additional margin
      
      // Fade in text
      textOpacity.value = withTiming(1, { duration: 200 });
    } else {
      // No text: collapse to minimal state
      width.value = withSpring(NO_TEXT_WIDTH, springConfig);
      containerHeight.value = withSpring(NO_TEXT_HEIGHT, springConfig);
      interactiveLineHeight.value = withSpring(NO_TEXT_HEIGHT, springConfig);
      marginTop.value = withSpring(NO_TEXT_MARGIN_TOP, springConfig); // 10px additional margin
      
      // Fade out text
      textOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [text]);
  
  // Animated outer container style
  const containerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: containerHeight.value,
      opacity: containerOpacity.value,
      marginTop: marginTop.value,
    };
  });
  
  // Animated InteractiveLine (blur pill) style
  const interactiveLineStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: interactiveLineHeight.value,
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
      <Animated.View style={[styles.interactiveLineWrapper, interactiveLineStyle]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  interactiveLineWrapper: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
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

