# Bottom Container State Transitions

## Visual Guide

This document explains how the bottom container transitions between different states.

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     State Transitions                        │
└─────────────────────────────────────────────────────────────┘

    State 1                State 2                State 3                State 4
    (Default)              (Action)               (Expanded)             (Fully Expanded)
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │  +2 more     │      │    ━━━━━     │
│    ━━━━━     │◄────►│  Listening   │◄────►│              │◄────►│              │
│              │      │              │      │  ┌─┬─┬─┐     │      │  ┌─┬─┬─┐     │
│   [Scan]     │      │   [Scan]     │      │  │ │ │ │     │      │  │ │ │ │     │
│   [Svcs]     │      │   [Svcs]     │      │  └─┴─┴─┘     │      │  └─┴─┴─┘     │
│   [Expl]     │      │   [Expl]     │      │  ┌─┬─┬─┐     │      │  ┌─┬─┬─┐     │
│   [Asst]     │      │   [Asst]     │      │  │ │ │ │     │      │  │ │ │ │     │
│              │      │              │      │  └─┴─┴─┘     │      │  └─┴─┴─┘     │
│              │      │              │      │   [Scan]     │      │  ┌─┬─┐       │
│              │      │              │      │   [Svcs]     │      │  │ │ │       │
│              │      │              │      │   [Expl]     │      │  └─┴─┘       │
│              │      │              │      │   [Asst]     │      │   [Scan]     │
│              │      │              │      │              │      │   [Svcs]     │
│              │      │              │      │              │      │   [Expl]     │
│              │      │              │      │              │      │   [Asst]     │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
  Height: 120px         Height: 140px         Height: 320px         Height: 420px
   Haptic: Light         Haptic: Light         Haptic: Medium        Haptic: Heavy

      ↕                     ↕                     ↕                     ↕
   Swipe Up             Swipe Up              Swipe Up             Swipe Down
   Swipe Down           Swipe Down            Swipe Down           to minimize
```

## Detailed State Descriptions

### State 1: Default View (Minimized)
**Height**: 120px
**Interactive Line**: Small pill (━━━━━) - 40px × 6px, no text
**Action Cards**: None visible
**Tab Bar**: All 4 items visible (Scan, Services, Explore, Assistant)
**Haptic**: Light impact
**Trigger**: Swipe down from any state OR initial load

### State 2: Action View
**Height**: 140px
**Interactive Line**: Expanded pill with "Listening" text - auto width × 24px
**Action Cards**: None visible
**Tab Bar**: All 4 items visible
**Haptic**: Light impact
**Trigger**: Slight swipe up from State 1

### State 3: Expanded State
**Height**: 320px
**Interactive Line**: Expanded pill with "+2 more" text - auto width × 24px
**Action Cards**: 6 cards in 2 rows
- Row 1: Borrow, Invest, Insurance
- Row 2: Shop, Bill Payments, Fastag
**Tab Bar**: All 4 items visible
**Haptic**: Medium impact
**Trigger**: Swipe up from State 2

### State 4: Fully Expanded State
**Height**: 420px
**Interactive Line**: Small pill (━━━━━) - 40px × 6px, no text
**Action Cards**: 8 cards in 3 rows
- Row 1: Borrow, Invest, Insurance
- Row 2: Shop, Bill Payments, Fastag
- Row 3: Bajaj Mall, Bajaj Health
**Tab Bar**: All 4 items visible
**Haptic**: Heavy impact
**Trigger**: Full swipe up from State 3

## Gesture Recognition

### Velocity-Based Snapping
- **High velocity** (> 800px/s):
  - Swipe up: Moves to next more expanded state
  - Swipe down: Moves to next more minimized state

### Distance-Based Snapping
- **Low velocity** (< 800px/s):
  - Snaps to nearest state based on current position
  - Threshold: 50px from snap point

## Animation Parameters

### Interactive Line
- **Height transition**: 300ms
- **Width transition**: 300ms  
- **Text opacity**: 200ms fade in/out
- **Easing**: `withTiming`

### Action Cards
- **Opacity**: 300ms (0 → 1 or 1 → 0)
- **Scale**: 300ms (0.95 → 1.0)
- **Easing**: `withTiming`

### Drag Gesture
- **Type**: Spring animation
- **Damping**: 30
- **Stiffness**: 400
- **Mass**: 0.7
- **Duration**: ~400-600ms (physics-based)

## Tab Bar Icons

### Scan (₹ symbol)
- **Size**: 24px
- **Color**: White
- **Background**: Semi-transparent white (14%)

### Services (User icon)
- **Size**: 24px
- **Color**: White
- **Background**: Semi-transparent white (14%)

### Explore (SquaresFour icon) - ACTIVE
- **Size**: 28px
- **Color**: Black
- **Background**: White (100%)
- This indicates the current active tab

### Assistant (AI icon)
- **Size**: 24px
- **Color**: White
- **Background**: Radial gradient (Blue shades)
- **Special Effects**: Glow with shadow

## Action Card Icons

All action cards use 24px icons with white color:
1. **Handshake** - Borrow
2. **ChartBar** - Invest
3. **ShieldCheck** - Insurance
4. **ShoppingCart** - Shop
5. **Receipt** - Bill Payments
6. **Car** - Fastag
7. **Storefront** - Bajaj Mall
8. **FirstAid** - Bajaj Health

## Color Reference

### Interactive Line
- Background: `rgba(255, 255, 255, 0.14)`
- Text: White with 77% opacity
- Blur: 2px

### Action Cards
- Background: `rgba(255, 255, 255, 0.1)` with 80px blur
- Text: White with 50% opacity
- Icon: White
- Border Radius: 24px

### Tab Bar Icons
- Inactive Background: `rgba(255, 255, 255, 0.14)`
- Active Background: `#FFFFFF` (Explore tab)
- Icon Color: White (or Black for active Explore)
- Border Radius: 100px (circular)

## Performance Notes

- All animations run on the UI thread using Reanimated
- Haptic feedback triggers after animation completes
- State changes are debounced to prevent rapid transitions
- Shared values ensure smooth, jank-free animations
- Gesture responder uses worklets for 60fps performance

## Testing Checklist

- [ ] Swipe up from minimized state shows "Listening"
- [ ] Swipe up more shows 6 cards with "+2 more"
- [ ] Swipe up fully shows all 8 cards
- [ ] Swipe down from any state works correctly
- [ ] Fast swipes skip intermediate states
- [ ] Slow drags snap to nearest state
- [ ] Haptic feedback fires on each state change
- [ ] Interactive line text fades smoothly
- [ ] Action cards scale and fade properly
- [ ] Assistant icon shows gradient glow
- [ ] Explore tab shows active state (white bg)


