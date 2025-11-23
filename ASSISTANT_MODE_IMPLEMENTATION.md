# Assistant Mode Implementation

## Overview
This document describes the new Assistant Mode feature added to the BottomContainer component, which includes two new states:

1. **Assistant Mode** - Shows 3 action buttons when the Assistant tab is pressed
2. **Input Mode** - Transforms the action buttons into an interactive input field when "Type" is pressed

## Features Implemented

### 1. Assistant Mode with Automatic Height Adjustment
When the user taps on the **Assistant** tab button:

#### Automatic Height Change
- The BottomContainer automatically animates to **220px height** (ASSISTANT_HEIGHT)
- This provides the perfect space for the 3 action buttons
- The transition is smooth with a 300ms duration
- ResizableSplitView adjusts the top section height accordingly

#### 3 Action Buttons Display
The bottom container switches to Assistant Mode, displaying three action buttons:

- **Video Chat** - Opens video chat functionality
- **Speak** - Opens voice input functionality  
- **Type** - Switches to input mode with keyboard

These buttons are styled consistently with the existing action cards:
- Glass morphism background (white with 10% opacity)
- 72px height
- 24px icon with label
- Haptic feedback on tap

### 2. Input Mode (Interactive Text Field)
When the user taps the **Type** button in Assistant Mode:

1. The action buttons transform into a text input field
2. Keyboard automatically appears and focuses the input
3. Input field includes:
   - **Back button (←)** - Returns to Assistant action buttons
   - **Text input** - "Ask me anything..." placeholder
   - **Submit button (→)** - Sends the input

### 3. Keyboard Behavior
The keyboard implementation ensures proper UX:

- **KeyboardAvoidingView** - Prevents keyboard from covering the input field
- **Auto-focus** - Input field automatically focuses when Type button is pressed
- **Keyboard dismissal** - Returns to Assistant buttons when keyboard is dismissed
- **Submit on Enter** - Pressing the return key submits the input
- **Keyboard overlays action cards** - The keyboard appears over the content area but not over the input field itself

### 4. State Management
The component manages three boolean states:

```javascript
const [assistantMode, setAssistantMode] = useState(false);  // Assistant tab active
const [inputMode, setInputMode] = useState(false);          // Type mode active
const [inputText, setInputText] = useState('');             // Current input text
```

### 5. Height States
The BottomContainer now has **4 distinct height states**:

1. **EXPLORE_DEFAULT (140px)** - Explore collapsed state
   - Just tab bar visible
   - Used in Explore mode when collapsed

2. **ASSISTANT_HEIGHT (220px)** - Assistant mode state
   - Automatically set when entering Assistant mode
   - Shows 3 action buttons in one row
   - New snap point in ResizableSplitView

3. **EXPLORE_MIN (320px)** - Explore min state
   - Shows 6 action cards in 2 rows
   - "+2 more" interactive text appears

4. **EXPLORE_MAX (400px)** - Explore max state
   - Shows all 8 action cards in 3 rows
   - Maximum expansion

### 6. Mode Switching Behavior

#### Explore → Assistant
- User taps **Assistant** tab button
- BottomContainer height automatically animates from current state to **220px**
- Content switches from action cards grid to 3 assistant buttons
- Assistant tab shows active gradient animation

#### Assistant → Explore
- User taps **Assistant** tab button again (or taps **Explore** tab)
- BottomContainer height automatically animates back to **140px** (collapsed)
- Content switches back to action cards grid
- Returns to default Explore collapsed state

This ensures a clean, predictable transition between modes.

### 7. Visual Hierarchy
**Explore Mode (default)**
```
┌─────────────────────────────┐
│  Action Cards Grid (8 cards)│
│  - Borrow, Invest, etc.     │
├─────────────────────────────┤
│  Tab Bar (4 tabs)           │
│  [Scan] [Services] [Explore*] [Assistant]
└─────────────────────────────┘
```

**Assistant Mode**
```
┌─────────────────────────────┐
│  3 Assistant Action Buttons │
│  [Video Chat] [Speak] [Type]│
├─────────────────────────────┤
│  Tab Bar (4 tabs)           │
│  [Scan] [Services] [Explore] [Assistant*]
└─────────────────────────────┘
```

**Input Mode**
```
┌─────────────────────────────┐
│  Input Field                │
│  [←] [Ask me anything...] [→]
├─────────────────────────────┤
│  Tab Bar (4 tabs)           │
│  [Scan] [Services] [Explore] [Assistant*]
│  (Keyboard appears here)    │
└─────────────────────────────┘
```

## User Flow

1. **Activate Assistant Mode**
   - User taps **Assistant** tab button
   - Haptic feedback triggers
   - Container switches from Explore grid to 3 Assistant buttons
   - Assistant tab button shows active state (animated gradient)

2. **Enter Type Mode**
   - User taps **Type** button
   - Input field appears with back button
   - Keyboard automatically opens and focuses input
   - User can type their query

3. **Submit or Cancel**
   - **Submit**: Tap submit button (→) or press Enter
   - **Cancel**: Tap back button (←) or dismiss keyboard
   - Returns to Assistant action buttons

4. **Exit Assistant Mode**
   - User taps **Assistant** tab button again
   - Returns to Explore mode with action cards grid

## Technical Implementation

### Height State Management

#### BottomContainer.js
```javascript
// New height constant
const ASSISTANT_HEIGHT = 220; // Assistant mode: 3 action buttons in 1 row

// Automatic height adjustment effect
useEffect(() => {
  if (assistantMode) {
    // Switch to Assistant height
    bottomHeightSharedValue.value = withTiming(ASSISTANT_HEIGHT, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    onHeightChange(ASSISTANT_HEIGHT);
  } else {
    // Switch back to Explore default (collapsed) height
    bottomHeightSharedValue.value = withTiming(EXPLORE_DEFAULT, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    onHeightChange(EXPLORE_DEFAULT);
  }
}, [assistantMode]);
```

#### ResizableSplitView.js
- Added `BOTTOM_ASSISTANT_HEIGHT` constant (220px)
- Added `ASSISTANT_TOP_SECTION_HEIGHT` for corresponding top section
- Updated snap points to include Assistant height
- Added `externalBottomHeight` prop for programmatic height control
- Added useEffect to respond to external height changes

```javascript
// New snap points including Assistant mode
const snapPoints = [
  MIN_SECTION_HEIGHT,           // Bottom fully expanded
  DEFAULT_TOP_SECTION_HEIGHT,   // Bottom expanded (6 cards)
  ASSISTANT_TOP_SECTION_HEIGHT, // Bottom at Assistant height
  MAX_TOP_SECTION_HEIGHT        // Bottom collapsed
];

// Handle external height changes
React.useEffect(() => {
  if (externalBottomHeight !== null) {
    const newTopHeight = SCREEN_HEIGHT - HANDLE_HEIGHT - externalBottomHeight;
    topSectionHeight.value = withTiming(newTopHeight, {
      duration: 300,
    });
  }
}, [externalBottomHeight]);
```

#### ExploreScreen.js
- Added `externalBottomHeight` state
- Added `handleHeightChange` callback
- Updated haptic feedback to include Assistant height state
- Updated interactive text logic to account for Assistant mode
- Passes height changes between BottomContainer and ResizableSplitView

### New Icons Added
Three new icons were added to `components/icons/index.js`:

- `VideoCameraIcon` - Video chat icon
- `MicrophoneIcon` - Voice input icon
- `KeyboardIcon` - Type/keyboard icon

### Modified Components

#### BottomContainer.js Changes:
1. Added React hooks: `useState`, `useRef`, `useEffect`
2. Added React Native components: `TextInput`, `Keyboard`, `KeyboardAvoidingView`, `Platform`
3. Added state management for Assistant and Input modes
4. **Added automatic height adjustment on mode change**
5. Added keyboard event listeners for proper behavior
6. Added handler functions:
   - `handleAssistantPress()` - Toggle Assistant mode (triggers height change)
   - `handleTypePress()` - Switch to input mode
   - `handleSubmitInput()` - Submit user input
7. Made TabBarItem pressable with `TouchableOpacity`
8. Added conditional rendering for Explore/Assistant/Input modes
9. Added new styles for input components
10. Added `onHeightChange` prop for notifying parent of height changes

#### ResizableSplitView.js Changes:
1. Added `BOTTOM_ASSISTANT_HEIGHT` constant (220px)
2. Added `ASSISTANT_TOP_SECTION_HEIGHT` constant
3. Added Assistant height to snap points array
4. Added `externalBottomHeight` prop for external height control
5. Added useEffect to respond to programmatic height changes
6. Updated snap logic to include Assistant mode height

#### ExploreScreen.js Changes:
1. Added `externalBottomHeight` state
2. Added `handleHeightChange` callback function
3. Updated `ASSISTANT_HEIGHT` constant to match BottomContainer
4. Updated haptic feedback to include Assistant height state
5. Updated `getInteractiveText()` to handle Assistant mode
6. Passes `onHeightChange` to BottomContainer
7. Passes `externalBottomHeight` to ResizableSplitView

### Keyboard Handling
```javascript
// Keyboard event listeners
useEffect(() => {
  const keyboardWillShow = Keyboard.addListener(...);
  const keyboardWillHide = Keyboard.addListener(...);
  return () => {
    keyboardWillShow.remove();
    keyboardWillHide.remove();
  };
}, [inputMode]);
```

### KeyboardAvoidingView
```javascript
<KeyboardAvoidingView 
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={0}
>
  {/* Container content */}
</KeyboardAvoidingView>
```

## Styling

### New Styles Added:
- `assistantActionsContainer` - Container for 3 Assistant buttons
- `inputContainer` - Container for input field
- `inputWrapper` - Input field wrapper with back/submit buttons
- `backButton` - Back button (←) styling
- `backButtonText` - Back button text styling
- `textInput` - Text input styling
- `submitButton` - Submit button (→) styling
- `submitButtonText` - Submit button text styling

All styles maintain consistency with the existing design system using tokens from `constants/tokens.js`.

## Future Enhancements

Potential improvements for future iterations:

1. **Video Chat Implementation** - Add actual video chat functionality
2. **Voice Input** - Implement speech-to-text for Speak button
3. **Input Submission Handler** - Connect input to backend API
4. **Chat History** - Display previous conversations
5. **Typing Indicators** - Show when Assistant is processing
6. **Animated Transitions** - Smooth transitions between modes
7. **Multi-line Input** - Support longer text inputs
8. **Input Validation** - Validate user input before submission

## Testing Checklist

### Height & Mode Switching
- [ ] Assistant button tap toggles Assistant mode
- [ ] BottomContainer automatically animates to 220px height in Assistant mode
- [ ] Top section adjusts height smoothly when entering Assistant mode
- [ ] Switching back to Explore returns to collapsed state (140px)
- [ ] Height transitions are smooth (300ms animation)
- [ ] ResizableSplitView snap points include Assistant height

### Assistant Mode
- [ ] 3 action buttons display in Assistant mode
- [ ] Assistant tab shows active state in Assistant mode
- [ ] Video Chat button visible and tappable
- [ ] Speak button visible and tappable
- [ ] Type button opens input field

### Input Mode
- [ ] Type button opens input field with keyboard
- [ ] Input field accepts text input
- [ ] Submit button sends input
- [ ] Back button returns to Assistant buttons
- [ ] Keyboard dismissal returns to Assistant buttons
- [ ] Keyboard doesn't cover input field

### Interactions
- [ ] Haptic feedback works on all interactions
- [ ] Switching back to Explore mode works correctly
- [ ] Manual drag gestures still work in all modes
- [ ] "+2 more" text appears correctly in Explore mode
- [ ] "+2 more" text doesn't appear in Assistant mode

## Dependencies

No new dependencies were added. The implementation uses existing packages:
- `react-native` - Core components
- `react-native-reanimated` - Animations
- `expo-haptics` - Haptic feedback
- `react-native-svg` - Icons

---

**Last Updated**: November 23, 2025
**Version**: 1.0.0

