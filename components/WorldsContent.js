import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40; // 20px padding on each side

// Check icon component
const CheckIcon = ({ size = 20, color = '#14a25b' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Circle cx="10" cy="10" r="10" fill={color} />
    <Path
      d="M6 10L9 13L14 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Status dot component
const StatusDot = ({ color = '#0962e1', size = 5 }) => (
  <View style={[styles.statusDot, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]} />
);

// World Card component for items like "My Tractor", "Home"
const WorldCard = ({ icon, title, status, statusColor = '#14a25b', hasEvent, eventText, children, onPress }) => (
  <TouchableOpacity style={styles.worldCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.worldCardContent}>
      {/* Header Row */}
      <View style={styles.worldCardHeader}>
        <View style={styles.worldIconContainer}>
          <Image source={{ uri: icon }} style={styles.worldIcon} resizeMode="cover" />
        </View>
        <View style={styles.worldCardInfo}>
          <Text style={styles.worldCardTitle}>{title}</Text>
          {hasEvent ? (
            <View style={styles.eventRow}>
              <StatusDot color="#0962e1" />
              <Text style={styles.eventText}>{eventText}</Text>
            </View>
          ) : (
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
          )}
        </View>
      </View>
      {children}
    </View>
  </TouchableOpacity>
);

// Fuel Saving indicator component
const FuelSavingBadge = () => (
  <View style={styles.fuelSavingContainer}>
    <Image 
      source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3842/3842128.png' }} 
      style={styles.fuelIcon} 
      resizeMode="contain"
    />
    <View style={styles.fuelTextContainer}>
      <Text style={styles.fuelLabel}>Fuel Saving</Text>
      <View style={styles.onTrackRow}>
        <CheckIcon size={20} />
        <Text style={styles.onTrackText}>On Track</Text>
      </View>
    </View>
  </View>
);

// Product Card with price overlay
const ProductCard = ({ image, price, originalPrice }) => (
  <View style={styles.productCard}>
    <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.6)']}
      style={styles.productGradient}
    />
    <View style={styles.productPriceContainer}>
      <Text style={styles.productPrice}>{price}</Text>
      {originalPrice && (
        <View style={styles.originalPriceContainer}>
          <Text style={styles.originalPrice}>{originalPrice}</Text>
          <View style={styles.strikethrough} />
        </View>
      )}
    </View>
  </View>
);

// Bajaj Mall Card with products
const BajajMallCard = ({ icon, title, subtitle, subtitleColor = '#0962e1', products, onPress }) => (
  <TouchableOpacity style={styles.worldCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.worldCardContent}>
      {/* Header Row */}
      <View style={styles.worldCardHeader}>
        <View style={styles.worldIconContainer}>
          <Image source={{ uri: icon }} style={styles.worldIcon} resizeMode="cover" />
        </View>
        <View style={styles.worldCardInfo}>
          <Text style={styles.worldCardTitle}>{title}</Text>
          <Text style={[styles.subtitleText, { color: subtitleColor }]}>{subtitle}</Text>
        </View>
      </View>
      
      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {products.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.productsRow}>
            {row.map((product, index) => (
              <ProductCard 
                key={index}
                image={product.image}
                price={product.price}
                originalPrice={product.originalPrice}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

export default function WorldsContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();

  const handleWorldPress = (worldData) => {
    onShowDetail?.('card', {
      title: worldData.title,
      description: worldData.status || worldData.eventText || 'Manage your world',
      content: 'View and manage all aspects of your world from this dashboard.',
      image: worldData.icon
    });
  };

  const handleMallPress = (mallData) => {
    onShowDetail?.('card', {
      title: mallData.title,
      description: mallData.subtitle,
      content: 'Browse products with exclusive discounts and EMI options.',
      image: mallData.icon
    });
  };

  // Data for the worlds
  const tractorData = {
    icon: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=200&q=80',
    title: 'My Tractor',
    eventText: '1 upcoming event',
  };

  const homeData = {
    icon: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80',
    title: 'Home',
    status: 'All good',
  };

  const bajajMallProductsData = {
    icon: 'https://cdn-icons-png.flaticon.com/128/3081/3081559.png',
    title: 'Bajaj Mall',
    subtitle: '2 New products for you',
    products: [
      [
        { 
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
          price: '₹1,621/mo.'
        },
        { 
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          price: '₹1,295/mo.'
        },
      ]
    ],
  };

  const bajajMallDiscountsData = {
    icon: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&q=80',
    title: 'Bajaj Mall',
    subtitle: 'Ongoing discounts',
    products: [
      [
        { 
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
          price: '₹299',
          originalPrice: '₹350'
        },
        { 
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
          price: '₹350',
          originalPrice: '₹399'
        },
      ],
      [
        { 
          image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=400&q=80',
          price: '₹2,499',
          originalPrice: '₹3,100'
        },
        { 
          image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80',
          price: '₹99',
          originalPrice: '₹130'
        },
      ]
    ],
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: 16 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* My Tractor Card */}
      <WorldCard
        icon={tractorData.icon}
        title={tractorData.title}
        hasEvent={true}
        eventText={tractorData.eventText}
        onPress={() => handleWorldPress(tractorData)}
      >
        <FuelSavingBadge />
      </WorldCard>

      {/* Home Card */}
      <WorldCard
        icon={homeData.icon}
        title={homeData.title}
        status={homeData.status}
        statusColor="#14a25b"
        onPress={() => handleWorldPress(homeData)}
      />

      {/* Bajaj Mall - New Products */}
      <BajajMallCard
        icon={bajajMallProductsData.icon}
        title={bajajMallProductsData.title}
        subtitle={bajajMallProductsData.subtitle}
        products={bajajMallProductsData.products}
        onPress={() => handleMallPress(bajajMallProductsData)}
      />

      {/* Bajaj Mall - Ongoing Discounts */}
      <BajajMallCard
        icon={bajajMallDiscountsData.icon}
        title={bajajMallDiscountsData.title}
        subtitle={bajajMallDiscountsData.subtitle}
        products={bajajMallDiscountsData.products}
        onPress={() => handleMallPress(bajajMallDiscountsData)}
      />

      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // World Card Styles
  worldCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(41, 47, 69, 0.21)',
    borderRadius: 32,
    marginBottom: 18,
    overflow: 'hidden',
  },
  worldCardContent: {
    padding: 20,
  },
  worldCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  worldIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(92, 112, 153, 0.13)',
    overflow: 'hidden',
  },
  worldIcon: {
    width: '100%',
    height: '100%',
  },
  worldCardInfo: {
    flex: 1,
    gap: 3,
  },
  worldCardTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0d223b',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventText: {
    fontSize: 14,
    color: '#0d223b',
    opacity: 0.7,
  },
  statusText: {
    fontSize: 14,
  },
  subtitleText: {
    fontSize: 14,
  },
  statusDot: {
    backgroundColor: '#0962e1',
  },

  // Fuel Saving Badge
  fuelSavingContainer: {
    backgroundColor: 'rgba(92, 112, 153, 0.08)',
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fuelIcon: {
    width: 40,
    height: 40,
  },
  fuelTextContainer: {
    gap: 4,
  },
  fuelLabel: {
    fontSize: 12,
    color: '#0d223b',
    textAlign: 'center',
  },
  onTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onTrackText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#14a25b',
    lineHeight: 20,
  },

  // Products Container
  productsContainer: {
    marginTop: 16,
    gap: 8,
  },
  productsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Product Card
  productCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  productPriceContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  originalPriceContainer: {
    position: 'relative',
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.8,
  },
  strikethrough: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#d9d9d9',
    transform: [{ translateY: -1 }],
  },
});

