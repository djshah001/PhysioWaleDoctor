const { default: colors } = require("./constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      borderWidth: {
        xsm: "1px",
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        osbold: ["OpenSans-Bold", "sans-serif"],
        osextrabold: ["OpenSans-ExtraBold", "sans-serif"],
        osmedium: ["OpenSans-Medium", "sans-serif"],
        osregular: ["OpenSans-Regular", "sans-serif"],
        ossemibold: ["OpenSans-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
