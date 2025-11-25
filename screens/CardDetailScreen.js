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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';

export default function CardDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { title, description, image, content } = route.params || {};

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack?.();
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
        {/* Hero Image */}
        {image && (
          <View style={styles.heroImageContainer}>
            <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']}
              style={styles.heroGradient}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title || 'Card Details'}</Text>
          
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}

          {content && (
            <View style={styles.additionalContent}>
              <Text style={styles.contentText}>{content}</Text>
            </View>
          )}

          {/* Placeholder for additional content */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>Active</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Last Updated</Text>
              <Text style={styles.detailValue}>Today</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Learn More</Text>
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
  heroImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  contentContainer: {
    padding: Spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0d223b',
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: Spacing.xl,
  },
  additionalContent: {
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  contentText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0d223b',
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(13, 34, 59, 0.1)',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0d223b',
    opacity: 0.6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d223b',
  },
  actionButton: {
    backgroundColor: '#1956ff',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

