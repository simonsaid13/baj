import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSharedValue } from 'react-native-reanimated';
import ResizableSplitView from '../components/ResizableSplitView';
import BottomContainer from '../components/BottomContainer';
import { Colors, BorderRadius, Spacing } from '../constants/tokens';

import ExploreContent from '../components/ExploreContent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Bottom container heights to match Figma designs
const EXPLORE_DEFAULT = 140;      // Explore collapsed: just tab bar + interactive line
const ASSISTANT_HEIGHT = 220;     // Assistant mode: 3 action buttons
const EXPLORE_MIN = 320;          // Explore min: 6 action cards (2 rows)
const EXPLORE_MAX = 400;          // Explore max: 8 action cards (3 rows)

export default function ExploreScreen({ navigation }) {
  // Initialize to EXPLORE_DEFAULT (collapsed state)
  const bottomHeightSharedValue = useSharedValue(EXPLORE_DEFAULT);
  const [bottomHeight, setBottomHeight] = React.useState(EXPLORE_DEFAULT);
  const [externalBottomHeight, setExternalBottomHeight] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('Explore');
  const prevHeightRef = React.useRef(EXPLORE_DEFAULT);
  
  // Handle Design System button press
  const handleDesignSystemPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (navigation) {
      navigation.navigate('DesignSystem');
    }
  }, [navigation]);
  
  // Determine interactive text based on state and active tab
  const getInteractiveText = React.useCallback((height, currentTab) => {
    // Only show "+2 more" text in Explore mode (between EXPLORE_DEFAULT and EXPLORE_MIN)
    if (currentTab !== 'Explore') {
      return '';
    }
    
    if (height > EXPLORE_DEFAULT && height <= EXPLORE_MIN) {
      return '+2 more';
    }
    return '';
  }, []);
  
  const [interactiveText, setInteractiveText] = React.useState('');
  
  // Update interactive text when height or tab changes
  React.useEffect(() => {
    const text = getInteractiveText(bottomHeight, activeTab);
    setInteractiveText(text);
  }, [bottomHeight, activeTab, getInteractiveText]);

  const handleStateChange = useCallback((newBottomHeight) => {
    const prevHeight = prevHeightRef.current;
    setBottomHeight(newBottomHeight);
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = newBottomHeight;
    }
    
    // Haptic feedback based on state transitions
    const isExpanding = newBottomHeight > prevHeight;
    
    if (newBottomHeight <= EXPLORE_DEFAULT + 10) {
      // Collapsed
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (newBottomHeight > EXPLORE_DEFAULT + 10 && newBottomHeight <= ASSISTANT_HEIGHT + 10) {
      // Assistant mode
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (newBottomHeight > ASSISTANT_HEIGHT + 10 && newBottomHeight <= EXPLORE_MIN + 10) {
      // Expanded with 6 cards
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (newBottomHeight > EXPLORE_MIN + 10) {
      // Fully expanded with 8 cards
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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

  const bottomSection = (
    <BottomContainer 
      bottomHeight={bottomHeight} 
      bottomHeightSharedValue={bottomHeightSharedValue}
      activeTab={activeTab}
      onHeightChange={handleHeightChange}
      onTabChange={handleTabChange}
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
      enableDrag={activeTab === 'Explore'}
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

