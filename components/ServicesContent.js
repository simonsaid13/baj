import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Using consistent high-quality icons and images from public sources
const SERVICE_ICONS = [
  { id: 1, title: 'Buy\non EMI', image: 'https://cdn-icons-png.flaticon.com/128/10860/10860770.png' },
  { id: 2, title: 'Borrow money', image: 'https://cdn-icons-png.flaticon.com/128/2454/2454269.png' },
  { id: 3, title: 'Invest\nsmart', image: 'https://cdn-icons-png.flaticon.com/128/3310/3310635.png' },
  { id: 4, title: 'Place\ntrades', image: 'https://cdn-icons-png.flaticon.com/128/11496/11496733.png' },
  { id: 5, title: 'Shop\nBajaj Mall', image: 'https://cdn-icons-png.flaticon.com/128/3081/3081559.png' },
  { id: 6, title: 'Start insurance', image: 'https://cdn-icons-png.flaticon.com/128/2966/2966334.png' },
];

const PRE_APPROVED_LOANS = [
  { 
    id: 1, 
    subtitle: 'Instant cash for\nspecial Events', 
    amount: '₹20 lakh', 
    bg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80', 
    tag: 'Pre approved'
  },
  { 
    id: 2, 
    subtitle: 'Instant cash for\nElectronics', 
    amount: '₹1 lakh', 
    bg: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=80', 
    tag: 'Pre approved'
  },
];

const SUGGESTED_ACTIONS = [
  'Required documents',
  'Eligibility criteria',
  'Loan alternatives'
];

const QUICK_ACTIONS = [
  { id: 1, title: 'Scan QR', icon: 'https://cdn-icons-png.flaticon.com/128/3409/3409600.png' },
  { id: 2, title: 'Send money', icon: 'https://cdn-icons-png.flaticon.com/128/9590/9590006.png' },
  { id: 3, title: 'Recharge mobile', icon: 'https://cdn-icons-png.flaticon.com/128/64/64096.png' },
  { id: 4, title: 'Create app', icon: 'https://cdn-icons-png.flaticon.com/128/5608/5608615.png' },
];

const NEW_ARRIVALS = [
  { id: 1, title: 'iPhone 17 256GB', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=500&q=80' },
  { id: 2, title: 'Honda SP 125 Disc DLX 2025', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80' },
];

const MALL_OFFERS = [
  { id: 1, title: 'Phones', image: 'https://cdn-icons-png.flaticon.com/128/644/644458.png' },
  { id: 2, title: 'Television', image: 'https://cdn-icons-png.flaticon.com/128/3953/3953226.png' },
  { id: 3, title: 'Laptops', image: 'https://cdn-icons-png.flaticon.com/128/428/428001.png' },
  { id: 4, title: 'Smart watches', image: 'https://cdn-icons-png.flaticon.com/128/3659/3659898.png' },
  { id: 5, title: 'Watches', image: 'https://cdn-icons-png.flaticon.com/128/2965/2965306.png' },
  { id: 6, title: 'Audio\ndevices', image: 'https://cdn-icons-png.flaticon.com/128/57/57108.png' },
  { id: 7, title: 'Appliances', image: 'https://cdn-icons-png.flaticon.com/128/1261/1261163.png' },
  { id: 8, title: 'Washing machines', image: 'https://cdn-icons-png.flaticon.com/128/2555/2555541.png' },
  { id: 9, title: 'Air Conditioners', image: 'https://cdn-icons-png.flaticon.com/128/911/911409.png' },
  { id: 10, title: 'Camera accessories', image: 'https://cdn-icons-png.flaticon.com/128/685/685655.png' },
  { id: 11, title: 'Cycles', image: 'https://cdn-icons-png.flaticon.com/128/2972/2972185.png' },
  { id: 12, title: 'Furniture', image: 'https://cdn-icons-png.flaticon.com/128/2663/2663114.png' },
  { id: 13, title: 'Fitness equipment', image: 'https://cdn-icons-png.flaticon.com/128/2558/2558298.png' },
];

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const ArrowIcon = () => (
  <View style={styles.arrowIcon}>
     <View style={styles.arrowShape} />
  </View>
);

export default function ServicesContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();

  const handleServicePress = (service) => {
    onShowDetail?.('service', {
      title: service.title,
      description: `${service.title} - Get started with Bajaj Finserv today`,
      icon: service.image,
      features: ['Quick approval', 'Flexible terms', 'Low interest rates', 'Easy documentation'],
      benefits: ['Trusted by millions', 'No hidden charges', '24/7 support', 'Secure transactions']
    });
  };

  const handleLoanCardPress = (loan) => {
    onShowDetail?.('loan', {
      title: loan.subtitle.replace('\n', ' '),
      amount: loan.amount,
      subtitle: 'Pre-approved',
      image: loan.bg,
      monthlyPayment: loan.amount.includes('lakh') ? '₹16,667' : '₹8,333',
      interestRate: '10.5',
      tenure: '12'
    });
  };

  const handleNewArrivalPress = (item) => {
    onShowDetail?.('product', {
      title: item.title,
      price: '₹25,999',
      description: 'Latest arrival with amazing features and competitive pricing.',
      image: item.image,
      category: 'New Arrivals',
      rating: '4.5',
      reviews: '234',
      emi: '₹2,167/mo'
    });
  };

  const handleMallOfferPress = (offer) => {
    onShowDetail?.('card', {
      title: offer.title,
      description: `Browse all ${offer.title.toLowerCase()} available on Bajaj Mall`,
      content: 'Discover a wide range of products with EMI options and great deals.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: 24 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Welcome Message */}
      <View style={styles.section}>
        <Text style={styles.welcomeText}>
          Welcome to Bajaj Finserv, trusted by over 100M people.  Here’s what’s available for you:
        </Text>
        
        {/* Service Grid */}
        <View style={styles.serviceGrid}>
          {SERVICE_ICONS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceCard} onPress={() => handleServicePress(item)} activeOpacity={0.8}>
              <View style={styles.serviceIconContainer}>
                <Image source={{ uri: item.image }} style={styles.serviceIcon} />
                <Text style={styles.serviceTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. Pre-approved Loans */}
      <View style={styles.section}>
        <SectionTitle title="You even have pre-approved loans ready for you!" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {PRE_APPROVED_LOANS.map((loan) => (
            <TouchableOpacity key={loan.id} style={styles.loanCard} onPress={() => handleLoanCardPress(loan)} activeOpacity={0.8}>
               <Image source={{ uri: loan.bg }} style={styles.loanBg} resizeMode="cover" />
               <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.loanGradient} />
               {/* Glass effect simulation */}
               <View style={styles.glassEffect}>
                 <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={StyleSheet.absoluteFill}
                 />
               </View>
               
               <View style={styles.loanContent}>
                  <Text style={styles.loanSubtitle}>{loan.subtitle}</Text>
                  <View style={styles.loanAmountRow}>
                     <Text style={styles.loanAmount}>{loan.amount}</Text>
                     <View style={styles.loanArrowBtn}>
                        <Text style={styles.arrowText}>→</Text>
                     </View>
                  </View>
               </View>

               <View style={styles.loanTag}>
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View> 
                  <Text style={styles.loanTagText}>{loan.tag}</Text>
               </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Suggested Actions */}
      <View style={styles.section}>
         <View style={styles.suggestedActionsContainer}>
            {SUGGESTED_ACTIONS.map((action, i) => (
               <TouchableOpacity key={i} style={styles.suggestedActionItem}>
                  <ArrowIcon />
                  <Text style={styles.suggestedActionText}>{action}</Text>
               </TouchableOpacity>
            ))}
            {/* Glare effect placeholder */}
            <View style={styles.glareEffect} pointerEvents="none" />
         </View>
      </View>

      {/* 4. Quick Actions (AI Bar) */}
      <View style={styles.section}>
         <SectionTitle title="Quick actions, just one click away" />
         <View style={styles.aiBarContainer}>
            <View style={styles.aiBarGlow} />
            <View style={styles.aiBar}>
               <View style={styles.aiActions}>
                  {QUICK_ACTIONS.map((action) => (
                     <TouchableOpacity key={action.id} style={styles.aiActionBtn}>
                        <Image source={{ uri: action.icon }} style={[styles.aiActionIcon, { tintColor: '#fff' }]} />
                        <Text style={styles.aiActionText} numberOfLines={1}>{action.title}</Text>
                     </TouchableOpacity>
                  ))}
               </View>
               <LinearGradient 
                  colors={['#0055ff', '#ff7300', '#00eaff', '#5500ff']} 
                  start={{x: 0, y: 1}} end={{x: 1, y: 1}}
                  style={styles.aiBarBottomGlow} 
               />
               <View style={styles.aiBarHandler}>
                  <View style={styles.handlerLine} />
                  <View style={[styles.handlerDot, {opacity: 0.5}]} />
                  <View style={[styles.handlerDot, {opacity: 0.5}]} />
               </View>
            </View>
         </View>
      </View>

      {/* 5. New Arrivals */}
      <View style={styles.section}>
         <View style={styles.sectionHeaderRow}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1162/1162451.png' }} style={styles.headerIcon} />
            <SectionTitle title="New arrivals" />
         </View>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {NEW_ARRIVALS.map((item) => (
               <TouchableOpacity key={item.id} style={styles.newArrivalCard} onPress={() => handleNewArrivalPress(item)} activeOpacity={0.8}>
                  <View style={styles.newArrivalImageContainer}>
                     <Image source={{ uri: item.image }} style={styles.newArrivalImage} resizeMode="contain" />
                  </View>
                  <Text style={styles.newArrivalTitle}>{item.title}</Text>
               </TouchableOpacity>
            ))}
         </ScrollView>
      </View>

      {/* 6. Bajaj Mall Offers */}
      <View style={styles.section}>
         <View style={styles.sectionHeaderRow}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3081/3081559.png' }} style={styles.headerIcon} />
            <SectionTitle title="What’s on offer at Bajaj Mall" />
         </View>
         <View style={styles.mallGrid}>
            {MALL_OFFERS.map((offer) => (
               <TouchableOpacity key={offer.id} style={styles.mallCard} onPress={() => handleMallOfferPress(offer)} activeOpacity={0.8}>
                  <Text style={styles.mallCardTitle} numberOfLines={2}>{offer.title}</Text>
                  <Image source={{ uri: offer.image }} style={styles.mallCardImage} />
               </TouchableOpacity>
            ))}
         </View>
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
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerIcon: {
    width: 28,
    height: 28,
  },
  
  // Welcome Text
  welcomeText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0d223b',
    marginBottom: 16,
    lineHeight: 32,
  },

  // Service Grid
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  serviceCard: {
    width: 110,
    height: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  serviceIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  serviceTitle: {
    fontSize: 13,
    color: '#0d223b',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Pre-approved Loans
  horizontalScroll: {
    gap: 12,
    paddingRight: 20,
  },
  loanCard: {
    width: 250,
    height: 340,
    borderRadius: 32,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#222845',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 13,
    elevation: 5,
  },
  loanBg: {
    width: '100%',
    height: '100%',
  },
  loanGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  glassEffect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loanContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  loanSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  loanAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  loanArrowBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '400',
  },
  loanTag: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0d223b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loanTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0d223b',
  },

  // Suggested Actions
  suggestedActionsContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: 'relative',
  },
  suggestedActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  arrowIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  arrowShape: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#0d223b',
  },
  suggestedActionText: {
    fontSize: 14,
    color: '#0d223b',
    flex: 1,
  },
  glareEffect: {
    position: 'absolute',
    top: -6,
    left: 5,
    width: 122,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{rotate: '291deg'}],
    opacity: 0.3,
  },

  // AI Bar
  aiBarContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  aiBarGlow: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 40,
  },
  aiBar: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
    shadowColor: '#222845',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 10,
  },
  aiActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 2,
    justifyContent: 'center',
  },
  aiActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 56,
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  aiActionIcon: {
    width: 20,
    height: 20,
  },
  aiActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  aiBarBottomGlow: {
    position: 'absolute',
    bottom: -100,
    left: -50,
    right: -50,
    height: 200,
    opacity: 0.6,
    borderRadius: 100,
  },
  aiBarHandler: {
    position: 'absolute',
    top: -2,
    left: '50%',
    transform: [{translateX: -25}],
    width: 50,
    height: 14,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101520',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 10,
    paddingTop: 2,
  },
  handlerLine: {
    width: 16,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  handlerDot: {
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 100,
  },

  // New Arrivals
  newArrivalCard: {
    width: 240,
    gap: 12,
  },
  newArrivalImageContainer: {
    width: 240,
    height: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    backgroundColor: '#fcfcfd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  newArrivalImage: {
    width: '100%',
    height: '100%',
  },
  newArrivalTitle: {
    fontSize: 16,
    color: '#0d223b',
    fontWeight: '500',
  },

  // Mall Offers
  mallGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mallCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 0,
  },
  mallCardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#0d223b',
  },
  mallCardImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
