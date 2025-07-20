module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    theme: {
      screens: {
        xl: { min: "1281px" },
        lg: { max: "1280px" },
        md: { max: "1024px" },
        sm: { max: "639px" },
      },
      extend: {},
    },
  },
  plugins: [],
};
