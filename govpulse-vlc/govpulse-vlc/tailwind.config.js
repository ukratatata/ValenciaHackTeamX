/** @type {import('tailwindcss').Config} */
// Todo el estilo del prototipo vive en estos tokens y en src/components/ui.jsx.
// Para reestilizar: cambia colores, fuentes y radios aquí.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens según /mnt/project-files/hackathon/mvp/diseno-valencia.md (paleta propia, contrastes AA calculados)
      colors: {
        // v2 (alineado con valencia.es): amarillo de marca + negro cálido. "primary" ahora es la escala
        // oscura/neutra (texto, bordes, hover); el amarillo vive en "gold". Amarillo SIEMPRE con texto #1A1A1A.
        primary: {
          50: "#FFF8DB",
          100: "#FFEFB0",
          200: "#BDBDBD",
          500: "#6B6B6B",
          600: "#333333",
          700: "#1A1A1A",
          800: "#1A1A1A",
          900: "#111111",
        },
        // Rojo del escudo: solo acentos de alerta ("Nuevo", banda de prototipo, cifra del resguardo)
        accent: {
          50: "#FDECEE",
          100: "#F9D3D8",
          500: "#C8102E",
          600: "#C8102E",
          700: "#A20D25",
        },
        gold: { DEFAULT: "#FFCC29", dark: "#F2BE12", soft: "#FFF3BF" },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F5F5",
          line: "#D9D9D9",
          strong: "#767676",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#4A4A4A",
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
        sans: ["Montserrat", "system-ui", "\"Segoe UI\"", "Roboto", "Arial", "sans-serif"],
        display: ["Montserrat", "system-ui", "\"Segoe UI\"", "Roboto", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        control: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.06)",
        panel: "0 8px 24px rgba(0,0,0,.18)",
      },
    },
  },
  plugins: [],
}
