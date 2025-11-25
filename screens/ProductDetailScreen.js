import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const {
    title = 'Product Details',
    price,
    originalPrice,
    description,
    image,
    images = [],
    category,
    rating,
    reviews,
    emi
  } = route.params || {};

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const displayImages = images.length > 0 ? images : (image ? [image] : []);

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack?.();
  };

  const handleBuyNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle buy action
  };

  return (
    <View style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity
        style={styles.backButton}
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
        {/* Product Images */}
        {displayImages.length > 0 && (
          <View style={styles.imagesSection}>
            <View style={styles.mainImageContainer}>
              <Image
                source={{ uri: displayImages[selectedImageIndex] }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>
            
            {displayImages.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailsContainer}
              >
                {displayImages.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.thumbnailActive
                    ]}
                    onPress={() => {
                      setSelectedImageIndex(index);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.thumbnailImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {category && (
            <Text style={styles.category}>{category}</Text>
          )}

          <Text style={styles.title}>{title}</Text>

          {/* Rating */}
          {(rating || reviews) && (
            <View style={styles.ratingContainer}>
              {rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {rating}</Text>
                </View>
              )}
              {reviews && (
                <Text style={styles.reviewsText}>({reviews} reviews)</Text>
              )}
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            {price && <Text style={styles.price}>{price}</Text>}
            {originalPrice && (
              <View style={styles.originalPriceContainer}>
                <Text style={styles.originalPrice}>{originalPrice}</Text>
                <View style={styles.strikethrough} />
              </View>
            )}
          </View>

          {/* EMI Option */}
          {emi && (
            <View style={styles.emiCard}>
              <Text style={styles.emiLabel}>EMI Available</Text>
              <Text style={styles.emiValue}>{emi}</Text>
            </View>
          )}

          {/* Description */}
          {description && (
            <View style={styles.descriptionCard}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          )}

          {/* Features */}
          <View style={styles.featuresCard}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featureItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.featureText}>High quality materials</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.featureText}>1 year warranty included</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.featureText}>Free delivery available</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.featureText}>Easy returns within 30 days</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleBuyNow}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Buy Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Add to Cart</Text>
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
  imagesSection: {
    backgroundColor: '#fcfcfd',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  mainImageContainer: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsContainer: {
    paddingHorizontal: Spacing.xxl,
    gap: 12,
    marginTop: Spacing.lg,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(41,47,69,0.21)',
    backgroundColor: '#fff',
    padding: 8,
  },
  thumbnailActive: {
    borderColor: '#1956ff',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: Spacing.xxl,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1956ff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: Spacing.md,
    lineHeight: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  ratingBadge: {
    backgroundColor: '#1956ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  reviewsText: {
    fontSize: 14,
    color: '#0d223b',
    opacity: 0.6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0d223b',
  },
  originalPriceContainer: {
    position: 'relative',
  },
  originalPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
    opacity: 0.5,
  },
  strikethrough: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0d223b',
    opacity: 0.5,
  },
  emiCard: {
    backgroundColor: 'rgba(25,86,255,0.08)',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emiLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0d223b',
  },
  emiValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1956ff',
  },
  descriptionCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0d223b',
    lineHeight: 24,
    opacity: 0.8,
  },
  featuresCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  featureItem: {
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
  featureText: {
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

