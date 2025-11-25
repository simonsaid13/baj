# Button Components Guide

This guide covers the usage of the new reusable button components: `ButtonGrey` and `ButtonBar`.

## Table of Contents
1. [ButtonGrey Component](#buttongrey-component)
2. [ButtonBar Component](#buttonbar-component)
3. [Animation System](#animation-system)
4. [Live Demo](#live-demo)

---

## ButtonGrey Component

A reusable button component with smooth animations, haptic feedback, and Figma design compliance.

### Features
- Smooth scale animation on press (ease in/out)
- Haptic feedback (light impact)
- Icon and label support
- Disabled state
- 72px fixed height
- Semi-transparent white background with backdrop blur effect

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | Component | No | - | Icon component (must accept `size` and `color` props) |
| `label` | string | No | - | Text label displayed below the icon |
| `onPress` | function | No | - | Callback function when button is pressed |
| `disabled` | boolean | No | `false` | Whether button is disabled |

### Basic Usage

```javascript
import ButtonGrey from './components/ButtonGrey';
import { HandshakeIcon } from './components/icons';

function MyComponent() {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <View style={{ width: 120 }}>
      <ButtonGrey
        icon={HandshakeIcon}
        label="Borrow"
        onPress={handlePress}
      />
    </View>
  );
}
```

### Advanced Usage

```javascript
// Button without icon
<ButtonGrey
  label="Continue"
  onPress={handleContinue}
/>

// Button without label
<ButtonGrey
  icon={SearchIcon}
  onPress={handleSearch}
/>

// Disabled button
<ButtonGrey
  icon={HandshakeIcon}
  label="Coming Soon"
  disabled={true}
/>
```

### Design Specifications
- **Height**: 72px (fixed)
- **Border Radius**: 20px
- **Background**: `rgba(255, 255, 255, 0.1)` with backdrop blur
- **Icon Size**: 24px
- **Label Font Size**: 14px
- **Label Opacity**: 0.5
- **Gap between icon and label**: 4px
- **Horizontal Padding**: 12px

---

## ButtonBar Component

A container component that displays multiple lines of buttons with smooth animated transitions. Each line can contain 1-3 buttons that automatically distribute space evenly.

### Features
- Supports up to 3 lines of buttons
- Each line can have 1-3 buttons
- Smooth appearance/disappearance animations
- Animated height transitions
- Scale and opacity transitions for individual buttons
- Similar animation system to BottomContainer's Assistant mode

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `lines` | Array<Array<Object>> | Yes | `[]` | Array of button lines (max 3 lines) |
| `heightProgress` | SharedValue | Yes | - | Animated progress value (0-1) controlling visibility |

### Button Object Structure

Each button in the `lines` array should have this structure:

```javascript
{
  icon: IconComponent,      // Icon component
  label: "Button Text",     // Label text
  onPress: () => {},        // Press handler
  disabled: false           // Optional: disabled state
}
```

### Basic Usage

```javascript
import ButtonBar from './components/ButtonBar';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { HandshakeIcon, ChartBarIcon, ShieldCheckIcon } from './components/icons';

function MyComponent() {
  const heightProgress = useSharedValue(0);

  // Define button lines
  const buttonLines = [
    // Line 1: Single button
    [{ icon: HandshakeIcon, label: 'Borrow', onPress: () => {} }],
    
    // Line 2: Two buttons
    [
      { icon: ChartBarIcon, label: 'Invest', onPress: () => {} },
      { icon: ShieldCheckIcon, label: 'Insurance', onPress: () => {} },
    ],
    
    // Line 3: Three buttons
    [
      { icon: Icon4, label: 'Button 4', onPress: () => {} },
      { icon: Icon5, label: 'Button 5', onPress: () => {} },
      { icon: Icon6, label: 'Button 6', onPress: () => {} },
    ],
  ];

  // Animate to show all lines
  const showAllLines = () => {
    heightProgress.value = withTiming(1, { duration: 300 });
  };

  // Animate to show only first line
  const showOneLine = () => {
    heightProgress.value = withTiming(0.33, { duration: 300 });
  };

  return (
    <View>
      <ButtonBar lines={buttonLines} heightProgress={heightProgress} />
      <Button title="Show All" onPress={showAllLines} />
      <Button title="Show One" onPress={showOneLine} />
    </View>
  );
}
```

### Height Progress Values

The `heightProgress` shared value controls which lines are visible:

| Progress Value | Visible Lines | Description |
|---------------|---------------|-------------|
| `0.0 - 0.33` | Line 1 | First line appears/disappears |
| `0.33 - 0.66` | Lines 1-2 | Second line appears/disappears |
| `0.66 - 1.0` | Lines 1-3 | Third line appears/disappears |

### Examples

#### Two Lines Only
```javascript
const buttonLines = [
  [{ icon: Icon1, label: 'Button 1', onPress: () => {} }],
  [
    { icon: Icon2, label: 'Button 2', onPress: () => {} },
    { icon: Icon3, label: 'Button 3', onPress: () => {} }
  ],
];

// Show both lines
heightProgress.value = withTiming(0.66, { duration: 300 });
```

#### Dynamic Animation with User Interaction
```javascript
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

function AnimatedButtonBar() {
  const heightProgress = useSharedValue(0);
  
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      // Map gesture to progress (0-1)
      const progress = Math.max(0, Math.min(1, event.translationY / 200));
      heightProgress.value = progress;
    },
    onEnd: () => {
      // Snap to nearest state
      const snapPoints = [0, 0.33, 0.66, 1];
      const closest = snapPoints.reduce((prev, curr) => 
        Math.abs(curr - heightProgress.value) < Math.abs(prev - heightProgress.value) 
          ? curr : prev
      );
      heightProgress.value = withSpring(closest);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View>
        <ButtonBar lines={buttonLines} heightProgress={heightProgress} />
      </Animated.View>
    </PanGestureHandler>
  );
}
```

### Design Specifications
- **Line Height**: 72px per line
- **Gap between lines**: 8px
- **Gap between buttons in a line**: 10px
- **Container Horizontal Padding**: 20px
- **Max buttons per line**: 3
- **Max lines**: 3

---

## Animation System

Both components use the same animation system as `BottomContainer.js` for consistency.

### Animation Principles

1. **Staggered Appearance**: Elements appear in sequence
   - Text appears first (0-40% progress)
   - Icon appears later (40-80% progress)

2. **Scale Transitions**: Smooth scale from 0.2 to 1.0
   - Uses ease-in-out easing function
   - Counter-scaling prevents distortion from parent transforms

3. **Opacity Transitions**: Smooth fade in/out
   - Text fades in early
   - Icon fades in later
   - Both fade out smoothly when collapsing

4. **Container Scaling**: Parent containers use scaleY for smooth height changes
   - Children counter-scale to maintain proper size
   - Overflow is hidden to prevent visual glitches

### Easing Function

```javascript
const easeInOut = (t) => {
  'worklet';
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
```

### Counter-Scaling

To prevent distortion when parent containers are scaled, children apply counter-scaling:

```javascript
const parentScale = containerScaleY?.value ?? 1;
const counterScale = parentScale > 0.01 ? 1 / parentScale : 1;
const finalScale = counterScale * appearanceScale;
```

---

## Live Demo

A live interactive demo is available in the app.

### Accessing the Demo

1. Launch the app
2. On the Explore screen, tap the **"BB"** button in the top-right corner
3. The ButtonBar Demo screen will open

### Demo Features

- **Interactive Slider**: Control height progress from 0% to 100%
- **Live Preview**: See ButtonBar animations in real-time
- **Progress Indicators**: Visual feedback showing which lines are visible
- **Usage Examples**: Code snippets and implementation details
- **Information Panel**: Explains how the animation system works

### Testing the Demo

1. Move the slider slowly to see smooth transitions
2. Observe how buttons appear/disappear with scale and opacity
3. Notice the staggered animation (text first, then icon)
4. Try jumping between different progress values for snap animations

---

## Integration Examples

### Example 1: Modal with ButtonBar

```javascript
import { Modal } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

function ActionModal({ visible, onClose }) {
  const heightProgress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animate in when modal opens
      heightProgress.value = withTiming(1, { duration: 400 });
    } else {
      // Animate out when modal closes
      heightProgress.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <ButtonBar lines={actionLines} heightProgress={heightProgress} />
      </View>
    </Modal>
  );
}
```

### Example 2: Expandable Section

```javascript
function ExpandableActions() {
  const [expanded, setExpanded] = useState(false);
  const heightProgress = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    heightProgress.value = withTiming(
      expanded ? 0 : 1,
      { duration: 300, easing: Easing.inOut(Easing.ease) }
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleExpand}>
        <Text>Quick Actions {expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      <ButtonBar lines={quickActions} heightProgress={heightProgress} />
    </View>
  );
}
```

### Example 3: Scroll-Based Animation

```javascript
import { useAnimatedScrollHandler } from 'react-native-reanimated';

function ScrollAnimatedButtons() {
  const scrollY = useSharedValue(0);
  const heightProgress = useDerivedValue(() => {
    // Map scroll position to progress (0-1)
    return Math.max(0, Math.min(1, scrollY.value / 300));
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView onScroll={scrollHandler}>
      <View style={{ height: 500 }} />
      <ButtonBar lines={buttonLines} heightProgress={heightProgress} />
    </Animated.ScrollView>
  );
}
```

---

## Best Practices

### Performance
1. **Memoize button configurations** to prevent unnecessary re-renders
2. **Use SharedValues** for animations (runs on UI thread)
3. **Avoid inline functions** in button press handlers
4. **Keep button count reasonable** (max 3 lines × 3 buttons = 9 buttons)

### Animation Timing
1. **Standard transitions**: 300ms duration
2. **Quick feedback**: 150-200ms duration
3. **Smooth easing**: Use `Easing.inOut(Easing.ease)`
4. **Spring animations**: Use for natural, bouncy feel

### Accessibility
1. **Provide meaningful labels** for all buttons
2. **Use appropriate haptic feedback** intensity
3. **Ensure sufficient touch target size** (72px height is good)
4. **Test with VoiceOver/TalkBack**

### Error Handling
```javascript
// Validate button lines
const validatedLines = lines
  .filter(line => Array.isArray(line) && line.length > 0)
  .map(line => line.slice(0, 3)) // Max 3 buttons per line
  .slice(0, 3); // Max 3 lines

<ButtonBar lines={validatedLines} heightProgress={heightProgress} />
```

---

## Troubleshooting

### Buttons not appearing
- Check that `heightProgress` is greater than 0
- Verify `lines` array is properly structured
- Ensure icons are imported correctly

### Animations not smooth
- Use `withTiming` or `withSpring` for SharedValue changes
- Check that duration is appropriate (300ms recommended)
- Verify easing function is applied

### Buttons not responding to press
- Check `onPress` handlers are defined
- Verify buttons are not disabled
- Ensure no view is blocking touch events

### Counter-scaling issues
- Verify parent container is passing `containerScaleY`
- Check that SharedValue is properly initialized
- Ensure worklet functions are marked with `'worklet'`

---

## Related Components

- **BottomContainer.js**: Main container with similar animation system
- **ActionCard**: Individual action card component in BottomContainer
- **ResizableSplitView**: Drag-based height control system

---

## Support

For questions or issues:
1. Check the Live Demo for interactive examples
2. Review BottomContainer.js for similar implementation patterns
3. Consult DESIGN_SYSTEM_GUIDE.md for design specifications

