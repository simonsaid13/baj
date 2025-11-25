import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TRENDING_ITEMS = [
  {
    id: 1,
    title: 'Top 10 Electric Scooters of 2024',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400',
    category: 'EV',
    views: '1.2M',
  },
  {
    id: 2,
    title: 'How to save tax with Bajaj Finserv',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
    category: 'Finance',
    views: '890K',
  },
  {
    id: 3,
    title: 'New Credit Card Rules Explained',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400',
    category: 'Finance',
    views: '650K',
  },
  {
    id: 4,
    title: 'Bajaj Allianz Life Insurance Plans',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    category: 'Insurance',
    views: '420K',
  },
];

export default function TrendingContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();

  const handleTrendingItemPress = (item) => {
    onShowDetail?.('card', {
      title: item.title,
      description: `${item.category} • ${item.views} views`,
      content: 'Explore this trending topic and stay up to date with the latest information.',
      image: item.image
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: 24 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerTitle}>Trending Now</Text>
      
      <View style={styles.grid}>
        {TRENDING_ITEMS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => handleTrendingItemPress(item)} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardGradient} />
            <View style={styles.cardContent}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardViews}>{item.views} views</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: 24,
  },
  grid: {
    gap: 20,
  },
  card: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  cardContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  tagContainer: {
    backgroundColor: '#1956ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardViews: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
});

