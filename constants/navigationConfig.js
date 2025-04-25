// Common navigation configuration to ensure consistent transitions
export const defaultScreenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300, // Consistent animation duration
};

// Animation configuration for modal screens
export const modalScreenOptions = {
  headerShown: false,
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: { backgroundColor: 'white' },
  animationDuration: 300,
};

// Animation configuration for tab screens
export const tabScreenOptions = {
  headerShown: false,
  animation: "fade",
  contentStyle: { backgroundColor: 'white' },
};

// Shared transition specification for screens
export const screenTransition = {
  screenOptions: {
    ...defaultScreenOptions,
    gestureEnabled: true,
    gestureDirection: "horizontal",
  },
};
