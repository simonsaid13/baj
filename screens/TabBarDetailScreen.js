import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';
import TabBar from '../components/TabBar';

const TABS = ['Explore', 'Services', 'Pay', 'Worlds', 'Assistant'];

export default function TabBarDetailScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Explore');

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
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
        <Text style={styles.headerTitle}>TabBar</Text>
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
            <TabBar
              activeTab={activeTab}
              onTabChange={(tab) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab);
              }}
            />
          </View>
          <Text style={styles.infoLabel}>Current Tab: {activeTab}</Text>
        </View>

        {/* All States Visualization */}
        <View style={styles.statesSection}>
          <Text style={styles.sectionTitle}>All States</Text>
          <Text style={styles.sectionDescription}>
            Each tab can be in two states: Default (transparent) or Selected (with background overlay)
          </Text>
          
          {TABS.map((tab) => (
            <View key={tab} style={styles.stateItem}>
              <Text style={styles.stateLabel}>{tab} Tab</Text>
              <View style={styles.previewBox}>
                <TabBar
                  activeTab={tab}
                  onTabChange={() => {}}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Component Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Behavior & Logic</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>States:</Text>
            <Text style={styles.detailText}>• Default: Transparent background, 50% opacity label</Text>
            <Text style={styles.detailText}>• Selected: White overlay background (rgba(255, 255, 255, 0.13)), 100% opacity label</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Interactions:</Text>
            <Text style={styles.detailText}>• Tap to switch tabs</Text>
            <Text style={styles.detailText}>• Haptic feedback on press</Text>
            <Text style={styles.detailText}>• Smooth background animation (300ms ease-in-out)</Text>
            <Text style={styles.detailText}>• Prevents selecting already active tab</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Design Specifications</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Container:</Text>
            <Text style={styles.detailText}>• Background: rgba(255, 255, 255, 0.13)</Text>
            <Text style={styles.detailText}>• Border radius: 24px</Text>
            <Text style={styles.detailText}>• Padding: 4px, Gap: 4px</Text>
            <Text style={styles.detailText}>• Left/Right padding: 20px from parent</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tab Item:</Text>
            <Text style={styles.detailText}>• Flex: 1 (equal width)</Text>
            <Text style={styles.detailText}>• Padding: 8px vertical, 6px horizontal</Text>
            <Text style={styles.detailText}>• Border radius: 20px</Text>
            <Text style={styles.detailText}>• Gap: 8px (icon to label)</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Icon & Label:</Text>
            <Text style={styles.detailText}>• Icon size: 24x24px</Text>
            <Text style={styles.detailText}>• Label: 12px, 500 weight, 14px line height</Text>
            <Text style={styles.detailText}>• Color: white</Text>
            <Text style={styles.detailText}>• Label opacity: 0.5 (default), 1.0 (selected)</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {'<TabBar\n  activeTab="Explore"\n  onTabChange={(tab) => console.log(tab)}\n/>'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Props</Text>
          <View style={styles.detailItem}>
            <Text style={styles.propText}>• activeTab: string (default: 'Explore')</Text>
            <Text style={styles.propText}>  Available values: 'Explore', 'Services', 'Pay', 'Worlds', 'Assistant'</Text>
            <Text style={styles.propText}>• onTabChange: function (tab name) - Called when tab is pressed</Text>
            <Text style={styles.propText}>• style: ViewStyle (optional) - Additional container styles</Text>
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
    marginBottom: Spacing.xxl,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  statesSection: {
    marginBottom: Spacing.xxxxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  sectionDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
    lineHeight: 18,
    marginBottom: Spacing.xxl,
  },
  stateItem: {
    marginBottom: Spacing.xxl,
  },
  stateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.md,
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
  },
});

