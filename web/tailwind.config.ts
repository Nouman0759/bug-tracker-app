import type { Config } from "tailwindcss";

// These values are copied 1:1 from mobile/src/theme/{colors,spacing,typography}.ts
// so the web app renders the same visual language as the mobile app.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8F7FF",
        surface: "#FFFFFF",
        surfaceLight: "#F1EDFE",
        primary: { DEFAULT: "#7C3AED", dark: "#6023D4", light: "#EFE7FE" },
        text: { DEFAULT: "#1E1B34", muted: "#6E6A8C" },
        border: "#EAE5F9",
        danger: "#EF4444",
        success: "#16A34A",
        warning: "#F59E0B",
        priority: {
          low: "#16A34A",
          medium: "#F59E0B",
          high: "#F97316",
          critical: "#E11D48",
        },
        status: {
          open: "#7C3AED",
          "in-progress": "#F59E0B",
          resolved: "#16A34A",
          closed: "#8B87A8",
          reopened: "#E11D48",
        },
        accentStart: "#8B5CF6",
        accentEnd: "#6023D4",
      },
      fontSize: {
        h1: ["28px", { fontWeight: "800", letterSpacing: "-0.4px" }],
        h2: ["22px", { fontWeight: "700", letterSpacing: "-0.3px" }],
        h3: ["18px", { fontWeight: "700", letterSpacing: "-0.2px" }],
        body: ["15px", { fontWeight: "400" }],
        bodyBold: ["15px", { fontWeight: "600" }],
        caption: ["13px", { fontWeight: "400" }],
        small: ["11px", { fontWeight: "600", letterSpacing: "0.2px" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "22px",
      },
      boxShadow: {
        subtle: "0 2px 6px 0 rgba(76,29,149,0.06)",
        card: "0 6px 14px 0 rgba(76,29,149,0.10)",
        raised: "0 10px 22px 0 rgba(76,29,149,0.16)",
      },
    },
  },
  plugins: [],
};
export default config;
