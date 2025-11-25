import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../constants/tokens';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  SendIcon,
  StopIcon,
} from './icons';

// Create animated Text component
const AnimatedText = Animated.createAnimatedComponent(Text);

// Exact Figma specifications
const CONTAINER_PADDING_DEFAULT = 20; // Default and Voice mode
const CONTAINER_PADDING_FOCUSED = 0;  // Focused/Type mode

const BUTTON_WRAPPER_PADDING_DEFAULT = 8;  // Default and Voice mode  
const BUTTON_WRAPPER_PADDING_FOCUSED = 12; // Focused/Type mode

const BUTTON_PADDING_DEFAULT = 8;  // Default and Voice mode
const BUTTON_PADDING_FOCUSED = 6;  // Focused/Type mode

const ICON_SIZE_DEFAULT = 24;  // Default and Voice mode
const ICON_SIZE_FOCUSED = 20;  // Focused/Type mode

const SEND_BUTTON_SIZE = 40;
const INPUT_HEIGHT = 56;
const INPUT_MIN_HEIGHT = 40;
const INPUT_MAX_HEIGHT = 80;
const ANIMATION_DURATION = 300;

// Audio wave bars configuration
const AUDIO_WAVE_BARS = 20;
const AUDIO_WAVE_MIN_HEIGHT = 12;
const AUDIO_WAVE_MAX_HEIGHT = 24;
const AUDIO_WAVE_ACTIVE_START = 9;  // Bars 9-16 are white
const AUDIO_WAVE_ACTIVE_END = 16;

export default function InputBar({
  placeholder = 'Type query...',
  onSend,
  onVideoPress,
  onVoicePress,
  onFocus, // Callback when input is focused
  style,
  // Props to force specific states for demo purposes
  forceState = null, // 'default', 'focused', 'multiline', 'generating', 'voice'
  forcedText = '',
}) {
  const [isFocused, setIsFocused] = useState(forceState === 'focused' || forceState === 'multiline');
  const [text, setText] = useState(forcedText || '');
  const [isGenerating, setIsGenerating] = useState(forceState === 'generating');
  const [isVoiceMode, setIsVoiceMode] = useState(forceState === 'voice');
  const [inputHeight, setInputHeight] = useState(forceState === 'multiline' ? INPUT_MAX_HEIGHT : INPUT_MIN_HEIGHT);
  const inputRef = useRef(null);

  // Determine initial values based on forceState
  const isInitiallyFocused = forceState === 'focused' || forceState === 'multiline' || forceState === 'generating';
  const isInitiallyVoice = forceState === 'voice';
  const shouldShowSendButton = (forceState === 'focused' && forcedText) || forceState === 'multiline' || forceState === 'generating';

  // Animation values - Start with appropriate state based on forceState
  // If no forceState, start with DEFAULT (large buttons, large icons)
  const containerPadding = useSharedValue(
    forceState && isInitiallyFocused && !isInitiallyVoice ? CONTAINER_PADDING_FOCUSED : CONTAINER_PADDING_DEFAULT
  );
  const inputPaddingRight = useSharedValue(
    forceState && isInitiallyFocused && !isInitiallyVoice ? 8 : 20
  );
  const buttonWrapperPadding = useSharedValue(
    forceState && isInitiallyFocused && !isInitiallyVoice ? BUTTON_WRAPPER_PADDING_FOCUSED : BUTTON_WRAPPER_PADDING_DEFAULT
  );
  const buttonPadding = useSharedValue(
    forceState && isInitiallyFocused && !isInitiallyVoice ? BUTTON_PADDING_FOCUSED : BUTTON_PADDING_DEFAULT
  );
  const iconSize = useSharedValue(
    forceState && isInitiallyFocused && !isInitiallyVoice ? ICON_SIZE_FOCUSED : ICON_SIZE_DEFAULT
  );
  const sendButtonOpacity = useSharedValue(shouldShowSendButton ? 1 : 0);
  const sendButtonScale = useSharedValue(shouldShowSendButton ? 1 : 0);
  const gradientOffset = useSharedValue(0);
  const videoButtonScale = useSharedValue(1);
  const audioWaveAnimations = useRef(
    Array.from({ length: AUDIO_WAVE_BARS }, () => useSharedValue(0))
  ).current;

  // Animated gradient offset for placeholder - continuous flow
  useEffect(() => {
    if (!isFocused && !text && !isGenerating && !isVoiceMode) {
      gradientOffset.value = 0;
      gradientOffset.value = withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else if (isGenerating) {
      gradientOffset.value = 0;
      gradientOffset.value = withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      gradientOffset.value = withTiming(0, { duration: 200 });
    }
  }, [isFocused, text, isGenerating, isVoiceMode]);

  // Audio wave animation
  useEffect(() => {
    if (isVoiceMode) {
      audioWaveAnimations.forEach((anim, index) => {
        anim.value = withRepeat(
          withTiming(1, {
            duration: 600 + Math.random() * 400,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        );
      });
    } else {
      audioWaveAnimations.forEach((anim) => {
        anim.value = withTiming(0, { duration: 200 });
      });
    }
  }, [isVoiceMode]);

  // Animate button and icon sizes based on focus state
  useEffect(() => {
    if (forceState) return; // Don't animate if state is forced
    
    if (isVoiceMode) {
      // Voice mode - use DEFAULT state spacing (large buttons and icons)
      containerPadding.value = withTiming(CONTAINER_PADDING_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      inputPaddingRight.value = withTiming(20, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      buttonWrapperPadding.value = withTiming(BUTTON_WRAPPER_PADDING_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      buttonPadding.value = withTiming(BUTTON_PADDING_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      iconSize.value = withTiming(ICON_SIZE_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
    } else if (isFocused || text.length > 0 || isGenerating) {
      // Focused state - smaller buttons and icons, 8px right padding
      containerPadding.value = withTiming(CONTAINER_PADDING_FOCUSED, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      inputPaddingRight.value = withTiming(8, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      buttonWrapperPadding.value = withTiming(BUTTON_WRAPPER_PADDING_FOCUSED, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      buttonPadding.value = withTiming(BUTTON_PADDING_FOCUSED, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      iconSize.value = withTiming(ICON_SIZE_FOCUSED, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Default state - larger buttons and icons, 20px right padding
      containerPadding.value = withTiming(CONTAINER_PADDING_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      inputPaddingRight.value = withTiming(20, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      buttonWrapperPadding.value = withTiming(BUTTON_WRAPPER_PADDING_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      buttonPadding.value = withTiming(BUTTON_PADDING_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
      iconSize.value = withTiming(ICON_SIZE_DEFAULT, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isFocused, text.length, isGenerating, isVoiceMode, forceState]);

  // Animate send button visibility - run immediately on every render
  const shouldShowSend = text.length > 0 || isGenerating;
  
  React.useEffect(() => {
    if (forceState) return; // Don't animate if state is forced
    
    if (shouldShowSend) {
      // Show send button only when there's text or generating
      sendButtonOpacity.value = withTiming(1, {
        duration: 200, // Faster animation for showing
        easing: Easing.out(Easing.ease),
      });
      sendButtonScale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Hide send button instantly when no text (no animation for hiding)
      sendButtonOpacity.value = 0;
      sendButtonScale.value = 0;
    }
  }, [shouldShowSend, forceState]);

  // Handle input focus
  const handleFocus = () => {
    if (forceState) return; // Don't handle interactions if state is forced
    
    setIsFocused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Call onFocus callback if provided
    if (onFocus) {
      onFocus();
    }
  };

  // Handle input blur
  const handleBlur = () => {
    if (forceState) return; // Don't handle interactions if state is forced
    
    if (!text && !isGenerating) {
      setIsFocused(false);
    }
  };

  // Handle video button press
  const handleVideoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    videoButtonScale.value = withTiming(0.9, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    }, () => {
      videoButtonScale.value = withTiming(1, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    });
    
    if (onVideoPress) {
      onVideoPress();
    }
  };

  // Handle voice button press
  const handleVoicePress = () => {
    if (forceState) return; // Don't handle interactions if state is forced
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newVoiceMode = !isVoiceMode;
    setIsVoiceMode(newVoiceMode);
    
    if (newVoiceMode) {
      // Enter voice mode
      Keyboard.dismiss();
      setIsFocused(false);
    } else {
      // Exit voice mode
      setIsFocused(false);
    }
    
    if (onVoicePress) {
      onVoicePress(newVoiceMode);
    }
  };

  // Handle send button press
  const handleSend = () => {
    if (forceState) return; // Don't handle interactions if state is forced
    
    if (isGenerating) {
      // Stop generating
      setIsGenerating(false);
      setText('');
      setIsFocused(false);
      handleBlur();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (text.trim()) {
      // Send message
      setIsGenerating(true);
      setText('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (onSend) {
        onSend(text);
      }
      
      // Simulate generating state for 3 seconds
      setTimeout(() => {
        setIsGenerating(false);
        setIsFocused(false);
        handleBlur();
      }, 3000);
    }
  };

  // Handle text change
  const handleTextChange = (newText) => {
    if (forceState) return; // Don't handle interactions if state is forced
    
    setText(newText);
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    paddingHorizontal: containerPadding.value,
  }));

  const buttonWrapperStyle = useAnimatedStyle(() => ({
    padding: buttonWrapperPadding.value,
  }));

  const buttonStyle = useAnimatedStyle(() => {
    const totalButtonSize = buttonPadding.value * 2 + iconSize.value;
    return {
      width: totalButtonSize,
      height: totalButtonSize,
    };
  });

  const videoButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: videoButtonScale.value }],
  }));

  const iconContainerStyle = useAnimatedStyle(() => {
    // Scale from 24 (default) to 20 (focused)
    // Scale factor: when iconSize is 20, scale should be 20/24 = 0.833
    // When iconSize is 24, scale should be 1
    const scale = iconSize.value / ICON_SIZE_DEFAULT;
    return {
      transform: [{ scale }],
      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  const inputContainerStyle = useAnimatedStyle(() => ({
    paddingRight: inputPaddingRight.value,
  }));

  const sendButtonContainerStyle = useAnimatedStyle(() => {
    // When scale is 0, button takes no space at all
    if (sendButtonScale.value === 0) {
      return {
        width: 0,
        height: SEND_BUTTON_SIZE,
        marginLeft: 0,
        opacity: 0,
      };
    }
    
    // When scaled to 1, width should be 40px (button only)
    const width = interpolate(
      sendButtonScale.value,
      [0, 1],
      [0, SEND_BUTTON_SIZE]
    );
    
    const marginLeft = interpolate(
      sendButtonScale.value,
      [0, 1],
      [0, 8] // 8px space from text when visible
    );
    
    return {
      width,
      height: SEND_BUTTON_SIZE,
      marginLeft,
      opacity: sendButtonOpacity.value,
    };
  });

  // Animated color for text - cycles through gradient colors
  const animatedTextColor = useAnimatedStyle(() => {
    const progress = gradientOffset.value;
    
    // Interpolate between gradient colors
    const colors = [
      { r: 68, g: 145, b: 255 },    // #4491FF
      { r: 248, g: 157, b: 255 },   // #F89DFF
      { r: 251, g: 228, b: 140 },   // #FBE48C
      { r: 68, g: 145, b: 255 },    // back to #4491FF
    ];
    
    const colorIndex = progress * (colors.length - 1);
    const lowerIndex = Math.floor(colorIndex);
    const upperIndex = Math.ceil(colorIndex);
    const t = colorIndex - lowerIndex;
    
    const lower = colors[lowerIndex];
    const upper = colors[upperIndex];
    
    const r = Math.round(lower.r + (upper.r - lower.r) * t);
    const g = Math.round(lower.g + (upper.g - lower.g) * t);
    const b = Math.round(lower.b + (upper.b - lower.b) * t);
    
    return {
      color: `rgb(${r}, ${g}, ${b})`,
    };
  });

  // Audio wave bar component
  const AudioWaveBar = ({ anim, index }) => {
    const barStyle = useAnimatedStyle(() => {
      const height = interpolate(
        anim.value,
        [0, 1],
        [AUDIO_WAVE_MIN_HEIGHT, AUDIO_WAVE_MAX_HEIGHT]
      );
      const opacity = interpolate(anim.value, [0, 1], [0.13, 1]);
      return {
        height,
        opacity,
      };
    });

    const isActive = index >= AUDIO_WAVE_ACTIVE_START && index <= AUDIO_WAVE_ACTIVE_END;

    return (
      <Animated.View
        style={[
          styles.audioWaveBar,
          barStyle,
          isActive && styles.audioWaveBarActive,
        ]}
      />
    );
  };

  // Render audio wave bars
  const renderAudioWave = () => {
    return (
      <View style={styles.audioWaveContainer}>
        {audioWaveAnimations.map((anim, index) => (
          <AudioWaveBar key={index} anim={anim} index={index} />
        ))}
      </View>
    );
  };

  // Render gradient text with animated color
  const renderGradientText = (textContent) => {
    return (
      <AnimatedText 
        style={[styles.placeholderText, animatedTextColor]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {textContent}
      </AnimatedText>
    );
  };

  // Determine if multi-line
  const isMultiLine = inputHeight > INPUT_MIN_HEIGHT;

  return (
    <Animated.View style={[styles.container, containerStyle, style]}>
      {/* Video Button */}
      <Animated.View style={[styles.buttonWrapper, buttonWrapperStyle]}>
        <TouchableOpacity
          style={styles.buttonTouchable}
          onPress={handleVideoPress}
          activeOpacity={0.7}
          disabled={!!forceState}
        >
          <Animated.View style={[styles.button, buttonStyle, videoButtonStyle]}>
            <Animated.View style={iconContainerStyle}>
              <VideoCameraIcon size={ICON_SIZE_DEFAULT} color={Colors.white} />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Input Area */}
      <Animated.View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          isMultiLine && styles.inputContainerMultiLine,
        ]}
      >
        {isVoiceMode ? (
          renderAudioWave()
        ) : (
          <>
            <View style={styles.textWrapper}>
              {(isGenerating || (!isFocused && !text)) && (
                <View style={[
                  styles.placeholderContainer,
                  (!isFocused && !text && !isGenerating) && styles.placeholderContainerCentered,
                ]}>
                  {renderGradientText(isGenerating ? 'Generating Response' : placeholder)}
                </View>
              )}
              <TextInput
                ref={inputRef}
                style={[
                  styles.textInput,
                  { 
                    height: Math.max(INPUT_MIN_HEIGHT, inputHeight),
                    paddingTop: inputHeight > INPUT_MIN_HEIGHT ? 8 : 11,
                    paddingBottom: inputHeight > INPUT_MIN_HEIGHT ? 8 : 11,
                  },
                ]}
                value={text}
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onContentSizeChange={(event) => {
                  const height = event.nativeEvent.contentSize.height;
                  setInputHeight(Math.min(Math.max(INPUT_MIN_HEIGHT, height), INPUT_MAX_HEIGHT));
                }}
                multiline
                placeholderTextColor="transparent"
                editable={!isGenerating && !forceState}
                pointerEvents={forceState ? 'none' : 'auto'}
              />
            </View>

            {/* Send Button */}
            <Animated.View style={[styles.sendButton, sendButtonContainerStyle]}>
              <View style={styles.sendButtonWrapper}>
                <TouchableOpacity
                  onPress={handleSend}
                  activeOpacity={0.7}
                  disabled={(!text.trim() && !isGenerating) || !!forceState}
                >
                  <Animated.View style={[styles.sendButtonInner, { opacity: sendButtonOpacity.value, transform: [{ scale: sendButtonScale.value }] }]}>
                    {isGenerating ? (
                      <StopIcon size={24} color="#000000" />
                    ) : (
                      <SendIcon size={24} color="#000000" />
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        )}
      </Animated.View>

      {/* Voice Button */}
      <Animated.View style={[styles.buttonWrapper, buttonWrapperStyle]}>
        <TouchableOpacity
          style={styles.buttonTouchable}
          onPress={handleVoicePress}
          activeOpacity={0.7}
          disabled={!!forceState}
        >
          <Animated.View
            style={[
              styles.button,
              buttonStyle,
              isVoiceMode && styles.buttonActive,
            ]}
          >
            <Animated.View style={iconContainerStyle}>
              {isVoiceMode ? (
                <StopIcon size={ICON_SIZE_DEFAULT} color="#000000" />
              ) : (
                <MicrophoneIcon size={ICON_SIZE_DEFAULT} color={Colors.white} />
              )}
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 16,
    width: '100%',
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.white14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonActive: {
    backgroundColor: Colors.white,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.white14,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingLeft: 20,
    paddingRight: 20,
    minHeight: INPUT_HEIGHT,
    maxHeight: INPUT_HEIGHT,
    overflow: 'hidden',
  },
  inputContainerMultiLine: {
    borderRadius: 32,
    alignItems: 'flex-end',
    maxHeight: INPUT_MAX_HEIGHT + 16,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: INPUT_MAX_HEIGHT,
    position: 'relative',
  },
  textInput: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.white,
    paddingHorizontal: 0,
    textAlign: 'left',
    includeFontPadding: false,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  placeholderContainerCentered: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.4,
  },
  sendButton: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sendButtonWrapper: {},
  sendButtonInner: {
    width: SEND_BUTTON_SIZE,
    height: SEND_BUTTON_SIZE,
    backgroundColor: Colors.white,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioWaveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  audioWaveBar: {
    width: 2,
    backgroundColor: Colors.white14,
    borderRadius: 0.7,
  },
  audioWaveBarActive: {
    backgroundColor: Colors.white,
  },
});
