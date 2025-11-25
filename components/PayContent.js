import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const TransactionItem = ({ amount, desc, logo, isIncoming, onPress }) => (
  <TouchableOpacity style={styles.transactionItem} onPress={onPress} activeOpacity={0.8}>
     <View style={styles.transactionLeft}>
        <View style={styles.logoContainer}>
           <Image source={{ uri: logo }} style={styles.bankLogo} resizeMode="contain" />
        </View>
        <Text style={styles.transAmount}>{amount}</Text>
     </View>
     <View style={styles.arrowContainer}>
       <Text style={styles.arrowText}>{isIncoming ? '→' : '←'}</Text>
     </View>
     <Text style={styles.transDesc}>{desc}</Text>
  </TouchableOpacity>
);

export default function PayContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();

  const handleTransactionPress = (transaction) => {
    const isIncoming = transaction.isIncoming;
    onShowDetail?.('transaction', {
      amount: transaction.amount,
      recipient: transaction.desc.replace(isIncoming ? 'Received from ' : 'Paid to ', ''),
      icon: transaction.logo,
      isIncoming: transaction.isIncoming,
      date: transaction.date || 'Today',
      time: '12:30 PM',
      status: 'Completed',
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      paymentMethod: 'UPI'
    });
  };

  const handleCardPress = (cardType, price) => {
    onShowDetail?.('loan', {
      title: cardType,
      monthlyPayment: price,
      interestRate: '12.5',
      tenure: '24',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=500'
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

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: 24 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.feedContainer}>
        
        {/* Wednesday Header */}
        <View style={styles.dateHeader}>
           <Text style={styles.dateText}>Wednesday</Text>
        </View>

        {/* Transactions Feed */}
        <TransactionItem 
          amount="₹150" 
          desc="Received from Sharma" 
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png" 
          isIncoming={true}
          onPress={() => handleTransactionPress({ amount: '₹150', desc: 'Received from Sharma', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png', isIncoming: true, date: 'Wednesday' })}
        />
        
        <TransactionItem 
          amount="₹450" 
          desc="Paid to Swiggy" 
          logo="https://logo.clearbit.com/swiggy.com" 
          isIncoming={false}
          onPress={() => handleTransactionPress({ amount: '₹450', desc: 'Paid to Swiggy', logo: 'https://logo.clearbit.com/swiggy.com', isIncoming: false, date: 'Wednesday' })}
        />

        <TransactionItem 
          amount="₹230" 
          desc="Paid to Uber" 
          logo="https://logo.clearbit.com/uber.com" 
          isIncoming={false}
          onPress={() => handleTransactionPress({ amount: '₹230', desc: 'Paid to Uber', logo: 'https://logo.clearbit.com/uber.com', isIncoming: false, date: 'Wednesday' })}
        />

        {/* Horizontal Cards: 1214:10081 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll} style={{marginBottom: 32, marginTop: 8}}>
           <TouchableOpacity style={styles.creditCard} onPress={() => handleCardPress('Personal loan', '₹2,585/mo')} activeOpacity={0.8}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=500&auto=format&fit=crop&q=60' }} style={styles.cardBg} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                 <Text style={styles.cardTitle}>Personal loan</Text>
                 <Text style={styles.cardAmount}>₹2,585/mo.</Text>
              </View>
           </TouchableOpacity>
           <TouchableOpacity style={styles.creditCard} onPress={() => handleCardPress('EMI card', '₹2,000/mo')} activeOpacity={0.8}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1614213269127-7692eb3c2c4e?w=500&auto=format&fit=crop&q=60' }} style={styles.cardBg} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                 <Text style={styles.cardTitle}>EMI card</Text>
                 <Text style={styles.cardAmount}>₹2,000/mo.</Text>
              </View>
           </TouchableOpacity>
        </ScrollView>

        {/* Monday Header */}
        <View style={styles.dateHeader}>
           <Text style={styles.dateText}>Monday</Text>
        </View>

        <TransactionItem 
          amount="₹2,000" 
          desc="Received from Rahul" 
          logo="https://ui-avatars.com/api/?name=Rahul&background=0D8ABC&color=fff" 
          isIncoming={true}
          onPress={() => handleTransactionPress({ amount: '₹2,000', desc: 'Received from Rahul', logo: 'https://ui-avatars.com/api/?name=Rahul&background=0D8ABC&color=fff', isIncoming: true, date: 'Monday' })}
        />

        {/* Stock Ticker: 1214:11047 */}
        <TouchableOpacity style={styles.tickerItem} onPress={handleStockPress} activeOpacity={0.8}>
           <View style={styles.tickerLeft}>
              <Image source={{ uri: 'https://logo.clearbit.com/bajajfinserv.in' }} style={styles.tickerLogo} />
              <View>
                 <Text style={styles.tickerName}>Bajaj Finserv</Text>
                 <Text style={styles.tickerSymbol}>BAJAJFINSV</Text>
              </View>
           </View>
           <View style={styles.tickerRight}>
              <Text style={styles.tickerPrice}>2 shares</Text>
              <View style={styles.tickerChangeBox}>
                 <Text style={styles.tickerChange}>-₹3,900.00</Text>
              </View>
           </View>
        </TouchableOpacity>

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
    paddingBottom: 40,
  },
  feedContainer: {
    paddingHorizontal: 20,
  },
  
  // Date Header
  dateHeader: {
    paddingVertical: 12,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(13,34,59, 0.6)',
  },

  // Transaction Item
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f2f4f7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankLogo: {
    width: '100%',
    height: '100%',
  },
  transAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d223b',
  },
  arrowContainer: {
    width: 16, 
    height: 16, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  arrowText: {
    color: '#0d223b', 
    fontSize: 12
  },
  transDesc: {
    fontSize: 14,
    color: '#0d223b',
    flex: 1,
  },

  // Credit Cards Scroll
  cardsScroll: {
    gap: 12,
  },
  creditCard: {
    width: 150,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  cardBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Ticker Item
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.1)',
  },
  tickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tickerLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
  },
  tickerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d223b',
  },
  tickerSymbol: {
    fontSize: 12,
    color: 'rgba(13,34,59, 0.5)',
  },
  tickerRight: {
    alignItems: 'flex-end',
  },
  tickerPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00a68a', // Green for positive
    marginBottom: 4,
  },
  tickerChangeBox: {
    backgroundColor: '#f2f4f7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tickerChange: {
    fontSize: 12,
    color: '#0d223b',
  },
});
