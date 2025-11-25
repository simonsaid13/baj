import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSharedValue } from 'react-native-reanimated';
import ResizableSplitView from '../components/ResizableSplitView';
import ContextBar from '../components/ContextBar';
import { Colors, BorderRadius, Spacing } from '../constants/tokens';

import ExploreContent from '../components/ExploreContent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Bottom container heights to match Figma designs
// Height constants - ONLY MIN AND MAX (MUST match ResizableSplitView.js & ContextBar.js)
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

export default function ExploreScreen({ navigation }) {
  // Initialize to EXPLORE_MIN
  const bottomHeightSharedValue = useSharedValue(EXPLORE_MIN);
  const [bottomHeight, setBottomHeight] = React.useState(EXPLORE_MIN);
  const [externalBottomHeight, setExternalBottomHeight] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('Explore');
  const prevHeightRef = React.useRef(EXPLORE_MIN);
  
  // Handle Design System button press
  const handleDesignSystemPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (navigation) {
      navigation.navigate('DesignSystem');
    }
  }, [navigation]);
  
  const [interactiveText, setInteractiveText] = React.useState('');

  const handleStateChange = useCallback((newBottomHeight) => {
    const prevHeight = prevHeightRef.current;
    setBottomHeight(newBottomHeight);
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = newBottomHeight;
    }
    
    // Haptic feedback based on state transitions
    if (activeTab === 'Services') {
      if (newBottomHeight <= SERVICE_MIN + 10) {
        // ServiceMin state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (newBottomHeight >= SERVICE_MAX - 10) {
        // ServiceMax state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } else if (activeTab === 'Pay') {
      if (newBottomHeight <= PAY_MIN + 10) {
        // PayMin state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (newBottomHeight >= PAY_MAX - 10) {
        // PayMax state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } else if (activeTab === 'Worlds') {
      if (newBottomHeight <= WORLDS_MIN + 10) {
        // WorldsMin state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (newBottomHeight >= WORLDS_MAX - 10) {
        // WorldsMax state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } else if (activeTab === 'Assistant') {
      if (newBottomHeight <= ASSISTANT_MIN + 10) {
        // AssistantMin state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (newBottomHeight >= ASSISTANT_MAX - 10) {
        // AssistantMax state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } else {
      if (newBottomHeight <= EXPLORE_MIN + 10) {
        // ExploreMin state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (newBottomHeight >= EXPLORE_MAX - 10) {
        // ExploreMax state
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }
    
    prevHeightRef.current = newBottomHeight;
  }, [bottomHeightSharedValue]);

  const topSection = (
    <View style={styles.topSection}>
      <BlurView intensity={20} tint="light" style={styles.topSectionBlur}>
        <View style={styles.pageContainer}>
          <ExploreContent />
          {/* Floating Design System Button */}
          <TouchableOpacity
            style={styles.designSystemButton}
            onPress={handleDesignSystemPress}
            activeOpacity={0.8}
          >
            <Text style={styles.designSystemButtonText}>DS</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  const handleHeightChange = useCallback((newHeight) => {
    setExternalBottomHeight(newHeight);
    setBottomHeight(newHeight);
    prevHeightRef.current = newHeight;
  }, []);

  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
    console.log('Tab changed to:', tabName);
  }, []);

  const handleInteractiveTextChange = useCallback((text) => {
    setInteractiveText(text);
  }, []);

  const bottomSection = (
    <ContextBar 
      bottomHeightSharedValue={bottomHeightSharedValue}
      activeTab={activeTab}
      onHeightChange={handleHeightChange}
      onTabChange={handleTabChange}
      onInteractiveTextChange={handleInteractiveTextChange}
    />
  );

  return (
    <ResizableSplitView
      topSection={topSection}
      bottomSection={bottomSection}
      onStateChange={handleStateChange}
      bottomHeightSharedValue={bottomHeightSharedValue}
      interactiveText={interactiveText}
      externalBottomHeight={externalBottomHeight}
      enableDrag={activeTab === 'Explore' || activeTab === 'Services' || activeTab === 'Pay' || activeTab === 'Worlds' || activeTab === 'Assistant'}
      activeTab={activeTab}
    />
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    borderBottomLeftRadius: BorderRadius.page,
    borderBottomRightRadius: BorderRadius.page,
    overflow: 'hidden',
  },
  topSectionBlur: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    position: 'relative',
  },
  designSystemButton: {
    position: 'absolute',
    top: 60,
    right: Spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  designSystemButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
});

