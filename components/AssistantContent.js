import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Arrow Right Icon
const ArrowRightIcon = ({ size = 16, color = '#0962e1' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M3.333 8h9.334M8.667 4l4 4-4 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Account Switcher Component
const AccountSwitcher = ({ activeAccount, onAccountChange }) => (
  <View style={styles.accountSwitcher}>
    <TouchableOpacity
      style={[styles.accountOption, activeAccount === 'Account' && styles.accountOptionActive]}
      onPress={() => onAccountChange('Account')}
    >
      <View style={styles.accountAvatar}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?u=account' }}
          style={styles.avatarImage}
        />
      </View>
      <Text style={[styles.accountLabel, activeAccount === 'Account' && styles.accountLabelActive]}>
        Account
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.accountOption, activeAccount === 'Nova' && styles.accountOptionActive]}
      onPress={() => onAccountChange('Nova')}
    >
      <View style={[styles.accountAvatar, styles.novaAvatar]}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?u=nova' }}
          style={styles.avatarImage}
        />
      </View>
      <Text style={[styles.accountLabel, activeAccount === 'Nova' && styles.accountLabelActive]}>
        Nova
      </Text>
    </TouchableOpacity>
  </View>
);

// Date Header Component
const DateHeader = ({ date }) => (
  <View style={styles.dateHeader}>
    <Text style={styles.dateText}>{date}</Text>
  </View>
);

// Chat Message Card - for text-based conversations
const ChatMessageCard = ({ title, children, onPress }) => (
  <TouchableOpacity style={styles.chatCard} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.chatTitle}>{title}</Text>
    {children}
  </TouchableOpacity>
);

// Product Image Strip - horizontal scrollable product images
const ProductImageStrip = ({ images }) => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false} 
    style={styles.productStrip}
    contentContainerStyle={styles.productStripContent}
  >
    {images.map((img, index) => (
      <View key={index} style={styles.productImageContainer}>
        <Image source={{ uri: img }} style={styles.productStripImage} resizeMode="cover" />
      </View>
    ))}
  </ScrollView>
);

// Transaction Card - for money transfer history
const TransactionCard = ({ icon, amount, recipient, onPress }) => (
  <TouchableOpacity style={styles.transactionCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.transactionContent}>
      <View style={styles.transactionIconContainer}>
        <Image source={{ uri: icon }} style={styles.transactionIcon} resizeMode="contain" />
      </View>
      <Text style={styles.transactionAmount}>{amount}</Text>
      <View style={styles.transactionArrow}>
        <ArrowRightIcon size={16} color="#0962e1" />
      </View>
      <Text style={styles.transactionRecipient}>{recipient}</Text>
    </View>
  </TouchableOpacity>
);

// Loan Card Component
const LoanCard = ({ type, price, image, gradient }) => (
  <View style={styles.loanCard}>
    <Image source={{ uri: image }} style={styles.loanImage} resizeMode="cover" />
    <LinearGradient
      colors={gradient || ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
      style={styles.loanGradient}
    />
    <View style={styles.loanContent}>
      <Text style={styles.loanType}>{type}</Text>
      <Text style={styles.loanPrice}>{price}</Text>
    </View>
  </View>
);

// Loans Card Container
const LoansCard = ({ title, loans, onPress }) => (
  <TouchableOpacity style={styles.loansContainer} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.loansTitle}>{title}</Text>
    <View style={styles.loansRow}>
      {loans.map((loan, index) => (
        <LoanCard
          key={index}
          type={loan.type}
          price={loan.price}
          image={loan.image}
          gradient={loan.gradient}
        />
      ))}
    </View>
  </TouchableOpacity>
);

// Stock Ticker Card
const StockTickerCard = ({ company, ticker, price, change, changePercent, isPositive, onPress }) => (
  <TouchableOpacity style={styles.tickerCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.tickerLeft}>
      <View style={styles.tickerLogoContainer}>
        <Image
          source={{ uri: 'https://logo.clearbit.com/bajajfinserv.in' }}
          style={styles.tickerLogo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.tickerInfo}>
        <Text style={styles.tickerCompany}>{company}</Text>
        <Text style={styles.tickerSymbol}>{ticker}</Text>
      </View>
    </View>
    <View style={styles.tickerRight}>
      <Text style={styles.tickerPrice}>{price}</Text>
      <Text style={[styles.tickerChange, isPositive ? styles.tickerPositive : styles.tickerNegative]}>
        {change}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function AssistantContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();
  const [activeAccount, setActiveAccount] = useState('Account');

  const handleProductChatPress = () => {
    onShowDetail?.('product', {
      title: 'Nothing Phone Available',
      price: '₹25,999',
      description: 'Check out the latest Nothing phones available right now with amazing features.',
      images: nothingPhoneImages,
      category: 'Smartphones',
      rating: '4.5',
      reviews: '1,234',
      emi: '₹2,167/mo'
    });
  };

  const handleTransactionPress = () => {
    onShowDetail?.('transaction', {
      amount: '150',
      recipient: 'Oleg Gasioshyn',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg',
      isIncoming: true,
      date: 'Wednesday',
      time: '2:30 PM',
      status: 'Completed',
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      paymentMethod: 'Bank Transfer'
    });
  };

  const handleLoansPress = () => {
    onShowDetail?.('loan', {
      title: 'Your Loans for the Trip',
      amount: '₹50,000',
      monthlyPayment: '₹2,585',
      interestRate: '12.5',
      tenure: '24',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500'
    });
  };

  const handleStockPress = () => {
    onShowDetail?.('card', {
      title: 'Bajaj Finserv Stock',
      description: 'View your stock holdings and performance',
      content: '2 shares • -₹3,900.00',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500'
    });
  };

  // Product images for the "Nothing Phones" chat
  const nothingPhoneImages = [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=300&q=80',
  ];

  // Loan options for the trip
  const tripLoans = [
    {
      type: 'Personal loan',
      price: '2,585/mo.',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80',
      gradient: ['rgba(139,69,19,0)', 'rgba(139,69,19,0.8)'],
    },
    {
      type: 'EMI card',
      price: '2,000/mo.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
      gradient: ['rgba(0,32,63,0)', 'rgba(0,32,63,0.9)'],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: 16 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Switcher */}
      <AccountSwitcher activeAccount={activeAccount} onAccountChange={setActiveAccount} />

      {/* Today Section */}
      <DateHeader date="Today" />
      <ChatMessageCard title="Nothing Phones available right now" onPress={handleProductChatPress}>
        <ProductImageStrip images={nothingPhoneImages} />
      </ChatMessageCard>

      {/* Wednesday Section */}
      <DateHeader date="Wednesday" />
      <TransactionCard
        icon="https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg"
        amount="150"
        recipient="Oleg Gasioshyn"
        onPress={handleTransactionPress}
      />
      <LoansCard title="Your loans for the trip" loans={tripLoans} onPress={handleLoansPress} />

      {/* Monday Section */}
      <DateHeader date="Monday" />
      <StockTickerCard
        company="Bajaj Finserv"
        ticker="BAJAJFINSV"
        price="2 shares"
        change="-3,900.00"
        isPositive={false}
        onPress={handleStockPress}
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

  // Account Switcher
  accountSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  accountOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(41, 47, 69, 0.21)',
  },
  accountOptionActive: {
    borderColor: '#0d223b',
    borderWidth: 1.5,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  novaAvatar: {
    backgroundColor: '#0d223b',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  accountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d223b',
  },
  accountLabelActive: {
    fontWeight: '600',
  },

  // Date Header
  dateHeader: {
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
  },

  // Chat Card
  chatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(41, 47, 69, 0.21)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0d223b',
    marginBottom: 16,
    lineHeight: 32,
  },

  // Product Strip
  productStrip: {
    marginHorizontal: -20,
  },
  productStripContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  productImageContainer: {
    width: 100,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  productStripImage: {
    width: '100%',
    height: '100%',
  },

  // Transaction Card
  transactionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(41, 47, 69, 0.21)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  transactionIcon: {
    width: '100%',
    height: '100%',
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d223b',
  },
  transactionArrow: {
    width: 16,
    height: 16,
  },
  transactionRecipient: {
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    color: '#0d223b',
  },

  // Loans Container
  loansContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(41, 47, 69, 0.21)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
  },
  loansTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0d223b',
    marginBottom: 12,
  },
  loansRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Loan Card
  loanCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  loanImage: {
    width: '100%',
    height: '100%',
  },
  loanGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  loanContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  loanType: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffffff',
    marginBottom: 4,
  },
  loanPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Stock Ticker
  tickerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(41, 47, 69, 0.21)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tickerLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickerLogo: {
    width: 30,
    height: 30,
  },
  tickerInfo: {
    gap: 2,
  },
  tickerCompany: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d223b',
  },
  tickerSymbol: {
    fontSize: 12,
    fontWeight: '400',
    color: '#0d223b',
    opacity: 0.5,
  },
  tickerRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tickerPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0962e1',
  },
  tickerChange: {
    fontSize: 14,
    fontWeight: '400',
  },
  tickerPositive: {
    color: '#14a25b',
  },
  tickerNegative: {
    color: '#0d223b',
  },
});

