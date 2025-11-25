# Design System Guide

## Overview
This document serves as a guide for implementing and documenting components in the Bajaj Universe design system. All components should be tested and visualized in the DesignSystem screen.

## Component Documentation Template

When creating a new component, document it using the following structure:

### Component Name: [ComponentName]

#### Description
Brief description of what the component does and when to use it.

#### Behavior & Logic
- **States**: List all possible states (e.g., default, active, disabled, loading)
- **Interactions**: Describe user interactions (e.g., tap, long-press, swipe)
- **Animations**: Detail any animations or transitions
- **Props**: List all props with types and default values

#### Design Specifications
- **Dimensions**: Width, height, padding, margins
- **Colors**: Reference design tokens (e.g., Colors.white14)
- **Typography**: Font sizes, weights, line heights
- **Spacing**: Gap, padding values using Spacing tokens
- **Border Radius**: Using BorderRadius tokens

#### Visual States
- Screenshot or description of each state
- Interaction feedback (haptic, visual)

#### Integration
- Where the component is used in the app
- Dependencies and related components

---

## Existing Components

### Component: TabBar

#### Description
A navigation bar with 5 tabs that allows users to switch between different sections of the app. The TabBar features a modern glassmorphic design with rounded corners and smooth state transitions.

#### Behavior & Logic

**States:**
- **Default**: Tab is not selected, shows icon with 50% opacity label
- **Selected**: Tab has background with `rgba(255, 255, 255, 0.13)` and full opacity label

**Structure:**
- Container: Full width with 20px left/right padding
- Background: `rgba(255, 255, 255, 0.13)` with 24px border radius
- Inner padding: 4px
- Gap between tabs: 4px

**Interactions:**
- Tap on tab: Switches to that tab with smooth animation
- Haptic feedback on tab press
- Visual feedback: Background appears on selected tab

**Tabs:**
1. **Explore** - Main exploration view
2. **Services** - User services and profile
3. **Pay** - Payment and transactions
4. **Worlds** - World/globe exploration
5. **Assistant** - AI assistant

**Animations:**
- Tab selection: Background fade in/out (300ms)
- Label opacity: 0.5 → 1.0 (selected)
- Icon remains at 24x24px

#### Design Specifications

**Container:**
- Background: `rgba(255, 255, 255, 0.13)`
- Border radius: 24px
- Padding: 4px
- Gap: 4px between tabs
- Left/Right padding: 20px from parent container

**Tab Item:**
- Flex: 1 (equal width distribution)
- Padding: 8px vertical, 6px horizontal
- Border radius: 20px
- Gap: 8px (between icon and label)
- Alignment: Center (vertical and horizontal)

**Selected State:**
- Background: `rgba(255, 255, 255, 0.13)`
- Border radius: 20px
- Label opacity: 1.0

**Default State:**
- Background: transparent
- Border radius: 20px
- Label opacity: 0.5

**Icon:**
- Size: 24x24px
- Color: white
- Format: SVG components

**Label:**
- Font size: 12px
- Font weight: 500 (Medium)
- Line height: 14px
- Color: white
- Opacity: 0.5 (default), 1.0 (selected)
- Text align: center

#### Visual States

**Selected Tab:**
- Background with subtle white overlay
- Full opacity label
- Icon at normal brightness

**Default Tab:**
- Transparent background
- 50% opacity label
- Icon at normal brightness

**Interaction:**
- Light haptic feedback on tap
- Smooth background animation (300ms ease-in-out)
- Label opacity transition (300ms)

#### Integration

**Location:**
- Bottom navigation bar
- Fixed position at the bottom of the screen
- Should respect safe area insets

**Dependencies:**
- React Native core components (View, Text, TouchableOpacity)
- Design tokens from `constants/tokens.js`
- SVG icons from `assets/TabBar/`
- Haptic feedback from `expo-haptics`

**Usage Example:**
```javascript
<TabBar
  activeTab="Explore"
  onTabChange={(tabName) => console.log('Switched to:', tabName)}
/>
```

**Props:**
- `activeTab`: string (default: 'Explore') - Currently active tab
- `onTabChange`: function - Callback when tab is pressed with tab name
- `style`: ViewStyle (optional) - Additional styles for container

---

## Component Detail Screen Rules

**CRITICAL: Every component MUST have its own separate detail screen file that visualizes ALL possible states.**

### File Structure

1. **Create separate detail screen file**: `screens/[ComponentName]DetailScreen.js`
   - Example: `TabBarDetailScreen.js`, `InputBarDetailScreen.js`
   - DO NOT put multiple components in the same detail screen file

2. **File naming convention**: `[ComponentName]DetailScreen.js`
   - Use PascalCase for component name
   - Always end with `DetailScreen.js`

### Required Sections

Every detail screen MUST include:

1. **Live Preview Section**
   - Interactive component that users can test
   - Shows current state indicator
   - Located at the top of the screen

2. **All States Visualization Section**
   - **MANDATORY**: Visualize EVERY SINGLE POSSIBLE STATE of the component
   - Each state should have:
     - Clear label (e.g., "1. Default State", "2. Focused State")
     - Description explaining what the state represents
     - Interactive example or visual representation
     - Instructions on how to trigger/see that state (if interactive)
   - Use multiple instances of the component if needed to show different states
   - Add helpful instructions like "💡 Tap on the input field above to see the focused state"

3. **Behavior & Logic Section**
   - List all states with descriptions
   - Document all interactions
   - Explain animations and transitions

4. **Design Specifications Section**
   - Container specifications
   - Component-specific dimensions
   - Colors, typography, spacing
   - Any other design details

5. **Usage Section**
   - Code example showing how to use the component

6. **Props Section**
   - Complete list of all props with types and descriptions

### Navigation Setup

1. **Add route in `App.js`**:
   ```javascript
   <Stack.Screen name="[ComponentName]Detail" component={[ComponentName]DetailScreen} />
   ```

2. **Update `DesignSystemScreen.js`**:
   ```javascript
   const handleComponentPress = (component) => {
     if (component.id === 'componentid') {
       navigation.navigate('[ComponentName]Detail');
     }
     // ... other components
   };
   ```

3. **Add component to COMPONENTS array**:
   ```javascript
   {
     id: 'componentid',
     name: 'ComponentName',
     description: 'Brief description',
     category: 'Category',
   }
   ```

### Detail Screen Template

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';
import YourComponent from '../components/YourComponent';

export default function YourComponentDetailScreen({ navigation }) {
  const [currentState, setCurrentState] = useState('Default');

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YourComponent</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Live Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Live Preview</Text>
          <View style={styles.previewBox}>
            <YourComponent
              // props here
            />
          </View>
          <Text style={styles.infoLabel}>Current State: {currentState}</Text>
        </View>

        {/* 2. All States Visualization - MANDATORY */}
        <View style={styles.statesSection}>
          <Text style={styles.sectionTitle}>All States</Text>
          <Text style={styles.sectionDescription}>
            Visual representation of every possible state
          </Text>

          {/* State 1 */}
          <View style={styles.stateItem}>
            <Text style={styles.stateLabel}>1. State Name</Text>
            <Text style={styles.stateDescription}>
              Description of what this state represents
            </Text>
            <View style={styles.previewBox}>
              <YourComponent
                // props for this specific state
              />
            </View>
            <Text style={styles.stateInstruction}>
              💡 Instructions on how to see/trigger this state
            </Text>
          </View>

          {/* State 2, 3, 4... - Show ALL states */}
          {/* ... */}
        </View>

        {/* 3. Behavior & Logic */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Behavior & Logic</Text>
          {/* ... */}
        </View>

        {/* 4. Design Specifications */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Design Specifications</Text>
          {/* ... */}
        </View>

        {/* 5. Usage */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {/* Code example */}
            </Text>
          </View>
        </View>

        {/* 6. Props */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Props</Text>
          {/* ... */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Use standard styles from existing detail screens
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlack,
  },
  // ... (copy from TabBarDetailScreen or InputBarDetailScreen)
});
```

### Critical Rules

1. **ALWAYS create a separate file** - Never put multiple components in one detail screen
2. **ALWAYS visualize ALL states** - Every single possible state must be shown
3. **ALWAYS include interactive examples** - Users should be able to test the component
4. **ALWAYS add clear instructions** - Tell users how to trigger each state
5. **ALWAYS update navigation** - Add route in App.js and navigation logic in DesignSystemScreen.js
6. **ALWAYS use consistent styling** - Follow the same structure as existing detail screens

### Example: TabBarDetailScreen

- Shows all 5 tabs (Explore, Services, Pay, Worlds, Assistant)
- Each tab visualized in selected state
- Live preview with state tracking
- Complete documentation

### Example: InputBarDetailScreen

- Shows all 6 states:
  1. Default State
  2. Focused State (Empty)
  3. Focused State (With Text)
  4. Multi-line State
  5. Generating State
  6. Voice Mode
- Each state has interactive example and instructions
- Complete documentation

---

## Component Creation Checklist

When implementing a new component:

1. [ ] Create component file in `components/` directory
2. [ ] Import required dependencies and design tokens
3. [ ] Implement all states and interactions
4. [ ] Add haptic feedback where appropriate
5. [ ] Use design tokens (Colors, Typography, Spacing, etc.)
6. [ ] Add component to DesignSystem COMPONENTS array
7. [ ] **Create separate detail screen file** (`screens/[ComponentName]DetailScreen.js`)
8. [ ] **Visualize ALL possible states** in the detail screen
9. [ ] Add route in `App.js`
10. [ ] Update navigation in `DesignSystemScreen.js`
11. [ ] Document component in this file
12. [ ] Test on different screen sizes
13. [ ] Verify animations and transitions

---

## Design Tokens Reference

Refer to `constants/tokens.js` for:
- **Colors**: Primary colors, opacity variants
- **Typography**: Font sizes, weights, line heights
- **Spacing**: Gaps, padding, margins
- **BorderRadius**: Card, full, page radius values
- **Sizes**: Component-specific dimensions
- **Opacity**: Standard opacity levels
- **FontWeight**: Weight presets

Always use design tokens instead of hardcoded values to maintain consistency.

