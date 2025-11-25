import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ButtonGrey from '../components/ButtonGrey';
import {
  HandshakeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CarIcon,
} from '../components/icons';
import { Colors, Spacing } from '../constants/tokens';

/**
 * ButtonGrey Examples
 * 
 * This file demonstrates various ways to use the ButtonGrey component
 */
export default function ButtonGreyExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ButtonGrey Examples</Text>

      {/* Example 1: Basic Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Basic Button</Text>
        <View style={styles.buttonRow}>
          <ButtonGrey
            icon={HandshakeIcon}
            label="Borrow"
            onPress={() => Alert.alert('Borrow', 'Button pressed!')}
          />
        </View>
      </View>

      {/* Example 2: Three Buttons in a Row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Three Buttons in a Row</Text>
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

      {/* Example 3: Two Buttons in a Row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Two Buttons in a Row</Text>
        <View style={styles.buttonRow}>
          <ButtonGrey
            icon={ShoppingCartIcon}
            label="Shop"
            onPress={() => Alert.alert('Shop')}
          />
          <ButtonGrey
            icon={ReceiptIcon}
            label="Bill Pay"
            onPress={() => Alert.alert('Bill Pay')}
          />
        </View>
      </View>

      {/* Example 4: Button without Label */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Icon Only (No Label)</Text>
        <View style={styles.buttonRow}>
          <ButtonGrey
            icon={CarIcon}
            onPress={() => Alert.alert('Icon Only')}
          />
        </View>
      </View>

      {/* Example 5: Button without Icon */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Label Only (No Icon)</Text>
        <View style={styles.buttonRow}>
          <ButtonGrey
            label="Continue"
            onPress={() => Alert.alert('Continue')}
          />
        </View>
      </View>

      {/* Example 6: Disabled Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Disabled State</Text>
        <View style={styles.buttonRow}>
          <ButtonGrey
            icon={HandshakeIcon}
            label="Coming Soon"
            disabled={true}
            onPress={() => Alert.alert('This should not appear')}
          />
        </View>
      </View>

      {/* Example 7: Grid Layout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Grid Layout (2×2)</Text>
        <View style={styles.gridRow}>
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
        </View>
        <View style={styles.gridRow}>
          <ButtonGrey
            icon={ShieldCheckIcon}
            label="Insurance"
            onPress={() => Alert.alert('Insurance')}
          />
          <ButtonGrey
            icon={ShoppingCartIcon}
            label="Shop"
            onPress={() => Alert.alert('Shop')}
          />
        </View>
      </View>

      {/* Example 8: Custom Width */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Custom Width (Fixed 120px)</Text>
        <View style={styles.customRow}>
          <View style={styles.fixedWidth}>
            <ButtonGrey
              icon={HandshakeIcon}
              label="Borrow"
              onPress={() => Alert.alert('Fixed Width')}
            />
          </View>
        </View>
      </View>

      {/* Example 9: With Console Logging */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. With Console Logging</Text>
        <View style={styles.buttonRow}>
          <ButtonGrey
            icon={ReceiptIcon}
            label="Debug"
            onPress={() => {
              console.log('Button pressed at:', new Date().toISOString());
              Alert.alert('Check Console', 'Timestamp logged!');
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingVertical: Spacing.xxxxl,
    paddingHorizontal: Spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.lg,
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10, // 10px gap between buttons
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  customRow: {
    flexDirection: 'row',
  },
  fixedWidth: {
    width: 120,
  },
});

