import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useDerivedValue,
} from 'react-native-reanimated';
import ButtonGrey from './ButtonGrey';
import { Spacing } from '../constants/tokens';

/**
 * ButtonLine - Internal component for a single line of buttons
 * Handles smooth appearance/disappearance with proportional scaling
 */
const ButtonLine = ({ buttons, animationProgress, containerScaleY }) => {
  return (
    <View style={styles.buttonLine}>
      {buttons.map((button, index) => (
        <View key={index} style={styles.buttonWrapper}>
          <ButtonGrey
            icon={button.icon}
            label={button.label}
            onPress={button.onPress}
            disabled={button.disabled}
            scaleProgress={animationProgress}
            containerScaleY={containerScaleY}
          />
        </View>
      ))}
    </View>
  );
};

/**
 * ButtonBar - Container for multiple lines of buttons (max 3 buttons per line)
 * Supports dynamic height animation with smooth appearance/disappearance of lines
 * 
 * Props:
 * @param {Array<Array<Object>>} lines - Array of button lines, each line is an array of button objects
 *        Button object: { icon, label, onPress, disabled }
 *        Example: [
 *          [{ icon: Icon1, label: "Button 1", onPress: () => {} }],
 *          [{ icon: Icon2, label: "Button 2" }, { icon: Icon3, label: "Button 3" }],
 *          [{ icon: Icon4, label: "Button 4" }, { icon: Icon5, label: "Button 5" }, { icon: Icon6, label: "Button 6" }]
 *        ]
 * @param {SharedValue} heightProgress - Animated progress value (0-1) controlling which lines are visible
 *        0 = all lines hidden, 0.33 = first line visible, 0.66 = first two lines visible, 1 = all three lines visible
 */
export default function ButtonBar({ lines = [], heightProgress }) {
  // Ensure max 3 lines
  const visibleLines = lines.slice(0, 3);

  // Calculate animation progress for each line
  // Line 1: visible from 0 to 0.33 progress
  // Line 2: visible from 0.33 to 0.66 progress
  // Line 3: visible from 0.66 to 1.0 progress
  
  const line1Progress = useDerivedValue(() => {
    'worklet';
    if (!heightProgress) return 1;
    const progress = heightProgress.value;
    return Math.max(0, Math.min(1, progress / 0.33));
  });

  const line2Progress = useDerivedValue(() => {
    'worklet';
    if (!heightProgress) return 0;
    const progress = heightProgress.value;
    if (progress < 0.33) return 0;
    return Math.max(0, Math.min(1, (progress - 0.33) / 0.33));
  });

  const line3Progress = useDerivedValue(() => {
    'worklet';
    if (!heightProgress) return 0;
    const progress = heightProgress.value;
    if (progress < 0.66) return 0;
    return Math.max(0, Math.min(1, (progress - 0.66) / 0.34));
  });

  // Animated styles for each line container - height animation with vertical scaling
  const line1Style = useAnimatedStyle(() => {
    'worklet';
    if (!heightProgress) {
      return { 
        height: 72,
        overflow: 'hidden',
        transform: [{ scaleY: 1 }],
      };
    }
    
    const progress = line1Progress.value;
    return {
      height: 72, // Fixed height, scaling handles the visual size
      overflow: 'hidden',
      transform: [{ scaleY: progress }], // Scale vertically for smooth animation
    };
  });

  const line2Style = useAnimatedStyle(() => {
    'worklet';
    if (!heightProgress) {
      return { 
        height: 72,
        overflow: 'hidden',
        transform: [{ scaleY: 0 }],
      };
    }
    
    const progress = line2Progress.value;
    return {
      height: 72, // Fixed height, scaling handles the visual size
      overflow: 'hidden',
      transform: [{ scaleY: progress }], // Scale vertically for smooth animation
      marginTop: progress > 0.1 ? Spacing.md : 0, // 8px gap when visible
    };
  });

  const line3Style = useAnimatedStyle(() => {
    'worklet';
    if (!heightProgress) {
      return { 
        height: 72,
        overflow: 'hidden',
        transform: [{ scaleY: 0 }],
      };
    }
    
    const progress = line3Progress.value;
    return {
      height: 72, // Fixed height, scaling handles the visual size
      overflow: 'hidden',
      transform: [{ scaleY: progress }], // Scale vertically for smooth animation
      marginTop: progress > 0.1 ? Spacing.md : 0, // 8px gap when visible
    };
  });

  return (
    <View style={styles.container}>
      {/* Line 1 */}
      {visibleLines[0] && (
        <Animated.View style={line1Style}>
          <ButtonLine 
            buttons={visibleLines[0]} 
            animationProgress={line1Progress}
            containerScaleY={line1Progress}
          />
        </Animated.View>
      )}

      {/* Line 2 */}
      {visibleLines[1] && (
        <Animated.View style={line2Style}>
          <ButtonLine 
            buttons={visibleLines[1]} 
            animationProgress={line2Progress}
            containerScaleY={line2Progress}
          />
        </Animated.View>
      )}

      {/* Line 3 */}
      {visibleLines[2] && (
        <Animated.View style={line3Style}>
          <ButtonLine 
            buttons={visibleLines[2]} 
            animationProgress={line3Progress}
            containerScaleY={line3Progress}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.xxl, // 20px from Figma design
  },
  buttonLine: {
    flexDirection: 'row',
    gap: 10, // 10px gap between buttons in a line (from Figma)
    height: 72,
  },
  buttonWrapper: {
    flex: 1,
  },
});

