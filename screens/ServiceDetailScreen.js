import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';

export default function ServiceDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const {
    title = 'Service Details',
    description,
    icon,
    features = [],
    benefits = []
  } = route.params || {};

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack?.();
  };

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle get started action
  };

  return (
    <View style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: 20 + insets.top }]}
        onPress={handleBackPress}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            {icon ? (
              <Image source={{ uri: icon }} style={styles.icon} resizeMode="contain" />
            ) : (
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconEmoji}>🎯</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>

        {/* Features Section */}
        {features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureIconText}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Benefits</Text>
          <View style={styles.benefitsCard}>
            {(benefits.length > 0 ? benefits : [
              'Quick and easy process',
              'Secure and reliable',
              'Available 24/7',
              'No hidden charges'
            ]).map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Service</Text>
                <Text style={styles.stepDescription}>
                  Choose the service that fits your needs
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Provide Details</Text>
                <Text style={styles.stepDescription}>
                  Fill in required information
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Started</Text>
                <Text style={styles.stepDescription}>
                  Begin using the service immediately
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  backButton: {
    position: 'absolute',
    left: Spacing.xxl,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.black,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: 100,
    paddingBottom: Spacing.xxl,
    backgroundColor: '#fcfcfd',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    width: 60,
    height: 60,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0d223b',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0d223b',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    padding: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: Spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1956ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d223b',
    textAlign: 'center',
  },
  benefitsCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 24,
    padding: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: Spacing.md,
  },
  bulletPoint: {
    fontSize: 20,
    color: '#1956ff',
    fontWeight: '700',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#0d223b',
    lineHeight: 22,
  },
  stepsContainer: {
    gap: Spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1956ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0d223b',
    opacity: 0.7,
    lineHeight: 22,
  },
  actionButtons: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  primaryButton: {
    backgroundColor: '#1956ff',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#1956ff',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1956ff',
  },
});

