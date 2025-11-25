import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import ResizableSplitView from '../components/ResizableSplitView';
import ContextBar from '../components/ContextBar';
import { Colors, BorderRadius, Spacing } from '../constants/tokens';

import ForMeContent from '../components/ForMeContent';
import TrendingContent from '../components/TrendingContent';
import LivestreamsContent from '../components/LivestreamsContent';
import ServicesContent from '../components/ServicesContent';
import PayContent from '../components/PayContent';
import WorldsContent from '../components/WorldsContent';
import AssistantContent from '../components/AssistantContent';

// Import detail screens for inline rendering
import CardDetailScreen from './CardDetailScreen';
import LoanDetailScreen from './LoanDetailScreen';
import ProductDetailScreen from './ProductDetailScreen';
import TransactionDetailScreen from './TransactionDetailScreen';
import ServiceDetailScreen from './ServiceDetailScreen';

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
  const [exploreActiveIndex, setExploreActiveIndex] = React.useState(0);
  const prevHeightRef = React.useRef(EXPLORE_MIN);
  
  const [interactiveText, setInteractiveText] = React.useState('');
  
  // Detail view state
  const [currentView, setCurrentView] = React.useState('main'); // 'main' or 'detail'
  const [detailType, setDetailType] = React.useState(null); // 'card', 'loan', 'product', 'transaction', 'service'
  const [detailParams, setDetailParams] = React.useState(null);

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

  // Detail view navigation callbacks - defined before renderContent so they're available
  const showDetail = useCallback((type, params) => {
    console.log('[ExploreScreen] showDetail called:', type, params);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDetailType(type);
    setDetailParams(params);
    setCurrentView('detail');
  }, []);

  const hideDetail = useCallback(() => {
    console.log('[ExploreScreen] hideDetail called');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentView('main');
    setDetailType(null);
    setDetailParams(null);
  }, []);

  // Render detail view or main content - memoized to ensure latest callbacks
  const renderContent = useMemo(() => {
    console.log('[ExploreScreen] renderContent:', { currentView, detailType, hasParams: !!detailParams });
    
    if (currentView === 'detail' && detailType && detailParams) {
      // Render detail view inline with wrapper to handle layout
      const detailProps = {
        route: { params: detailParams },
        navigation: { goBack: hideDetail }
      };

      console.log('[ExploreScreen] Rendering detail screen:', detailType);

      // Wrap in a View instead of relying on SafeAreaView from detail screens
      return (
        <View style={styles.detailWrapper}>
          {detailType === 'card' && <CardDetailScreen {...detailProps} />}
          {detailType === 'loan' && <LoanDetailScreen {...detailProps} />}
          {detailType === 'product' && <ProductDetailScreen {...detailProps} />}
          {detailType === 'transaction' && <TransactionDetailScreen {...detailProps} />}
          {detailType === 'service' && <ServiceDetailScreen {...detailProps} />}
        </View>
      );
    }

    // Render main content based on active tab
    if (activeTab === 'Explore') {
      if (exploreActiveIndex === 0) return <ForMeContent onShowDetail={showDetail} />;
      if (exploreActiveIndex === 1) return <TrendingContent onShowDetail={showDetail} />;
      if (exploreActiveIndex === 2) return <LivestreamsContent onShowDetail={showDetail} />;
    } else if (activeTab === 'Services') {
      return <ServicesContent onShowDetail={showDetail} />;
    } else if (activeTab === 'Pay') {
      return <PayContent onShowDetail={showDetail} />;
    } else if (activeTab === 'Worlds') {
      return <WorldsContent onShowDetail={showDetail} />;
    } else if (activeTab === 'Assistant') {
      return <AssistantContent onShowDetail={showDetail} />;
    }

    return <View style={{flex: 1, backgroundColor: '#fff'}} />;
  }, [currentView, detailType, detailParams, activeTab, exploreActiveIndex, showDetail, hideDetail]);

  const topSection = (
    <View style={styles.topSection}>
      <BlurView intensity={20} tint="light" style={styles.topSectionBlur}>
        <View style={styles.pageContainer}>
          {renderContent}
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
    const previousTab = activeTab;

    console.log('Tab change from', previousTab, 'to', tabName);

    // Reset to main view when switching tabs
    setCurrentView('main');
    setDetailType(null);
    setDetailParams(null);

    // Always switch to MIN state for the new tab, regardless of current state
    // This ensures consistent behavior - new tabs always start minimized
    setActiveTab(tabName);

    let newMinHeight;
    if (tabName === 'Services') {
      newMinHeight = SERVICE_MIN;
    } else if (tabName === 'Pay') {
      newMinHeight = PAY_MIN;
    } else if (tabName === 'Worlds') {
      newMinHeight = WORLDS_MIN;
    } else if (tabName === 'Assistant') {
      newMinHeight = ASSISTANT_MIN;
    } else {
      newMinHeight = EXPLORE_MIN;
    }

    console.log('Switching tab - setting to MIN height:', newMinHeight);

    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = withTiming(newMinHeight, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }

    setExternalBottomHeight(newMinHeight);
    setBottomHeight(newMinHeight);
    prevHeightRef.current = newMinHeight;
  }, [activeTab, bottomHeight, bottomHeightSharedValue]);

  const handleInteractiveTextChange = useCallback((text) => {
    setInteractiveText(text);
  }, []);
  
  const handleExploreTabChange = useCallback((index) => {
    // Reset to main view when switching explore sub-tabs
    setCurrentView('main');
    setDetailType(null);
    setDetailParams(null);
    setExploreActiveIndex(index);
  }, []);

  const bottomSection = (
    <ContextBar 
      bottomHeightSharedValue={bottomHeightSharedValue}
      activeTab={activeTab}
      onHeightChange={handleHeightChange}
      onTabChange={handleTabChange}
      onInteractiveTextChange={handleInteractiveTextChange}
      onExploreTabChange={handleExploreTabChange}
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
  detailWrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
});

