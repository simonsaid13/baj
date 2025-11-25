import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/tokens';
import DragComponent from './DragComponent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 0; // Removed header height offset
const STATUS_BAR_HEIGHT = 0;
const HANDLE_HEIGHT = 40; // Defined handle height

// Define heights - ONLY MIN AND MAX (MUST match ContextBar.js)
const BOTTOM_EXPLORE_MIN = 220;          // Explore min: InputBar + TabBar + spacing
const BOTTOM_EXPLORE_MAX = 280;          // Explore max: AnimatedTabs + InputBar + TabBar
const BOTTOM_SERVICE_MIN = 220;          // Service min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const BOTTOM_SERVICE_MAX = 460;          // Service max: ButtonBar (3 lines × 72px + gaps) + InputBar + TabBar + spacing
const BOTTOM_PAY_MIN = 220;              // Pay min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const BOTTOM_PAY_MAX = 312;              // Pay max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing (PAY_MIN + 92px)
const BOTTOM_WORLDS_MIN = 220;          // Worlds min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const BOTTOM_WORLDS_MAX = 312;           // Worlds max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing (WORLDS_MIN + 92px)
const BOTTOM_ASSISTANT_MIN = 220;       // Assistant min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const BOTTOM_ASSISTANT_MAX = 312;        // Assistant max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing (ASSISTANT_MIN + 92px)

// Calculate top section heights for Explore tab
const EXPLORE_MIN_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const EXPLORE_MAX_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_EXPLORE_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

// Calculate top section heights for Services tab
const SERVICE_MIN_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_SERVICE_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const SERVICE_MAX_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_SERVICE_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

// Calculate top section heights for Pay tab
const PAY_MIN_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_PAY_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const PAY_MAX_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_PAY_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

// Calculate top section heights for Worlds tab
const WORLDS_MIN_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_WORLDS_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const WORLDS_MAX_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_WORLDS_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

// Calculate top section heights for Assistant tab
const ASSISTANT_MIN_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_ASSISTANT_MAX - HANDLE_HEIGHT;  // Smallest top (largest bottom)
const ASSISTANT_MAX_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_ASSISTANT_MIN - HANDLE_HEIGHT;  // Largest top (smallest bottom)

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
  
  // Create shared value for activeTab to use in worklets
  const activeTabShared = useSharedValue(activeTab);
  
  // Update activeTabShared when activeTab prop changes
  React.useEffect(() => {
    activeTabShared.value = activeTab;
  }, [activeTab, activeTabShared]);
  
  // Calculate initial top section height based on bottomHeightSharedValue and activeTab
  // Default to MIN state (smallest bottom)
  const getInitialTopHeight = () => {
    if (bottomHeightSharedValue) {
      const currentBottomHeight = bottomHeightSharedValue.value ?? BOTTOM_EXPLORE_MIN;
      const initialTopHeight = SCREEN_HEIGHT - currentBottomHeight - HANDLE_HEIGHT;
      
      // Determine min/max based on active tab
      let minTopHeight, maxTopHeight;
      if (activeTab === 'Services') {
        minTopHeight = SERVICE_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = SERVICE_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Pay') {
        minTopHeight = PAY_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = PAY_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Worlds') {
        minTopHeight = WORLDS_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = WORLDS_MAX_TOP_SECTION_HEIGHT;
      } else {
        minTopHeight = EXPLORE_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = EXPLORE_MAX_TOP_SECTION_HEIGHT;
      }
      
      return Math.max(minTopHeight, Math.min(maxTopHeight, initialTopHeight));
    }
      if (activeTab === 'Services') {
        return SERVICE_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Pay') {
        return PAY_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Worlds') {
        return WORLDS_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Assistant') {
        return ASSISTANT_MAX_TOP_SECTION_HEIGHT;
      }
      return EXPLORE_MAX_TOP_SECTION_HEIGHT;
  };
  
  const topSectionHeight = useSharedValue(getInitialTopHeight());
  const isDragging = useSharedValue(false);
  const startY = useSharedValue(0);
  
  // State to control text visibility based on bottom height
  const [displayText, setDisplayText] = useState('');
  const interactiveTextShared = useSharedValue(interactiveText);
  
  // Keep shared value in sync with prop
  React.useEffect(() => {
    interactiveTextShared.value = interactiveText;
  }, [interactiveText, interactiveTextShared]);
  
  // Sync topSectionHeight with bottomHeightSharedValue - chain them together
  // When bottomHeightSharedValue changes (from ContextBar), update topSectionHeight accordingly
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue) return null;
      return bottomHeightSharedValue.value;
    },
    (currentBottomHeight, previousBottomHeight) => {
      'worklet';
      // Skip if dragging (let gesture handle it) or if values haven't changed
      if (isDragging.value) return;
      if (previousBottomHeight !== null && Math.abs(currentBottomHeight - previousBottomHeight) < 1) return;
      
      // Calculate corresponding top section height
      const newTopHeight = SCREEN_HEIGHT - currentBottomHeight - HANDLE_HEIGHT;
      
      // Determine min/max based on active tab
      if (!activeTabShared) {
        return;
      }
      const currentTab = activeTabShared.value ?? 'Explore';
      let minTopHeight, maxTopHeight;
      if (currentTab === 'Services') {
        minTopHeight = SERVICE_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = SERVICE_MAX_TOP_SECTION_HEIGHT;
      } else if (currentTab === 'Pay') {
        minTopHeight = PAY_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = PAY_MAX_TOP_SECTION_HEIGHT;
      } else if (currentTab === 'Worlds') {
        minTopHeight = WORLDS_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = WORLDS_MAX_TOP_SECTION_HEIGHT;
      } else if (currentTab === 'Assistant') {
        minTopHeight = ASSISTANT_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = ASSISTANT_MAX_TOP_SECTION_HEIGHT;
      } else {
        minTopHeight = EXPLORE_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = EXPLORE_MAX_TOP_SECTION_HEIGHT;
      }
      
      // Keyboard mode: when bottomHeight is LARGER than normal MAX
      // This means top section should SHRINK (keyboard is open)
      let maxBottomHeight = BOTTOM_EXPLORE_MAX;
      if (currentTab === 'Services') {
        maxBottomHeight = BOTTOM_SERVICE_MAX;
      } else if (currentTab === 'Pay') {
        maxBottomHeight = BOTTOM_PAY_MAX;
      } else if (currentTab === 'Worlds') {
        maxBottomHeight = BOTTOM_WORLDS_MAX;
      } else if (currentTab === 'Assistant') {
        maxBottomHeight = BOTTOM_ASSISTANT_MAX;
      }
      const isKeyboardMode = currentBottomHeight > maxBottomHeight + 10;
      
      // In keyboard mode, allow the top section to shrink below normal minimum
      const minAllowedHeight = isKeyboardMode 
        ? Math.round(SCREEN_HEIGHT * 0.3)  // Allow shrinking to 30% of screen
        : minTopHeight;
      
      const clampedTopHeight = Math.max(minAllowedHeight, Math.min(maxTopHeight, newTopHeight));
      
      // Update topSectionHeight to match bottomHeightSharedValue
      topSectionHeight.value = withTiming(clampedTopHeight, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    },
    [bottomHeightSharedValue, isDragging, activeTabShared]
  );
  
  // Update displayText based on bottom height and interactiveText prop
  useAnimatedReaction(
    () => {
      'worklet';
      const height = bottomHeightSharedValue?.value ?? BOTTOM_EXPLORE_MIN;
      const text = interactiveTextShared.value;
      return { height, text };
    },
    (current, previous) => {
      'worklet';
      // Skip if values haven't changed
      if (previous && 
          Math.abs(current.height - previous.height) < 1 && 
          current.text === previous.text) {
        return;
      }
      
      const { height, text } = current;
      
      // Show text in Min state OR keyboard mode
      // ExploreMin: height between EXPLORE_MIN and EXPLORE_MAX
      // ServiceMin: height between SERVICE_MIN and SERVICE_MAX
      // Keyboard mode: height > MAX (larger bottom section, top shrinks)
      if (!activeTabShared) {
        return;
      }
      const currentTab = activeTabShared.value ?? 'Explore';
      const isExploreMin = height >= BOTTOM_EXPLORE_MIN - 10 && height < BOTTOM_EXPLORE_MAX - 10;
      const isServiceMin = height >= BOTTOM_SERVICE_MIN - 10 && height < BOTTOM_SERVICE_MAX - 10;
      const isPayMin = height >= BOTTOM_PAY_MIN - 10 && height < BOTTOM_PAY_MAX - 10;
      const isWorldsMin = height >= BOTTOM_WORLDS_MIN - 10 && height < BOTTOM_WORLDS_MAX - 10;
      const isAssistantMin = height >= BOTTOM_ASSISTANT_MIN - 10 && height < BOTTOM_ASSISTANT_MAX - 10;
      let maxBottomHeight = BOTTOM_EXPLORE_MAX;
      if (currentTab === 'Services') {
        maxBottomHeight = BOTTOM_SERVICE_MAX;
      } else if (currentTab === 'Pay') {
        maxBottomHeight = BOTTOM_PAY_MAX;
      } else if (currentTab === 'Worlds') {
        maxBottomHeight = BOTTOM_WORLDS_MAX;
      } else if (currentTab === 'Assistant') {
        maxBottomHeight = BOTTOM_ASSISTANT_MAX;
      }
      const isKeyboardMode = height > maxBottomHeight + 10;
      const shouldShowText = 
        (currentTab === 'Explore' && (isExploreMin || isKeyboardMode)) ||
        (currentTab === 'Services' && isServiceMin) ||
        (currentTab === 'Pay' && isPayMin) ||
        (currentTab === 'Worlds' && isWorldsMin) ||
        (currentTab === 'Assistant' && isAssistantMin);
      
      // Determine text to display - only show if in valid state AND text is provided
      const textToDisplay = shouldShowText && text && text.trim().length > 0 ? text : '';
      
      // Update state on JS thread
      runOnJS(setDisplayText)(textToDisplay);
    },
    [bottomHeightSharedValue, interactiveTextShared, activeTabShared]
  );

  // Handle external bottom height changes (e.g., from Assistant mode, keyboard)
  React.useEffect(() => {
    if (externalBottomHeight !== null) {
      const newTopHeight = SCREEN_HEIGHT - HANDLE_HEIGHT - externalBottomHeight;
      
      // Determine min/max based on active tab (use prop, not shared value in JS thread)
      let minTopHeight, maxTopHeight;
      if (activeTab === 'Services') {
        minTopHeight = SERVICE_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = SERVICE_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Pay') {
        minTopHeight = PAY_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = PAY_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Worlds') {
        minTopHeight = WORLDS_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = WORLDS_MAX_TOP_SECTION_HEIGHT;
      } else if (activeTab === 'Assistant') {
        minTopHeight = ASSISTANT_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = ASSISTANT_MAX_TOP_SECTION_HEIGHT;
      } else {
        minTopHeight = EXPLORE_MIN_TOP_SECTION_HEIGHT;
        maxTopHeight = EXPLORE_MAX_TOP_SECTION_HEIGHT;
      }
      
      // Keyboard mode: when bottomHeight is LARGER than normal MAX
      let maxBottomHeight = BOTTOM_EXPLORE_MAX;
      if (activeTab === 'Services') {
        maxBottomHeight = BOTTOM_SERVICE_MAX;
      } else if (activeTab === 'Pay') {
        maxBottomHeight = BOTTOM_PAY_MAX;
      } else if (activeTab === 'Worlds') {
        maxBottomHeight = BOTTOM_WORLDS_MAX;
      } else if (activeTab === 'Assistant') {
        maxBottomHeight = BOTTOM_ASSISTANT_MAX;
      }
      const isKeyboardMode = externalBottomHeight > maxBottomHeight + 10;
      
      // In keyboard mode, allow the top section to shrink below normal minimum
      const minAllowedHeight = isKeyboardMode 
        ? Math.round(SCREEN_HEIGHT * 0.3) 
        : minTopHeight;
      
      const clampedTopHeight = Math.max(minAllowedHeight, Math.min(maxTopHeight, newTopHeight));
      topSectionHeight.value = withTiming(clampedTopHeight, {
        duration: 300,
      });
    }
  }, [externalBottomHeight, topSectionHeight, activeTab]);


  const panGesture = Gesture.Pan()
    .enabled(enableDrag)
    .onStart((event) => {
      startY.value = topSectionHeight.value;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      'worklet';
      // When dragging UP (negative translationY), we want to REDUCE top section (expand bottom)
      // When dragging DOWN (positive translationY), we want to INCREASE top section (minimize bottom)
      const newHeight = startY.value + event.translationY;
      
      // Determine min/max based on active tab
      if (!activeTabShared) {
        return;
      }
      const currentTab = activeTabShared.value ?? 'Explore';
      let minTopHeight, maxTopHeight;
      if (currentTab === 'Services') {
        minTopHeight = SERVICE_MIN_TOP_SECTION_HEIGHT; // SERVICE_MAX bottom
        maxTopHeight = SERVICE_MAX_TOP_SECTION_HEIGHT; // SERVICE_MIN bottom
      } else if (currentTab === 'Pay') {
        minTopHeight = PAY_MIN_TOP_SECTION_HEIGHT; // PAY_MAX bottom
        maxTopHeight = PAY_MAX_TOP_SECTION_HEIGHT; // PAY_MIN bottom
      } else if (currentTab === 'Worlds') {
        minTopHeight = WORLDS_MIN_TOP_SECTION_HEIGHT; // WORLDS_MAX bottom
        maxTopHeight = WORLDS_MAX_TOP_SECTION_HEIGHT; // WORLDS_MIN bottom
      } else if (currentTab === 'Assistant') {
        minTopHeight = ASSISTANT_MIN_TOP_SECTION_HEIGHT; // ASSISTANT_MAX bottom
        maxTopHeight = ASSISTANT_MAX_TOP_SECTION_HEIGHT; // ASSISTANT_MIN bottom
      } else {
        minTopHeight = EXPLORE_MIN_TOP_SECTION_HEIGHT; // EXPLORE_MAX bottom
        maxTopHeight = EXPLORE_MAX_TOP_SECTION_HEIGHT; // EXPLORE_MIN bottom
      }
      
      topSectionHeight.value = Math.max(
        minTopHeight,
        Math.min(maxTopHeight, newHeight)
      );
      // bottomHeightSharedValue is updated automatically in bottomSectionAnimatedStyle
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      const currentHeight = topSectionHeight.value;
      const velocity = event.velocityY;

      let targetHeight;

      // Determine snap points based on active tab (only 2 snap points: MIN and MAX)
      // Note: activeTab is accessed from JS thread, not worklet
      let snapPoints;
      if (activeTab === 'Services') {
        snapPoints = [SERVICE_MIN_TOP_SECTION_HEIGHT, SERVICE_MAX_TOP_SECTION_HEIGHT];
      } else if (activeTab === 'Pay') {
        snapPoints = [PAY_MIN_TOP_SECTION_HEIGHT, PAY_MAX_TOP_SECTION_HEIGHT];
      } else if (activeTab === 'Worlds') {
        snapPoints = [WORLDS_MIN_TOP_SECTION_HEIGHT, WORLDS_MAX_TOP_SECTION_HEIGHT];
      } else if (activeTab === 'Assistant') {
        snapPoints = [ASSISTANT_MIN_TOP_SECTION_HEIGHT, ASSISTANT_MAX_TOP_SECTION_HEIGHT];
      } else {
        snapPoints = [EXPLORE_MIN_TOP_SECTION_HEIGHT, EXPLORE_MAX_TOP_SECTION_HEIGHT];
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
  
  // Drag handle is always visible but disabled when in keyboard mode
  // Keyboard mode: bottomHeight > MAX (larger bottom, smaller top)
  const dragHandleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const bottomHeight = bottomHeightSharedValue?.value ?? BOTTOM_EXPLORE_MIN;
    if (!activeTabShared) {
      return {
        opacity: 1,
        pointerEvents: 'auto',
      };
    }
    const currentTab = activeTabShared.value ?? 'Explore';
    let maxBottomHeight = BOTTOM_EXPLORE_MAX;
    if (currentTab === 'Services') {
      maxBottomHeight = BOTTOM_SERVICE_MAX;
    } else if (currentTab === 'Pay') {
      maxBottomHeight = BOTTOM_PAY_MAX;
    } else if (currentTab === 'Worlds') {
      maxBottomHeight = BOTTOM_WORLDS_MAX;
    } else if (currentTab === 'Assistant') {
      maxBottomHeight = BOTTOM_ASSISTANT_MAX;
    }
    const isKeyboardMode = bottomHeight > maxBottomHeight + 10;
    
    return {
      opacity: 1, // Always visible
      pointerEvents: isKeyboardMode ? 'none' : 'auto', // Disable drag during keyboard mode
    };
  });

  return (
    <View style={styles.container}>
      {/* Top Section - Resizable */}
      <Animated.View style={[styles.topSection, topSectionAnimatedStyle]}>
        {topSection}
      </Animated.View>

      {/* Interactive Line - Drag Handle - Hidden when keyboard is open */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.dragHandleContainer, dragHandleAnimatedStyle]}>
          <DragComponent text={displayText} />
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

