import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';
import { useSharedValue } from 'react-native-reanimated';
import ResizableSplitView from '../components/ResizableSplitView';
import ContextBar from '../components/ContextBar';
import ExploreContent from '../components/ExploreContent';

const EXPLORE_DEFAULT = 140;

export default function ContextBarDetailScreen({ navigation }) {
  const bottomHeightSharedValue = useSharedValue(EXPLORE_DEFAULT);
  const [bottomHeight, setBottomHeight] = useState(EXPLORE_DEFAULT);
  const [activeTab, setActiveTab] = useState('Explore');
  const [interactiveText, setInteractiveText] = useState('');

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleStateChange = useCallback((newBottomHeight) => {
    setBottomHeight(newBottomHeight);
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = newBottomHeight;
    }
  }, [bottomHeightSharedValue]);

  const handleHeightChange = useCallback((newHeight) => {
    setBottomHeight(newHeight);
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = newHeight;
    }
  }, [bottomHeightSharedValue]);

  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  const handleInteractiveTextChange = useCallback((text) => {
    setInteractiveText(text);
  }, []);

  const topSection = (
    <View style={styles.topSection}>
      <BlurView intensity={20} tint="light" style={styles.topSectionBlur}>
        <View style={styles.pageContainer}>
          <ExploreContent />
        </View>
      </BlurView>
    </View>
  );

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ContextBar</Text>
        <View style={styles.placeholder} />
      </View>

      {/* ResizableSplitView with ContextBar */}
      <ResizableSplitView
        topSection={topSection}
        bottomSection={bottomSection}
        onStateChange={handleStateChange}
        bottomHeightSharedValue={bottomHeightSharedValue}
        interactiveText={interactiveText}
        enableDrag={activeTab === 'Explore'}
        activeTab={activeTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white14,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  placeholder: {
    width: 40,
  },
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
});

