/** @type {import('tailwindcss').Config} */
// Todo el estilo del prototipo vive en estos tokens y en src/components/ui.jsx.
// Para reestilizar: cambia colores, fuentes y radios aquí.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens según /mnt/project-files/hackathon/mvp/diseno-valencia.md (paleta propia, contrastes AA calculados)
      colors: {
        primary: {
          50: "#EEF3FA",
          100: "#DCE7F5",
          200: "#B9CDE8",
          500: "#2F63A8",
          600: "#1F4E8C",
          700: "#1F4E8C",
          800: "#14325C",
          900: "#0F2747",
        },
        accent: {
          50: "#FFF1EA",
          100: "#FFDCCB",
          500: "#D14A12",
          600: "#B93A0B",
          700: "#8F2C08",
        },
        gold: "#F5B800",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F7FB",
          line: "#D5DDE8",
          strong: "#8794A8",
        },
        ink: {
          DEFAULT: "#1B2433",
          soft: "#4A5568",
        },
        ok: { 50: "#E6F4EA", 600: "#166534", 700: "#166534" },
        warn: { 50: "#FFF4D6", 200: "#E8C877", 700: "#7A4B00" },
        level: {
          estado: "#EFEAFB",
          generalitat: "#FCE7F3",
          local: "#E3ECF8",
        },
      },
      // Mínimos de legibilidad: texto secundario >= 15 px, meta >= 14 px (también en móvil)
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['0.9375rem', { lineHeight: '1.375rem' }],
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "\"Segoe UI\"", "Roboto", "Arial", "sans-serif"],
        display: ["Inter", "system-ui", "\"Segoe UI\"", "Roboto", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        control: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,50,92,.06), 0 2px 8px rgba(20,50,92,.06)",
        panel: "0 8px 24px rgba(20,50,92,.16)",
      },
    },
  },
  plugins: [],
}
