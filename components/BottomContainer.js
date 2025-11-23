import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import {
  ScanIcon,
  UserIcon,
  SquaresFourIcon,
  AssistantIcon,
  HandshakeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  CarIcon,
  StorefrontIcon,
  FirstAidIcon,
} from './icons';
import { Colors, Typography, Spacing, BorderRadius, Sizes } from '../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Height constants to match Figma designs
const MIN_HEIGHT = 120;           // Minimized: just tab bar + interactive line
const DEFAULT_HEIGHT = 140;       // With "Listening" text
const EXPANDED_HEIGHT = 320;      // With 6 action cards (2 rows)
const FULLY_EXPANDED_HEIGHT = 420; // With 8 action cards (3 rows)

// Animation thresholds for ActionCard content
const TEXT_MIN_HEIGHT = 24;       // Height when text starts appearing
const ICON_MIN_HEIGHT = 48;      // Height when icon starts appearing
const FULL_CARD_HEIGHT = Sizes.actionCardHeight; // 72px

// Easing function for smooth animations
const easeInOut = (t) => {
  'worklet';
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

const ActionCard = ({ icon: Icon, label, onPress, animationProgress, containerScaleY }) => {
  // Animated style for text - appears early when card is small
  const textStyle = useAnimatedStyle(() => {
    'worklet';
    if (!animationProgress) {
      return {
        opacity: 0,
        transform: [{ scaleX: 1 }, { scaleY: 1 }], // Counter-scale to prevent distortion
      };
    }
    
    const progress = animationProgress.value;
    // Text appears early: fades in from 0 to 0.4 progress (when card is small ~24px)
    // Then stays visible but slightly fades as icon appears
    // Fades out when container collapses (progress goes back to 0)
    const textProgress = Math.max(0, Math.min(1, progress / 0.4));
    const easedProgress = easeInOut(textProgress);
    
    // Smooth opacity: fade in early, stay visible, fade out when collapsing
    let finalOpacity = 0;
    if (progress < 0.4) {
      // Fading in: 0 to 1
      finalOpacity = easedProgress;
    } else if (progress >= 0.4 && progress <= 0.8) {
      // Fully visible, slight fade as icon appears
      finalOpacity = Math.max(0.85, 1 - (progress - 0.4) * 0.15);
    } else {
      // Fully visible when both are shown
      finalOpacity = 0.85;
    }
    
    // Scale animation: scale from 0.2 to 1.0 as it appears/disappears
    // Separate scaleX and scaleY for independent control
    // Scales smoothly in both directions (expanding and collapsing)
    let appearanceScaleX = 0.2;
    let appearanceScaleY = 0.2;
    if (progress < 0.4) {
      // Scaling: 0.2 to 1.0 with smooth transition (works for both expanding and collapsing)
      const scaleProgress = easedProgress;
      appearanceScaleX = 0.2 + scaleProgress * 0.8;
      appearanceScaleY = 0.2 + scaleProgress * 0.8;
    } else {
      // Fully scaled when visible
      appearanceScaleX = 1.0;
      appearanceScaleY = 1.0;
    }
    
    // Counter-scale to prevent distortion from parent scaleX and scaleY
    // When parent has scaleX/Y: 0.5, child needs scaleX/Y: 2.0 to maintain size
    // Combine counter-scale with appearance scale for both X and Y
    const parentScale = containerScaleY?.value ?? 1;
    const counterScale = parentScale > 0.01 ? 1 / parentScale : 1;
    const finalScaleX = counterScale * appearanceScaleX;
    const finalScaleY = counterScale * appearanceScaleY;
    
    return {
      opacity: finalOpacity,
      transform: [
        { scaleX: finalScaleX }, 
        { scaleY: finalScaleY }
      ], // Separate scaleX and scaleY transitions with counter-scaling
    };
  });

  // Animated style for icon - appears later when card is almost full height
  const iconStyle = useAnimatedStyle(() => {
    'worklet';
    if (!animationProgress) {
      return {
        opacity: 0,
        transform: [{ scaleX: 1 }, { scaleY: 1 }], // Counter-scale to prevent distortion
      };
    }
    
    const progress = animationProgress.value;
    // Icon appears later: starts fading in at 0.4 progress, fully visible at 0.8+
    // This means icon shows when card height is larger (almost full height)
    // Fades out smoothly when container collapses
    const iconProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.4));
    const easedProgress = easeInOut(iconProgress);
    
    // Smooth opacity: fade in from 0.4 to 0.8, fully visible after, fade out when collapsing
    let finalOpacity = 0;
    if (progress < 0.4) {
      // Not visible yet
      finalOpacity = 0;
    } else if (progress >= 0.4 && progress <= 0.8) {
      // Fading in: 0 to 1
      finalOpacity = easedProgress;
    } else {
      // Fully visible
      finalOpacity = 1;
    }
    
    // Scale animation: scale up from 0.2 to 1.0 as it appears
    // Separate scaleX and scaleY for independent control
    let appearanceScaleX = 0.2;
    let appearanceScaleY = 0.2;
    if (progress < 0.4) {
      // Not visible yet, keep at starting scale
      appearanceScaleX = 0.2;
      appearanceScaleY = 0.2;
    } else if (progress >= 0.4 && progress <= 0.8) {
      // Scaling up: 0.2 to 1.0 with smooth transition
      const scaleProgress = easedProgress;
      appearanceScaleX = 0.2 + scaleProgress * 0.8;
      appearanceScaleY = 0.2 + scaleProgress * 0.8;
    } else {
      // Fully scaled
      appearanceScaleX = 1.0;
      appearanceScaleY = 1.0;
    }
    
    // Counter-scale to prevent distortion from parent scaleX and scaleY
    // When parent has scaleX/Y: 0.5, child needs scaleX/Y: 2.0 to maintain size
    // Combine counter-scale with appearance scale for both X and Y
    const parentScale = containerScaleY?.value ?? 1;
    const counterScale = parentScale > 0.01 ? 1 / parentScale : 1;
    const finalScaleX = counterScale * appearanceScaleX;
    const finalScaleY = counterScale * appearanceScaleY;
    
    return {
      opacity: finalOpacity,
      transform: [
        { scaleX: finalScaleX }, 
        { scaleY: finalScaleY }
      ], // Separate scaleX and scaleY transitions
    };
  });

  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <BlurView intensity={100} tint="light" style={styles.actionCardBlur}>
        <Animated.View style={iconStyle}>
          <Icon size={Sizes.actionCardIconSize} color={Colors.white} />
        </Animated.View>
        <Animated.Text style={[styles.actionCardLabel, textStyle]}>
          {label}
        </Animated.Text>
      </BlurView>
    </TouchableOpacity>
  );
};

export default function BottomContainer({ 
  bottomHeight: propBottomHeight = DEFAULT_HEIGHT, 
  bottomHeightSharedValue,
  activeTab = 'Explore' 
}) {
  const currentBottomHeight = propBottomHeight;

  // Action cards to show
  const allActions = [
    { icon: HandshakeIcon, label: 'Borrow' },
    { icon: ChartBarIcon, label: 'Invest' },
    { icon: ShieldCheckIcon, label: 'Insurance' },
    { icon: ShoppingCartIcon, label: 'Shop' },
    { icon: ReceiptIcon, label: 'Bill Payments' },
    { icon: CarIcon, label: 'Fastag' },
    { icon: StorefrontIcon, label: 'Bajaj Mall' },
    { icon: FirstAidIcon, label: 'Bajaj Health' },
  ];

  // Calculate animation progress for first 2 rows using derived value
  const firstTwoRowsProgress = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - DEFAULT_HEIGHT) / (EXPANDED_HEIGHT - DEFAULT_HEIGHT)
    ));
  });

  // Calculate scaleY value for first 2 rows (for counter-scaling children)
  const firstTwoRowsScaleY = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - DEFAULT_HEIGHT) / (EXPANDED_HEIGHT - DEFAULT_HEIGHT)
    ));
  });

  // Animated styles for action cards container - first 2 rows
  // Use scaleY for smooth animation, children will counter-scale
  const firstTwoRowsStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { 
        height: 0, 
        opacity: 0, 
        overflow: 'hidden',
        transform: [{ scaleX: 0 }, { scaleY: 0 }],
        transformOrigin: 'top',
      };
    }
    
    // First 2 rows appear between DEFAULT_HEIGHT (140) and EXPANDED_HEIGHT (320)
    const height = bottomHeightSharedValue.value;
    const progress = Math.max(0, Math.min(1, 
      (height - DEFAULT_HEIGHT) / (EXPANDED_HEIGHT - DEFAULT_HEIGHT)
    ));
    
    const rowHeight = Sizes.actionCardHeight + Spacing.actionCardGap;
    const totalHeight = rowHeight * 2; // 2 rows
    
    return {
      height: totalHeight,
      opacity: progress,
      overflow: 'hidden',
      transform: [{ scaleX: progress }, { scaleY: progress }],
      transformOrigin: 'top',
    };
  });

  // Calculate animation progress for third row using derived value
  const thirdRowProgress = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - EXPANDED_HEIGHT) / (FULLY_EXPANDED_HEIGHT - EXPANDED_HEIGHT)
    ));
  });

  // Calculate scaleY value for third row (for counter-scaling children)
  const thirdRowScaleY = useDerivedValue(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return 0;
    }
    
    const height = bottomHeightSharedValue.value;
    return Math.max(0, Math.min(1, 
      (height - EXPANDED_HEIGHT) / (FULLY_EXPANDED_HEIGHT - EXPANDED_HEIGHT)
    ));
  });

  // Animated styles for third row
  // Use scaleY for smooth animation, children will counter-scale
  const thirdRowStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { 
        height: 0, 
        opacity: 0, 
        overflow: 'hidden',
        transform: [{ scaleX: 0 }, { scaleY: 0 }],
        transformOrigin: 'top',
      };
    }
    
    // Third row appears between EXPANDED_HEIGHT (320) and FULLY_EXPANDED_HEIGHT (420)
    const height = bottomHeightSharedValue.value;
    const progress = Math.max(0, Math.min(1, 
      (height - EXPANDED_HEIGHT) / (FULLY_EXPANDED_HEIGHT - EXPANDED_HEIGHT)
    ));
    
    const rowHeight = Sizes.actionCardHeight;
    
    return {
      height: rowHeight,
      opacity: progress,
      overflow: 'hidden',
      transform: [{ scaleX: progress }, { scaleY: progress }],
      transformOrigin: 'top',
    };
  });

  // Animated styles for actions container wrapper - dynamic height
  const actionsContainerStyle = useAnimatedStyle(() => {
    'worklet';
    if (!bottomHeightSharedValue) {
      return { 
        height: 0,
        overflow: 'hidden',
      };
    }
    
    const height = bottomHeightSharedValue.value;
    const rowHeight = Sizes.actionCardHeight + Spacing.actionCardGap;
    
    // Calculate total height based on state
    let totalHeight = 0;
    
    if (height <= DEFAULT_HEIGHT) {
      // Collapsed: 0px
      totalHeight = 0;
    } else if (height > DEFAULT_HEIGHT && height <= EXPANDED_HEIGHT) {
      // Expanding to 2 rows: 0 → 152px
      const progress = (height - DEFAULT_HEIGHT) / (EXPANDED_HEIGHT - DEFAULT_HEIGHT);
      totalHeight = (rowHeight * 2) * progress;
    } else if (height > EXPANDED_HEIGHT && height <= FULLY_EXPANDED_HEIGHT) {
      // Expanding to 3 rows: 152px → 232px
      const twoRowsHeight = rowHeight * 2;
      const thirdRowProgress = (height - EXPANDED_HEIGHT) / (FULLY_EXPANDED_HEIGHT - EXPANDED_HEIGHT);
      totalHeight = twoRowsHeight + (Sizes.actionCardHeight + Spacing.actionCardGap) * thirdRowProgress;
    } else {
      // Fully expanded: 232px
      totalHeight = rowHeight * 2 + Sizes.actionCardHeight + Spacing.actionCardGap;
    }
    
    return {
      height: totalHeight,
      overflow: 'hidden',
    };
  });

  return (
    <View style={styles.container}>
      {/* Content Section (Action Cards) */}
      <View style={styles.contentSection}>
        {/* Action Cards Grid - Always rendered for smooth animations */}
        <Animated.View style={[styles.actionsContainer, actionsContainerStyle]}>
          {/* First 2 rows - animate together */}
          <Animated.View style={firstTwoRowsStyle} pointerEvents={currentBottomHeight > DEFAULT_HEIGHT ? 'auto' : 'none'}>
            <View style={styles.actionsRow}>
              {allActions.slice(0, 3).map((action, index) => (
                <ActionCard
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  animationProgress={firstTwoRowsProgress}
                  containerScaleY={firstTwoRowsScaleY}
                />
              ))}
            </View>
            <View style={[styles.actionsRow, { marginTop: Spacing.actionCardGap }]}>
              {allActions.slice(3, 6).map((action, index) => (
                <ActionCard
                  key={index + 3}
                  icon={action.icon}
                  label={action.label}
                  animationProgress={firstTwoRowsProgress}
                  containerScaleY={firstTwoRowsScaleY}
                />
              ))}
            </View>
          </Animated.View>

          {/* Third row - separate animation */}
          <Animated.View style={[thirdRowStyle, { marginTop: Spacing.actionCardGap }]} pointerEvents={currentBottomHeight > EXPANDED_HEIGHT ? 'auto' : 'none'}>
            <View style={styles.actionsRow}>
              {allActions.slice(6, 8).map((action, index) => (
                <ActionCard
                  key={index + 6}
                  icon={action.icon}
                  label={action.label}
                  animationProgress={thirdRowProgress}
                  containerScaleY={thirdRowScaleY}
                />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </View>

      {/* TabBar - Always at Bottom */}
      <View style={styles.tabBar}>
        <TabBarItem
          icon={ScanIcon}
          label="Scan"
          isActive={activeTab === 'Scan'}
          size={24}
        />
        <TabBarItem
          icon={UserIcon}
          label="Services"
          isActive={activeTab === 'Services'}
          size={24}
        />
        <TabBarItem
          icon={SquaresFourIcon}
          label="Explore"
          isActive={activeTab === 'Explore'}
          size={24}
          isExplore
        />
        <TabBarItem
          icon={AssistantIcon}
          label="Assistant"
          isActive={activeTab === 'Assistant'}
          size={24}
          isAssistant
        />
      </View>
    </View>
  );
}

const TabBarItem = ({ icon: Icon, label, isActive, size, isExplore, isAssistant }) => (
  <View style={styles.tabBarItem}>
    {isAssistant ? (
      <View style={styles.assistantIconContainer}>
        <LinearGradient
          colors={[Colors.assistantBlue, Colors.assistantBlueMid + 'CC', Colors.assistantBlueEnd + '00']}
          style={styles.assistantGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View style={[styles.tabBarIconWrapper, styles.tabBarIconWrapperAssistant]}>
          <Icon size={size} color={Colors.white} />
        </View>
      </View>
    ) : (
      <View
        style={[
          styles.tabBarIconWrapper,
          isActive && isExplore && styles.tabBarIconWrapperActive,
        ]}
      >
        <Icon size={size} color={isActive && isExplore ? Colors.black : Colors.white} />
      </View>
    )}
    <Text style={[styles.tabBarLabel, isActive && isExplore && styles.tabBarLabelActive]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
  },
  contentSection: {
    alignItems: 'center',
    gap: Spacing.containerGap,
    paddingTop: Spacing.containerPaddingTop,
    flexShrink: 0,
  },
  actionsContainer: {
    width: Sizes.actionsContainerWidth,
    flexShrink: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.actionCardGap,
  },
  actionCard: {
    flex: 1,
    height: Sizes.actionCardHeight,
  },
  actionCardBlur: {
    flex: 1,
    backgroundColor: Colors.white10,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    overflow: 'hidden',
  },
  actionCardLabel: {
    fontSize: Typography.actionCardLabel.fontSize,
    fontWeight: Typography.actionCardLabel.fontWeight,
    color: Colors.white,
    // Opacity is handled by animated style, don't set it here
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    gap: Spacing.tabBarGap,
    paddingHorizontal: Spacing.tabBarPaddingH,
    paddingBottom: Spacing.containerPaddingBottom,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexShrink: 0,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.tabBarItemGap,
    width: Sizes.tabBarItemWidth,
  },
  tabBarIconWrapper: {
    width: Sizes.tabBarIconSize,
    height: Sizes.tabBarIconSize,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIconWrapperActive: {
    backgroundColor: Colors.white,
  },
  assistantIconContainer: {
    width: Sizes.tabBarIconSize,
    height: Sizes.tabBarIconSize,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantGradient: {
    position: 'absolute',
    width: Sizes.tabBarIconSize * 1.5,
    height: Sizes.tabBarIconSize * 1.5,
    borderRadius: Sizes.tabBarIconSize,
    opacity: 0.6,
  },
  tabBarIconWrapperAssistant: {
    backgroundColor: 'transparent',
    overflow: 'visible',
    borderWidth: 2,
    borderColor: Colors.assistantBlue + '40',
    shadowColor: Colors.assistantBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: Typography.tabBarLabel.fontSize,
    fontWeight: Typography.tabBarLabel.fontWeight,
    color: Colors.white,
    opacity: Typography.tabBarLabel.opacity,
    textAlign: 'center',
  },
  tabBarLabelActive: {
    opacity: Typography.tabBarLabelActive.opacity,
    color: Colors.white,
  },
});

