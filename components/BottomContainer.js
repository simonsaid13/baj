import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  TextInput, 
  Keyboard,
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useDerivedValue, 
  useSharedValue, 
  withTiming, 
  withRepeat,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import {
  ScanIcon,
  UserIcon,
  SquaresFourIcon,
  AssistantIcon,
  HandshakeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CarIcon,
  StorefrontIcon,
  FirstAidIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  KeyboardIcon,
} from './icons';
import { Colors, Typography, Spacing, BorderRadius, Sizes } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Height constants to match Figma designs
const EXPLORE_DEFAULT = 140;      // Explore collapsed: just tab bar + interactive line
const ASSISTANT_HEIGHT = 220;     // Assistant mode: 3 action buttons in 1 row
const EXPLORE_MIN = 320;          // Explore min: 6 action cards (2 rows) + "+2 more" text
const EXPLORE_MAX = 400;          // Explore max: 8 action cards (3 rows)

// Input field dimensions
const INPUT_FIELD_HEIGHT = 72;    // Height of input field container
const INPUT_PADDING_ABOVE_KEYBOARD = 8; // Minimal padding between input and keyboard

// Animation thresholds for ActionCard content
const TEXT_MIN_HEIGHT = 24;       // Height when text starts appearing
const ICON_MIN_HEIGHT = 48;      // Height when icon starts appearing
const FULL_CARD_HEIGHT = Sizes.actionCardHeight; // 72px

// Easing function for smooth animations
const easeInOut = (t) => {
  'worklet';
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

const ActionCard = ({ icon: Icon, label, onPress, animationProgress, containerScaleY }) => {
  // Handle press with haptic feedback
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) onPress();
  };
  // Animated style for text - appears early when card is small
  const textStyle = useAnimatedStyle(() => {
    'worklet';
    if (!animationProgress) {
      return {
        opacity: 0,
        transform: [{ scaleX: 1 }, { scaleY: 1 }], // Counter-scale to prevent distortion
      };
    }
    
    const progress = animationProgress.value;
    // Text appears early: fades in from 0 to 0.4 progress (when card is small ~24px)
    // Then stays visible but slightly fades as icon appears
    // Fades out when container collapses (progress goes back to 0)
    const textProgress = Math.max(0, Math.min(1, progress / 0.4));
    const easedProgress = easeInOut(textProgress);
    
    // Smooth opacity: fade in early, stay visible, fade out when collapsing
    let finalOpacity = 0;
    if (progress < 0.4) {
      // Fading in: 0 to 1
      finalOpacity = easedProgress;
    } else if (progress >= 0.4 && progress <= 0.8) {
      // Fully visible, slight fade as icon appears
      finalOpacity = Math.max(0.85, 1 - (progress - 0.4) * 0.15);
    } else {
      // Fully visible when both are shown
      finalOpacity = 0.85;
    }
    
    // Scale animation: scale from 0.2 to 1.0 as it appears/disappears
    // Separate scaleX and scaleY for independent control
    // Scales smoothly in both directions (expanding and collapsing)
    let appearanceScaleX = 0.2;
    let appearanceScaleY = 0.2;
    if (progress < 0.4) {
      // Scaling: 0.2 to 1.0 with smooth transition (works for both expanding and collapsing)
      const scaleProgress = easedProgress;
      appearanceScaleX = 0.2 + scaleProgress * 0.8;
      appearanceScaleY = 0.2 + scaleProgress * 0.8;
    } else {
      // Fully scaled when visible
      appearanceScaleX = 1.0;
      appearanceScaleY = 1.0;
    }
    
    // Counter-scale to prevent distortion from parent scaleX and scaleY
    // When parent has scaleX/Y: 0.5, child needs scaleX/Y: 2.0 to maintain size
    // Combine counter-scale with appearance scale for both X and Y
    const parentScale = containerScaleY?.value ?? 1;
    const counterScale = parentScale > 0.01 ? 1 / parentScale : 1;
    const finalScaleX = counterScale * appearanceScaleX;
    const finalScaleY = counterScale * appearanceScaleY;
    
    return {
      opacity: finalOpacity,
      transform: [
        { scaleX: finalScaleX }, 
        { scaleY: finalScaleY }
      ], // Separate scaleX and scaleY transitions with counter-scaling
    };
  });

  // Animated style for icon - appears later when card is almost full height
  const iconStyle = useAnimatedStyle(() => {
    'worklet';
    if (!animationProgress) {
      return {
        opacity: 0,
        transform: [{ scaleX: 1 }, { scaleY: 1 }], // Counter-scale to prevent distortion
      };
    }
    
    const progress = animationProgress.value;
    // Icon appears later: starts fading in at 0.4 progress, fully visible at 0.8+
    // This means icon shows when card height is larger (almost full height)
    // Fades out smoothly when container collapses
    const iconProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.4));
    const easedProgress = easeInOut(iconProgress);
    
    // Smooth opacity: fade in from 0.4 to 0.8, fully visible after, fade out when collapsing
    let finalOpacity = 0;
    if (progress < 0.4) {
      // Not visible yet
      finalOpacity = 0;
    } else if (progress >= 0.4 && progress <= 0.8) {
      // Fading in: 0 to 1
      finalOpacity = easedProgress;
    } else {
      // Fully visible
      finalOpacity = 1;
    }
    
    // Scale animation: scale up from 0.2 to 1.0 as it appears
    // Separate scaleX and scaleY for independent control
    let appearanceScaleX = 0.2;
    let appearanceScaleY = 0.2;
    if (progress < 0.4) {
      // Not visible yet, keep at starting scale
      appearanceScaleX = 0.2;
      appearanceScaleY = 0.2;
    } else if (progress >= 0.4 && progress <= 0.8) {
      // Scaling up: 0.2 to 1.0 with smooth transition
      const scaleProgress = easedProgress;
      appearanceScaleX = 0.2 + scaleProgress * 0.8;
      appearanceScaleY = 0.2 + scaleProgress * 0.8;
    } else {
      // Fully scaled
      appearanceScaleX = 1.0;
      appearanceScaleY = 1.0;
    }
    
    // Counter-scale to prevent distortion from parent scaleX and scaleY
    // When parent has scaleX/Y: 0.5, child needs scaleX/Y: 2.0 to maintain size
    // Combine counter-scale with appearance scale for both X and Y
    const parentScale = containerScaleY?.value ?? 1;
    const counterScale = parentScale > 0.01 ? 1 / parentScale : 1;
    const finalScaleX = counterScale * appearanceScaleX;
    const finalScaleY = counterScale * appearanceScaleY;
    
    return {
      opacity: finalOpacity,
      transform: [
        { scaleX: finalScaleX }, 
        { scaleY: finalScaleY }
      ], // Separate scaleX and scaleY transitions
    };
  });

  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.actionCardBlur}>
        <Animated.View style={iconStyle}>
          <Icon size={Sizes.actionCardIconSize} color={Colors.white} />
        </Animated.View>
        <Animated.Text style={[styles.actionCardLabel, textStyle]}>
          {label}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

export default function BottomContainer({ 
  bottomHeight: propBottomHeight = EXPLORE_DEFAULT, 
  bottomHeightSharedValue,
  activeTab = 'Explore',
  onHeightChange, // Callback to notify parent of height changes
  onTabChange // Callback when user switches tabs
}) {
  const currentBottomHeight = propBottomHeight;
  const insets = useSafeAreaInsets();
  
  // State management - track which tab is currently active
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [inputMode, setInputMode] = useState(false);
  const [audioMode, setAudioMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);
  
  // Animation for assistant buttons appearance
  const assistantButtonsScale = useSharedValue(currentTab === 'Assistant' ? 1 : 0);

  // Animated style for assistant containers (must be at top level, not conditional)
  const assistantContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: assistantButtonsScale.value }],
    opacity: assistantButtonsScale.value,
  }));

  // Sync with parent's activeTab prop
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // Handle height changes when switching tabs
  useEffect(() => {
    if (currentTab === 'Assistant') {
      // Animate assistant buttons scale
      assistantButtonsScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      
      // Switch to Assistant height
      if (bottomHeightSharedValue) {
        bottomHeightSharedValue.value = withTiming(ASSISTANT_HEIGHT, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
      if (onHeightChange) {
        onHeightChange(ASSISTANT_HEIGHT);
      }
    } else if (currentTab === 'Explore') {
      // Hide assistant buttons
      assistantButtonsScale.value = withTiming(0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      });
      
      // Switch back to Explore default (collapsed) height
      if (bottomHeightSharedValue) {
        bottomHeightSharedValue.value = withTiming(EXPLORE_DEFAULT, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
      if (onHeightChange) {
        onHeightChange(EXPLORE_DEFAULT);
      }
    } else {
      // Hide assistant buttons
      assistantButtonsScale.value = withTiming(0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      });
      
      // Other tabs (Scan, Services) - default collapsed height
      if (bottomHeightSharedValue) {
        bottomHeightSharedValue.value = withTiming(EXPLORE_DEFAULT, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
      if (onHeightChange) {
        onHeightChange(EXPLORE_DEFAULT);
      }
    }
  }, [currentTab, bottomHeightSharedValue, onHeightChange, assistantButtonsScale]);

  // Listen to keyboard events and adjust container height
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const kbHeight = e.endCoordinates.height;
        setKeyboardHeight(kbHeight);
        
        // Calculate new container height to position input field above keyboard
        // Structure: [Input Field] [8px padding] [Keyboard space]
        // Tab bar is hidden when keyboard is open, so we only need space for input field
        
        // Container height = input field + padding + keyboard space
        const newHeight = INPUT_FIELD_HEIGHT + INPUT_PADDING_ABOVE_KEYBOARD + kbHeight;
        
        console.log('Keyboard shown - Container height:', newHeight, 'Keyboard space:', kbHeight, 'Input field height:', INPUT_FIELD_HEIGHT, 'Padding:', INPUT_PADDING_ABOVE_KEYBOARD);
        
        // Animate container to new height
        if (bottomHeightSharedValue) {
          bottomHeightSharedValue.value = withTiming(newHeight, {
            duration: Platform.OS === 'ios' ? 250 : 200,
            easing: Easing.out(Easing.ease),
          });
        }
        
        // Notify parent to adjust ResizableSplitView
        if (onHeightChange) {
          onHeightChange(newHeight);
        }
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        
        console.log('Keyboard hidden - Returning to Assistant height:', ASSISTANT_HEIGHT);
        
        // Animate back to Assistant height
        if (bottomHeightSharedValue) {
          bottomHeightSharedValue.value = withTiming(ASSISTANT_HEIGHT, {
            duration: Platform.OS === 'ios' ? 250 : 200,
            easing: Easing.inOut(Easing.ease),
          });
        }
        
        // Notify parent
        if (onHeightChange) {
          onHeightChange(ASSISTANT_HEIGHT);
        }
        
        // Go back to assistant buttons when keyboard is dismissed
        if (inputMode) {
          setTimeout(() => {
            setInputMode(false);
            setInputText(''); // Clear input text
          }, 100);
        }
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [inputMode, bottomHeightSharedValue, onHeightChange]);

  // Shared values for AIGlow polygon opacity animations (0% to 100% - FULL RANGE!)
  // Each polygon animates independently with its own timing - start at different opacities
  const polygon1Opacity = useSharedValue(0.2);
  const polygon2Opacity = useSharedValue(0.5);
  const polygon3Opacity = useSharedValue(0.8);
  const polygon4Opacity = useSharedValue(0);

  // Assistant tab animated multi-color gradient (seamless color transitions)
  const assistantRotation = useSharedValue(0);
  const assistantScale = useSharedValue(1);

  // Start continuous opacity animations for each polygon using withRepeat - 4X SLOWER THAN ORIGINAL
  // Animates from current value to opposite extreme (0 or 1)
  useEffect(() => {
    // Polygon 1: Pulse from 0 to 1 and back (1000ms each way - 2x slower)
    polygon1Opacity.value = 0;
    polygon1Opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite
      true // reverse - goes back to 0
    );

    // Polygon 2: Different timing (1400ms - 2x slower)
    polygon2Opacity.value = 0;
    polygon2Opacity.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Polygon 3: Different timing (1800ms - 2x slower)
    polygon3Opacity.value = 0;
    polygon3Opacity.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Polygon 4: Different timing (2200ms - 2x slower)
    polygon4Opacity.value = 0;
    polygon4Opacity.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Assistant tab: Continuous rotation animation (smooth 360° spin)
    assistantRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false // continuous rotation, no reverse
    );

    // Assistant tab: Subtle scale pulsing (breathing effect)
    assistantScale.value = withRepeat(
      withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true // reverse for breathing
    );
    
    console.log('AIGlow animations started - smooth 0% to 100% fade');
    console.log('Assistant tab animations started - rotating multi-color gradient contained in 56x56');
  }, []);

  // Handle tab press - generic handler for all tabs
  const handleTabPress = (tabName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // If clicking the same tab, do nothing (or could toggle)
    if (currentTab === tabName) {
      return;
    }
    
    // Switch to new tab
    setCurrentTab(tabName);
    setInputMode(false);
    setAudioMode(false);
    setInputText(''); // Clear input text when switching tabs
    
    // Notify parent
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  // Handle Type button press - show input field
  const handleTypePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputMode(true);
    setAudioMode(false);
    // Focus input after state update
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  // Handle Speak button press - switch to audio mode
  const handleSpeakPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAudioMode(prev => !prev);
    setInputMode(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    Keyboard.dismiss();
  }, []);

  // Handle input submission
  const handleSubmitInput = () => {
    if (inputText.trim()) {
      console.log('Submitted text:', inputText);
      // Here you would handle the actual submission
      setInputText('');
      Keyboard.dismiss();
    }
  };

  // Action cards to show
  const allActions = [
    { icon: HandshakeIcon, label: 'Borrow' },
    { icon: ChartBarIcon, label: 'Invest' },
    { icon: ShieldCheckIcon, label: 'Insurance' },
    { icon: ShoppingCartIcon, label: 'Shop' },
    { icon: ReceiptIcon, label: 'Bill Payments' },
    { icon: CarIcon, label: 'Fastag' },
    { icon: StorefrontIcon, label: 'Bajaj Mall' },
    { icon: FirstAidIcon, label: 'Bajaj Health' },
  ];

  // Assistant mode actions - memoized to prevent recreation on every render
  const assistantActions = useMemo(() => [
    { icon: VideoCameraIcon, label: 'Video Chat' },
    { icon: MicrophoneIcon, label: 'Speak', onPress: handleSpeakPress },
    { icon: KeyboardIcon, label: 'Type', onPress: handleTypePress },
  ], [handleSpeakPress, handleTypePress]);

  // Calculate animation progress for first 2 rows using derived value
  const firstTwoRowsProgress = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - EXPLORE_DEFAULT) / (EXPLORE_MIN - EXPLORE_DEFAULT)
    ));
  });

  // Calculate scaleY value for first 2 rows (for counter-scaling children)
  const firstTwoRowsScaleY = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - EXPLORE_DEFAULT) / (EXPLORE_MIN - EXPLORE_DEFAULT)
    ));
  });

  // Animated styles for action cards container - first 2 rows
  // Use scaleY for smooth animation, children will counter-scale
  const firstTwoRowsStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { 
        height: 0, 
        opacity: 0, 
        overflow: 'hidden',
        transform: [{ scaleX: 0 }, { scaleY: 0 }],
        transformOrigin: 'top',
      };
    }
    
    // First 2 rows appear between EXPLORE_DEFAULT and EXPLORE_MIN
    const height = bottomHeightSharedValue.value;
    const progress = Math.max(0, Math.min(1, 
      (height - EXPLORE_DEFAULT) / (EXPLORE_MIN - EXPLORE_DEFAULT)
    ));
    
    const rowHeight = Sizes.actionCardHeight + Spacing.actionCardGap;
    const totalHeight = rowHeight * 2; // 2 rows
    
    return {
      height: totalHeight,
      opacity: progress,
      overflow: 'hidden',
      transform: [{ scaleX: progress }, { scaleY: progress }],
      transformOrigin: 'top',
    };
  });

  // Calculate animation progress for third row using derived value
  const thirdRowProgress = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - EXPLORE_MIN) / (EXPLORE_MAX - EXPLORE_MIN)
    ));
  });

  // Calculate scaleY value for third row (for counter-scaling children)
  const thirdRowScaleY = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - EXPLORE_MIN) / (EXPLORE_MAX - EXPLORE_MIN)
    ));
  });

  // Animated styles for third row
  // Use scaleY for smooth animation, children will counter-scale
  const thirdRowStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { 
        height: 0, 
        opacity: 0, 
        overflow: 'hidden',
        transform: [{ scaleX: 0 }, { scaleY: 0 }],
        transformOrigin: 'top',
      };
    }
    
    // Third row appears between EXPLORE_MIN and EXPLORE_MAX
    const height = bottomHeightSharedValue.value;
    const progress = Math.max(0, Math.min(1, 
      (height - EXPLORE_MIN) / (EXPLORE_MAX - EXPLORE_MIN)
    ));
    
    const rowHeight = Sizes.actionCardHeight;
    
    return {
      height: rowHeight,
      opacity: progress,
      overflow: 'hidden',
      transform: [{ scaleX: progress }, { scaleY: progress }],
      transformOrigin: 'top',
    };
  });

  // Animated styles for actions container wrapper - dynamic height
  const actionsContainerStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { 
        height: 0,
        overflow: 'hidden',
      };
    }
    
    const height = bottomHeightSharedValue.value;
    const rowHeight = Sizes.actionCardHeight + Spacing.actionCardGap;
    
    // Calculate total height based on state
    let totalHeight = 0;
    
    if (height <= EXPLORE_DEFAULT) {
      // Collapsed: 0px
      totalHeight = 0;
    } else if (height > EXPLORE_DEFAULT && height <= EXPLORE_MIN) {
      // Expanding to 2 rows: 0 → 152px
      const progress = (height - EXPLORE_DEFAULT) / (EXPLORE_MIN - EXPLORE_DEFAULT);
      totalHeight = (rowHeight * 2) * progress;
    } else if (height > EXPLORE_MIN && height <= EXPLORE_MAX) {
      // Expanding to 3 rows: 152px → 232px
      const twoRowsHeight = rowHeight * 2;
      const thirdRowProgress = (height - EXPLORE_MIN) / (EXPLORE_MAX - EXPLORE_MIN);
      totalHeight = twoRowsHeight + (Sizes.actionCardHeight + Spacing.actionCardGap) * thirdRowProgress;
    } else {
      // Fully expanded: 232px
      totalHeight = rowHeight * 2 + Sizes.actionCardHeight + Spacing.actionCardGap;
    }
    
    return {
      height: totalHeight,
      overflow: 'hidden',
    };
  });

  // Fixed style for AIGlow container - stays at constant screen position
  // AIGlow should always be positioned at the same place, only polygons scale
  const aiGlowContainerStyle = {
    top: -60, // Fixed position (40px higher than before)
  };

  // Calculate scale based on container height for AIGlow polygons
  // Scale from 1.0 (EXPLORE_DEFAULT) to 1.6 (EXPLORE_MAX)
  const aiGlowScale = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 1.0;
    }
    
    const currentHeight = bottomHeightSharedValue.value ?? EXPLORE_DEFAULT;
    const heightRange = EXPLORE_MAX - EXPLORE_DEFAULT;
    const heightProgress = Math.max(0, Math.min(1, (currentHeight - EXPLORE_DEFAULT) / heightRange));
    
    // Scale from 1.0 to 1.6 based on height progress - MORE INTENSE SCALE!
    const scale = 1.0 + (heightProgress * 0.6);
    return scale;
  });

  // Animated styles for AIGlow polygons - combine opacity and scale
  const polygon1Style = useAnimatedStyle(() => ({
    opacity: polygon1Opacity.value,
    transform: [{ scale: aiGlowScale.value }],
  }));

  const polygon2Style = useAnimatedStyle(() => ({
    opacity: polygon2Opacity.value,
    transform: [{ scale: aiGlowScale.value }],
  }));

  const polygon3Style = useAnimatedStyle(() => ({
    opacity: polygon3Opacity.value,
    transform: [{ scale: aiGlowScale.value }],
  }));

  const polygon4Style = useAnimatedStyle(() => ({
    opacity: polygon4Opacity.value,
    transform: [{ scale: aiGlowScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* AIGlow Layer - Absolute positioned at top, fixed screen position */}
      <Animated.View style={[styles.aiGlowContainer, aiGlowContainerStyle]} pointerEvents="none">
        <Animated.View style={[styles.polygonWrapper, polygon1Style]}>
          <Image 
            source={require('../assets/png/Polygon 1.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.polygonWrapper, polygon2Style]}>
          <Image 
            source={require('../assets/png/Polygon 2.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.polygonWrapper, polygon3Style]}>
          <Image 
            source={require('../assets/png/Polygon 3.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.polygonWrapper, polygon4Style]}>
          <Image 
            source={require('../assets/png/Polygon 4.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
      </Animated.View>

      {/* Content Section - Renders based on currentTab */}
      <View style={[styles.contentSection, { 
        paddingBottom: inputMode && keyboardHeight > 0 
          ? keyboardHeight + INPUT_PADDING_ABOVE_KEYBOARD
          : 78 + Math.max(Spacing.containerPaddingBottom, insets.bottom + 8) + Spacing.containerGap 
      }]}>
        {currentTab === 'Explore' && (
          // Explore Mode - Action Cards Grid with expandable states
          <Animated.View style={[styles.actionsContainer, actionsContainerStyle]}>
            {/* First 2 rows - animate together */}
            <Animated.View style={firstTwoRowsStyle} pointerEvents={currentBottomHeight > EXPLORE_DEFAULT ? 'auto' : 'none'}>
              <View style={styles.actionsRow}>
                {allActions.slice(0, 3).map((action, index) => (
                  <ActionCard
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    animationProgress={firstTwoRowsProgress}
                    containerScaleY={firstTwoRowsScaleY}
                  />
                ))}
              </View>
              <View style={[styles.actionsRow, { marginTop: Spacing.actionCardGap }]}>
                {allActions.slice(3, 6).map((action, index) => (
                  <ActionCard
                    key={index + 3}
                    icon={action.icon}
                    label={action.label}
                    animationProgress={firstTwoRowsProgress}
                    containerScaleY={firstTwoRowsScaleY}
                  />
                ))}
              </View>
            </Animated.View>

            {/* Third row - separate animation */}
            <Animated.View style={[thirdRowStyle, { marginTop: Spacing.actionCardGap }]} pointerEvents={currentBottomHeight > EXPLORE_MIN ? 'auto' : 'none'}>
              <View style={styles.actionsRow}>
                {allActions.slice(6, 8).map((action, index) => (
                  <ActionCard
                    key={index + 6}
                    icon={action.icon}
                    label={action.label}
                    animationProgress={thirdRowProgress}
                    containerScaleY={thirdRowScaleY}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
        )}

        {currentTab === 'Assistant' && (
          <View style={styles.assistantModesContainer}>
            {/* Audio Mode */}
            <Animated.View style={[
              styles.inputContainer, 
              assistantContainerAnimatedStyle,
              { 
                marginTop: 0,
                position: 'absolute',
                width: '100%',
                opacity: audioMode ? 1 : 0,
                zIndex: audioMode ? 1 : -1,
              }
            ]} pointerEvents={audioMode ? 'auto' : 'none'}>
              <View style={styles.audioModeContainer}>
                <Text style={styles.audioModeText}>Listening...</Text>
                <TouchableOpacity 
                  style={styles.stopAudioButton}
                  onPress={handleSpeakPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stopAudioButtonText}>Stop</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            {/* Input Field Mode */}
            <Animated.View style={[
              styles.inputContainer, 
              assistantContainerAnimatedStyle,
              { 
                marginTop: 0,
                position: 'absolute',
                width: '100%',
                opacity: (!audioMode && inputMode) ? 1 : 0,
                zIndex: (!audioMode && inputMode) ? 1 : -1,
              }
            ]} pointerEvents={(!audioMode && inputMode) ? 'auto' : 'none'}>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask me anything..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmitInput}
                  multiline={false}
                  editable={true}
                />
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmitInput}
                  activeOpacity={0.7}
                >
                  <Text style={styles.submitButtonText}>→</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            {/* Assistant Action Buttons - Always rendered to keep hooks stable */}
            <Animated.View style={[
              styles.assistantActionsContainer, 
              assistantContainerAnimatedStyle,
              {
                position: 'absolute',
                width: '100%',
                opacity: (!audioMode && !inputMode) ? 1 : 0,
                zIndex: (!audioMode && !inputMode) ? 1 : -1,
              }
            ]} pointerEvents={(!audioMode && !inputMode) ? 'auto' : 'none'}>
              <View style={styles.actionsRow}>
                {assistantActions.map((action, index) => (
                  <ActionCard
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onPress={action.onPress}
                    animationProgress={{ value: 1 }}
                    containerScaleY={{ value: 1 }}
                  />
                ))}
              </View>
            </Animated.View>
          </View>
        )}

        {currentTab === 'Scan' && (
          // Scan Mode - Placeholder for future implementation
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Scan Content</Text>
          </View>
        )}

        {currentTab === 'Services' && (
          // Services Mode - Placeholder for future implementation
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Services Content</Text>
          </View>
        )}
      </View>

      {/* TabBar - Hidden when keyboard is open */}
      {!(inputMode && keyboardHeight > 0) && (
        <View style={[styles.tabBar, { paddingBottom: Math.max(Spacing.containerPaddingBottom, insets.bottom + 8) }]}>
          <TabBarItem
            icon={ScanIcon}
            label="Scan"
            isActive={currentTab === 'Scan'}
            size={24}
            onPress={() => handleTabPress('Scan')}
          />
          <TabBarItem
            icon={UserIcon}
            label="Services"
            isActive={currentTab === 'Services'}
            size={24}
            onPress={() => handleTabPress('Services')}
          />
          <TabBarItem
            icon={SquaresFourIcon}
            label="Explore"
            isActive={currentTab === 'Explore'}
            size={24}
            isExplore
            onPress={() => handleTabPress('Explore')}
          />
          <TabBarItem
            icon={AssistantIcon}
            label="Assistant"
            isActive={currentTab === 'Assistant'}
            size={24}
            isAssistant
            assistantRotation={assistantRotation}
            assistantScale={assistantScale}
            onPress={() => handleTabPress('Assistant')}
          />
        </View>
      )}
    </View>
  );
}

const TabBarItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  size, 
  isExplore, 
  isAssistant, 
  assistantRotation,
  assistantScale,
  onPress
}) => {
  // Animated style for rotating and scaling gradient background
  // Contained within 56x56 container - no glow, no expansion
  const animatedGradientStyle = useAnimatedStyle(() => {
    if (!assistantRotation || !assistantScale) {
      return {
        transform: [{ rotate: '0deg' }, { scale: 1 }],
      };
    }
    
    return {
      transform: [
        { rotate: `${assistantRotation.value}deg` },
        { scale: assistantScale.value }
      ],
    };
  });

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.tabBarItem}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {isAssistant ? (
        <View style={styles.assistantIconContainer}>
          {/* Animated gradient background - contained within 56x56 */}
          <Animated.View style={[styles.assistantGradientBg, animatedGradientStyle]}>
            <LinearGradient
              colors={[
                '#00F0FF', // Brilliant cyan
                '#00AAFF', // Electric blue
                '#8B6FFF', // Vivid purple
                '#FF6EC7', // Pink accent
                '#00F0FF', // Back to cyan for seamless loop
              ]}
              style={styles.assistantGradientFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Icon container */}
          <View style={[styles.tabBarIconWrapper, styles.tabBarIconWrapperAssistant]}>
            <Icon size={size} color={Colors.white} />
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.tabBarIconWrapper,
            isActive && isExplore && styles.tabBarIconWrapperActive,
          ]}
        >
          <Icon size={size} color={isActive && isExplore ? Colors.black : Colors.white} />
        </View>
      )}
      <Text style={[styles.tabBarLabel, isActive && isExplore && styles.tabBarLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  aiGlowContainer: {
    position: 'absolute',
    left: -100,
    right: -100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    zIndex: 0,
    overflow: 'visible',
    // top is controlled by animated style to keep it fixed on screen
  },
  polygonWrapper: {
    width: 250,
    height: 250,
    marginHorizontal: -80,
    overflow: 'visible',
  },
  polygonImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Spacing.containerPaddingTop, // 8px from top
    // paddingBottom applied inline with safe area calculation (56px icon + 8px gap + 14px label + dynamic padding + 20px gap)
  },
  actionsContainer: {
    width: Sizes.actionsContainerWidth,
    flexShrink: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.actionCardGap,
  },
  actionCard: {
    flex: 1,
    height: Sizes.actionCardHeight,
  },
  actionCardBlur: {
    flex: 1,
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    overflow: 'hidden',
  },
  actionCardLabel: {
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    // Opacity is handled by animated style, don't set it here
    textAlign: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.tabBarGap,
    paddingHorizontal: Spacing.tabBarPaddingH,
    // paddingBottom applied inline with safe area
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.tabBarItemGap,
    width: Sizes.tabBarItemWidth,
  },
  tabBarIconWrapper: {
    width: Sizes.tabBarIconSize,
    height: Sizes.tabBarIconSize,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIconWrapperActive: {
    backgroundColor: Colors.white,
  },
  assistantIconContainer: {
    width: Sizes.tabBarIconSize,
    height: Sizes.tabBarIconSize,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Contain animation within 56x56
    borderRadius: BorderRadius.full,
  },
  // Animated gradient background - larger than container so rotation is visible
  assistantGradientBg: {
    position: 'absolute',
    width: Sizes.tabBarIconSize * 1.8,
    height: Sizes.tabBarIconSize * 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantGradientFill: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  tabBarIconWrapperAssistant: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    zIndex: 1,
  },
  tabBarLabel: {
    fontSize: Typography.tabBarLabel.fontSize,
    fontWeight: Typography.tabBarLabel.fontWeight,
    color: Colors.white,
    opacity: Typography.tabBarLabel.opacity,
    textAlign: 'center',
  },
  tabBarLabelActive: {
    opacity: Typography.tabBarLabelActive.opacity,
    color: Colors.white,
  },
  assistantModesContainer: {
    position: 'relative',
    width: Sizes.actionsContainerWidth, // 361px
    minHeight: Sizes.actionCardHeight, // Ensure container has height
  },
  assistantActionsContainer: {
    width: Sizes.actionsContainerWidth, // 361px
  },
  inputContainer: {
    width: Sizes.actionsContainerWidth, // 361px
    marginBottom: 0, // Will be set dynamically when keyboard is open
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: Sizes.actionCardHeight,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    paddingVertical: 0,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  placeholderContainer: {
    width: Sizes.actionsContainerWidth,
    paddingTop: Spacing.containerPaddingTop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    opacity: 0.5,
  },
  audioModeContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: Sizes.actionCardHeight,
  },
  audioModeText: {
    flex: 1,
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    textAlign: 'center',
  },
  stopAudioButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
  },
  stopAudioButtonText: {
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: '600',
    color: Colors.black,
  },
});

