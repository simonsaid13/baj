// Color Tokens
export const Colors = {
  // Primary Colors
  black: '#000000',
  white: '#FFFFFF',
  
  // White with Opacity
  white14: 'rgba(255, 255, 255, 0.14)',      // Used for tab bar icons, interactive line background
  white10: 'rgba(255, 255, 255, 0.1)',       // Used for action card backgrounds
  white77: 'rgba(255, 255, 255, 0.77)',      // Used for interactive line text opacity
  
  // Background Colors
  backgroundBlack: '#000000',                 // Main background
  backgroundWhite: '#FFFFFF',                 // Page container background
  
  // Assistant Gradient Colors
  assistantBlue: '#0389FF',
  assistantBlueMid: '#036FCF',
  assistantBlueEnd: '#025299',
};

// Text Style Tokens
export const Typography = {
  // Interactive Line Text
  interactiveLine: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    opacity: 0.77,
  },
  
  // Action Card Label
  actionCardLabel: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.5,
  },
  
  // Tab Bar Label
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.5,
  },
  
  // Tab Bar Label Active
  tabBarLabelActive: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 1,
  },
};

// Spacing Tokens
export const Spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  xxxxl: 32,
  
  // Component Specific
  interactiveLinePaddingH: 10,
  interactiveLinePaddingV: 6,
  tabBarGap: 24,
  tabBarPaddingH: 32,
  tabBarItemGap: 8,
  actionCardGap: 8,
  containerGap: 20,
  containerPaddingTop: 8,
  containerPaddingBottom: 32,
};

// Border Radius Tokens
export const BorderRadius = {
  full: 100,      // Used for circular elements (tab bar icons, interactive line)
  card: 24,       // Used for action cards
  page: 32,       // Used for page container corners
};

// Size Tokens
export const Sizes = {
  // Interactive Line
  interactiveLineMinHeight: 6,
  interactiveLineMinWidth: 40,
  interactiveLineExpandedHeight: 24,
  
  // Tab Bar
  tabBarIconSize: 56,
  tabBarIconSmall: 24,
  tabBarIconMedium: 28,
  tabBarItemWidth: 68,
  
  // Action Cards
  actionCardHeight: 72,
  actionCardIconSize: 24,
  actionsContainerWidth: 361,
  
  // Drag Handle
  dragHandleWidth: 40,
  dragHandleHeight: 6,
  dragHandleContainerHeight: 20,
  dragHandlePaddingV: 8,
};

// Opacity Tokens
export const Opacity = {
  disabled: 0.5,
  secondary: 0.77,
  overlay: 0.14,
  card: 0.1,
  full: 1,
};

// Font Weight Tokens
export const FontWeight = {
  regular: '400',
  semibold: '600',
};


