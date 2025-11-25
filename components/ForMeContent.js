import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/tokens';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AVATARS = [
  { id: 1, name: 'Sharma Halwai', image: 'https://i.pravatar.cc/150?u=sharma' },
  { id: 2, name: 'Sony', image: 'https://logo.clearbit.com/sony.com' },
  { id: 3, name: 'Yamaha', image: 'https://logo.clearbit.com/yamaha.com' },
  { id: 4, name: 'Bajaj Finserv', image: 'https://logo.clearbit.com/bajajfinserv.in' },
];

const CATEGORIES = [
  { id: 1, name: 'Phones', icon: 'https://cdn-icons-png.flaticon.com/512/0/191.png' },
  { id: 2, name: 'Television', icon: 'https://cdn-icons-png.flaticon.com/512/2665/2665809.png' },
  { id: 3, name: 'Laptops', icon: 'https://cdn-icons-png.flaticon.com/512/610/610021.png' },
  { id: 4, name: 'Smart watches', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { id: 5, name: 'Watches', icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965306.png' },
  { id: 6, name: 'Audio devices', icon: 'https://cdn-icons-png.flaticon.com/512/57/57108.png' },
  { id: 7, name: 'Appliances', icon: 'https://cdn-icons-png.flaticon.com/512/1261/1261163.png' },
  { id: 8, name: 'Washing machines', icon: 'https://cdn-icons-png.flaticon.com/512/2555/2555541.png' },
  { id: 9, name: 'Air Conditioners', icon: 'https://cdn-icons-png.flaticon.com/512/911/911409.png' },
  { id: 10, name: 'Camera accessories', icon: 'https://cdn-icons-png.flaticon.com/512/685/685655.png' },
  { id: 11, name: 'Cycles', icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png' },
  { id: 12, name: 'Furniture', icon: 'https://cdn-icons-png.flaticon.com/512/2663/2663114.png' },
  { id: 13, name: 'Fitness equipment', icon: 'https://cdn-icons-png.flaticon.com/512/2558/2558298.png' },
];

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

export default function ForMeContent({ onShowDetail }) {
  const insets = useSafeAreaInsets();

  const handleLoanCardPress = () => {
    onShowDetail?.('loan', {
      title: 'Next Loan Payment',
      amount: '₹10,000',
      nextPayment: 'in 21 days',
      amountRepaid: '₹40,000',
      totalAmount: '₹120,000',
      monthlyPayment: '₹10,000',
      interestRate: '12.5',
      tenure: '12',
      image: 'https://images.unsplash.com/photo-1554224311-beee4ece8fe5?w=500'
    });
  };

  const handleInvestmentCardPress = () => {
    onShowDetail?.('card', {
      title: 'Your Investments',
      description: 'Track and manage your investment portfolio',
      content: 'Current value: ₹27,598 (-4%)',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500'
    });
  };

  const handleDepositsCardPress = () => {
    onShowDetail?.('card', {
      title: 'Your Deposits',
      description: 'View your deposit accounts and savings',
      content: 'Total deposits: ₹50,420 (+₹1,000)',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500'
    });
  };

  const handleProductPress = () => {
    onShowDetail?.('product', {
      title: 'Nothing Phone (2a) 5G 256 GB Storage Blue (8 GB RAM)',
      price: '₹25,999',
      originalPrice: '₹27,999',
      description: 'The Nothing Phone (2a) offers a unique transparent design with powerful 5G capabilities. Features include 8GB RAM, 256GB storage, and an impressive camera system.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500'
      ],
      category: 'Smartphones',
      rating: '4.5',
      reviews: '1,234',
      emi: '₹2,167/mo'
    });
  };

  const handleCategoryPress = (categoryName) => {
    onShowDetail?.('card', {
      title: categoryName,
      description: `Browse all ${categoryName.toLowerCase()} available on Bajaj Mall`,
      content: 'Discover a wide range of products with EMI options and great deals.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    });
  };

  const handlePreApprovedLoanPress = (loanData) => {
    onShowDetail?.('loan', {
      title: loanData.subtitle,
      amount: loanData.amount,
      subtitle: 'Pre-approved',
      image: loanData.bg,
      monthlyPayment: loanData.emi || '₹8,333',
      interestRate: '10.5',
      tenure: '12'
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: 24 + insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Avatars Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarsScroll} contentContainerStyle={styles.avatarsContainer}>
        {AVATARS.map((avatar) => (
          <View key={avatar.id} style={styles.avatarItem}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: avatar.image }} style={styles.avatarImage} />
            </View>
            <Text style={styles.avatarName} numberOfLines={1}>{avatar.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 2. Your Products */}
      <View style={styles.section}>
        <SectionTitle title="Your products" />
        
        {/* Loan Payment Card */}
        <TouchableOpacity style={styles.loanCard} onPress={handleLoanCardPress} activeOpacity={0.8}>
          <View style={styles.loanHeader}>
            <View style={styles.loanIconRow}>
               <View style={styles.iconCircle}>
                 <Text style={{fontSize: 12}}>💸</Text>
               </View>
               <Text style={styles.loanLabel}>Next loan payment</Text>
            </View>
            <Text style={styles.loanAmount}>₹10,000 in 21 days</Text>
          </View>
          
          <View style={styles.repaymentRow}>
             <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Amount repaid</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '33%' }]} />
                  <View style={[styles.progressIndicator, { left: '33%' }]} />
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.paidAmount}>₹40,000</Text>
                  <Text style={styles.totalAmount}>of ₹120,000</Text>
                </View>
             </View>
             <TouchableOpacity style={styles.payNowButton}>
               <Text style={styles.payNowText}>Pay Now</Text>
             </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Investment & Deposits Row */}
        <View style={styles.dualCardRow}>
          <TouchableOpacity onPress={handleInvestmentCardPress} activeOpacity={0.8} style={{ flex: 1 }}>
            <LinearGradient colors={['#ffffff', '#fff5f5']} style={styles.smallCard}>
               <View style={styles.smallCardHeader}>
                  <View style={[styles.iconCircle, {backgroundColor: '#ffebee'}]}>
                    <Text>📈</Text>
                  </View>
                  <Text style={styles.smallCardLabel}>Investment</Text>
               </View>
               <View style={styles.valueRow}>
                  <Text style={styles.valueText}>₹27,598</Text>
                  <Text style={[styles.changeText, { color: '#f30000' }]}>-4%</Text>
               </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDepositsCardPress} activeOpacity={0.8} style={{ flex: 1 }}>
            <LinearGradient colors={['#ffffff', '#f0fff4']} style={styles.smallCard}>
               <View style={styles.smallCardHeader}>
                  <View style={[styles.iconCircle, {backgroundColor: '#e8f5e9'}]}>
                    <Text>🏦</Text>
                  </View>
                  <Text style={styles.smallCardLabel}>Deposits</Text>
               </View>
               <View style={styles.valueRow}>
                  <Text style={styles.valueText}>₹50,420</Text>
                  <Text style={[styles.changeText, { color: '#00a300' }]}>+1,000</Text>
               </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Re-balance Portfolio */}
        <View style={styles.rebalanceCard}>
           <View style={styles.rebalanceContent}>
             <View style={styles.portfolioImages}>
                <Image source={{ uri: 'https://logo.clearbit.com/apple.com' }} style={[styles.portfolioImg, { top: 23, left: 29, zIndex: 3 }]} />
                <Image source={{ uri: 'https://logo.clearbit.com/google.com' }} style={[styles.portfolioImg, { top: 49, left: 25, zIndex: 4, width: 32, height: 32 }]} />
                <Image source={{ uri: 'https://logo.clearbit.com/microsoft.com' }} style={[styles.portfolioImg, { top: 25, left: 2, zIndex: 2, width: 36, height: 36 }]} />
                <Image source={{ uri: 'https://logo.clearbit.com/amazon.com' }} style={[styles.portfolioImg, { top: 6, left: 15, zIndex: 1, width: 32, height: 32 }]} />
             </View>
             <View style={styles.rebalanceTextContainer}>
                <Text style={styles.rebalanceTitle}>Re-balance your portfolio</Text>
                <Text style={styles.rebalanceDesc}>Tech companies are getting dipped with the lack of innovation and poor expectations.</Text>
             </View>
           </View>
           <View style={styles.divider} />
           <View style={styles.rebalanceActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                <Text style={styles.primaryBtnText}>Re-balance Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                <Text style={styles.secondaryBtnText}>Remind Later</Text>
              </TouchableOpacity>
           </View>
        </View>
      </View>

      {/* 3. Suggestion for you */}
      <View style={styles.section}>
        <SectionTitle title="Suggestion for you" />
        <TouchableOpacity style={styles.suggestionCard} onPress={handleProductPress} activeOpacity={0.8}>
           <View style={styles.suggestionHeader}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100' }} style={styles.productThumb} />
              <Text style={styles.productTitle}>Nothing Phone (2a) 5G 256 GB Storage Blue (8 GB RAM)</Text>
           </View>
           <View style={styles.divider} />
           <View style={styles.priceSection}>
              <Text style={styles.priceTitle}>Good time to buy</Text>
              <Text style={styles.priceDesc}>
                 The current price <Text style={{fontWeight: 'bold'}}>₹25,999 is surprisingly lower</Text> than usual, typically priced at ₹27,999
              </Text>
           </View>
           <View style={styles.priceBar}>
              <LinearGradient colors={['#177ee5', '#e5175c']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.gradientBar} />
              <View style={styles.priceKnob} />
           </View>
        </TouchableOpacity>
      </View>

      {/* 4. Quick Actions */}
      <View style={styles.section}>
        <SectionTitle title="Quick Actions" />
        <View style={styles.quickActionsRow}>
           {[
             { icon: '🏠', label: 'Utility\nbills' },
             { icon: '💰', label: 'Send\nMoney' },
             { icon: '🧾', label: 'Payments\nSchedule' }
           ].map((action, i) => (
             <TouchableOpacity key={i} style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
             </TouchableOpacity>
           ))}
        </View>
      </View>

      {/* 5. Question Card */}
      <View style={styles.questionCard}>
         <View style={styles.questionHeader}>
            <Text style={styles.questionSubtitle}>Answer question - earn more points</Text>
            <Text style={styles.questionTitle}>+10 points</Text>
         </View>
         <View style={styles.questionBody}>
            <Text style={styles.questionText}>What is your employment status?</Text>
            <View style={styles.questionButtons}>
               <TouchableOpacity style={[styles.qBtn, styles.qBtnOutline]}>
                 <Text style={styles.qBtnTextOutline}>Salaried</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.qBtn, styles.qBtnFilled]}>
                 <Text style={styles.qBtnTextFilled}>Self-employed</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>

      {/* 6. Launch your own business */}
      <View style={styles.section}>
         <SectionTitle title="Launch your own business" />
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {[
              { img: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=400', title: 'Let’s build store with Bajaj store builder' },
              { img: 'https://images.unsplash.com/photo-1595064085577-7c2ef98ec311?w=400', title: 'Top 10 success stories of farmers that launched their business with Bajaj.' }
            ].map((item, i) => (
              <View key={i} style={styles.videoCard}>
                 <Image source={{ uri: item.img }} style={styles.videoThumb} />
                 <View style={styles.playIconContainer}>
                    <View style={styles.playCircle}><View style={styles.triangle}/></View>
                 </View>
                 <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.videoGradient} />
                 <Text style={styles.videoTitle}>{item.title}</Text>
              </View>
            ))}
         </ScrollView>
      </View>

      {/* 7. Pre-approved loans */}
      <View style={styles.section}>
         <SectionTitle title="Pre-approved loans for you" />
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
             {/* Card 1 */}
             <TouchableOpacity 
               style={styles.preApprovedCard}
               onPress={() => handlePreApprovedLoanPress({
                 subtitle: 'Instant cash for Electronics',
                 amount: '₹1,00,000',
                 bg: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400',
                 emi: '₹8,333'
               })}
               activeOpacity={0.8}
             >
                {/* Use image as background since video is not trivial */}
                <Image source={{ uri: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400' }} style={styles.preApprovedBg} blurRadius={0}/>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.videoGradient} />
                
                <View style={styles.tagPreApproved}>
                   <Text style={styles.tagText}>Pre approved</Text>
                </View>

                <View style={styles.preApprovedContent}>
                   <View>
                      <Text style={styles.paSubtitle}>Instant cash for Electronics</Text>
                      <Text style={styles.paTitle}>₹100,000</Text>
                   </View>
                   <View style={styles.arrowButton}>
                      <Text style={{color:'#000'}}>→</Text>
                   </View>
                </View>
             </TouchableOpacity>
             
             {/* Card 2 */}
             <TouchableOpacity 
               style={styles.preApprovedCard}
               onPress={() => handlePreApprovedLoanPress({
                 subtitle: 'Instant cash for special Events',
                 amount: '₹20,00,000',
                 bg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
                 emi: '₹1,66,667'
               })}
               activeOpacity={0.8}
             >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' }} style={styles.preApprovedBg} blurRadius={0}/>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.videoGradient} />
                
                <View style={styles.tagPreApproved}>
                   <Text style={styles.tagText}>Pre approved</Text>
                </View>

                <View style={styles.preApprovedContent}>
                   <View>
                      <Text style={styles.paSubtitle}>Instant cash for special Events</Text>
                      <Text style={styles.paTitle}>₹20,00,000</Text>
                   </View>
                   <View style={styles.arrowButton}>
                      <Text style={{color:'#000'}}>→</Text>
                   </View>
                </View>
             </TouchableOpacity>
         </ScrollView>
      </View>

      {/* 13. All categories - moving up as simplified list */}
      <View style={styles.section}>
        <SectionTitle title="All categories" />
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryChip} onPress={() => handleCategoryPress(cat.name)} activeOpacity={0.8}>
               <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
               <Image source={{ uri: cat.icon }} style={styles.categoryIcon} />
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
    paddingTop: 24,
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
  
  // Avatars
  avatarsScroll: {
    marginBottom: 32,
  },
  avatarsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  avatarItem: {
    width: 99,
    alignItems: 'center',
    gap: 8,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    padding: 8,
    backgroundColor: '#fcfcfd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d223b',
    textAlign: 'center',
  },

  // Loan Card
  loanCard: {
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
  },
  loanHeader: {
    marginBottom: 12,
  },
  loanIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconCircle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
  },
  loanLabel: {
    fontSize: 14,
    color: '#0d223b',
  },
  loanAmount: {
    fontSize: 28,
    fontWeight: '500',
    color: '#0d223b',
  },
  repaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressSection: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 13,
    color: '#18171a',
    textAlign: 'right',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(92,112,153,0.21)',
    borderRadius: 4,
    marginBottom: 8,
    position: 'relative',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#1956ff',
    borderRadius: 4,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    width: 16,
    height: 6,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paidAmount: {
    fontSize: 13,
    color: '#0d223b',
  },
  totalAmount: {
    fontSize: 13,
    color: 'rgba(13,34,59, 0.5)',
  },
  payNowButton: {
    backgroundColor: '#1956ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  payNowText: {
    color: '#f7f9ff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Dual Row
  dualCardRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  smallCard: {
    flex: 1,
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    height: 100,
    justifyContent: 'space-between',
  },
  smallCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  smallCardLabel: {
    fontSize: 16,
    color: '#0d223b',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0d223b',
  },
  changeText: {
    fontSize: 12,
  },

  // Rebalance
  rebalanceCard: {
    backgroundColor: 'rgba(3,137,255,0.13)',
    borderRadius: 24,
    padding: 16,
  },
  rebalanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  portfolioImages: {
    width: 72,
    height: 86,
    position: 'relative',
  },
  portfolioImg: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  rebalanceTextContainer: {
    flex: 1,
  },
  rebalanceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0d223b',
    marginBottom: 4,
  },
  rebalanceDesc: {
    fontSize: 13,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    opacity: 0.1,
    marginVertical: 12,
  },
  rebalanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#1956ff',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryBtnText: {
    color: '#1956ff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Suggestion
  suggestionCard: {
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productThumb: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  productTitle: {
    flex: 1,
    fontSize: 16,
    color: '#0d223b',
  },
  priceSection: {
    marginBottom: 12,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d223b',
    marginBottom: 4,
  },
  priceDesc: {
    fontSize: 14,
    color: '#0d223b',
  },
  priceBar: {
    height: 16,
    borderRadius: 100,
    backgroundColor: '#eee',
    position: 'relative',
    justifyContent: 'center',
  },
  gradientBar: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
  },
  priceKnob: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    position: 'absolute',
    left: '40%',
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    width: 110,
    height: 116,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    backgroundColor: '#fcfcfd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d223b',
    textAlign: 'center',
  },

  // Question Card
  questionCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#19218f',
    borderRadius: 32,
    padding: 20,
    backgroundColor: '#fcfcfd',
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#1956ff',
    marginBottom: 4,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#0d223b',
  },
  questionBody: {
    backgroundColor: 'rgba(92,112,153,0.08)',
    borderRadius: 24,
    padding: 12,
  },
  questionText: {
    fontSize: 16,
    color: '#0d223b',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  qBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    flex: 1,
    alignItems: 'center',
  },
  qBtnOutline: {
    borderWidth: 1.5,
    borderColor: '#1956ff',
  },
  qBtnFilled: {
    backgroundColor: '#1956ff',
  },
  qBtnTextOutline: {
    color: '#1956ff',
    fontWeight: '600',
    fontSize: 16,
  },
  qBtnTextFilled: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Horizontal Scroll General
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  
  // Video Cards
  videoCard: {
    width: 300,
    height: 286,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -32}, {translateY: -32}],
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)', // Note: backdropFilter not supported in RN directly usually
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    transform: [{rotate: '90deg'}],
    marginLeft: 5,
  },
  videoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  videoTitle: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  // Pre Approved Cards
  preApprovedCard: {
    width: 270,
    height: 320,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  preApprovedBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  tagPreApproved: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: '#fff',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#152545',
  },
  preApprovedContent: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  paSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  arrowButton: {
    width: 50,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    width: '48%', // Approx
    height: 68,
    borderRadius: 32,
    backgroundColor: '#fcfcfd',
    borderWidth: 1,
    borderColor: 'rgba(41,47,69,0.21)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    marginBottom: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0d223b',
  },
  categoryIcon: {
    width: 44,
    height: 44,
  },
});

