/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'


export default <Partial<Config>>{
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Koruri', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}

