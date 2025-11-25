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

export default function LoanDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { 
    title = 'Loan Details',
    subtitle,
    amount,
    monthlyPayment,
    interestRate,
    tenure,
    image,
    nextPayment,
    amountRepaid,
    totalAmount
  } = route.params || {};

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack?.();
  };

  const handleApplyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle apply action
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
        {image && (
          <View style={styles.heroContainer}>
            <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              {subtitle && <Text style={styles.heroSubtitle}>{subtitle}</Text>}
              {amount && <Text style={styles.heroAmount}>{amount}</Text>}
            </View>
          </View>
        )}

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>

          {/* Loan Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Loan Information</Text>
            
            {monthlyPayment && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monthly Payment</Text>
                <Text style={styles.detailValue}>{monthlyPayment}</Text>
              </View>
            )}

            {interestRate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Interest Rate</Text>
                <Text style={styles.detailValue}>{interestRate}% p.a.</Text>
              </View>
            )}

            {tenure && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tenure</Text>
                <Text style={styles.detailValue}>{tenure} months</Text>
              </View>
            )}

            {nextPayment && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next Payment</Text>
                <Text style={styles.detailValue}>{nextPayment}</Text>
              </View>
            )}
          </View>

          {/* Repayment Progress */}
          {amountRepaid && totalAmount && (
            <View style={styles.progressCard}>
              <Text style={styles.cardTitle}>Repayment Progress</Text>
              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Amount Repaid</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(parseInt(amountRepaid.replace(/[^0-9]/g, '')) / parseInt(totalAmount.replace(/[^0-9]/g, ''))) * 100}%` }]} />
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.paidAmount}>{amountRepaid}</Text>
                  <Text style={styles.totalAmountText}>of {totalAmount}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Benefits Section */}
          <View style={styles.benefitsCard}>
            <Text style={styles.cardTitle}>Key Benefits</Text>
            <View style={styles.benefitItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.benefitText}>Quick approval process</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.benefitText}>Flexible repayment options</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.benefitText}>Competitive interest rates</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.benefitText}>No hidden charges</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleApplyPress}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Apply Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
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
  heroContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#000',
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
    height: 180,
  },
  heroContent: {
    position: 'absolute',
    bottom: 30,
    left: Spacing.xxl,
    right: Spacing.xxl,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  contentContainer: {
    padding: Spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: Spacing.xl,
  },
  detailsCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(13, 34, 59, 0.1)',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0d223b',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d223b',
  },
  progressCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  progressSection: {
    gap: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#0d223b',
    opacity: 0.7,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(92,112,153,0.21)',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#1956ff',
    borderRadius: 4,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d223b',
  },
  totalAmountText: {
    fontSize: 14,
    color: '#0d223b',
    opacity: 0.6,
  },
  benefitsCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
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
  actionButtons: {
    gap: Spacing.md,
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

