export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#0b3d36",
          50: "#f0f7f5",
          100: "#d9ede8",
          200: "#b6ded5",
          300: "#8ac7bc",
          400: "#5baaa0",
          500: "#3d8f85",
          600: "#2d726a",
          700: "#1b5a52",
          800: "#0b3d36",
          900: "#072b25",
          950: "#041a16",
          light: "#134e45",
        },
        surface: "#f5f6f8",
        rust: "#b13a16",
        lavender: { DEFAULT: "#f5f4ff", dark: "#eeecfd", btn: "#dfe2fa" },
      },
    },
  },
  plugins: [],
};