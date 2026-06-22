/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#f97316', // Orange 500
                    hover: '#ea580c',   // Orange 600
                    light: '#ffedd5',   // Orange 100
                },
                brand: {
                    sidebar: '#1e293b', // Slate 800
                    bg: '#0f172a',      // Slate 900
                    card: '#1e293b',    // Slate 800
                },
                secondary: '#6366f1',
                'slate-950': '#020617',
            },
            fontFamily: {
                display: ['Inter', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
