export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        brand: { DEFAULT: "#0b3d36", light: "#134e45" },
        rust: "#b13a16",
        lavender: { DEFAULT: "#f5f4ff", dark: "#eeecfd", btn: "#dfe2fa" },
      },
    },
  },
  plugins: [],
};