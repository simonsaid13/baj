import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_HEIGHT = 48; // Maximum height in pixels
const TEXT_HIDE_THRESHOLD = MAX_HEIGHT * 0.8; // Hide text when height < 80% of max

// Animation constants
const BASE_DURATION_PER_PIXEL = 2; // milliseconds per pixel (slower movement)
const MIN_DURATION = 200; // Minimum duration in ms
const MAX_DURATION = 600; // Maximum duration in ms
const SQUISH_DURATION_RATIO = 0.3; // Squish takes 30% of total duration

/**
 * AnimatedTabs - A tab component with animated white background indicator
 * 
 * Features:
 * - White background moves smoothly to selected tab
 * - Squishing animation during movement
 * - 0.2s bounce animation when reaching target
 * - Supports variable number of tabs
 * - Supports height adjustment (minimized/expanded view)
 * - Can completely disappear (opacity animation)
 * - Text hides when height < 80% of max height
 * - Width scales proportionally with height decrease
 * 
 * @param {Array<string>} tabs - Array of tab labels
 * @param {number} activeIndex - Index of currently active tab (0-based)
 * @param {Function} onTabChange - Callback when tab is pressed (index) => void
 * @param {number} height - Height of tabs (default: 40, max: 48)
 * @param {boolean} minimized - Whether tabs are in minimized state (shows dots only)
 * @param {number} opacity - Opacity of entire component (0-1, default: 1)
 * @param {Object} style - Additional container styles
 */
export default function AnimatedTabs({
  tabs = ['For Me', 'Trending', 'Streams'],
  activeIndex = 0,
  onTabChange,
  height = 40,
  minimized = false,
  opacity = 1,
  style,
}) {
  // Base container width (full width)
  const baseContainerWidth = SCREEN_WIDTH - Spacing.xxl * 2; // 20px padding on each side
  
  // Calculate width scaling based on height
  // Special case: when height = 12px or minimized, width = 32px
  const effectiveHeight = minimized ? 12 : height;
  let containerWidth;
  if (effectiveHeight === 12) {
    containerWidth = 32;
  } else if (effectiveHeight >= TEXT_HIDE_THRESHOLD) {
    // Use full width when height is at or above text hide threshold
    containerWidth = baseContainerWidth;
  } else {
    // Width scales from 100% at text threshold to ~60% at minimum height (4px)
    const heightRatio = Math.max(effectiveHeight / TEXT_HIDE_THRESHOLD, 0.6); // Minimum 60% width
    containerWidth = baseContainerWidth * heightRatio;
  }
  
  const containerPadding = 4; // Padding inside tab bar container
  const tabBarInnerWidth = containerWidth - (containerPadding * 2);
  const tabWidth = tabBarInnerWidth / tabs.length;
  
  // Determine if text should be shown
  const showText = !minimized && height >= TEXT_HIDE_THRESHOLD;
  
  // Calculate initial tab center for animated values
  const initialTabCenter = activeIndex * tabWidth + tabWidth / 2;
  
  // Animated values
  // indicatorPosition represents the center of the tab (for centered anchor point)
  const indicatorPosition = useSharedValue(initialTabCenter);
  const indicatorWidth = useSharedValue(tabWidth);
  const indicatorHeightAnimated = useSharedValue(minimized ? 4 : height);
  const containerWidthAnimated = useSharedValue(containerWidth);
  const containerHeightAnimated = useSharedValue(minimized ? 12 : height + 8);
  const currentPositionRef = useRef(initialTabCenter);
  const prevActiveIndexRef = useRef(activeIndex);
  
  // Initialize position ref and animated values when component mounts
  useEffect(() => {
    // Recalculate tab center based on current dimensions
    const effectiveHeight = minimized ? 12 : height;
    let currentContainerWidth;
    if (effectiveHeight === 12) {
      currentContainerWidth = 32;
    } else if (effectiveHeight >= TEXT_HIDE_THRESHOLD) {
      // Use full width when height is at or above text hide threshold
      currentContainerWidth = baseContainerWidth;
    } else {
      const currentHeightRatio = Math.max(effectiveHeight / TEXT_HIDE_THRESHOLD, 0.6);
      currentContainerWidth = baseContainerWidth * currentHeightRatio;
    }
    const currentTabBarInnerWidth = currentContainerWidth - (containerPadding * 2);
    const currentTabWidth = currentTabBarInnerWidth / tabs.length;
    const tabCenter = activeIndex * currentTabWidth + currentTabWidth / 2;
    
    // Initialize animated values
    containerWidthAnimated.value = currentContainerWidth;
    containerHeightAnimated.value = minimized ? 12 : height + 8;
    indicatorHeightAnimated.value = minimized ? 4 : height;
    
    currentPositionRef.current = tabCenter;
    prevActiveIndexRef.current = activeIndex;
    indicatorPosition.value = tabCenter;
    indicatorWidth.value = currentTabWidth;
  }, []); // Only on mount
  
  // Update position when activeIndex changes
  useEffect(() => {
    // Only animate if activeIndex actually changed
    if (prevActiveIndexRef.current === activeIndex) {
      return;
    }
    
    // Use animated container width for consistent calculations
    const currentContainerWidth = containerWidthAnimated.value;
    const currentTabBarInnerWidth = currentContainerWidth - (containerPadding * 2);
    const currentTabWidth = currentTabBarInnerWidth / tabs.length;
    // Target position is the center of the target tab (for centered anchor point)
    const targetTabCenter = activeIndex * currentTabWidth + currentTabWidth / 2;
    
    // Calculate distance traveled (from center to center)
    const currentPosition = currentPositionRef.current;
    const distance = Math.abs(targetTabCenter - currentPosition);
    
    // Calculate duration based on distance (slower movement)
    // Longer distance = longer duration, but with reasonable bounds
    const calculatedDuration = Math.min(
      Math.max(distance * BASE_DURATION_PER_PIXEL, MIN_DURATION),
      MAX_DURATION
    );
    const squishDuration = calculatedDuration * SQUISH_DURATION_RATIO;
    
    // Update refs for next calculation
    currentPositionRef.current = targetTabCenter;
    prevActiveIndexRef.current = activeIndex;
    
    // Don't animate if indicator should be hidden
    if (!shouldShowIndicator) {
      indicatorPosition.value = targetTabCenter;
      return;
    }
    
    // Adjust spring parameters based on distance (longer distance = slower spring)
    // More damping and less stiffness for longer distances
    const distanceRatio = distance / currentTabWidth;
    const springDamping = Math.max(12, 18 - distanceRatio * 1.5);
    const springStiffness = Math.max(120, 220 - distanceRatio * 25);
    
    // Squish animation during movement
    indicatorWidth.value = withTiming(currentTabWidth * 0.7, {
      duration: squishDuration,
    }, () => {
      // Move to new position with spring (duration depends on distance)
      indicatorPosition.value = withSpring(
        targetTabCenter,
        {
          damping: springDamping,
          stiffness: springStiffness,
          mass: 0.5,
        },
        () => {
          // Expand back with bounce (0.2s bounce effect)
          indicatorWidth.value = withSpring(
            currentTabWidth,
            {
              damping: 8,
              stiffness: 300,
              mass: 0.3,
            }
          );
        }
      );
    });
  }, [activeIndex, height, baseContainerWidth, tabs.length, shouldShowIndicator, containerWidthAnimated]);

  // Update width when tabs array or height changes
  useEffect(() => {
    // Use animated container width for consistent calculations
    const currentContainerWidth = containerWidthAnimated.value;
    const currentTabBarInnerWidth = currentContainerWidth - (containerPadding * 2);
    const newTabWidth = currentTabBarInnerWidth / tabs.length;
    // Position is the center of the tab (for centered anchor point)
    const newTabCenter = activeIndex * newTabWidth + newTabWidth / 2;
    
    // Calculate distance for smooth transition
    const currentPosition = currentPositionRef.current;
    const distance = Math.abs(newTabCenter - currentPosition);
    const duration = Math.min(
      Math.max(distance * BASE_DURATION_PER_PIXEL, MIN_DURATION),
      MAX_DURATION
    );
    
    currentPositionRef.current = newTabCenter;
    
    indicatorWidth.value = withTiming(newTabWidth, { duration: 300 });
    indicatorPosition.value = withTiming(newTabCenter, { duration: 300 });
  }, [tabs.length, height, baseContainerWidth, activeIndex, containerWidthAnimated]);

  // Update position when minimized state changes (to keep indicator centered)
  useEffect(() => {
    // Use animated container width for consistent calculations
    const currentContainerWidth = containerWidthAnimated.value;
    const currentTabBarInnerWidth = currentContainerWidth - (containerPadding * 2);
    const currentTabWidth = currentTabBarInnerWidth / tabs.length;
    // Position is the center of the tab (for centered anchor point)
    const targetTabCenter = activeIndex * currentTabWidth + currentTabWidth / 2;
    
    // Calculate distance for smooth transition
    const currentPosition = currentPositionRef.current;
    const distance = Math.abs(targetTabCenter - currentPosition);
    const duration = Math.min(
      Math.max(distance * BASE_DURATION_PER_PIXEL, MIN_DURATION),
      MAX_DURATION
    );
    
    currentPositionRef.current = targetTabCenter;
    
    indicatorPosition.value = withTiming(targetTabCenter, { duration: 300 });
  }, [minimized, activeIndex, height, baseContainerWidth, tabs.length, containerWidthAnimated]);

  // Calculate indicator dimensions
  const indicatorWidthMinimized = 8; // 8px width for minimized dots
  
  // Determine if indicator should be visible (hide when height < 80% of max)
  const shouldShowIndicator = height >= TEXT_HIDE_THRESHOLD && !minimized;
  
  // Animate container dimensions smoothly when height changes
  useEffect(() => {
    // If height is 0, component completely disappears
    if (height === 0) {
      containerWidthAnimated.value = withTiming(0, { duration: 300 });
      containerHeightAnimated.value = withTiming(0, { duration: 300 });
      indicatorHeightAnimated.value = withTiming(0, { duration: 300 });
      indicatorWidth.value = withTiming(0, { duration: 300 });
      return;
    }
    
    const effectiveHeight = minimized ? 12 : height;
    let targetContainerWidth;
    if (effectiveHeight === 12) {
      targetContainerWidth = 32;
    } else if (effectiveHeight >= TEXT_HIDE_THRESHOLD) {
      // Use full width when height is at or above text hide threshold
      targetContainerWidth = baseContainerWidth;
    } else {
      const currentHeightRatio = Math.max(effectiveHeight / TEXT_HIDE_THRESHOLD, 0.6);
      targetContainerWidth = baseContainerWidth * currentHeightRatio;
    }
    const targetContainerHeight = minimized ? 12 : height + 8;
    const targetIndicatorHeight = minimized ? 4 : height;
    
    // Smooth transitions for all dimensions
    containerWidthAnimated.value = withTiming(targetContainerWidth, {
      duration: 300,
    });
    containerHeightAnimated.value = withTiming(targetContainerHeight, {
      duration: 300,
    });
    indicatorHeightAnimated.value = withTiming(targetIndicatorHeight, {
      duration: 300,
    });
  }, [height, minimized, baseContainerWidth]);

  // Update indicator position and width when container width changes (due to height changes)
  useEffect(() => {
    // Skip if height is 0 (component is hidden)
    if (height === 0) {
      return;
    }
    
    const effectiveHeight = minimized ? 12 : height;
    let targetContainerWidth;
    if (effectiveHeight === 12) {
      targetContainerWidth = 32;
    } else if (effectiveHeight >= TEXT_HIDE_THRESHOLD) {
      // Use full width when height is at or above text hide threshold
      targetContainerWidth = baseContainerWidth;
    } else {
      const currentHeightRatio = Math.max(effectiveHeight / TEXT_HIDE_THRESHOLD, 0.6);
      targetContainerWidth = baseContainerWidth * currentHeightRatio;
    }
    
    // Recalculate tab center based on new container width
    const newTabBarInnerWidth = targetContainerWidth - (containerPadding * 2);
    const newTabWidth = newTabBarInnerWidth / tabs.length;
    const newTabCenter = activeIndex * newTabWidth + newTabWidth / 2;
    
    // Update position smoothly to match new tab center
    indicatorPosition.value = withTiming(newTabCenter, { duration: 300 });
    currentPositionRef.current = newTabCenter;
    
    // Update indicator width if it should be visible
    if (shouldShowIndicator && !minimized) {
      indicatorWidth.value = withTiming(newTabWidth, { duration: 300 });
    }
  }, [height, minimized, baseContainerWidth, activeIndex, tabs.length, shouldShowIndicator]);

  // Update indicator width when minimized state changes or height changes
  // Note: Position update is handled in the container width animation callback above
  useEffect(() => {
    const effectiveHeight = minimized ? 12 : height;
    
    // Hide indicator if height < 80% of max
    if (!shouldShowIndicator) {
      indicatorWidth.value = withTiming(0, { duration: 200 });
      return;
    }
    
    if (minimized) {
      // When minimized, set indicator width to minimized size smoothly
      indicatorWidth.value = withTiming(indicatorWidthMinimized, { duration: 200 });
    } else {
      // When expanded, restore to full tab width - calculate from current height
      let currentContainerWidth;
      if (effectiveHeight === 12) {
        currentContainerWidth = 32;
      } else if (effectiveHeight >= TEXT_HIDE_THRESHOLD) {
        // Use full width when height is at or above text hide threshold
        currentContainerWidth = baseContainerWidth;
      } else {
        const currentHeightRatio = Math.max(effectiveHeight / TEXT_HIDE_THRESHOLD, 0.6);
        currentContainerWidth = baseContainerWidth * currentHeightRatio;
      }
      const currentTabBarInnerWidth = currentContainerWidth - (containerPadding * 2);
      const currentTabWidth = currentTabBarInnerWidth / tabs.length;
      indicatorWidth.value = withTiming(currentTabWidth, { duration: 300 });
    }
  }, [minimized, height, baseContainerWidth, tabs.length, shouldShowIndicator]);

  // Animated style for the white background indicator
  const indicatorStyle = useAnimatedStyle(() => {
    // Hide indicator when height < 80% of max
    if (!shouldShowIndicator) {
      return {
        opacity: 0,
        width: 0,
        height: 0,
      };
    }
    
    // Use animated container width for smooth transitions
    const currentContainerWidth = containerWidthAnimated.value;
    const currentTabBarInnerWidth = currentContainerWidth - (containerPadding * 2);
    const currentTabWidth = currentTabBarInnerWidth / tabs.length;
    
    const width = indicatorWidth.value;
    // indicatorPosition.value already represents the center of the tab
    // Position indicator so its center aligns with tab center
    // Left position = tabCenter - width/2
    const tabCenter = indicatorPosition.value;
    const posX = tabCenter - width / 2;
    
    return {
      opacity: 1,
      transform: [{ translateX: posX }],
      width: width,
      height: indicatorHeightAnimated.value,
    };
  });

  // Container opacity and height animation (width fills parent)
  const containerStyle = useAnimatedStyle(() => {
    // If height is 0, component completely disappears
    const isHidden = height === 0;
    return {
      opacity: isHidden ? 0 : opacity,
      height: containerHeightAnimated.value,
      // Width fills parent - don't set explicit width here
    };
  });

  const handleTabPress = (index) => {
    if (index === activeIndex) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (onTabChange) {
      onTabChange(index);
    }
  };

  // Animated style for tab bar container width - centered alignment
  const tabBarContainerStyle = useAnimatedStyle(() => {
    return {
      width: containerWidthAnimated.value,
      alignSelf: 'center', // Center the container when width animates
    };
  });

  // If height is 0, component is completely hidden (handled by opacity in containerStyle)
  // But we still render it so animations can complete smoothly
  
  return (
    <Animated.View style={[styles.container, containerStyle, style]}>
      <Animated.View style={[styles.tabBarContainer, tabBarContainerStyle]}>
        {/* Animated white background indicator */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
        
        {/* Tab items */}
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={`${tab}-${index}`}
            style={[
              styles.tabItem,
              { width: tabWidth },
              minimized && styles.tabItemMinimized,
            ]}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
            disabled={height === 0}
          >
            {minimized || !showText ? (
              <View
                style={[
                  styles.tabDot,
                  index === activeIndex && styles.tabDotActive,
                ]}
              />
            ) : (
              <Text
                style={[
                  styles.tabLabel,
                  index === activeIndex && styles.tabLabelActive,
                ]}
              >
                {tab}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%', // Fill parent width
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 99,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
    // Backdrop blur effect (React Native doesn't support backdrop-filter natively)
    // Using white background with slight transparency for similar effect
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 0,
    borderRadius: 20,
    zIndex: 1,
  },
  tabItemMinimized: {
    paddingVertical: 0,
    height: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabDot: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  tabDotActive: {
    backgroundColor: Colors.white,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.5,
    textAlign: 'center',
  },
  tabLabelActive: {
    opacity: 1,
    color: Colors.black,
  },
});

