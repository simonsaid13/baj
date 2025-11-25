import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedReaction,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/tokens';
import DragComponent from './DragComponent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HANDLE_HEIGHT = 40; // Drag handle height

// Bottom section heights per tab (following our app's design system)
const BOTTOM_EXPLORE_MIN = 220;          // Explore min: InputBar + TabBar + spacing
const BOTTOM_EXPLORE_MAX = 280;          // Explore max: AnimatedTabs + InputBar + TabBar

const BOTTOM_SERVICE_MIN = 220;          // Service min: InputBar + TabBar + spacing
const BOTTOM_SERVICE_MAX = 460;          // Service max: ButtonBar (3 lines × 72px + gaps) + InputBar + TabBar + spacing

const BOTTOM_PAY_MIN = 220;              // Pay min: InputBar + TabBar + spacing
const BOTTOM_PAY_MAX = 312;              // Pay max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing

const BOTTOM_WORLDS_MIN = 220;           // Worlds min: InputBar + TabBar + spacing
const BOTTOM_WORLDS_MAX = 312;           // Worlds max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing

const BOTTOM_ASSISTANT_MIN = 220;        // Assistant min: InputBar + TabBar + spacing
const BOTTOM_ASSISTANT_MAX = 312;        // Assistant max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing

// Calculate top section heights for each tab (following documentation pattern)
// MIN = smallest top section (largest bottom), MAX = largest top section (smallest bottom)
const EXPLORE_MIN_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const EXPLORE_MAX_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

const SERVICE_MIN_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_SERVICE_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const SERVICE_MAX_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_SERVICE_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

const PAY_MIN_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_PAY_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const PAY_MAX_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_PAY_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

const WORLDS_MIN_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_WORLDS_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const WORLDS_MAX_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_WORLDS_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

const ASSISTANT_MIN_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_ASSISTANT_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const ASSISTANT_MAX_TOP_HEIGHT = SCREEN_HEIGHT - BOTTOM_ASSISTANT_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

const ANIMATION_CONFIG = {
  damping: 25,        // Controls bounce (lower = more bouncy)
  stiffness: 300,     // Controls speed (higher = faster)
  mass: 0.8,          // Controls inertia (higher = more inertia)
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const VELOCITY_THRESHOLD = 800; // High velocity threshold (>800px/s)
const HEIGHT_THRESHOLD = 50;   // Height threshold for snap decisions

export default function ResizableSplitView({
  topSection,
  bottomSection,
  onStateChange,
  bottomHeightSharedValue, // Core shared value for height control
  interactiveText = '', // Dynamic text for InteractiveLine
  enableDrag = true, // Whether drag handle is enabled
  activeTab = 'Explore' // Current active tab to determine valid snap points
}) {
  // Core shared value following documentation pattern
  const topSectionHeight = useSharedValue(getInitialTopHeight(activeTab, bottomHeightSharedValue));
  const isDragging = useSharedValue(false);
  const startY = useSharedValue(0);

  // Get initial top height based on bottomHeightSharedValue or defaults
  function getInitialTopHeight(tab, bottomHeightShared) {
    if (bottomHeightShared && bottomHeightShared.value) {
      // If external height is set, derive top height from it
      return SCREEN_HEIGHT - bottomHeightShared.value - HANDLE_HEIGHT;
    }

    // Default to MIN state for each tab (largest bottom section)
    switch (tab) {
      case 'Services': return SERVICE_MIN_TOP_HEIGHT;
      case 'Pay': return PAY_MIN_TOP_HEIGHT;
      case 'Worlds': return WORLDS_MIN_TOP_HEIGHT;
      case 'Assistant': return ASSISTANT_MIN_TOP_HEIGHT;
      default: return EXPLORE_MIN_TOP_HEIGHT;
    }
  }

  // Track previous activeTab to detect tab changes
  const prevActiveTabRef = React.useRef(activeTab);
  
  // Sync topSectionHeight when activeTab changes
  // This ensures proper reset to MIN state when switching tabs
  React.useEffect(() => {
    const tabChanged = prevActiveTabRef.current !== activeTab;
    prevActiveTabRef.current = activeTab;
    
    if (tabChanged && bottomHeightSharedValue) {
      // Calculate the target MIN height for the new tab (matching ExploreScreen's logic)
      let targetMinHeight;
      switch (activeTab) {
        case 'Services': targetMinHeight = BOTTOM_SERVICE_MIN; break;
        case 'Pay': targetMinHeight = BOTTOM_PAY_MIN; break;
        case 'Worlds': targetMinHeight = BOTTOM_WORLDS_MIN; break;
        case 'Assistant': targetMinHeight = BOTTOM_ASSISTANT_MIN; break;
        default: targetMinHeight = BOTTOM_EXPLORE_MIN;
      }
      
      // Sync immediately to the target MIN height
      // This matches what ExploreScreen's handleTabChange does
      const targetTopHeight = SCREEN_HEIGHT - targetMinHeight - HANDLE_HEIGHT;
      topSectionHeight.value = withTiming(targetTopHeight, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [activeTab]);

  // Handle external bottom height changes using useAnimatedReaction
  // This ensures proper response to bottomHeightSharedValue changes from dragging
  // Note: Tab changes are handled by the useEffect above for immediate sync
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue) return null;
      return Math.round(bottomHeightSharedValue.value);
    },
    (currentBottomHeight, previousBottomHeight) => {
      'worklet';
      // Only respond to significant changes (not tiny adjustments)
      // Skip if this is likely a tab change (handled by useEffect)
      if (previousBottomHeight !== null && Math.abs(currentBottomHeight - previousBottomHeight) > 5) {
        const newTopHeight = SCREEN_HEIGHT - currentBottomHeight - HANDLE_HEIGHT;

        // Animate to the new top height
        topSectionHeight.value = withTiming(newTopHeight, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
    },
    [bottomHeightSharedValue]
  );

  // Track interactive text - use state to ensure DragComponent receives updates
  // Use a key-based approach to force updates when transitioning states
  const [displayText, setDisplayText] = React.useState(interactiveText || '');
  const prevHeightRef = React.useRef(bottomHeightSharedValue?.value ?? 0);
  
  // Update displayText when interactiveText prop changes
  React.useEffect(() => {
    setDisplayText(interactiveText || '');
  }, [interactiveText]);
  
  // Track bottomHeightSharedValue changes to ensure text updates when transitioning states
  // This is critical for ensuring text appears when going from MAX to MIN
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue) return 0;
      // Round to avoid unnecessary updates from tiny changes
      return Math.round(bottomHeightSharedValue.value);
    },
    (currentHeight, previousHeight) => {
      'worklet';
      // Update when height changes significantly
      if (previousHeight === undefined || Math.abs(currentHeight - previousHeight) > 5) {
        // Trigger update on JS thread to sync with latest interactiveText
        // The small delay ensures ContextBar's useAnimatedReaction has run first
        runOnJS(setDisplayText)('');
      }
    },
    [bottomHeightSharedValue]
  );
  
  // Re-sync with interactiveText after height changes
  // This ensures we get the latest text value from ContextBar after state transitions
  React.useEffect(() => {
    if (!bottomHeightSharedValue) return;
    
    const currentHeight = Math.round(bottomHeightSharedValue.value);
    const prevHeight = prevHeightRef.current;
    
    // If height changed significantly, re-sync text after a brief delay
    if (Math.abs(currentHeight - prevHeight) > 5) {
      prevHeightRef.current = currentHeight;
      
      // Delay to ensure ContextBar's useAnimatedReaction has updated interactiveText
      const timeoutId = setTimeout(() => {
        setDisplayText(interactiveText || '');
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [interactiveText, activeTab, bottomHeightSharedValue]);


  const panGesture = Gesture.Pan()
    .enabled(enableDrag)
    .onStart(() => {
      'worklet';
      startY.value = topSectionHeight.value;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      'worklet';
      // Calculate new height based on finger movement
      const newHeight = startY.value + event.translationY;

      // Get snap positions for current tab (MIN, MAX only - following documentation)
      let minTopHeight, maxTopHeight;
      switch (activeTab) {
        case 'Services':
          minTopHeight = SERVICE_MIN_TOP_HEIGHT;
          maxTopHeight = SERVICE_MAX_TOP_HEIGHT;
          break;
        case 'Pay':
          minTopHeight = PAY_MIN_TOP_HEIGHT;
          maxTopHeight = PAY_MAX_TOP_HEIGHT;
          break;
        case 'Worlds':
          minTopHeight = WORLDS_MIN_TOP_HEIGHT;
          maxTopHeight = WORLDS_MAX_TOP_HEIGHT;
          break;
        case 'Assistant':
          minTopHeight = ASSISTANT_MIN_TOP_HEIGHT;
          maxTopHeight = ASSISTANT_MAX_TOP_HEIGHT;
          break;
        default:
          minTopHeight = EXPLORE_MIN_TOP_HEIGHT;
          maxTopHeight = EXPLORE_MAX_TOP_HEIGHT;
      }

      // Constrain to valid range
      topSectionHeight.value = Math.max(minTopHeight, Math.min(maxTopHeight, newHeight));

      // Update shared value in real-time
      if (bottomHeightSharedValue) {
        bottomHeightSharedValue.value = SCREEN_HEIGHT - topSectionHeight.value - HANDLE_HEIGHT;
      }
    })
    .onEnd((event) => {
      'worklet';
      isDragging.value = false;

      const currentHeight = topSectionHeight.value;
      const velocity = event.velocityY;

      // Get snap positions for current tab (MIN, MAX only)
      let snapPoints;
      switch (activeTab) {
        case 'Services':
          snapPoints = [SERVICE_MIN_TOP_HEIGHT, SERVICE_MAX_TOP_HEIGHT];
          break;
        case 'Pay':
          snapPoints = [PAY_MIN_TOP_HEIGHT, PAY_MAX_TOP_HEIGHT];
          break;
        case 'Worlds':
          snapPoints = [WORLDS_MIN_TOP_HEIGHT, WORLDS_MAX_TOP_HEIGHT];
          break;
        case 'Assistant':
          snapPoints = [ASSISTANT_MIN_TOP_HEIGHT, ASSISTANT_MAX_TOP_HEIGHT];
          break;
        default:
          snapPoints = [EXPLORE_MIN_TOP_HEIGHT, EXPLORE_MAX_TOP_HEIGHT];
      }

      let targetHeight;

      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        // High velocity swipe - snap to next/previous position
        if (velocity < 0) {
          // Swiping up (negative velocity) - expand bottom (reduce top)
          const nextSnapPoint = snapPoints.find(point => point < currentHeight - HEIGHT_THRESHOLD);
          targetHeight = nextSnapPoint || snapPoints[0]; // Use first (minimum) if none found
        } else {
          // Swiping down (positive velocity) - minimize bottom (expand top)
          const reversedSnapPoints = [...snapPoints].reverse();
          const nextSnapPoint = reversedSnapPoints.find(point => point > currentHeight + HEIGHT_THRESHOLD);
          targetHeight = nextSnapPoint || snapPoints[snapPoints.length - 1]; // Use last (maximum) if none found
        }
      } else {
        // Low velocity - snap to nearest valid snap point (MIN or MAX only)
        const distances = snapPoints.map(point => ({
          point,
          distance: Math.abs(currentHeight - point)
        }));

        distances.sort((a, b) => a.distance - b.distance);
        targetHeight = distances[0].point;
      }

      // Animate to target height
      topSectionHeight.value = withSpring(targetHeight, ANIMATION_CONFIG, (finished) => {
        if (finished && onStateChange) {
          const calculatedBottomHeight = SCREEN_HEIGHT - targetHeight - HANDLE_HEIGHT;
          runOnJS(onStateChange)(calculatedBottomHeight);
        }
      });
    });

  const topSectionAnimatedStyle = useAnimatedStyle(() => ({
    height: topSectionHeight.value,
  }));

  // Bottom section auto-adjusts to fill remaining space
  const bottomSectionAnimatedStyle = useAnimatedStyle(() => ({
    height: SCREEN_HEIGHT - topSectionHeight.value - HANDLE_HEIGHT,
  }));
  
  // Drag handle style - always enabled for simplicity
  const dragHandleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1,
    pointerEvents: enableDrag ? 'auto' : 'none',
  }));
  
  // Handle tap on DragComponent - expand directly to MAX state for current tab
  const handleDragComponentPress = useCallback(() => {
    // Get MAX top height for current tab (smallest top, largest bottom)
    let targetTopHeight;
    switch (activeTab) {
      case 'Services':
        targetTopHeight = SERVICE_MIN_TOP_HEIGHT;
        break;
      case 'Pay':
        targetTopHeight = PAY_MIN_TOP_HEIGHT;
        break;
      case 'Worlds':
        targetTopHeight = WORLDS_MIN_TOP_HEIGHT;
        break;
      case 'Assistant':
        targetTopHeight = ASSISTANT_MIN_TOP_HEIGHT;
        break;
      default:
        targetTopHeight = EXPLORE_MIN_TOP_HEIGHT;
    }

    console.log('[ResizableSplitView] tap-to-expand', {
      tab: activeTab,
      targetTopHeight,
      targetBottomHeight: SCREEN_HEIGHT - targetTopHeight - HANDLE_HEIGHT,
    });

    topSectionHeight.value = withSpring(targetTopHeight, ANIMATION_CONFIG, (finished) => {
      if (finished && onStateChange) {
        const calculatedBottomHeight = SCREEN_HEIGHT - targetTopHeight - HANDLE_HEIGHT;
        runOnJS(onStateChange)(calculatedBottomHeight);
      }
    });
  }, [activeTab, topSectionHeight, onStateChange]);

  return (
    <View style={styles.container}>
      {/* Top Section - Resizable */}
      <Animated.View style={[styles.topSection, topSectionAnimatedStyle]}>
        {topSection}
      </Animated.View>

      {/* Interactive Line - Drag Handle - Hidden when keyboard is open */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.dragHandleContainer, dragHandleAnimatedStyle]}>
          <DragComponent text={displayText} onPress={handleDragComponentPress} />
        </Animated.View>
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
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 7, // 7px padding from top in text state
    paddingHorizontal: 20, // Increase horizontal touch area
    minWidth: '100%', // Ensure full width is draggable
  },
  bottomSection: {
    overflow: 'hidden',
    backgroundColor: Colors.backgroundBlack,
  },
});

