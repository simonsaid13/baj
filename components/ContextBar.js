import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  Keyboard,
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useDerivedValue, 
  useSharedValue, 
  withTiming, 
  withRepeat,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Sizes } from '../constants/tokens';
import AnimatedTabs from './AnimatedTabs';
import InputBar from './InputBar';
import TabBar from './TabBar';
import ButtonBar from './ButtonBar';
import { 
  HandshakeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CarIcon,
  StorefrontIcon,
  FirstAidIcon,
  ArrowUpRightIcon,
  BarcodeIcon,
  StarFourIcon,
  DiamondsFourIcon,
  ArticleIcon
} from './icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Height constants - ONLY MIN AND MAX (MUST match ResizableSplitView.js)
const EXPLORE_MIN = 220;          // Explore min: InputBar + TabBar + spacing
const EXPLORE_MAX = 280;          // Explore max: AnimatedTabs + InputBar + TabBar
const SERVICE_MIN = 220;          // Service min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const SERVICE_MAX = 460;          // Service max: ButtonBar (3 lines × 72px + gaps) + InputBar + TabBar + spacing
const PAY_MIN = 220;              // Pay min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const PAY_MAX = 312;              // Pay max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing (PAY_MIN + 92px)
const WORLDS_MIN = 220;           // Worlds min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const WORLDS_MAX = 312;           // Worlds max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing (WORLDS_MIN + 92px)
const ASSISTANT_MIN = 220;        // Assistant min: InputBar + TabBar + spacing (same as EXPLORE_MIN)
const ASSISTANT_MAX = 312;        // Assistant max: ButtonBar (1 line × 72px + gap) + InputBar + TabBar + spacing (ASSISTANT_MIN + 92px)
const HANDLE_HEIGHT = 40;         // Drag handle height (MUST match ResizableSplitView.js)

// Keyboard mode: Top section should shrink to leave space for keyboard + 12px + input + 12px
// This creates the structure: keyboard - 12px - input - 12px - top part of screen
const KEYBOARD_TOP_SECTION_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const KEYBOARD_MODE_BOTTOM_HEIGHT = SCREEN_HEIGHT - KEYBOARD_TOP_SECTION_HEIGHT - HANDLE_HEIGHT;

export default function ContextBar({ 
  bottomHeightSharedValue,
  activeTab = 'Explore',
  onHeightChange, // Callback to notify parent of height changes
  onTabChange, // Callback when user switches tabs
  onInputFocus, // Callback when InputBar is focused
  onInteractiveTextChange, // Callback to notify parent of interactive text changes
}) {
  const insets = useSafeAreaInsets();
  
  // State management
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [inputMode, setInputMode] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [animatedTabsActiveIndex, setAnimatedTabsActiveIndex] = useState(0);
  const [animatedTabsHeight, setAnimatedTabsHeight] = useState(0);
  
  // Animated keyboard height for smooth InputBar positioning
  const keyboardHeightAnimated = useSharedValue(0);
  
  // Shared value for ButtonBar height progress (0-1) for Services tab
  const buttonBarHeightProgress = useSharedValue(0);
  
  // Shared value for Worlds tab ButtonBar height progress (0-1)
  const worldsButtonBarHeightProgress = useSharedValue(0);
  
  // Shared value for Assistant tab ButtonBar height progress (0-1)
  const assistantButtonBarHeightProgress = useSharedValue(0);
  
  // Shared value for currentTab to use in worklets (must be declared early)
  const currentTabShared = useSharedValue(currentTab);
  
  // Sync with parent's activeTab prop
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);
  
  // Initialize AnimatedTabs height based on current bottomHeightSharedValue
  useEffect(() => {
    if (bottomHeightSharedValue && currentTab === 'Explore') {
      const currentHeight = bottomHeightSharedValue.value ?? EXPLORE_MIN;
      let initialHeight = 0;
      
      if (currentHeight >= EXPLORE_MAX) {
        initialHeight = 40;
      } else if (currentHeight >= EXPLORE_MIN) {
        const heightRange = EXPLORE_MAX - EXPLORE_MIN;
        const heightProgress = (currentHeight - EXPLORE_MIN) / heightRange;
        const clampedProgress = Math.max(0, Math.min(1, heightProgress));
        initialHeight = clampedProgress * 40;
      }
      
      setAnimatedTabsHeight(initialHeight);
    } else {
      setAnimatedTabsHeight(0);
    }
  }, [bottomHeightSharedValue, currentTab]);

  // NOTE: Height on tab change is now fully controlled by ResizableSplitView + ExploreScreen.
  // ContextBar reads bottomHeightSharedValue but no longer forces it to MIN on tab switch.

  // Listen to keyboard events and adjust container height with smooth animation
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const kbHeight = e.endCoordinates.height;
        const duration = e.duration || 250;
        
        setKeyboardHeight(kbHeight);
        setInputMode(true);
        
        // Animate keyboard height for smooth InputBar positioning
        keyboardHeightAnimated.value = withTiming(kbHeight, {
          duration: Platform.OS === 'ios' ? duration : 200,
          easing: Easing.out(Easing.ease),
        });
        
        // Set larger bottom height so top section SHRINKS (matching Figma design)
        // The InputBar floats above keyboard, TabBar is hidden behind keyboard
        if (bottomHeightSharedValue) {
          bottomHeightSharedValue.value = withTiming(KEYBOARD_MODE_BOTTOM_HEIGHT, {
            duration: Platform.OS === 'ios' ? duration : 200,
            easing: Easing.out(Easing.ease),
          });
        }
        
        // Notify parent to adjust ResizableSplitView top section
        if (onHeightChange) {
          onHeightChange(KEYBOARD_MODE_BOTTOM_HEIGHT);
        }
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        const duration = e?.duration || 250;
        
        setKeyboardHeight(0);
        
        // Animate keyboard height back to 0 for smooth InputBar positioning
        keyboardHeightAnimated.value = withTiming(0, {
          duration: Platform.OS === 'ios' ? duration : 200,
          easing: Easing.inOut(Easing.ease),
        });
        
        // Animate back to MIN when keyboard closes (based on current tab)
        if (bottomHeightSharedValue) {
          let minHeight = EXPLORE_MIN;
          if (currentTab === 'Services') {
            minHeight = SERVICE_MIN;
          } else if (currentTab === 'Pay') {
            minHeight = PAY_MIN;
          } else if (currentTab === 'Worlds') {
            minHeight = WORLDS_MIN;
          } else if (currentTab === 'Assistant') {
            minHeight = ASSISTANT_MIN;
          }
          bottomHeightSharedValue.value = withTiming(minHeight, {
            duration: Platform.OS === 'ios' ? duration : 200,
            easing: Easing.inOut(Easing.ease),
          });
          if (onHeightChange) {
            onHeightChange(minHeight);
          }
        }
        
        // Go back to normal mode when keyboard is dismissed
        setTimeout(() => {
          setInputMode(false);
        }, 100);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [bottomHeightSharedValue, onHeightChange, keyboardHeightAnimated]);
  
  // Animated style for InputBar when keyboard is open
  // Bottom padding = keyboard height + 12px from bottom of screen
  // Structure: keyboard - 12px - input - 12px - top part of screen
  const inputBarKeyboardStyle = useAnimatedStyle(() => {
    'worklet';
    const kbHeight = keyboardHeightAnimated.value;

    if (kbHeight > 0) {
      return {
        position: 'absolute',
        bottom: kbHeight + 12,
        left: 0,
        right: 0,
        zIndex: 10,
      };
    }

    return {};
  });

  // Shared values for AIGlow polygon opacity animations (1:1 copy from BottomContainer)
  const polygon1Opacity = useSharedValue(0.2);
  const polygon2Opacity = useSharedValue(0.5);
  const polygon3Opacity = useSharedValue(0.8);
  const polygon4Opacity = useSharedValue(0);

  // Start continuous opacity animations for each polygon using withRepeat - 4X SLOWER THAN ORIGINAL
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
  }, []);

  // Handle tab press - generic handler for all tabs
  const handleTabPress = (tabName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // If clicking the same tab, do nothing
    if (currentTab === tabName) {
      return;
    }
    
    // Switch to new tab
    setCurrentTab(tabName);
    setInputMode(false);
    
    // Notify parent
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  // Handle InputBar focus - always change to Min state
  const handleInputFocus = useCallback(() => {
    setInputMode(true);
    
    // Always change to Min state when InputBar is focused (based on current tab)
    let minHeight = EXPLORE_MIN;
    if (currentTab === 'Services') {
      minHeight = SERVICE_MIN;
    } else if (currentTab === 'Pay') {
      minHeight = PAY_MIN;
    } else if (currentTab === 'Worlds') {
      minHeight = WORLDS_MIN;
    } else if (currentTab === 'Assistant') {
      minHeight = ASSISTANT_MIN;
    }
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = withTiming(minHeight, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
    
    if (onHeightChange) {
      onHeightChange(minHeight);
    }
    
    if (onInputFocus) {
      onInputFocus();
    }
  }, [bottomHeightSharedValue, onHeightChange, onInputFocus, currentTab]);


  // Handle InputBar send
  const handleInputSend = useCallback((text) => {
    console.log('ContextBar - Send:', text);
    // Handle send logic here
  }, []);

  // Handle InputBar video press
  const handleVideoPress = useCallback(() => {
    console.log('ContextBar - Video pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Handle InputBar voice press
  const handleVoicePress = useCallback((isVoiceMode) => {
    console.log('ContextBar - Voice mode:', isVoiceMode);
  }, []);

  // Calculate scale based on container height for AIGlow polygons
  // Scale from 1.0 (MIN) to 1.6 (MAX) - works for both Explore and Services
  const aiGlowScale = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue || !currentTabShared) {
      return 1.0;
    }
    
    const currentHeight = bottomHeightSharedValue.value ?? EXPLORE_MIN;
    const currentTabValue = currentTabShared.value ?? 'Explore';
    
    // Determine min/max based on current tab
    let minHeight, maxHeight;
    if (currentTabValue === 'Services') {
      minHeight = SERVICE_MIN;
      maxHeight = SERVICE_MAX;
    } else if (currentTabValue === 'Pay') {
      minHeight = PAY_MIN;
      maxHeight = PAY_MAX;
    } else if (currentTabValue === 'Worlds') {
      minHeight = WORLDS_MIN;
      maxHeight = WORLDS_MAX;
    } else if (currentTabValue === 'Assistant') {
      minHeight = ASSISTANT_MIN;
      maxHeight = ASSISTANT_MAX;
    } else {
      minHeight = EXPLORE_MIN;
      maxHeight = EXPLORE_MAX;
    }
    
    const heightRange = maxHeight - minHeight;
    const heightProgress = Math.max(0, Math.min(1, (currentHeight - minHeight) / heightRange));
    
    // Scale from 1.0 to 1.6 based on height progress
    const scale = 1.0 + (heightProgress * 0.6);
    return scale;
  });

  // Animated style for AIGlow container - adjusts position based on height
  const aiGlowContainerStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue || !currentTabShared) {
      return {};
    }
    
    const currentHeight = bottomHeightSharedValue.value ?? EXPLORE_MIN;
    const currentTabValue = currentTabShared.value ?? 'Explore';
    
    // Determine min height based on current tab
    let minHeight = EXPLORE_MIN;
    if (currentTabValue === 'Services') {
      minHeight = SERVICE_MIN;
    } else if (currentTabValue === 'Pay') {
      minHeight = PAY_MIN;
    } else if (currentTabValue === 'Worlds') {
      minHeight = WORLDS_MIN;
    } else if (currentTabValue === 'Assistant') {
      minHeight = ASSISTANT_MIN;
    }
    
    // When height increases (MIN to MAX), move AIGlow down to keep it visually fixed
    const heightDelta = currentHeight - minHeight;
    
    return {
      transform: [{ translateY: heightDelta }],
    };
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

  // Determine interactive text based on state using useAnimatedReaction
  // ExploreMax: no text
  // ExploreMin: "Feed Settings"
  const interactiveTextShared = useSharedValue('');
  
  // Update currentTabShared when currentTab changes
  useEffect(() => {
    currentTabShared.value = currentTab;
  }, [currentTab, currentTabShared]);
  
  // Initialize and notify parent of initial interactive text
  useEffect(() => {
    if (onInteractiveTextChange && bottomHeightSharedValue) {
      const currentHeight = bottomHeightSharedValue.value ?? EXPLORE_MIN;
      let text = '';
      
      if (currentTab === 'Explore') {
        if (currentHeight >= EXPLORE_MIN - 10 && currentHeight < EXPLORE_MAX - 10) {
          text = 'Feed Settings';
        }
      } else if (currentTab === 'Services') {
        // Services tab doesn't show interactive text
        text = '';
      } else if (currentTab === 'Pay') {
        // Show "UPI and more" in PayMin state
        if (currentHeight >= PAY_MIN - 10 && currentHeight < PAY_MAX - 10) {
          text = 'UPI and more';
        }
      } else if (currentTab === 'Worlds') {
        // Show "Create & Explore" in WorldsMin state
        if (currentHeight >= WORLDS_MIN - 10 && currentHeight < WORLDS_MAX - 10) {
          text = 'Create & Explore';
        }
      } else if (currentTab === 'Assistant') {
        // Show "Conversation History" in AssistantMin state
        if (currentHeight >= ASSISTANT_MIN - 10 && currentHeight < ASSISTANT_MAX - 10) {
          text = 'Conversation History';
        }
      }
      
      onInteractiveTextChange(text);
    } else if (onInteractiveTextChange) {
      onInteractiveTextChange('');
    }
  }, []); // Only on mount
  
  // Callback to notify parent of interactive text changes
  const notifyInteractiveTextChange = useCallback((text) => {
    if (onInteractiveTextChange) {
      onInteractiveTextChange(text);
    }
  }, [onInteractiveTextChange]);

  // Update interactive text based on height and notify parent in real-time
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue || !currentTabShared) {
        return { 
          height: EXPLORE_MIN, 
          tab: 'Explore' 
        };
      }
      return { 
        height: bottomHeightSharedValue.value, 
        tab: currentTabShared.value ?? 'Explore' 
      };
    },
    (current, previous) => {
      'worklet';
      // Skip if values haven't changed
      if (previous && 
          Math.abs(current.height - previous.height) < 1 && 
          current.tab === previous.tab) {
        return;
      }
      
      const { height, tab } = current;
      let textToSet = '';
      
      if (tab === 'Explore') {
        // Show "Feed Settings" in ExploreMin state OR keyboard mode
        // ExploreMin: height between EXPLORE_MIN and EXPLORE_MAX
        // Keyboard mode: height > EXPLORE_MAX (larger bottom section)
        const isExploreMin = height >= EXPLORE_MIN - 10 && height < EXPLORE_MAX - 10;
        const isKeyboardMode = height > EXPLORE_MAX + 10;
        
        if (isExploreMin || isKeyboardMode) {
          textToSet = 'Feed Settings';
        } else {
          // ExploreMax state - no text
          textToSet = '';
        }
      } else if (tab === 'Services') {
        // Show "7 Services" in ServiceMin state
        // ServiceMin: height between SERVICE_MIN and SERVICE_MAX
        const isServiceMin = height >= SERVICE_MIN - 10 && height < SERVICE_MAX - 10;
        
        if (isServiceMin) {
          textToSet = '7 Services';
        } else {
          // ServiceMax state - no text
          textToSet = '';
        }
      } else if (tab === 'Pay') {
        // Show "UPI and more" in PayMin state
        // PayMin: height between PAY_MIN and PAY_MAX
        const isPayMin = height >= PAY_MIN - 10 && height < PAY_MAX - 10;
        
        if (isPayMin) {
          textToSet = 'UPI and more';
        } else {
          // PayMax state - no text
          textToSet = '';
        }
      } else if (tab === 'Worlds') {
        // Show "Create & Explore" in WorldsMin state
        // WorldsMin: height between WORLDS_MIN and WORLDS_MAX
        const isWorldsMin = height >= WORLDS_MIN - 10 && height < WORLDS_MAX - 10;
        
        if (isWorldsMin) {
          textToSet = 'Create & Explore';
        } else {
          // WorldsMax state - no text
          textToSet = '';
        }
      } else if (tab === 'Assistant') {
        // Show "Conversation History" in AssistantMin state
        // AssistantMin: height between ASSISTANT_MIN and ASSISTANT_MAX
        const isAssistantMin = height >= ASSISTANT_MIN - 10 && height < ASSISTANT_MAX - 10;
        
        if (isAssistantMin) {
          textToSet = 'Conversation History';
        } else {
          // AssistantMax state - no text
          textToSet = '';
        }
      } else {
        textToSet = '';
      }
      
      // Update shared value
      interactiveTextShared.value = textToSet;
      
      // Notify parent in real-time
      runOnJS(notifyInteractiveTextChange)(textToSet);
    },
    [bottomHeightSharedValue, currentTabShared, notifyInteractiveTextChange]
  );

  // Determine current state based on height
  const [currentState, setCurrentState] = React.useState('default');
  
  // Calculate AnimatedTabs height based on bottomHeightSharedValue
  // Animates from 0 (at EXPLORE_MIN) to 40 (at EXPLORE_MAX)
  const animatedTabsHeightDerived = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue || !currentTabShared) {
      return 0;
    }
    
    const currentHeight = bottomHeightSharedValue.value ?? EXPLORE_MIN;
    const currentTabValue = currentTabShared.value ?? 'Explore';
    
    // Only calculate for Explore tab
    if (currentTabValue !== 'Explore') {
      return 0;
    }
    
    // At EXPLORE_MIN, tabs are hidden (height = 0)
    if (currentHeight <= EXPLORE_MIN) {
      return 0;
    }
    
    // At EXPLORE_MAX, tabs are at full height (40px)
    if (currentHeight >= EXPLORE_MAX) {
      return 40;
    }
    
    // Smoothly interpolate between EXPLORE_MIN (0px) and EXPLORE_MAX (40px)
    const heightRange = EXPLORE_MAX - EXPLORE_MIN;
    const heightProgress = (currentHeight - EXPLORE_MIN) / heightRange;
    const clampedProgress = Math.max(0, Math.min(1, heightProgress));
    return clampedProgress * 40;
  });
  
  // Shared value for Pay tab ButtonBar height progress (0-1)
  const payButtonBarHeightProgress = useSharedValue(0);
  
  // Calculate ButtonBar height progress for Services tab (0-1)
  // Animates from 0 (at SERVICE_MIN) to 1 (at SERVICE_MAX)
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue || !currentTabShared) return 0;
      const currentHeight = bottomHeightSharedValue.value ?? SERVICE_MIN;
      const currentTabValue = currentTabShared.value ?? 'Explore';
      
      // Only calculate for Services tab
      if (currentTabValue !== 'Services') {
        return 0;
      }
      
      // At SERVICE_MIN, progress is 0
      if (currentHeight <= SERVICE_MIN) {
        return 0;
      }
      
      // At SERVICE_MAX, progress is 1
      if (currentHeight >= SERVICE_MAX) {
        return 1;
      }
      
      // Smoothly interpolate between SERVICE_MIN (0) and SERVICE_MAX (1)
      const heightRange = SERVICE_MAX - SERVICE_MIN;
      const heightProgress = (currentHeight - SERVICE_MIN) / heightRange;
      const clampedProgress = Math.max(0, Math.min(1, heightProgress));
      return clampedProgress;
    },
    (progress) => {
      'worklet';
      buttonBarHeightProgress.value = progress;
    },
    [bottomHeightSharedValue, currentTabShared]
  );
  
  // Calculate ButtonBar height progress for Pay tab (0-1)
  // Animates from 0 (at PAY_MIN) to 1 (at PAY_MAX)
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue || !currentTabShared) return 0;
      const currentHeight = bottomHeightSharedValue.value ?? PAY_MIN;
      const currentTabValue = currentTabShared.value ?? 'Explore';
      
      // Only calculate for Pay tab
      if (currentTabValue !== 'Pay') {
        return 0;
      }
      
      // At PAY_MIN, progress is 0
      if (currentHeight <= PAY_MIN) {
        return 0;
      }
      
      // At PAY_MAX, progress is 1
      if (currentHeight >= PAY_MAX) {
        return 1;
      }
      
      // Smoothly interpolate between PAY_MIN (0) and PAY_MAX (1)
      const heightRange = PAY_MAX - PAY_MIN;
      const heightProgress = (currentHeight - PAY_MIN) / heightRange;
      const clampedProgress = Math.max(0, Math.min(1, heightProgress));
      return clampedProgress;
    },
    (progress) => {
      'worklet';
      payButtonBarHeightProgress.value = progress;
    },
    [bottomHeightSharedValue, currentTabShared]
  );
  
  // Calculate ButtonBar height progress for Worlds tab (0-1)
  // Animates from 0 (at WORLDS_MIN) to 1 (at WORLDS_MAX)
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue || !currentTabShared) return 0;
      const currentHeight = bottomHeightSharedValue.value ?? WORLDS_MIN;
      const currentTabValue = currentTabShared.value ?? 'Explore';
      
      // Only calculate for Worlds tab
      if (currentTabValue !== 'Worlds') {
        return 0;
      }
      
      // At WORLDS_MIN, progress is 0
      if (currentHeight <= WORLDS_MIN) {
        return 0;
      }
      
      // At WORLDS_MAX, progress is 1
      if (currentHeight >= WORLDS_MAX) {
        return 1;
      }
      
      // Smoothly interpolate between WORLDS_MIN (0) and WORLDS_MAX (1)
      const heightRange = WORLDS_MAX - WORLDS_MIN;
      const heightProgress = (currentHeight - WORLDS_MIN) / heightRange;
      const clampedProgress = Math.max(0, Math.min(1, heightProgress));
      return clampedProgress;
    },
    (progress) => {
      'worklet';
      worldsButtonBarHeightProgress.value = progress;
    },
    [bottomHeightSharedValue, currentTabShared]
  );
  
  // Calculate ButtonBar height progress for Assistant tab (0-1)
  // Animates from 0 (at ASSISTANT_MIN) to 1 (at ASSISTANT_MAX)
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue || !currentTabShared) return 0;
      const currentHeight = bottomHeightSharedValue.value ?? ASSISTANT_MIN;
      const currentTabValue = currentTabShared.value ?? 'Explore';
      
      // Only calculate for Assistant tab
      if (currentTabValue !== 'Assistant') {
        return 0;
      }
      
      // At ASSISTANT_MIN, progress is 0
      if (currentHeight <= ASSISTANT_MIN) {
        return 0;
      }
      
      // At ASSISTANT_MAX, progress is 1
      if (currentHeight >= ASSISTANT_MAX) {
        return 1;
      }
      
      // Smoothly interpolate between ASSISTANT_MIN (0) and ASSISTANT_MAX (1)
      const heightRange = ASSISTANT_MAX - ASSISTANT_MIN;
      const heightProgress = (currentHeight - ASSISTANT_MIN) / heightRange;
      const clampedProgress = Math.max(0, Math.min(1, heightProgress));
      return clampedProgress;
    },
    (progress) => {
      'worklet';
      assistantButtonBarHeightProgress.value = progress;
    },
    [bottomHeightSharedValue, currentTabShared]
  );
  
  // Update state value for AnimatedTabs height prop
  // Check currentTab outside worklet to avoid worklet issues
  const updateAnimatedTabsHeight = useCallback((height) => {
    // Only update if we're on Explore tab
    if (currentTab === 'Explore') {
      setAnimatedTabsHeight(height);
    } else {
      setAnimatedTabsHeight(0);
    }
  }, [currentTab]);
  
  useAnimatedReaction(
    () => {
      'worklet';
      return animatedTabsHeightDerived.value;
    },
    (currentHeight, previousHeight) => {
      'worklet';
      // Update state on JS thread for prop passing
      // Update if height changed significantly
      if (previousHeight === undefined || Math.abs(currentHeight - previousHeight) > 0.1) {
        runOnJS(updateAnimatedTabsHeight)(currentHeight);
      }
    },
    [animatedTabsHeightDerived, updateAnimatedTabsHeight]
  );
  
  // Reset height when tab changes
  useEffect(() => {
    if (currentTab !== 'Explore') {
      setAnimatedTabsHeight(0);
    }
  }, [currentTab]);
  
  // Update state based on height changes
  useAnimatedReaction(
    () => {
      'worklet';
      if (!bottomHeightSharedValue || !currentTabShared) {
        return { height: EXPLORE_MIN, tab: 'Explore' };
      }
      return { 
        height: bottomHeightSharedValue.value, 
        tab: currentTabShared.value ?? 'Explore' 
      };
    },
    (current, previous) => {
      'worklet';
      // Skip if values haven't changed significantly
      if (previous && 
          Math.abs(current.height - previous.height) < 1 && 
          current.tab === previous.tab) {
        return;
      }
      
      const { height, tab } = current;
      let newState = 'default';
      
      if (tab === 'Explore') {
        if (height >= EXPLORE_MAX - 10) {
          newState = 'max';
        } else if (height >= EXPLORE_MIN - 10) {
          newState = 'min';
        }
      } else if (tab === 'Services') {
        if (height >= SERVICE_MAX - 10) {
          newState = 'max';
        } else if (height >= SERVICE_MIN - 10) {
          newState = 'min';
        }
      } else if (tab === 'Pay') {
        if (height >= PAY_MAX - 10) {
          newState = 'max';
        } else if (height >= PAY_MIN - 10) {
          newState = 'min';
        }
      } else if (tab === 'Worlds') {
        if (height >= WORLDS_MAX - 10) {
          newState = 'max';
        } else if (height >= WORLDS_MIN - 10) {
          newState = 'min';
        }
      } else if (tab === 'Assistant') {
        if (height >= ASSISTANT_MAX - 10) {
          newState = 'max';
        } else if (height >= ASSISTANT_MIN - 10) {
          newState = 'min';
        }
      }
      
      runOnJS(setCurrentState)(newState);
    },
    [bottomHeightSharedValue, currentTabShared]
  );

  return (
    <View style={styles.container}>
      {/* AIGlow Layer - Absolute positioned at top, fixed screen position */}
      <Animated.View style={[styles.aiGlowContainer, aiGlowContainerStyle]} pointerEvents="none">
        <Animated.View style={[styles.polygonWrapper, styles.polygon1Position, polygon1Style]}>
          <Image 
            source={require('../assets/png/Polygon 1.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.polygonWrapper, styles.polygon2Position, polygon2Style]}>
          <Image 
            source={require('../assets/png/Polygon 2.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.polygonWrapper, styles.polygon3Position, polygon3Style]}>
          <Image 
            source={require('../assets/png/Polygon 3.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.polygonWrapper, styles.polygon4Position, polygon4Style]}>
          <Image 
            source={require('../assets/png/Polygon 4.png')} 
            style={styles.polygonImage}
            resizeMode="cover"
          />
        </Animated.View>
      </Animated.View>

      {/* Content Section - Normal flex layout */}
      <View style={styles.contentSection}>
        {currentTab === 'Explore' && !inputMode && (
          <>
            {/* AnimatedTabs - Smoothly animates from 0 to 40px height during Min to Max transition */}
            <View style={styles.animatedTabsContainer}>
              <AnimatedTabs
                tabs={['For Me', 'Trending', 'Streams']}
                activeIndex={animatedTabsActiveIndex}
                onTabChange={setAnimatedTabsActiveIndex}
                height={animatedTabsHeight}
                minimized={false}
                opacity={1}
              />
            </View>

            {/* InputBar - Normal position when keyboard closed */}
            <View style={styles.inputBarContainer}>
              <InputBar
                placeholder="Type query..."
                onSend={handleInputSend}
                onVideoPress={handleVideoPress}
                onVoicePress={handleVoicePress}
                onFocus={handleInputFocus}
              />
            </View>
          </>
        )}

        {currentTab === 'Services' && !inputMode && (
          <>
            <View style={styles.servicesContainer}>
              <ButtonBar
                lines={[
                  [
                    { icon: HandshakeIcon, label: 'Borrow', onPress: () => console.log('Borrow') },
                    { icon: ChartBarIcon, label: 'Invest', onPress: () => console.log('Invest') },
                    { icon: ShieldCheckIcon, label: 'Insurance', onPress: () => console.log('Insurance') },
                  ],
                  [
                    { icon: ShoppingCartIcon, label: 'Shop', onPress: () => console.log('Shop') },
                    { icon: ReceiptIcon, label: 'Bill Payments', onPress: () => console.log('Bill Payments') },
                    { icon: CarIcon, label: 'Fastag', onPress: () => console.log('Fastag') },
                  ],
                  [
                    { icon: StorefrontIcon, label: 'Bajaj Mall', onPress: () => console.log('Bajaj Mall') },
                    { icon: FirstAidIcon, label: 'Bajaj Health', onPress: () => console.log('Bajaj Health') },
                  ],
                ]}
                heightProgress={buttonBarHeightProgress}
              />
            </View>

            {/* InputBar - Normal position when keyboard closed */}
            <View style={styles.inputBarContainer}>
              <InputBar
                placeholder="Type query..."
                onSend={handleInputSend}
                onVideoPress={handleVideoPress}
                onVoicePress={handleVoicePress}
                onFocus={handleInputFocus}
              />
            </View>
          </>
        )}

        {currentTab === 'Pay' && !inputMode && (
          <>
            <View style={styles.servicesContainer}>
              <ButtonBar
                lines={[
                  [
                    { icon: ReceiptIcon, label: 'Pay Bills', onPress: () => console.log('Pay Bills') },
                    { icon: ArrowUpRightIcon, label: 'Send Money', onPress: () => console.log('Send Money') },
                    { icon: BarcodeIcon, label: 'Scan QR', onPress: () => console.log('Scan QR') },
                  ],
                ]}
                heightProgress={payButtonBarHeightProgress}
              />
            </View>

            {/* InputBar - Normal position when keyboard closed */}
            <View style={styles.inputBarContainer}>
              <InputBar
                placeholder="Type query..."
                onSend={handleInputSend}
                onVideoPress={handleVideoPress}
                onVoicePress={handleVoicePress}
                onFocus={handleInputFocus}
              />
            </View>
          </>
        )}

        {currentTab === 'Worlds' && !inputMode && (
          <>
            <View style={styles.servicesContainer}>
              <ButtonBar
                lines={[
                  [
                    { icon: StarFourIcon, label: 'Create New World', onPress: () => console.log('Create New World') },
                    { icon: DiamondsFourIcon, label: 'Explore Templates', onPress: () => console.log('Explore Templates') },
                  ],
                ]}
                heightProgress={worldsButtonBarHeightProgress}
              />
            </View>

            {/* InputBar - Normal position when keyboard closed */}
            <View style={styles.inputBarContainer}>
              <InputBar
                placeholder="Type query..."
                onSend={handleInputSend}
                onVideoPress={handleVideoPress}
                onVoicePress={handleVoicePress}
                onFocus={handleInputFocus}
              />
            </View>
          </>
        )}

        {currentTab === 'Assistant' && !inputMode && (
          <>
            <View style={styles.servicesContainer}>
              <ButtonBar
                lines={[
                  [
                    { icon: ArticleIcon, label: 'Conversation History', onPress: () => console.log('Conversation History') },
                  ],
                ]}
                heightProgress={assistantButtonBarHeightProgress}
              />
            </View>

            {/* InputBar - Normal position when keyboard closed */}
            <View style={styles.inputBarContainer}>
              <InputBar
                placeholder="Type query..."
                onSend={handleInputSend}
                onVideoPress={handleVideoPress}
                onVoicePress={handleVoicePress}
                onFocus={handleInputFocus}
              />
            </View>
          </>
        )}
        
        {currentTab !== 'Explore' && currentTab !== 'Services' && currentTab !== 'Pay' && currentTab !== 'Worlds' && currentTab !== 'Assistant' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{currentTab} Content</Text>
          </View>
        )}
      </View>

      {/* InputBar - Absolute positioned when keyboard is open */}
      {(currentTab === 'Explore' || currentTab === 'Services' || currentTab === 'Pay' || currentTab === 'Worlds' || currentTab === 'Assistant') && inputMode && (
        <Animated.View style={[styles.inputBarKeyboard, inputBarKeyboardStyle]}>
          <InputBar
            placeholder="Type query..."
            onSend={handleInputSend}
            onVideoPress={handleVideoPress}
            onVoicePress={handleVoicePress}
            onFocus={handleInputFocus}
          />
        </Animated.View>
      )}

      {/* TabBar - Hidden when keyboard is open */}
      {!(inputMode && keyboardHeight > 0) && (
        <View style={[styles.tabBar, { paddingBottom: Math.max(Spacing.containerPaddingBottom, insets.bottom + 8) }]}>
          <TabBar
            activeTab={currentTab}
            onTabChange={handleTabPress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'flex-end', // Align all content to bottom
  },
  aiGlowContainer: {
    position: 'absolute',
    top: 20, // Moved 80px down (was -60)
    left: -100,
    right: -100,
    height: 350,
    zIndex: 0,
    overflow: 'visible',
    pointerEvents: 'none',
  },
  polygonWrapper: {
    position: 'absolute',
    width: 250,
    height: 250,
    overflow: 'visible',
  },
  polygon1Position: {
    left: '50%',
    top: '50%',
    marginLeft: -20, // -125 (center) - 40 (offset for overlap)
    marginTop: -125, // Half of height (250/2)
  },
  polygon2Position: {
    left: '50%',
    top: '50%',
    marginLeft: -105, // -125 (center) - 20 (slight offset)
    marginTop: -125,
  },
  polygon3Position: {
    left: '50%',
    top: '50%',
    marginLeft: -210, // Centered (half of width)
    marginTop: -125,
  },
  polygon4Position: {
    left: '50%',
    top: '50%',
    marginLeft: -320, // -125 (center) + 40 (offset)
    marginTop: -125,
  },
  polygonImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  animatedTabsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.containerGap,
  },
  inputBarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.containerGap,
  },
  inputBarKeyboard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  tabBar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicesContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.containerGap,
  },
  placeholderContainer: {
    width: SCREEN_WIDTH - Spacing.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  placeholderText: {
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    opacity: 0.5,
  },
});

