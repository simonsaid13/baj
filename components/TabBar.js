import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/tokens';
import {
  ExploreTabIcon,
  ServicesTabIcon,
  PayTabIcon,
  WorldsTabIcon,
  AssistantTabIcon,
} from './icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// TabBar component with 5 tabs
// Container padding: 20px left/right from parent
// Background: rgba(255, 255, 255, 0.13) with 24px border radius
// Inner padding: 4px, gap: 4px between tabs
export default function TabBar({ 
  activeTab = 'Explore',
  onTabChange,
  style,
}) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Handle tab press with haptic feedback
  const handleTabPress = (tabName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentTab === tabName) {
      return; // Already selected
    }
    
    setCurrentTab(tabName);
    
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  // Tab configuration
  const tabs = [
    { name: 'Explore', icon: ExploreTabIcon },
    { name: 'Services', icon: ServicesTabIcon },
    { name: 'Pay', icon: PayTabIcon },
    { name: 'Worlds', icon: WorldsTabIcon },
    { name: 'Assistant', icon: AssistantTabIcon },
  ];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabBarContainer}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.name}
            icon={tab.icon}
            label={tab.name}
            isActive={currentTab === tab.name}
            onPress={() => handleTabPress(tab.name)}
          />
        ))}
      </View>
    </View>
  );
}

// Individual tab item
const TabItem = ({ icon: Icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabItem,
        isActive && styles.tabItemActive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon size={24} color={Colors.white} />
      </View>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20, // 20px left/right padding from parent
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 24,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  tabItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.5,
    textAlign: 'center',
  },
  tabLabelActive: {
    opacity: 1,
  },
});

