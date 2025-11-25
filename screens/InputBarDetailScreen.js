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
import InputBar from '../components/InputBar';

export default function InputBarDetailScreen({ navigation }) {
  const [currentState, setCurrentState] = useState('Default');
  const [demoText, setDemoText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleSend = (text) => {
    console.log('Send:', text);
    setIsGenerating(true);
    setCurrentState('Generating');
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentState('Default');
      setDemoText('');
    }, 3000);
  };

  const handleVideoPress = () => {
    console.log('Video pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVoicePress = (isVoiceMode) => {
    console.log('Voice mode:', isVoiceMode);
    setIsVoiceMode(isVoiceMode);
    setCurrentState(isVoiceMode ? 'Voice Mode' : 'Default');
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
        <Text style={styles.headerTitle}>InputBar</Text>
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
            <InputBar
              placeholder="Type query..."
              onSend={handleSend}
              onVideoPress={handleVideoPress}
              onVoicePress={handleVoicePress}
            />
          </View>
          <Text style={styles.infoLabel}>Current State: {currentState}</Text>
        </View>

        {/* All States Visualization */}
        <View style={styles.statesSection}>
          <Text style={styles.sectionTitle}>All States</Text>
          <Text style={styles.sectionDescription}>
            Visual representation of every possible state the InputBar component can be in
          </Text>

          {/* State 1: Default */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>1. Default State</Text>
            <Text style={styles.stateDescription}>
              Gradient placeholder, 40x40px buttons, 24x24px icons, 20px horizontal padding
            </Text>
            <View style={styles.previewBox}>
              <InputBar
                placeholder="Type query..."
                forceState="default"
                onSend={() => {}}
                onVideoPress={() => {}}
                onVoicePress={() => {}}
              />
            </View>
          </View>

          {/* State 2: Focused (Empty) */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>2. Focused State (Empty Input)</Text>
            <Text style={styles.stateDescription}>
              Smaller buttons (32x32px), icons (20x20px), no padding, send button visible but disabled
            </Text>
            <View style={styles.previewBox}>
              <InputBar
                placeholder="Type query..."
                forceState="focused"
                onSend={() => {}}
                onVideoPress={() => {}}
                onVoicePress={() => {}}
              />
            </View>
          </View>

          {/* State 3: Focused with Text */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>3. Focused State (With Text)</Text>
            <Text style={styles.stateDescription}>
              Same as focused, but with text entered and send button enabled (white circle with arrow)
            </Text>
            <View style={styles.previewBox}>
              <InputBar
                placeholder="Type query..."
                forceState="focused"
                forcedText="User query shown here"
                onSend={() => {}}
                onVideoPress={() => {}}
                onVoicePress={() => {}}
              />
            </View>
          </View>

          {/* State 4: Multi-line */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>4. Multi-line State</Text>
            <Text style={styles.stateDescription}>
              Input expands up to 80px height, border radius changes to 32px, icons stay bottom-aligned
            </Text>
            <View style={styles.previewBox}>
              <InputBar
                placeholder="Type query..."
                forceState="multiline"
                forcedText={'User query shown here\nUser query shown hereUser query shown hereUser query shown here'}
                onSend={() => {}}
                onVideoPress={() => {}}
                onVoicePress={() => {}}
              />
            </View>
          </View>

          {/* State 5: Generating */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>5. Generating State</Text>
            <Text style={styles.stateDescription}>
              Shows "Generating Response" with gradient background, stop icon replaces send button
            </Text>
            <View style={styles.previewBox}>
              <InputBar
                placeholder="Type query..."
                forceState="generating"
                onSend={handleSend}
                onVideoPress={() => {}}
                onVoicePress={() => {}}
              />
            </View>
          </View>

          {/* State 6: Voice Mode */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>6. Voice Mode</Text>
            <Text style={styles.stateDescription}>
              Audio wave visualization (20 animated bars) replaces input field, microphone button shows stop icon
            </Text>
            <View style={styles.previewBox}>
              <InputBar
                placeholder="Type query..."
                forceState="voice"
                onSend={() => {}}
                onVideoPress={() => {}}
                onVoicePress={handleVoicePress}
              />
            </View>
          </View>
        </View>

        {/* Component Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Behavior & Logic</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>States:</Text>
            <Text style={styles.detailText}>• Default: Gradient placeholder, 40x40 buttons, 24x24 icons, 20px padding</Text>
            <Text style={styles.detailText}>• Focused: Smaller buttons (32x32), icons (20x20), no padding, send button appears</Text>
            <Text style={styles.detailText}>• Multi-line: Input expands (max 80px), icons stay bottom-aligned, border radius 32px</Text>
            <Text style={styles.detailText}>• Generating: Shows "Generating Response" with gradient, stop icon</Text>
            <Text style={styles.detailText}>• Voice Mode: Audio wave visualization, stop icon replaces microphone</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Interactions:</Text>
            <Text style={styles.detailText}>• Video button: Bounce animation + haptic feedback</Text>
            <Text style={styles.detailText}>• Input focus: Animates sizes, shows send button (300ms animation)</Text>
            <Text style={styles.detailText}>• Send button: Appears when text entered, transitions to generating state</Text>
            <Text style={styles.detailText}>• Voice button: Toggles voice mode, shows audio waves</Text>
            <Text style={styles.detailText}>• Haptic feedback on all interactions</Text>
            <Text style={styles.detailText}>• Keyboard opens automatically on input focus</Text>
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
            <Text style={styles.detailText}>• Button wrapper: Fixed 56x56px (always)</Text>
            <Text style={styles.detailText}>• Button size: 40x40px (default), 32x32px (focused)</Text>
            <Text style={styles.detailText}>• Icon size: 24x24px (default), 20x20px (focused)</Text>
            <Text style={styles.detailText}>• Background: rgba(255, 255, 255, 0.13)</Text>
            <Text style={styles.detailText}>• Send button: 40x40px, white background, appears with fade + scale</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Input:</Text>
            <Text style={styles.detailText}>• Background: rgba(255, 255, 255, 0.13)</Text>
            <Text style={styles.detailText}>• Text: 15px, 500 weight, white color</Text>
            <Text style={styles.detailText}>• Placeholder: Gradient (blue → pink → yellow), 40% opacity, animated</Text>
            <Text style={styles.detailText}>• Height: 40px (default), expands to 80px max (multi-line)</Text>
            <Text style={styles.detailText}>• Padding: 20px horizontal (default), 8px right when focused</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Audio Wave:</Text>
            <Text style={styles.detailText}>• 21 bars, 2px width each, 6px gap</Text>
            <Text style={styles.detailText}>• Height: 12px (min) to 24px (max)</Text>
            <Text style={styles.detailText}>• Opacity: 0.13 (inactive) to 1.0 (active)</Text>
            <Text style={styles.detailText}>• Animated with varying delays (600-1000ms)</Text>
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
    paddingVertical: Spacing.xxxxl,
    paddingHorizontal: Spacing.xxl,
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
    marginBottom: Spacing.xs,
  },
  stateDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.6,
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  stateInstruction: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.6,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
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
  demoNote: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.5,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
});

