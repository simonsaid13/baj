import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LIVE_STREAMS = [
  {
    id: 1,
    title: 'Financial Planning Masterclass',
    host: 'Rahul Sharma',
    viewers: '12.5K',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    tag: 'LIVE',
  },
  {
    id: 2,
    title: 'New Electric Chetak Launch Event',
    host: 'Bajaj Auto',
    viewers: '45K',
    image: 'https://images.unsplash.com/photo-1625043484555-47841a7543c0?w=400',
    tag: 'LIVE',
  },
  {
    id: 3,
    title: 'Market Analysis 2025',
    host: 'CNBC TV18',
    viewers: '8.2K',
    image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=400',
    tag: 'LIVE',
  },
];

const UPCOMING_STREAMS = [
  {
    id: 4,
    title: 'Investment Strategies for Beginners',
    time: 'Today, 6:00 PM',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
  },
  {
    id: 5,
    title: 'Home Loan Q&A Session',
    time: 'Tomorrow, 11:00 AM',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
  },
];

export default function LivestreamsContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();

  const handleLiveStreamPress = (stream) => {
    onShowDetail?.('card', {
      title: stream.title,
      description: `Hosted by ${stream.host} • ${stream.viewers} watching`,
      content: 'Join the live stream to interact with the host and other viewers.',
      image: stream.image
    });
  };

  const handleUpcomingStreamPress = (stream) => {
    onShowDetail?.('card', {
      title: stream.title,
      description: `Scheduled for ${stream.time}`,
      content: 'Set a reminder to not miss this upcoming stream.',
      image: stream.image
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: 24 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerTitle}>Live Now</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {LIVE_STREAMS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.liveCard} onPress={() => handleLiveStreamPress(item)} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.liveImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cardGradient} />
            <View style={styles.liveTagContainer}>
              <View style={styles.liveDot} />
              <Text style={styles.liveTagText}>{item.tag}</Text>
            </View>
            <View style={styles.viewerBadge}>
              <Text style={styles.viewerText}>👁 {item.viewers}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.hostText}>{item.host}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Streams</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.upcomingList}>
        {UPCOMING_STREAMS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.upcomingCard} onPress={() => handleUpcomingStreamPress(item)} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.upcomingImage} />
            <View style={styles.upcomingContent}>
              <Text style={styles.upcomingTime}>{item.time}</Text>
              <Text style={styles.upcomingTitle} numberOfLines={2}>{item.title}</Text>
              <TouchableOpacity style={styles.notifyButton}>
                <Text style={styles.notifyText}>Notify Me</Text>
              </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 32,
  },
  liveCard: {
    width: 280,
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  liveImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  liveTagContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ff0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  viewerBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hostText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  
  // Upcoming
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1956ff',
    fontWeight: '600',
  },
  upcomingList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: '#fcfcfd',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.1)',
  },
  upcomingImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  upcomingContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  upcomingTime: {
    fontSize: 12,
    color: '#1956ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: 12,
  },
  notifyButton: {
    backgroundColor: 'rgba(25, 86, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  notifyText: {
    color: '#1956ff',
    fontSize: 12,
    fontWeight: '600',
  },
});

