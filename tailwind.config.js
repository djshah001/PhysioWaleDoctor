const { default: colors } = require("./constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        pthin: ["Poppins_100Thin", "sans-serif"],
        pextralight: ["Poppins_200ExtraLight", "sans-serif"],
        plight: ["Poppins_300Light", "sans-serif"],
        pregular: ["Poppins_400Regular", "sans-serif"],
        pmedium: ["Poppins_500Medium", "sans-serif"],
        psemibold: ["Poppins_600SemiBold", "sans-serif"],
        pbold: ["Poppins_700Bold", "sans-serif"],
        pextrabold: ["Poppins_800ExtraBold", "sans-serif"],
        pblack: ["Poppins_900Black", "sans-serif"],
        osbold: ["OpenSans_700Bold", "sans-serif"],
        osextrabold: ["OpenSans_800ExtraBold", "sans-serif"],
        osmedium: ["OpenSans_500Medium", "sans-serif"],
        osregular: ["OpenSans_400Regular", "sans-serif"],
        ossemibold: ["OpenSans_600SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
