# Tab System Architecture

## Overview
The BottomContainer component has been refactored to support a flexible, scalable tab-based system. This new architecture makes it easy to add new tabs and their associated content/states without modifying core logic.

## Architecture Design

### State Management
```javascript
// Single source of truth for active tab
const [currentTab, setCurrentTab] = useState(activeTab);

// Tab states: 'Explore', 'Assistant', 'Scan', 'Services'
```

### Tab Structure
Each tab now has:
1. **Independent content rendering** - Conditional rendering based on `currentTab`
2. **Automatic height management** - Each tab can define its own height behavior
3. **Isolated state** - Tab-specific state (like inputMode for Assistant)
4. **Configurable interactions** - Enable/disable drag, show/hide interactive elements

## Tab Definitions

### 1. Explore Tab (Default)
**Features:**
- 3 expandable states via drag gesture
  - **Collapsed (140px)**: Just tab bar
  - **Expanded (340px)**: 6 action cards, "+2 more" text
  - **Fully Expanded (440px)**: All 8 action cards
- Interactive drag handle
- Dynamic action cards with animations
- Manual drag gestures enabled

**Content:**
```javascript
{currentTab === 'Explore' && (
  <Animated.View>
    {/* 8 action cards in 3 rows */}
    {/* First 2 rows animate together */}
    {/* Third row animates separately */}
  </Animated.View>
)}
```

### 2. Assistant Tab
**Features:**
- Fixed height (220px) - no drag expansion
- 3 action buttons: Video Chat, Speak, Type
- Input mode for text queries
- Animated gradient tab indicator
- Manual drag gestures disabled

**Content:**
```javascript
{currentTab === 'Assistant' && (
  inputMode ? (
    // Text input field
  ) : (
    // 3 assistant action buttons
  )
)}
```

### 3. Scan Tab (Placeholder)
**Features:**
- Fixed height (140px)
- Placeholder content - ready for implementation
- Manual drag gestures disabled

**Content:**
```javascript
{currentTab === 'Scan' && (
  <View style={styles.placeholderContainer}>
    <Text>Scan Content</Text>
  </View>
)}
```

### 4. Services Tab (Placeholder)
**Features:**
- Fixed height (140px)
- Placeholder content - ready for implementation
- Manual drag gestures disabled

**Content:**
```javascript
{currentTab === 'Services' && (
  <View style={styles.placeholderContainer}>
    <Text>Services Content</Text>
  </View>
)}
```

## How Tab Switching Works

### User Flow
```
User taps tab button
    ↓
handleTabPress(tabName) called
    ↓
Haptic feedback triggers
    ↓
setCurrentTab(tabName) updates state
    ↓
onTabChange callback notifies parent
    ↓
Content section re-renders for new tab
    ↓
Height automatically adjusts via useEffect
    ↓
ResizableSplitView responds to height change
    ↓
Drag behavior updates (enabled/disabled)
```

### Code Flow
```javascript
// 1. User taps tab
handleTabPress('Explore')

// 2. State updates
setCurrentTab('Explore')
setInputMode(false) // Reset any mode-specific states

// 3. Parent notified
onTabChange('Explore')

// 4. Height adjusts (in useEffect)
if (currentTab === 'Explore') {
  bottomHeightSharedValue.value = withTiming(EXPLORE_DEFAULT, ...)
  onHeightChange(EXPLORE_DEFAULT)
}

// 5. Content renders
{currentTab === 'Explore' && <ExploreContent />}
```

## Tab Configuration

### Height Mapping
Each tab defines its default height:

| Tab | Default Height | Expandable? | Max Height |
|-----|----------------|-------------|------------|
| Explore | 140px | Yes | 440px |
| Assistant | 220px | No | 220px |
| Scan | 140px | No | 140px |
| Services | 140px | No | 140px |

### Interaction Mapping
Each tab defines its interaction behavior:

| Tab | Drag Handle | Interactive Text | Manual Expansion |
|-----|-------------|------------------|------------------|
| Explore | Enabled | "+2 more" | Yes |
| Assistant | Disabled | None | No |
| Scan | Disabled | None | No |
| Services | Disabled | None | No |

## Adding a New Tab

To add a new tab to the system, follow these steps:

### Step 1: Define Content Component (BottomContainer.js)
```javascript
{currentTab === 'NewTab' && (
  <View style={styles.newTabContainer}>
    {/* Your tab content here */}
  </View>
)}
```

### Step 2: Add Height Logic (BottomContainer.js)
```javascript
useEffect(() => {
  if (currentTab === 'NewTab') {
    const NEW_TAB_HEIGHT = 250; // Define your height
    if (bottomHeightSharedValue) {
      bottomHeightSharedValue.value = withTiming(NEW_TAB_HEIGHT, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
    if (onHeightChange) {
      onHeightChange(NEW_TAB_HEIGHT);
    }
  }
  // ... other tabs
}, [currentTab]);
```

### Step 3: Add Tab Bar Item (BottomContainer.js)
```javascript
<TabBarItem
  icon={NewTabIcon}
  label="New Tab"
  isActive={currentTab === 'NewTab'}
  size={24}
  onPress={() => handleTabPress('NewTab')}
/>
```

### Step 4: Update Height Constants (if needed)
```javascript
// In BottomContainer.js
const NEW_TAB_HEIGHT = 250;

// In ResizableSplitView.js
const BOTTOM_NEW_TAB_HEIGHT = 250;
const NEW_TAB_TOP_SECTION_HEIGHT = SCREEN_HEIGHT - BOTTOM_NEW_TAB_HEIGHT - HANDLE_HEIGHT;

// Add to snap points
const snapPoints = [
  MIN_SECTION_HEIGHT,
  DEFAULT_TOP_SECTION_HEIGHT,
  ASSISTANT_TOP_SECTION_HEIGHT,
  NEW_TAB_TOP_SECTION_HEIGHT, // Add here
  MAX_TOP_SECTION_HEIGHT
];
```

### Step 5: Configure Interactions (ExploreScreen.js)
```javascript
// Enable/disable drag for your tab
enableDrag={activeTab === 'Explore' || activeTab === 'NewTab'}

// Add interactive text logic if needed
const getInteractiveText = React.useCallback((height, currentTab) => {
  if (currentTab === 'NewTab') {
    // Return your custom text
  }
  // ... existing logic
}, []);
```

### Step 6: Add Styles (if needed)
```javascript
newTabContainer: {
  width: Sizes.actionsContainerWidth,
  paddingTop: Spacing.containerPaddingTop,
  // Your styles
},
```

## Key Components Modified

### BottomContainer.js
- **Removed**: `assistantMode` state (replaced with `currentTab`)
- **Added**: Generic `handleTabPress(tabName)` handler
- **Added**: Tab-specific content rendering with conditions
- **Added**: Placeholder containers for Scan and Services
- **Changed**: Height logic now based on `currentTab` instead of boolean flags

### ResizableSplitView.js
- **Added**: `enableDrag` prop to control drag gesture
- **Added**: Drag gesture uses `.enabled(enableDrag)`
- **Existing**: Snap points still work for manual dragging (when enabled)

### ExploreScreen.js
- **Added**: `activeTab` state management
- **Added**: `handleTabChange` callback
- **Changed**: Interactive text logic considers `activeTab`
- **Added**: `enableDrag` prop passed to ResizableSplitView
- **Changed**: Passes `activeTab` to BottomContainer

## Benefits of New Architecture

### 1. Scalability
- Easy to add new tabs without touching core logic
- Each tab is isolated and self-contained
- No complex boolean flag combinations

### 2. Maintainability
- Clear separation of concerns
- Each tab's logic is in one place
- Easy to understand tab switching flow

### 3. Flexibility
- Each tab can have different heights
- Each tab can enable/disable features independently
- Easy to add tab-specific states and behaviors

### 4. Consistency
- All tabs use the same activation mechanism
- Uniform haptic feedback
- Consistent animation timing

### 5. Reusability
- Tab system can be used in other screens
- Tab content components can be extracted
- Height management logic is centralized

## State Flow Diagram

```
┌─────────────────────────────────────┐
│      ExploreScreen (Parent)         │
│  - activeTab: 'Explore'             │
│  - bottomHeight: 140                │
│  - externalBottomHeight: null       │
└────────────┬────────────────────────┘
             │
             ├──► onTabChange(tabName)
             │    └──► setActiveTab(tabName)
             │
             ├──► onHeightChange(height)
             │    └──► setExternalBottomHeight(height)
             │
             ▼
┌─────────────────────────────────────┐
│     BottomContainer (Child)         │
│  - currentTab: 'Explore'            │
│  - inputMode: false                 │
│  - inputText: ''                    │
└────────────┬────────────────────────┘
             │
             ├──► handleTabPress(tab)
             │    ├──► Haptics
             │    ├──► setCurrentTab(tab)
             │    └──► onTabChange(tab)
             │
             ├──► useEffect on currentTab
             │    ├──► Adjust height
             │    └──► onHeightChange(height)
             │
             └──► Render content
                  ├──► {currentTab === 'Explore' && ...}
                  ├──► {currentTab === 'Assistant' && ...}
                  ├──► {currentTab === 'Scan' && ...}
                  └──► {currentTab === 'Services' && ...}
```

## Testing Checklist

### Tab Switching
- [ ] Tapping Explore shows Explore content and collapses to 140px
- [ ] Tapping Assistant shows Assistant content and expands to 220px
- [ ] Tapping Scan shows Scan placeholder at 140px
- [ ] Tapping Services shows Services placeholder at 140px
- [ ] Switching between tabs has smooth height transitions
- [ ] Only one tab is active at a time

### Explore Tab Specific
- [ ] Can drag to expand from 140px → 340px (6 cards)
- [ ] "+2 more" text appears at 340px height
- [ ] Can drag to expand from 340px → 440px (8 cards)
- [ ] "+2 more" text disappears at 440px height
- [ ] Can drag to collapse back to any state
- [ ] Action cards animate smoothly

### Assistant Tab Specific
- [ ] Cannot drag to expand (drag disabled)
- [ ] 3 action buttons visible
- [ ] Type button shows input field
- [ ] Input field works correctly
- [ ] Keyboard dismissal returns to buttons

### General
- [ ] Haptic feedback on all tab taps
- [ ] Tab bar icons show correct active/inactive states
- [ ] Assistant gradient animates correctly
- [ ] Explore white background appears correctly
- [ ] All other tabs stay inactive when one is active

---

**Last Updated**: November 23, 2025
**Version**: 2.0.0 - Tab System Refactor

