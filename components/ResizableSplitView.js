import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, Sizes, Typography } from '../constants/tokens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 0; // Removed header height offset
const STATUS_BAR_HEIGHT = 0;
const HANDLE_HEIGHT = 40; // Defined handle height

// Define heights based on bottom container states
const BOTTOM_EXPLORE_DEFAULT = 140;      // Explore collapsed state
const BOTTOM_ASSISTANT_HEIGHT = 220;     // Assistant mode: 3 action buttons
const BOTTOM_EXPLORE_MIN = 320;          // Explore min: 6 action cards (2 rows)
const BOTTOM_EXPLORE_MAX = 400;          // Explore max: 8 action cards (3 rows)

// Calculate top section heights from bottom heights - accounting for full screen usage (no status bar padding)
const MIN_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_MAX - HANDLE_HEIGHT;
const DEFAULT_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_MIN - HANDLE_HEIGHT;
const ASSISTANT_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_ASSISTANT_HEIGHT - HANDLE_HEIGHT;
const MAX_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_DEFAULT - HANDLE_HEIGHT;

const ANIMATION_CONFIG = {
  damping: 30,
  stiffness: 400,
  mass: 0.7,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const VELOCITY_THRESHOLD = 800;
const HEIGHT_THRESHOLD = 50;

export default function ResizableSplitView({ 
  topSection, 
  bottomSection,
  onStateChange,
  bottomHeightSharedValue,
  interactiveText = '', // Dynamic text for InteractiveLine
  externalBottomHeight = null, // External height control from BottomContainer
  enableDrag = true, // Whether drag handle is enabled
  activeTab = 'Explore' // Current active tab to determine valid snap points
}) {
  const insets = useSafeAreaInsets();
  const topSectionHeight = useSharedValue(MAX_TOP_SECTION_HEIGHT);
  const isDragging = useSharedValue(false);
  const startY = useSharedValue(0);
  
  // Shared values for smooth InteractiveLine transitions
  const interactiveLineHeight = useSharedValue(6);
  const interactiveLineWidth = useSharedValue(40);
  const interactiveLinePaddingH = useSharedValue(0);
  const interactiveLinePaddingV = useSharedValue(0);
  const textWidth = useSharedValue(0);
  const hasText = useSharedValue(false); // Track if text exists (accessible in worklets)
  
  // Update hasText shared value when interactiveText prop changes
  React.useEffect(() => {
    const hasTextValue = !!interactiveText;
    hasText.value = hasTextValue;
    
    if (!hasTextValue) {
      // Clear text width when no text
      textWidth.value = 0;
    } else {
      // Reset to 0 to force re-measurement when text appears or changes
      // This ensures onLayout will fire again and measure the new text
      textWidth.value = 0;
    }
  }, [interactiveText, hasText, textWidth]);

  // Handle external bottom height changes (e.g., from Assistant mode, keyboard)
  React.useEffect(() => {
    if (externalBottomHeight !== null) {
      const newTopHeight = SCREEN_HEIGHT - HANDLE_HEIGHT - externalBottomHeight;
      // Allow top section to shrink for keyboard, but not go negative
      const clampedTopHeight = Math.max(0, Math.min(MAX_TOP_SECTION_HEIGHT, newTopHeight));
      topSectionHeight.value = withTiming(clampedTopHeight, {
        duration: 300,
      });
    }
  }, [externalBottomHeight, topSectionHeight]);
  
  // Measure text width when it's laid out - measure the actual text content width
  const handleTextLayout = React.useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    // Only update if we get a reasonable width (not full screen) and we have text
    if (width > 0 && width < 500 && interactiveText) {
      // Store the measured text width (this is the text content width, not including padding)
      // Force update even if it seems the same - this handles text reappearing
      const previousWidth = textWidth.value;
      textWidth.value = width;
      
      // If width changed or was 0 (text just appeared), trigger immediate update
      if (previousWidth === 0 || Math.abs(previousWidth - width) > 0.5) {
        // Force the reaction to trigger by setting a flag
        // The useAnimatedReaction will pick this up
      }
    }
  }, [textWidth, interactiveText]);

  // Consolidated logic: Watch height, text state, and measured width to determine size responsively
  useAnimatedReaction(
    () => {
      'worklet';
      const height = bottomHeightSharedValue?.value ?? BOTTOM_EXPLORE_DEFAULT;
      const showText = (height > BOTTOM_EXPLORE_DEFAULT && height <= BOTTOM_EXPLORE_MIN);
      return { 
        height, 
        showText, 
        textWidth: textWidth.value, 
        hasText: hasText.value 
      };
    },
    (current, previous) => {
      'worklet';
      // Skip if values haven't changed
      if (previous && 
          current.height === previous.height && 
          current.showText === previous.showText && 
          current.textWidth === previous.textWidth &&
          current.hasText === previous.hasText) {
        return;
      }
      
      const { showText, textWidth: measuredWidth, hasText: textExists } = current;
      
      if (showText && textExists) {
        // Expanded state WITH text: smooth transition to expanded size
        interactiveLineHeight.value = withTiming(26, { duration: 200 });
        // Width = textWidth + 24px (20px padding + 4px buffer) if measured
        // If not measured yet (measuredWidth === 0), keep current width - don't shrink to 40px
        // This prevents truncation when text reappears
        if (measuredWidth > 0 && measuredWidth < 500) {
          const expandedWidth = measuredWidth + 24;
          // Always update when we have a measurement - this handles text reappearing
          // Don't check if different - always update to ensure correct width
          interactiveLineWidth.value = withTiming(expandedWidth, { duration: 200 });
        }
        // If measuredWidth is 0, don't change width - let measurement reaction handle it
        // This prevents the main reaction from interfering when text is being measured
        interactiveLinePaddingH.value = withTiming(10, { duration: 200 });
        interactiveLinePaddingV.value = withTiming(6, { duration: 200 });
      } else {
        // Minimized state OR no text: smooth transition to pill size - ALWAYS 40px
        interactiveLineHeight.value = withTiming(6, { duration: 200 });
        interactiveLineWidth.value = withTiming(40, { duration: 200 });
        interactiveLinePaddingH.value = withTiming(0, { duration: 200 });
        interactiveLinePaddingV.value = withTiming(0, { duration: 200 });
      }
    }
  );
  
  // Update width immediately when text is measured (for smooth transitions during measurement)
  useAnimatedReaction(
    () => {
      'worklet';
      return {
        textWidth: textWidth.value,
        height: bottomHeightSharedValue?.value ?? BOTTOM_EXPLORE_DEFAULT,
        hasText: hasText.value,
      };
    },
    (current, previous) => {
      'worklet';
      const { textWidth: currentWidth, height, hasText: textExists } = current;
      const showText = (height > BOTTOM_EXPLORE_DEFAULT && height <= BOTTOM_EXPLORE_MIN);
      
      // Update when text is measured and we're in expanded state
      // Also trigger when text reappears (previousWidth was 0, now has value)
      const wasZero = previous?.textWidth === 0 || !previous;
      const isValidMeasurement = currentWidth > 0 && currentWidth < 500;
      
      if (showText && textExists && isValidMeasurement) {
        const newWidth = currentWidth + 24;
        
        // ALWAYS update when:
        // 1. Text was just measured (was 0, now has value) - CRITICAL for text reappearing
        // 2. Width is significantly different from current
        // Remove the previous check to ensure it always updates when text reappears
        const shouldUpdate = wasZero || !previous || Math.abs(interactiveLineWidth.value - newWidth) > 1;
        
        if (shouldUpdate) {
          // Force update - this handles text reappearing after being hidden
          interactiveLineWidth.value = withTiming(newWidth, { duration: 200 });
        }
      }
    }
  );

  const interactiveLineStyle = useAnimatedStyle(() => {
    'worklet';
    // In React Native, padding is INSIDE the width
    // So: width = textWidth + paddingHorizontal*2 + buffer
    // This ensures the text fits with padding on both sides
    return {
      height: interactiveLineHeight.value,
      width: interactiveLineWidth.value,
      minHeight: interactiveLineHeight.value,
      paddingHorizontal: interactiveLinePaddingH.value,
      paddingVertical: interactiveLinePaddingV.value,
    };
  });

  // Animated styles for text opacity - chained to bottomHeight
  const textOpacityStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { opacity: 0 };
    }
    
    const height = bottomHeightSharedValue.value;
    
    // Hide when collapsed (<= EXPLORE_DEFAULT) OR expanded beyond EXPLORE_MIN
    // Show with smooth fade in/out transitions
    
    let opacity = 0;
    
    if (height <= BOTTOM_EXPLORE_DEFAULT) {
      opacity = 0;
    } else if (height > BOTTOM_EXPLORE_DEFAULT && height <= BOTTOM_EXPLORE_MIN) {
      // Smooth fade in from EXPLORE_DEFAULT, stay fully visible until EXPLORE_MIN
      const fadeInRange = 20; // Fade in over 20px
      
      if (height < BOTTOM_EXPLORE_DEFAULT + fadeInRange) {
        // Fade in from EXPLORE_DEFAULT
        opacity = (height - BOTTOM_EXPLORE_DEFAULT) / fadeInRange;
      } else {
        // Fully visible from EXPLORE_DEFAULT + fadeInRange to EXPLORE_MIN
        opacity = 1;
      }
    } else {
      // Fade out quickly after EXPLORE_MIN
      const fadeOutRange = 20;
      if (height <= BOTTOM_EXPLORE_MIN + fadeOutRange) {
        opacity = 1 - (height - BOTTOM_EXPLORE_MIN) / fadeOutRange;
      } else {
        opacity = 0;
      }
    }
    
    return { opacity: Math.max(0, Math.min(1, opacity)) };
  });


  const panGesture = Gesture.Pan()
    .enabled(enableDrag)
    .onStart((event) => {
      startY.value = topSectionHeight.value;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      // When dragging UP (negative translationY), we want to REDUCE top section (expand bottom)
      // When dragging DOWN (positive translationY), we want to INCREASE top section (minimize bottom)
      const newHeight = startY.value + event.translationY;
      topSectionHeight.value = Math.max(
        MIN_SECTION_HEIGHT,
        Math.min(MAX_TOP_SECTION_HEIGHT, newHeight)
      );
      // bottomHeightSharedValue is updated automatically in bottomSectionAnimatedStyle
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      const currentHeight = topSectionHeight.value;
      const velocity = event.velocityY;

      let targetHeight;

      // Determine valid snap points based on active tab
      let snapPoints;
      if (activeTab === 'Explore') {
        // Explore tab: 3 states - collapsed, min (6 cards), max (8 cards)
        snapPoints = [MIN_SECTION_HEIGHT, DEFAULT_TOP_SECTION_HEIGHT, MAX_TOP_SECTION_HEIGHT];
      } else if (activeTab === 'Assistant') {
        // Assistant tab: fixed height, only allows collapsed state
        snapPoints = [ASSISTANT_TOP_SECTION_HEIGHT, MAX_TOP_SECTION_HEIGHT];
      } else {
        // Other tabs (Scan, Services): only collapsed state
        snapPoints = [MAX_TOP_SECTION_HEIGHT];
      }

      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        // High velocity swipe
        if (velocity < 0) {
          // Swiping up - expand bottom (reduce top)
          const nextSnapPoint = snapPoints.find(point => point < currentHeight - HEIGHT_THRESHOLD);
          targetHeight = nextSnapPoint || snapPoints[0]; // Use first (minimum) if none found
        } else {
          // Swiping down - minimize bottom (expand top)
          const reversedSnapPoints = [...snapPoints].reverse();
          const nextSnapPoint = reversedSnapPoints.find(point => point > currentHeight + HEIGHT_THRESHOLD);
          targetHeight = nextSnapPoint || snapPoints[snapPoints.length - 1]; // Use last (maximum) if none found
        }
      } else {
        // Low velocity - snap to nearest valid snap point for this tab
        const distances = snapPoints.map(point => ({
          point,
          distance: Math.abs(currentHeight - point)
        }));
        
        distances.sort((a, b) => a.distance - b.distance);
        targetHeight = distances[0].point;
      }

      topSectionHeight.value = withSpring(targetHeight, ANIMATION_CONFIG, (finished) => {
        if (finished) {
          const calculatedBottomHeight = SCREEN_HEIGHT - targetHeight - HANDLE_HEIGHT;
          if (onStateChange) {
            runOnJS(onStateChange)(calculatedBottomHeight);
          }
        }
      });
    });

  const topSectionAnimatedStyle = useAnimatedStyle(() => ({
    height: topSectionHeight.value,
  }));

  const bottomSectionAnimatedStyle = useAnimatedStyle(() => {
    const calculatedHeight = SCREEN_HEIGHT - topSectionHeight.value - HANDLE_HEIGHT;
    // Update shared value in real-time for smooth chaining
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = calculatedHeight;
    }
    return {
      height: calculatedHeight,
      // No padding/margin - let tab bar sit at actual bottom
    };
  });

  return (
    <View style={styles.container}>
      {/* Top Section - Resizable */}
      <Animated.View style={[styles.topSection, topSectionAnimatedStyle]}>
        {topSection}
      </Animated.View>

      {/* Interactive Line - Drag Handle */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.dragHandleContainer}>
          <View style={styles.interactiveLineWrapper}>
            {/* Hidden text for accurate measurement - positioned absolutely, not constrained */}
            {interactiveText ? (
              <Text
                style={[
                  styles.interactiveLineText,
                  {
                    position: 'absolute',
                    opacity: 0,
                    zIndex: -1,
                    left: -10000, // Move off-screen
                  }
                ]}
                numberOfLines={1}
                onLayout={handleTextLayout}
                allowFontScaling={false}
              >
                {interactiveText}
              </Text>
            ) : null}
            <Animated.View style={[styles.interactiveLineContainer, interactiveLineStyle]}>
              <BlurView intensity={2} tint="light" style={styles.interactiveLine}>
                {interactiveText ? (
                  <Animated.Text 
                    style={[styles.interactiveLineText, textOpacityStyle]} 
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    {interactiveText}
                  </Animated.Text>
                ) : null}
              </BlurView>
            </Animated.View>
          </View>
        </View>
      </GestureDetector>

      {/* Bottom Section - Auto-adjusting */}
      <Animated.View style={[styles.bottomSection, bottomSectionAnimatedStyle]}>
        {bottomSection}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlack,
  },
  topSection: {
    overflow: 'hidden',
  },
  dragHandleContainer: {
    height: 40, // Increased to accommodate the taller interactive line
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.dragHandlePaddingV,
  },
  interactiveLineWrapper: {
    height: 36, // Increased height to prevent clipping (was 40)
    alignItems: 'center',
    justifyContent: 'center',
  },
  interactiveLineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white14,
  },
  interactiveLine: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  interactiveLineText: {
    fontSize: Typography.interactiveLine.fontSize,
    fontWeight: Typography.interactiveLine.fontWeight,
    color: Colors.white,
    lineHeight: Typography.interactiveLine.lineHeight,
    textAlign: 'center',
  },
  bottomSection: {
    overflow: 'hidden',
    backgroundColor: Colors.backgroundBlack,
  },
});

