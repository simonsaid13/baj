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
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';
import DragComponent from '../components/DragComponent';

export default function DragComponentDetailScreen({ navigation }) {
  const [text, setText] = useState('');

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleClearText = () => {
    setText('');
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
        <Text style={styles.headerTitle}>DragComponent</Text>
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
            <DragComponent text={text} />
          </View>
          <Text style={styles.infoLabel}>
            {text.trim() ? `Text: "${text}"` : 'No text (minimal state)'}
          </Text>
        </View>

        {/* Controls Section */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Controls</Text>

          {/* Text Input Control */}
          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>Text Input</Text>
            <Text style={styles.controlHint}>
              Type text to see the component morph from no-text state to with-text state
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter text here..."
                placeholderTextColor={Colors.white}
                value={text}
                onChangeText={setText}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {text.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearText}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Component Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Behavior & Logic</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Animation:</Text>
            <Text style={styles.detailText}>
              • Smooth spring animation when transitioning between states
            </Text>
            <Text style={styles.detailText}>
              • Width expands/contracts to fit text content
            </Text>
            <Text style={styles.detailText}>
              • Height transitions from 6px (no text) to 18px (with text)
            </Text>
            <Text style={styles.detailText}>
              • Text fades in/out with timing animation
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>States:</Text>
            <Text style={styles.detailText}>
              • No text: 6px height × 40px width (hardcoded dimensions)
            </Text>
            <Text style={styles.detailText}>
              • With text: Expands to fit content with 10px horizontal padding
            </Text>
            <Text style={styles.detailText}>
              • Smooth morphing transition between states
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
            <Text style={styles.detailText}>• Border radius: 100px (pill shape)</Text>
            <Text style={styles.detailText}>• Backdrop blur: 2px</Text>
            <Text style={styles.detailText}>
              • Padding (with text): 10px horizontal, 6px vertical
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Text:</Text>
            <Text style={styles.detailText}>• Font size: 11px</Text>
            <Text style={styles.detailText}>• Font weight: 600 (SemiBold)</Text>
            <Text style={styles.detailText}>• Line height: 14px</Text>
            <Text style={styles.detailText}>
              • Color: White with 0.77 opacity
            </Text>
            <Text style={styles.detailText}>• Text alignment: Center</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Dimensions:</Text>
            <Text style={styles.detailText}>
              • No text state: 6px height × 40px width (hardcoded)
            </Text>
            <Text style={styles.detailText}>
              • With text state: Dynamic width based on content, 18px height
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {'<DragComponent text="Text here" />'}
            </Text>
            <Text style={styles.codeText}>
              {'<DragComponent text="" /> // No text state'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Props</Text>
          <View style={styles.detailItem}>
            <Text style={styles.propText}>
              • text: string (default: '') - Text content to display. Empty string shows no-text state
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
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  controlHint: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.5,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white14,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    color: Colors.white,
    fontSize: 14,
  },
  clearButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: Spacing.xs,
  },
  clearButtonText: {
    fontSize: 18,
    color: Colors.white,
    lineHeight: 20,
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
    marginBottom: Spacing.xs,
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

