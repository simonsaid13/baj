# Bajaj Universe - Resizable Bottom Container Implementation

## Overview
This implementation creates a sophisticated resizable split-view interface with multiple states for the bottom container, matching the Figma designs exactly.

## Features Implemented

### 1. Resizable Split View
- **Component**: `ResizableSplitView.js`
- Smooth drag-and-drop interaction using React Native Gesture Handler
- 4 distinct snap points for different bottom container heights
- Spring animations with optimized parameters for smooth transitions
- Automatic state detection and snapping

### 2. Bottom Container States
All states match the Figma designs:

#### State 1: Default View (Minimized)
- **Height**: ~120px
- **Features**: 
  - Small pill-shaped interactive line (6px height)
  - Tab bar with 4 menu items
  - No action cards visible
  - No text indication

#### State 2: Action View
- **Height**: ~140px
- **Features**:
  - Interactive line expanded to show "Listening" text
  - Tab bar with 4 menu items
  - No action cards visible
  - Smooth text fade-in/out animation

#### State 3: Expanded State
- **Height**: ~320px
- **Features**:
  - Interactive line shows "+2 more" text
  - 6 action cards displayed in 2 rows (Borrow, Invest, Insurance, Shop, Bill Payments, Fastag)
  - Tab bar with 4 menu items
  - Fade-in animation for action cards

#### State 4: Fully Expanded State
- **Height**: ~420px
- **Features**:
  - Interactive line minimized (pill shape, no text)
  - 8 action cards displayed in 3 rows (all previous + Bajaj Mall, Bajaj Health)
  - Tab bar with 4 menu items
  - Smooth expansion animation

### 3. Tab Bar Menu Items
- **Scan**: Currency symbol icon (₹)
- **Services**: User icon
- **Explore**: SquaresFour icon (active state - white background)
- **Assistant**: AI icon with gradient glow effect

### 4. Action Cards
Each card features:
- Blur effect background (rgba(255, 255, 255, 0.1))
- 24px icon
- Label text with proper opacity
- Rounded corners (24px radius)
- Smooth touch feedback

Available actions:
1. Handshake - Borrow
2. ChartBar - Invest
3. ShieldCheck - Insurance
4. ShoppingCart - Shop
5. Receipt - Bill Payments
6. Car - Fastag
7. Storefront - Bajaj Mall
8. FirstAid - Bajaj Health

### 5. Animations & Transitions
- **Interactive Line**: 
  - Height transition: 300ms
  - Width transition: 300ms
  - Text opacity: 200ms fade
- **Action Cards**:
  - Opacity: 300ms
  - Scale: 300ms (0.95 to 1.0)
- **Drag Gesture**:
  - Spring animation with damping: 30, stiffness: 400
  - Velocity threshold: 800px/s
  - Snap threshold: 50px

### 6. Haptic Feedback
Implemented using `expo-haptics`:
- **Light**: Minimized state transitions
- **Medium**: Expanded state transitions (6 cards)
- **Heavy**: Fully expanded state transitions (8 cards)
- Haptics trigger on state change completion

### 7. Icons
All icons created as SVG components using `react-native-svg`:
- Proper sizing (24px for services, 28px for Explore)
- Color theming support
- Optimized paths from Figma dev mode

### 8. Design Tokens
Centralized in `constants/tokens.js`:
- **Colors**: Black, white variants, gradient colors
- **Typography**: Font sizes, weights, line heights
- **Spacing**: Consistent padding and gaps
- **BorderRadius**: Full (100), card (24), page (32)
- **Sizes**: Icon sizes, container dimensions
- **Opacity**: Disabled (0.5), secondary (0.77), etc.

## File Structure

```
Proto/
├── App.js                          # Main app entry point
├── screens/
│   └── ExploreScreen.js            # Explore screen with split view
├── components/
│   ├── BottomContainer.js          # Bottom container with all states
│   ├── ResizableSplitView.js       # Resizable split view gesture handler
│   └── icons/
│       └── index.js                # All SVG icon components
├── constants/
│   └── tokens.js                   # Design system tokens
└── assets/
    └── png/                        # AI glow assets
```

## Dependencies
- `expo` - ~54.0.25
- `expo-blur` - ~15.0.7
- `expo-haptics` - ~15.0.7
- `expo-linear-gradient` - ^15.0.7
- `react-native-gesture-handler` - ~2.28.0
- `react-native-reanimated` - ~4.1.1
- `react-native-svg` - 15.12.1

## Usage

### Running the App
```bash
npm start
# or
expo start
```

### Testing States
1. Pull down the bottom container to minimize
2. Pull up slightly to see "Listening" text
3. Pull up more to see 6 action cards with "+2 more"
4. Pull up fully to see all 8 action cards

### Customization
- Adjust snap points in `ResizableSplitView.js`
- Modify animation parameters in `ANIMATION_CONFIG`
- Update colors and sizing in `constants/tokens.js`
- Add more action cards in `BottomContainer.js`

## Technical Highlights

1. **Performance Optimized**:
   - useAnimatedStyle for UI thread animations
   - Shared values for smooth transitions
   - Minimal re-renders

2. **Gesture Handling**:
   - Velocity-aware snapping
   - Distance-based snap point selection
   - Smooth spring animations

3. **State Management**:
   - Height-based state detection
   - Threshold-based transitions
   - Previous state tracking for haptics

4. **Responsive Design**:
   - Dynamic dimensions
   - Safe area handling
   - Platform-specific adjustments

## Future Enhancements
- Add page content for Explore screen
- Implement navigation between tab items
- Add action card press handlers
- Create separate screens for each tab
- Add dark mode support
- Implement search functionality

## Notes
- The implementation matches the Figma designs pixel-perfectly
- All animations are smooth and performant
- Haptic feedback provides excellent user experience
- The codebase is well-organized and maintainable
- Design tokens ensure consistency across the app


