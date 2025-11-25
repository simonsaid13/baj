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
import { Colors, Typography, Spacing, BorderRadius } from '../constants/tokens';
import TabBar from '../components/TabBar';
import InputBar from '../components/InputBar';

// Component previews - add new component previews here
const ComponentPreviews = {
  tabbar: TabBarPreview,
  inputbar: InputBarPreview,
};

// TabBar Preview Component
function TabBarPreview() {
  const [activeTab, setActiveTab] = useState('Explore');

  return (
    <View style={styles.previewContainer}>
      <Text style={styles.previewLabel}>Live Preview</Text>
      <View style={styles.previewBox}>
        <TabBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            console.log('Tab changed:', tab);
            setActiveTab(tab);
          }}
        />
      </View>
      
      <Text style={styles.infoLabel}>Current Tab: {activeTab}</Text>

      {/* Component Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Behavior & Logic</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>States:</Text>
          <Text style={styles.detailText}>• Default: Transparent background, 50% opacity label</Text>
          <Text style={styles.detailText}>• Selected: White overlay background, 100% opacity label</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Interactions:</Text>
          <Text style={styles.detailText}>• Tap to switch tabs</Text>
          <Text style={styles.detailText}>• Haptic feedback on press</Text>
          <Text style={styles.detailText}>• Smooth background animation (300ms)</Text>
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
          <Text style={styles.propText}>• onTabChange: function (tab name)</Text>
          <Text style={styles.propText}>• style: ViewStyle (optional)</Text>
        </View>
      </View>
    </View>
  );
}

// InputBar Preview Component
function InputBarPreview() {
  const [currentState, setCurrentState] = useState('Default');

  const handleSend = (text) => {
    console.log('Send:', text);
    setCurrentState('Generating');
  };

  const handleVideoPress = () => {
    console.log('Video pressed');
  };

  const handleVoicePress = (isVoiceMode) => {
    console.log('Voice mode:', isVoiceMode);
    setCurrentState(isVoiceMode ? 'Voice Mode' : 'Default');
  };

  return (
    <View style={styles.previewContainer}>
      <Text style={styles.previewLabel}>Live Preview</Text>
      <View style={styles.previewBox}>
        <InputBar
          placeholder="Type query..."
          onSend={handleSend}
          onVideoPress={handleVideoPress}
          onVoicePress={handleVoicePress}
        />
      </View>
      
      <Text style={styles.infoLabel}>Current State: {currentState}</Text>

      {/* Component Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Behavior & Logic</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>States:</Text>
          <Text style={styles.detailText}>• Default: Gradient placeholder, 40x40 buttons, 24x24 icons</Text>
          <Text style={styles.detailText}>• Focused: Smaller buttons (32x32), icons (20x20), no padding, send button appears</Text>
          <Text style={styles.detailText}>• Multi-line: Input expands (max 80px), icons stay bottom-aligned</Text>
          <Text style={styles.detailText}>• Generating: Shows "Generating Response" with gradient, stop icon</Text>
          <Text style={styles.detailText}>• Voice Mode: Audio wave visualization, stop icon replaces microphone</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Interactions:</Text>
          <Text style={styles.detailText}>• Video button: Bounce animation + haptic feedback</Text>
          <Text style={styles.detailText}>• Input focus: Animates sizes, shows send button</Text>
          <Text style={styles.detailText}>• Send button: Appears when text entered, transitions to generating state</Text>
          <Text style={styles.detailText}>• Voice button: Toggles voice mode, shows audio waves</Text>
          <Text style={styles.detailText}>• Haptic feedback on all interactions</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Design Specifications</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Container:</Text>
          <Text style={styles.detailText}>• Padding: 20px horizontal (default), 0px (focused)</Text>
          <Text style={styles.detailText}>• Border radius: 16px container, 100px input (default), 32px (multi-line)</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Buttons:</Text>
          <Text style={styles.detailText}>• Button wrapper: Fixed 56x56px</Text>
          <Text style={styles.detailText}>• Button size: 40x40px (default), 32x32px (focused)</Text>
          <Text style={styles.detailText}>• Icon size: 24x24px (default), 20x20px (focused)</Text>
          <Text style={styles.detailText}>• Background: rgba(255, 255, 255, 0.13)</Text>
          <Text style={styles.detailText}>• Send button: 40x40px, white background</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Input:</Text>
          <Text style={styles.detailText}>• Background: rgba(255, 255, 255, 0.13)</Text>
          <Text style={styles.detailText}>• Text: 15px, 500 weight, white color</Text>
          <Text style={styles.detailText}>• Placeholder: Gradient (blue → pink → yellow), 40% opacity</Text>
          <Text style={styles.detailText}>• Height: 40px (default), expands to 80px max (multi-line)</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Audio Wave:</Text>
          <Text style={styles.detailText}>• 21 bars, 2px width each</Text>
          <Text style={styles.detailText}>• Height: 12px (min) to 24px (max)</Text>
          <Text style={styles.detailText}>• Opacity: 0.13 (inactive) to 1.0 (active)</Text>
          <Text style={styles.detailText}>• Animated with varying delays</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Usage</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {'<InputBar\n  placeholder="Type query..."\n  onSend={(text) => console.log(text)}\n  onVideoPress={() => console.log("Video")}\n  onVoicePress={(isVoiceMode) => console.log(isVoiceMode)}\n/>'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Props</Text>
        <View style={styles.detailItem}>
          <Text style={styles.propText}>• placeholder: string (default: 'Type query...')</Text>
          <Text style={styles.propText}>• onSend: function (text) - Called when send button is pressed</Text>
          <Text style={styles.propText}>• onVideoPress: function () - Called when video button is pressed</Text>
          <Text style={styles.propText}>• onVoicePress: function (isVoiceMode) - Called when voice button is pressed</Text>
          <Text style={styles.propText}>• style: ViewStyle (optional)</Text>
        </View>
      </View>
    </View>
  );
}

export default function ComponentDetailScreen({ route, navigation }) {
  const { component } = route.params;

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const PreviewComponent = ComponentPreviews[component.id];

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
        <Text style={styles.headerTitle}>{component.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PreviewComponent ? (
          <PreviewComponent />
        ) : (
          <Text style={styles.noPreviewText}>No preview available</Text>
        )}
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
  detailsSection: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.md,
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
  noPreviewText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: Spacing.xxxxl,
  },
});

