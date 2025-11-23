import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Snap points matching BottomContainer constants
const MIN_HEIGHT = 120;
const DEFAULT_HEIGHT = 140;
const EXPANDED_HEIGHT = 320;
const FULLY_EXPANDED_HEIGHT = 420;

const SNAP_POINTS = [MIN_HEIGHT, DEFAULT_HEIGHT, EXPANDED_HEIGHT, FULLY_EXPANDED_HEIGHT];

// Spring animation configuration
const SPRING_CONFIG = {
  damping: 30,
  stiffness: 400,
  mass: 0.5,
};

export default function ResizableSplitView({ 
  topContent, 
  bottomContent,
  bottomHeightSharedValue: externalSharedValue 
}) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Explore');
  
  // Initialize bottom height shared value
  const bottomHeight = useSharedValue(DEFAULT_HEIGHT);
  
  // Use external shared value if provided, otherwise use internal one
  const bottomHeightSharedValue = externalSharedValue || bottomHeight;
  
  // Sync with external shared value if provided
  React.useEffect(() => {
    if (externalSharedValue) {
      bottomHeight.value = DEFAULT_HEIGHT;
      externalSharedValue.value = DEFAULT_HEIGHT;
    } else {
      bottomHeight.value = DEFAULT_HEIGHT;
    }
  }, []);

  // Track previous state for haptics
  const previousState = useSharedValue(1); // 0=min, 1=default, 2=expanded, 3=fully expanded

  // Find nearest snap point
  const findNearestSnapPoint = (currentHeight, velocity) => {
    'worklet';
    
    // If velocity is significant, snap in direction of movement
    if (Math.abs(velocity) > 800) {
      if (velocity > 0) {
        // Moving up - find next higher snap point
        for (let i = 0; i < SNAP_POINTS.length - 1; i++) {
          if (currentHeight >= SNAP_POINTS[i] && currentHeight < SNAP_POINTS[i + 1]) {
            return SNAP_POINTS[i + 1];
          }
        }
        return SNAP_POINTS[SNAP_POINTS.length - 1];
      } else {
        // Moving down - find next lower snap point
        for (let i = SNAP_POINTS.length - 1; i > 0; i--) {
          if (currentHeight <= SNAP_POINTS[i] && currentHeight > SNAP_POINTS[i - 1]) {
            return SNAP_POINTS[i - 1];
          }
        }
        return SNAP_POINTS[0];
      }
    }
    
    // Otherwise, find nearest snap point
    let nearest = SNAP_POINTS[0];
    let minDistance = Math.abs(currentHeight - SNAP_POINTS[0]);
    
    for (let i = 1; i < SNAP_POINTS.length; i++) {
      const distance = Math.abs(currentHeight - SNAP_POINTS[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = SNAP_POINTS[i];
      }
    }
    
    return nearest;
  };

  // Determine state index from height
  const getStateIndex = (height) => {
    'worklet';
    if (height <= MIN_HEIGHT + 10) return 0;
    if (height <= DEFAULT_HEIGHT + 10) return 1;
    if (height <= EXPANDED_HEIGHT + 10) return 2;
    return 3;
  };

  // Trigger haptic feedback
  const triggerHaptic = (stateIndex) => {
    if (stateIndex === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (stateIndex === 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (stateIndex === 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Store starting position if needed
    })
    .onUpdate((event) => {
      // Calculate new height (inverse of translationY)
      const newHeight = bottomHeight.value - event.translationY;
      
      // Clamp between min and max
      const clampedHeight = Math.max(
        MIN_HEIGHT,
        Math.min(FULLY_EXPANDED_HEIGHT, newHeight)
      );
      
      bottomHeight.value = clampedHeight;
      bottomHeightSharedValue.value = clampedHeight;
    })
    .onEnd((event) => {
      const currentHeight = bottomHeight.value;
      const velocity = event.velocityY;
      
      // Find target snap point
      const targetHeight = findNearestSnapPoint(currentHeight, -velocity);
      
      // Animate to snap point
      bottomHeight.value = withSpring(targetHeight, SPRING_CONFIG, () => {
        bottomHeightSharedValue.value = targetHeight;
        
        // Check if state changed for haptics
        const newState = getStateIndex(targetHeight);
        if (newState !== previousState.value) {
          previousState.value = newState;
          runOnJS(triggerHaptic)(newState);
        }
      });
    });

  // Animated style for bottom container
  const bottomContainerStyle = useAnimatedStyle(() => {
    return {
      height: bottomHeight.value,
    };
  });

  // Animated style for top content
  const topContentStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      marginBottom: bottomHeight.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Top Content */}
      <Animated.View style={[styles.topContent, topContentStyle]}>
        {topContent}
      </Animated.View>

      {/* Bottom Container */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
          {bottomContent && React.cloneElement(bottomContent, {
            bottomHeight: bottomHeight.value,
            bottomHeightSharedValue: bottomHeightSharedValue,
            activeTab,
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContent: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
});
