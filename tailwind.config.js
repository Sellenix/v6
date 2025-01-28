module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cyberpunk: {
          neon: "#00ff00",
          purple: "#800080",
          blue: "#00ffff",
          pink: "#ff00ff",
          yellow: "#ffff00",
        },
      },
      fontFamily: {
        cyberpunk: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        neon: '0 0 5px theme("colors.cyberpunk.neon"), 0 0 10px theme("colors.cyberpunk.neon")',
      },
      animation: {
        glow: "glow 1s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          from: { textShadow: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00ff00, 0 0 20px #00ff00" },
          to: { textShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ff00, 0 0 40px #00ff00" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

