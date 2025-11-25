import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';
import AnimatedTabs from '../components/AnimatedTabs';

const DEFAULT_TABS = ['For Me', 'Trending', 'Streams'];

export default function AnimatedTabsDetailScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [tabCount, setTabCount] = useState(3);
  const [height, setHeight] = useState(40);
  const [minimized, setMinimized] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [newTabName, setNewTabName] = useState('');

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleTabCountChange = (value) => {
    const count = Math.round(value);
    setTabCount(count);
    
    // Generate tab names
    const newTabs = [];
    for (let i = 0; i < count; i++) {
      if (i < DEFAULT_TABS.length) {
        newTabs.push(DEFAULT_TABS[i]);
      } else {
        newTabs.push(`Tab ${i + 1}`);
      }
    }
    setTabs(newTabs);
    
    // Reset active index if it's out of bounds
    if (activeIndex >= count) {
      setActiveIndex(count - 1);
    }
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      setTabs([...tabs, newTabName.trim()]);
      setTabCount(tabs.length + 1);
      setNewTabName('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveTab = (index) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((_, i) => i !== index);
      setTabs(newTabs);
      setTabCount(newTabs.length);
      
      // Adjust active index if needed
      if (activeIndex >= newTabs.length) {
        setActiveIndex(newTabs.length - 1);
      } else if (activeIndex === index && index > 0) {
        setActiveIndex(index - 1);
      }
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleHeightChange = (value) => {
    setHeight(Math.round(value));
    // Auto-toggle minimized when height is very small
    if (value <= 8) {
      setMinimized(true);
    } else if (value > 8 && minimized) {
      setMinimized(false);
    }
  };

  const toggleMinimized = () => {
    setMinimized(!minimized);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

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
        <Text style={styles.headerTitle}>AnimatedTabs</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Live Preview</Text>
          <View style={styles.previewBox}>
            <AnimatedTabs
              tabs={tabs}
              activeIndex={activeIndex}
              onTabChange={(index) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveIndex(index);
              }}
              height={height}
              minimized={minimized}
              opacity={opacity}
            />
          </View>
          <Text style={styles.infoLabel}>
            Active Tab: {tabs[activeIndex]} (Index: {activeIndex})
          </Text>
        </View>

        {/* Controls Section */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Controls</Text>

          {/* Tab Count Control */}
          <View style={styles.controlItem}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlLabel}>Number of Tabs</Text>
              <Text style={styles.controlValue}>{tabCount}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={8}
              step={1}
              value={tabCount}
              onValueChange={handleTabCountChange}
              minimumTrackTintColor={Colors.white}
              maximumTrackTintColor={Colors.white14}
              thumbTintColor={Colors.white}
            />
          </View>

          {/* Height Control */}
          <View style={styles.controlItem}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlLabel}>Height</Text>
              <Text style={styles.controlValue}>{height}px</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={48}
              step={1}
              value={height}
              onValueChange={handleHeightChange}
              minimumTrackTintColor={Colors.white}
              maximumTrackTintColor={Colors.white14}
              thumbTintColor={Colors.white}
            />
            <Text style={styles.controlHint}>
              Height: 0px (hidden) to 48px (max). Text hides below 38px (80%). Width scales with height.
            </Text>
          </View>

          {/* Minimized Toggle */}
          <View style={styles.controlItem}>
            <TouchableOpacity
              style={[styles.toggleButton, minimized && styles.toggleButtonActive]}
              onPress={toggleMinimized}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, minimized && styles.toggleTextActive]}>
                {minimized ? 'Minimized' : 'Expanded'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Opacity Control */}
          <View style={styles.controlItem}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlLabel}>Opacity</Text>
              <Text style={styles.controlValue}>
                {Math.round(opacity * 100)}%
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={opacity}
              onValueChange={setOpacity}
              minimumTrackTintColor={Colors.white}
              maximumTrackTintColor={Colors.white14}
              thumbTintColor={Colors.white}
            />
            <Text style={styles.controlHint}>
              Set to 0 to completely hide the component
            </Text>
          </View>

          {/* Custom Tab Names */}
          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>Custom Tab Names</Text>
            <View style={styles.tabList}>
              {tabs.map((tab, index) => (
                <View key={index} style={styles.tabListItem}>
                  <Text style={styles.tabListText}>{tab}</Text>
                  {tabs.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveTab(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.addTabContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="New tab name"
                placeholderTextColor={Colors.white}
                value={newTabName}
                onChangeText={setNewTabName}
                onSubmitEditing={handleAddTab}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTab}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Component Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Behavior & Logic</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Animation:</Text>
            <Text style={styles.detailText}>
              • White background moves smoothly to selected tab
            </Text>
            <Text style={styles.detailText}>
              • Squishing animation (70% width) during movement (150ms)
            </Text>
            <Text style={styles.detailText}>
              • Spring animation to target position with bounce (0.2s)
            </Text>
            <Text style={styles.detailText}>
              • Expands back to full width with bounce effect
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>States:</Text>
            <Text style={styles.detailText}>
              • Expanded: Shows tab labels with white background indicator
            </Text>
            <Text style={styles.detailText}>
              • Minimized: Shows dots only (4px height, 8px width)
            </Text>
            <Text style={styles.detailText}>
              • Hidden: Opacity set to 0 (component disappears)
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Interactions:</Text>
            <Text style={styles.detailText}>• Tap to switch tabs</Text>
            <Text style={styles.detailText}>• Haptic feedback on press</Text>
            <Text style={styles.detailText}>
              • Prevents selecting already active tab
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Design Specifications</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Container:</Text>
            <Text style={styles.detailText}>
              • Background: rgba(255, 255, 255, 0.13)
            </Text>
            <Text style={styles.detailText}>• Border radius: 99px (pill shape)</Text>
            <Text style={styles.detailText}>• Padding: 4px</Text>
            <Text style={styles.detailText}>
              • Left/Right padding: 20px from parent
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Indicator:</Text>
            <Text style={styles.detailText}>• Background: White</Text>
            <Text style={styles.detailText}>• Border radius: 20px</Text>
            <Text style={styles.detailText}>
              • Width: Equal to tab width (squishes to 70% during animation)
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tab Label:</Text>
            <Text style={styles.detailText}>• Font size: 14px</Text>
            <Text style={styles.detailText}>• Font weight: 500</Text>
            <Text style={styles.detailText}>
              • Color: White (opacity 0.5 default, 1.0 selected)
            </Text>
            <Text style={styles.detailText}>
              • Selected: Black text (on white background)
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {'<AnimatedTabs\n  tabs={["For Me", "Trending", "Streams"]}\n  activeIndex={0}\n  onTabChange={(index) => console.log(index)}\n  height={40}\n  minimized={false}\n  opacity={1}\n/>'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Props</Text>
          <View style={styles.detailItem}>
            <Text style={styles.propText}>
              • tabs: Array&lt;string&gt; (default: ['For Me', 'Trending',
              'Streams'])
            </Text>
            <Text style={styles.propText}>
              • activeIndex: number (default: 0) - Index of active tab
            </Text>
            <Text style={styles.propText}>
              • onTabChange: function (index) - Called when tab is pressed
            </Text>
            <Text style={styles.propText}>
              • height: number (default: 40) - Height of tabs in pixels
            </Text>
            <Text style={styles.propText}>
              • minimized: boolean (default: false) - Shows dots only when true
            </Text>
            <Text style={styles.propText}>
              • opacity: number (default: 1) - Opacity 0-1, set to 0 to hide
            </Text>
            <Text style={styles.propText}>
              • style: ViewStyle (optional) - Additional container styles
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xxl,
  },
  previewContainer: {
    marginBottom: Spacing.xxxxl,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.xxl,
  },
  previewBox: {
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    padding: Spacing.xxxxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginBottom: Spacing.xxl,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
  },
  controlsSection: {
    marginBottom: Spacing.xxxxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  controlItem: {
    marginBottom: Spacing.xxl,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
  },
  controlValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  controlHint: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.5,
    marginTop: Spacing.xs,
  },
  toggleButton: {
    backgroundColor: Colors.white14,
    borderRadius: 20,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.7,
  },
  toggleTextActive: {
    color: Colors.black,
    opacity: 1,
  },
  tabList: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  tabListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white14,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  tabListText: {
    fontSize: 14,
    color: Colors.white,
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  removeButtonText: {
    fontSize: 18,
    color: Colors.white,
    lineHeight: 20,
  },
  addTabContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.white14,
    borderRadius: 8,
    padding: Spacing.md,
    color: Colors.white,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  detailsSection: {
    marginBottom: Spacing.xxl,
  },
  detailItem: {
    marginBottom: Spacing.md,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#00F0FF',
    fontFamily: 'Courier',
    lineHeight: 18,
  },
  propText: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
    lineHeight: 20,
    fontFamily: 'Courier',
    marginBottom: Spacing.xs,
  },
});

