import React, { useEffect } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import {
  Canvas,
  Circle,
  BlurMask,
  vec,
  Rect,
  LinearGradient,
  FractalNoise,
  BackdropFilter,
  Fill,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
  Easing,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import colors from "tailwindcss/colors";

const { width, height } = Dimensions.get("window");

/**
 * CONFIGURATION
 */
const CONFIG = {
  durationBase: 12000,
  blurRadius: 120, // High blur for smooth mesh
  baseRadius: width * 0.8,
  noiseOpacity: 0.05, // Subtle grain
};

/**
 * PALETTE: BLUEISH THEME (Physiotherapy & Medical)
 * ------------------------------------------------
 * Focused on Trust (Blue), Healing (Teal), and Depth (Indigo).
 */
const PALETTE = {
  background: colors.slate[950], // Deep dark base

  // Orb 1: Fresh Medical Blue (Sky -> Cyan)
  orb1Start: colors.sky[500],
  orb1End: colors.cyan[600],

  // Orb 2: Deep Professional Blue (Blue -> Indigo)
  orb2Start: colors.blue[600],
  orb2End: colors.indigo[600],

  // Orb 3: Healing Teal Accent (Teal -> Emerald)
  orb3Start: colors.teal[500],
  orb3End: colors.emerald[500],

  // Orb 4: Soft Calm Depth (Slate -> Blue)
  orb4Start: colors.slate[600],
  orb4End: colors.blue[500],

  // Orb 5: Vibrant Highlight (Cyan -> Blue)
  orb5Start: colors.cyan[400],
  orb5End: colors.blue[400],
};

const DynamicBackground = () => {
  // --- 1. Shared Values for Random Movement ---
  const svX1 = useSharedValue(Math.random());
  const svY1 = useSharedValue(Math.random());
  const svX2 = useSharedValue(Math.random());
  const svY2 = useSharedValue(Math.random());
  const svX3 = useSharedValue(Math.random());
  const svY3 = useSharedValue(Math.random());
  const svX4 = useSharedValue(Math.random());
  const svY4 = useSharedValue(Math.random());
  const svX5 = useSharedValue(Math.random());
  const svY5 = useSharedValue(Math.random());

  // Shared Values for Color Cycle
  const cProg1 = useSharedValue(0);
  const cProg2 = useSharedValue(0);

  const easeInOut = Easing.inOut(Easing.ease);

  const startWandering = (sv: SharedValue<number>, durationBase: number) => {
    sv.value = withRepeat(
      withTiming(Math.random(), {
        duration: durationBase + Math.random() * 2000,
        easing: easeInOut,
      }),
      -1,
      true
    );
  };

  useEffect(() => {
    // 2. Trigger Animations
    startWandering(svX1, CONFIG.durationBase);
    startWandering(svY1, CONFIG.durationBase * 1.1);
    startWandering(svX2, CONFIG.durationBase * 1.2);
    startWandering(svY2, CONFIG.durationBase * 0.9);
    startWandering(svX3, CONFIG.durationBase * 1.3);
    startWandering(svY3, CONFIG.durationBase * 1.15);
    startWandering(svX4, CONFIG.durationBase * 1.4);
    startWandering(svY4, CONFIG.durationBase * 1.05);
    startWandering(svX5, CONFIG.durationBase * 1.25);
    startWandering(svY5, CONFIG.durationBase * 1.35);

    // Color shifting cycles
    cProg1.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.linear }),
      -1,
      true
    );
    cProg2.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  // --- 3. Derived Computations ---

  const c1 = useDerivedValue(() =>
    vec(svX1.value * width * 1.2 - width * 0.1, svY1.value * height * 0.6)
  );
  const c2 = useDerivedValue(() =>
    vec(
      svX2.value * width * 1.2 - width * 0.1,
      height * 0.4 + svY2.value * height * 0.6
    )
  );
  const c3 = useDerivedValue(() =>
    vec(svX3.value * width * 0.6, svY3.value * height)
  );
  const c4 = useDerivedValue(() =>
    vec(width * 0.4 + svX4.value * width * 0.6, svY4.value * height)
  );
  const c5 = useDerivedValue(() =>
    vec(
      width / 2 + (svX5.value - 0.5) * width * 0.5,
      height / 2 + (svY5.value - 0.5) * height * 0.5
    )
  );

  // Derived Colors
  const color1 = useDerivedValue(() =>
    interpolateColor(cProg1.value, [0, 1], [PALETTE.orb1Start, PALETTE.orb1End])
  );
  const color2 = useDerivedValue(() =>
    interpolateColor(cProg2.value, [0, 1], [PALETTE.orb2Start, PALETTE.orb2End])
  );
  const color3 = useDerivedValue(() =>
    interpolateColor(cProg1.value, [0, 1], [PALETTE.orb3Start, PALETTE.orb3End])
  );
  const color4 = useDerivedValue(() =>
    interpolateColor(cProg2.value, [0, 1], [PALETTE.orb4Start, PALETTE.orb4End])
  );
  const color5 = useDerivedValue(() =>
    interpolateColor(cProg1.value, [0, 1], [PALETTE.orb5Start, PALETTE.orb5End])
  );

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1 }}>
        {/* Layer 1: Solid Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={PALETTE.background}
        />

        {/* Layer 2: Vignette (Darken edges) - Uses Deep Blue instead of pure black */}
        <Rect x={0} y={0} width={width} height={height} opacity={1}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={[colors.slate[900], "black"]}
          />
        </Rect>

        {/* Layer 3: The Orbs */}
        <Circle c={c1} r={CONFIG.baseRadius} color={color1} opacity={0.7}>
          <BlurMask blur={CONFIG.blurRadius} style="normal" />
        </Circle>

        <Circle c={c2} r={CONFIG.baseRadius * 1.1} color={color2} opacity={0.6}>
          <BlurMask blur={CONFIG.blurRadius} style="normal" />
        </Circle>

        <Circle c={c3} r={CONFIG.baseRadius * 0.9} color={color3} opacity={0.5}>
          <BlurMask blur={CONFIG.blurRadius} style="normal" />
        </Circle>

        <Circle
          c={c4}
          r={CONFIG.baseRadius * 0.95}
          color={color4}
          opacity={0.6}
        >
          <BlurMask blur={CONFIG.blurRadius} style="normal" />
        </Circle>

        <Circle c={c5} r={CONFIG.baseRadius * 0.7} color={color5} opacity={0.8}>
          <BlurMask blur={CONFIG.blurRadius * 0.8} style="normal" />
        </Circle>

        {/* Layer 4: Noise Texture */}
        <BackdropFilter
          filter={<FractalNoise freqX={0.6} freqY={0.6} octaves={4} />}
          clip={{ x: 0, y: 0, width, height }}
        >
          <Fill color={`rgba(0,0,0,${CONFIG.noiseOpacity})`} />
        </BackdropFilter>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.slate[950],
  },
});

export default DynamicBackground;
