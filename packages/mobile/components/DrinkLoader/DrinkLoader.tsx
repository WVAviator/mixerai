import * as React from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const GLASS_DASHARRAY = 511.83;
const GARNISH_DASHARRAY = 208.5;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const useSequentialAnimation = (
  glassOffset: Animated.SharedValue<number>,
  garnishOffset: Animated.SharedValue<number>,
  duration = 3500,
) => {
  React.useEffect(() => {
    const glassAnimationSequence = withSequence(
      withTiming(0, {
        duration: duration * 0.3,
        easing: Easing.linear,
      }),
      withTiming(0, {
        duration: duration * 0.2,
        easing: Easing.linear,
      }),
      withTiming(0, {
        duration: duration * 0.2,
        easing: Easing.linear,
      }),
      withTiming(-GLASS_DASHARRAY, {
        duration: duration * 0.3,
        easing: Easing.linear,
      }),
      withTiming(GLASS_DASHARRAY, { duration: 0 }),
    );

    const garnishAnimationSequence = withSequence(
      withTiming(GARNISH_DASHARRAY, {
        duration: duration * 0.3,
        easing: Easing.linear,
      }),
      withTiming(0, {
        duration: duration * 0.2,
        easing: Easing.linear,
      }),
      withTiming(-GARNISH_DASHARRAY, {
        duration: duration * 0.2,
        easing: Easing.linear,
      }),
      withTiming(-GARNISH_DASHARRAY, {
        duration: duration * 0.3,
        easing: Easing.linear,
      }),
      withTiming(GARNISH_DASHARRAY, { duration: 0 }),
    );

    glassOffset.value = withRepeat(glassAnimationSequence, -1, false);
    garnishOffset.value = withRepeat(garnishAnimationSequence, -1, false);
  }, [glassOffset, garnishOffset, duration]);
};

const DrinkLoader = () => {
  const glassOffset = useSharedValue(GLASS_DASHARRAY);
  const garnishOffset = useSharedValue(GARNISH_DASHARRAY);

  useSequentialAnimation(glassOffset, garnishOffset);

  const animatedGlassProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: glassOffset.value,
    };
  });

  const animatedGarnishProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: garnishOffset.value,
    };
  });

  return (
    <Svg width={191} height={191} fill="none">
      <AnimatedPath
        d="M71.625 49.74c0-6.314-2.222-12.44-6.301-17.376-4.08-4.935-9.774-8.385-16.15-9.785a29.785 29.785 0 0 0-18.946 2.08C24.34 27.403 19.592 32 16.764 37.693a26.983 26.983 0 0 0-2.1 18.297c1.467 6.153 5.056 11.642 10.179 15.567 5.122 3.925 11.474 6.053 18.013 6.036 6.54-.018 12.879-2.18 17.978-6.132L43.772 49.74h27.854Z"
        stroke="#C0630D"
        strokeWidth={4}
        strokeDasharray={GARNISH_DASHARRAY}
        animatedProps={animatedGarnishProps}
      />
      <AnimatedPath
        d="M78 165h47l-23.5-.5V121l38-46.5H89l51-.5 19-24H44l57 70.5"
        stroke="#C0630D"
        strokeWidth={4}
        strokeDasharray={GLASS_DASHARRAY}
        animatedProps={animatedGlassProps}
      />
    </Svg>
  );
};

{
  /* <svg width="125" height="119" viewBox="0 0 125 119" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M38.5 117H62.5M86.5 117H62.5M62.5 117V73M62.5 73L100.5 26M62.5 73L5 2H120L100.5 26M100.5 26H48" stroke="#C0630D" stroke-width="4"/>
</svg> */
}

export default DrinkLoader;
