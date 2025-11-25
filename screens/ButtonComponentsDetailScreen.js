import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import ButtonGrey from '../components/ButtonGrey';
import ButtonBar from '../components/ButtonBar';
import {
  HandshakeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CarIcon,
} from '../components/icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/tokens';

export default function ButtonComponentsDetailScreen({ navigation }) {
  // ButtonBar animation control
  const heightProgress = useSharedValue(0);
  const [sliderValue, setSliderValue] = useState(0);

  // Handle slider change with smooth animation
  const handleSliderChange = (value) => {
    setSliderValue(value);
    heightProgress.value = withTiming(value, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  // Button configurations for ButtonBar
  const buttonLines = [
    // Line 1: Single button
    [
      { 
        icon: HandshakeIcon, 
        label: 'Borrow', 
        onPress: () => Alert.alert('Borrow', 'Button pressed!') 
      },
    ],
    // Line 2: Two buttons
    [
      { 
        icon: ChartBarIcon, 
        label: 'Invest', 
        onPress: () => Alert.alert('Invest', 'Button pressed!') 
      },
      { 
        icon: ShieldCheckIcon, 
        label: 'Insurance', 
        onPress: () => Alert.alert('Insurance', 'Button pressed!') 
      },
    ],
    // Line 3: Three buttons
    [
      { 
        icon: ShoppingCartIcon, 
        label: 'Shop', 
        onPress: () => Alert.alert('Shop', 'Button pressed!') 
      },
      { 
        icon: ReceiptIcon, 
        label: 'Bill Pay', 
        onPress: () => Alert.alert('Bill Pay', 'Button pressed!') 
      },
      { 
        icon: CarIcon, 
        label: 'Fastag', 
        onPress: () => Alert.alert('Fastag', 'Button pressed!') 
      },
    ],
  ];

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
        <Text style={styles.headerTitle}>Button Components</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ButtonGrey Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ButtonGrey</Text>
          <Text style={styles.sectionDescription}>
            Reusable button with icon and label, haptic feedback, and smooth press animation
          </Text>

          {/* Single Button Example */}
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Single Button</Text>
            <View style={styles.buttonRow}>
              <ButtonGrey
                icon={HandshakeIcon}
                label="Borrow"
                onPress={() => Alert.alert('Borrow', 'Button pressed!')}
              />
            </View>
          </View>

          {/* Three Buttons Example */}
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Three Buttons in Row</Text>
            <View style={styles.buttonRow}>
              <ButtonGrey
                icon={HandshakeIcon}
                label="Borrow"
                onPress={() => Alert.alert('Borrow')}
              />
              <ButtonGrey
                icon={ChartBarIcon}
                label="Invest"
                onPress={() => Alert.alert('Invest')}
              />
              <ButtonGrey
                icon={ShieldCheckIcon}
                label="Insurance"
                onPress={() => Alert.alert('Insurance')}
              />
            </View>
          </View>

          {/* Disabled State Example */}
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Disabled State</Text>
            <View style={styles.buttonRow}>
              <ButtonGrey
                icon={HandshakeIcon}
                label="Coming Soon"
                disabled={true}
              />
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.specsContainer}>
            <Text style={styles.specsTitle}>Specifications</Text>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Height:</Text>
              <Text style={styles.specValue}>72px (fixed)</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Border Radius:</Text>
              <Text style={styles.specValue}>20px</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Background:</Text>
              <Text style={styles.specValue}>rgba(255, 255, 255, 0.1)</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Icon Size:</Text>
              <Text style={styles.specValue}>24px</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Label Font:</Text>
              <Text style={styles.specValue}>14px, 50% opacity</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Animation:</Text>
              <Text style={styles.specValue}>Scale 0.95x on press, ease in/out</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ButtonBar Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ButtonBar</Text>
          <Text style={styles.sectionDescription}>
            Container for multiple button lines with smooth animated transitions (1-3 buttons per line, max 3 lines)
          </Text>

          {/* Interactive Slider Control */}
          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Height Progress</Text>
              <Text style={styles.sliderValue}>{(sliderValue * 100).toFixed(0)}%</Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={sliderValue}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={Colors.white}
              maximumTrackTintColor={Colors.white14}
              thumbTintColor={Colors.white}
            />

            {/* Progress Labels */}
            <View style={styles.progressLabels}>
              <View style={styles.progressItem}>
                <View style={[
                  styles.progressDot, 
                  sliderValue >= 0 && sliderValue < 0.33 && styles.progressDotActive
                ]} />
                <Text style={styles.progressText}>Line 1</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[
                  styles.progressDot, 
                  sliderValue >= 0.33 && sliderValue < 0.66 && styles.progressDotActive
                ]} />
                <Text style={styles.progressText}>Line 2</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[
                  styles.progressDot, 
                  sliderValue >= 0.66 && styles.progressDotActive
                ]} />
                <Text style={styles.progressText}>Line 3</Text>
              </View>
            </View>
          </View>

          {/* Live Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.exampleTitle}>Live Preview</Text>
            <View style={styles.buttonBarWrapper}>
              <ButtonBar 
                lines={buttonLines} 
                heightProgress={heightProgress}
              />
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.specsContainer}>
            <Text style={styles.specsTitle}>Specifications</Text>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Line Height:</Text>
              <Text style={styles.specValue}>72px per line</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Line Gap:</Text>
              <Text style={styles.specValue}>8px vertical</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Button Gap:</Text>
              <Text style={styles.specValue}>10px horizontal</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Max Buttons/Line:</Text>
              <Text style={styles.specValue}>3 buttons</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Max Lines:</Text>
              <Text style={styles.specValue}>3 lines</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Animation:</Text>
              <Text style={styles.specValue}>Staggered appearance (text → icon)</Text>
            </View>
          </View>
        </View>

        {/* Usage Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Animation System</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Text appears first (0-40% progress)
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Icon appears later (40-80% progress)
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Scale transitions from 0.2 to 1.0 with ease in/out
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Counter-scaling prevents distortion from parent transforms
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xxxxl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  exampleContainer: {
    marginBottom: Spacing.xxl,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.lg,
    opacity: 0.9,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  specsContainer: {
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  specsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: Spacing.xxxxl,
  },
  sliderSection: {
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white14,
  },
  progressDotActive: {
    backgroundColor: Colors.white,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
  },
  previewContainer: {
    marginBottom: Spacing.xxl,
  },
  buttonBarWrapper: {
    minHeight: 240,
    paddingVertical: Spacing.lg,
  },
  infoSection: {
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  infoBullet: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginRight: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.8,
    lineHeight: 18,
  },
});

