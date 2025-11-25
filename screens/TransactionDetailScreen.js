import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';

export default function TransactionDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const {
    amount = '₹0',
    recipient = 'Unknown',
    date = 'Today',
    time = '12:00 PM',
    status = 'Completed',
    transactionId,
    icon,
    isIncoming = false,
    paymentMethod
  } = route.params || {};

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
        {/* Transaction Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, styles.statusSuccess]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
          
          <View style={styles.iconContainer}>
            {icon ? (
              <Image source={{ uri: icon }} style={styles.icon} resizeMode="contain" />
            ) : (
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconEmoji}>{isIncoming ? '💰' : '💸'}</Text>
              </View>
            )}
          </View>

          <Text style={styles.amountLabel}>{isIncoming ? 'Received' : 'Paid'}</Text>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.recipient}>{isIncoming ? `from ${recipient}` : `to ${recipient}`}</Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Transaction Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>

          {transactionId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={[styles.detailValue, styles.transactionId]}>{transactionId}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{isIncoming ? 'Credit' : 'Debit'}</Text>
          </View>

          {paymentMethod && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>{paymentMethod}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Download Receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Report an Issue</Text>
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
    padding: Spacing.xxl,
    paddingTop: 120,
  },
  statusCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 32,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: Spacing.xl,
  },
  statusSuccess: {
    backgroundColor: 'rgba(20, 162, 91, 0.1)',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14a25b',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    width: 50,
    height: 50,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 40,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d223b',
    opacity: 0.6,
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: 12,
  },
  recipient: {
    fontSize: 18,
    fontWeight: '400',
    color: '#0d223b',
    opacity: 0.8,
  },
  detailsCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#0d223b',
  },
  transactionId: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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

