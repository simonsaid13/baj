import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/tokens';

// Component registry - add new components here
const COMPONENTS = [
  {
    id: 'tabbar',
    name: 'TabBar',
    description: 'Navigation bar with 5 tabs (Explore, Services, Pay, Worlds, Assistant)',
    category: 'Navigation',
  },
  {
    id: 'inputbar',
    name: 'InputBar',
    description: 'Interactive input bar with video call, text input, and voice interaction',
    category: 'Input',
  },
  // Add more components here as they are created
];

export default function DesignSystemScreen({ navigation }) {
  const handleComponentPress = (component) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to specific component detail page
    if (component.id === 'tabbar') {
      navigation.navigate('TabBarDetail');
    } else if (component.id === 'inputbar') {
      navigation.navigate('InputBarDetail');
    } else {
      // Fallback to generic component detail screen
      navigation.navigate('ComponentDetail', { component });
    }
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const renderComponentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.componentItem}
      onPress={() => handleComponentPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.componentHeader}>
        <Text style={styles.componentName}>{item.name}</Text>
        <Text style={styles.componentCategory}>{item.category}</Text>
      </View>
      <Text style={styles.componentDescription}>{item.description}</Text>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Design System</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Component List */}
      <FlatList
        data={COMPONENTS}
        renderItem={renderComponentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    padding: Spacing.xxl,
  },
  componentItem: {
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    padding: Spacing.xxl,
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  componentName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  componentCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.5,
    backgroundColor: Colors.white14,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  componentDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
    lineHeight: 20,
  },
  arrow: {
    position: 'absolute',
    right: Spacing.xxl,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  arrowText: {
    fontSize: 24,
    color: Colors.white,
    opacity: 0.3,
  },
});

