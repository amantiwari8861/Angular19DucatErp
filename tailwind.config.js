/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          softer: "#EFF6FF",
          strong: "#1D4ED8",
        },
        "neutral-primary-soft": "#F3F4F6",
        "fg-brand-strong": "#0A0A0A",
      },
      borderColor: {
        DEFAULT: "#E5E7EB",
        "brand-subtle": "#C7D2FE",
      },
      borderRadius: {
        base: "12px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
      },
      fontSize: {
        heading: "1.25rem",
      }
    }
  },
  plugins: [],
};
