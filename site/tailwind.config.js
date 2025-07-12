/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode based on the presence of the 'dark' class in the HTML tag
  darkMode: 'class',
  // Configure files to scan for Tailwind CSS classes
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  // Extend the default Tailwind CSS theme
  theme: {
    extend: {
      // Define custom color palette
      colors: {
        // DARK THEME COLORS
        'unidark-bg': '#111827', // Dark background
        'unidark-bg-gradient-from': '#111827', // Gradient start for dark background
        'unidark-bg-gradient-via': '#1F2937', // Gradient middle for dark background
        'unidark-bg-gradient-to': '#1E1E1E', // Gradient end for dark background
        'unidark-card': '#1F2937', // Dark card background
        'unidark-card-alt': '#111827', // Alternative dark card background
        'unidark-card-deep': '#2A2A2A', // Deeper dark card background
        'unidark-accent-gold': '#FFD301', // Gold accent color for dark theme
        'unidark-accent-gold-30': 'rgba(255, 211, 1, 0.3)', // Gold accent with 30% opacity
        'unidark-accent-gold-20': 'rgba(255, 211, 1, 0.2)', // Gold accent with 20% opacity
        'unidark-accent-gold-10': 'rgba(255, 211, 1, 0.1)', // Gold accent with 10% opacity
        'unidark-accent-red': '#FF3B3B', // Red accent color for dark theme
        'unidark-accent-red-bright': '#FF5252', // Bright red accent for dark theme
        'unidark-accent-red-30': 'rgba(255, 59, 59, 0.3)', // Red accent with 30% opacity
        'unidark-accent-rose': '#FF3B3B', // Rose accent color for dark theme
        'unidark-accent-maroon': '#7B2222', // Maroon accent color for dark theme
        'unidark-text-base': '#F3F4F6', // Base text color for dark theme
        'unidark-text-100': '#F9FAFB', // Lighter text color for dark theme
        'unidark-text-200': '#E5E7EB', // Slightly lighter text color for dark theme
        'unidark-text-300': '#D1D5DB', // Medium text color for dark theme
        'unidark-text-400': '#9CA3AF', // Darker text color for dark theme
        'unidark-shadow': 'rgba(255, 211, 1, 0.2)', // Shadow color for dark theme
        'unidark-border-gold': '#FFD301', // Gold border color for dark theme
        'unidark-border-gold-30': 'rgba(255, 211, 1, 0.3)', // Gold border with 30% opacity
        'unidark-border-gold-10': 'rgba(255, 211, 1, 0.1)', // Gold border with 10% opacity
        'unidark-border-red-30': 'rgba(255, 59, 59, 0.3)', // Red border with 30% opacity
        'unidark-border-rose-30': 'rgba(255, 59, 59, 0.3)', // Rose border with 30% opacity

        // LIGHT THEME COLORS
        'unilight-bg': '#FFF8F0', // Light background
        'unilight-bg-gradient-from': '#FFF8F0', // Gradient start for light background
        'unilight-bg-gradient-to': '#FFEBEE', // Gradient end for light background
        'unilight-card': '#FFFFFF', // Light card background
        'unilight-card-amber-100': '#FEF3C7', // Amber card background (light)
        'unilight-card-amber-50': '#FFFBEB', // Lighter amber card background (light)
        'unilight-card-rose-100': '#FFEBEE', // Rose card background (light)
        'unilight-card-rose-50': '#FFF1F2', // Lighter rose card background (light)
        'unilight-accent-amber': '#FFB300', // Amber accent color for light theme
        'unilight-accent-amber-400': '#FFB300', // Amber accent 400
        'unilight-accent-amber-500': '#FFA000', // Amber accent 500
        'unilight-accent-amber-600': '#FF8F00', // Amber accent 600
        'unilight-accent-amber-700': '#FF6F00', // Amber accent 700
        'unilight-accent-amber-800': '#E65100', // Amber accent 800
        'unilight-accent-red': '#FF3B3B', // Red accent color for light theme
        'unilight-accent-red-bright': '#FF5252', // Bright red accent for light theme
        'unilight-accent-rose-400': '#FF3B3B', // Rose accent 400
        'unilight-accent-rose-500': '#FF3B3B', // Rose accent 500
        'unilight-accent-rose-600': '#E53935', // Rose accent 600
        'unilight-accent-rose-700': '#D32F2F', // Rose accent 700
        'unilight-accent-rose-800': '#C62828', // Rose accent 800
        'unilight-accent-maroon': '#7B2222', // Maroon accent color for light theme
        'unilight-text-800': '#1F2937', // Darkest text color for light theme
        'unilight-text-700': '#374151', // Darker text color for light theme
        'unilight-text-600': '#4B5563', // Medium text color for light theme
        'unilight-text-500': '#6B7280', // Lighter text color for light theme
        'unilight-shadow': 'rgba(0, 0, 0, 0.1)', // Shadow color for light theme
        'unilight-border-white': '#FFFFFF', // White border color for light theme
        'unilight-border-gray-100': '#F3F4F6', // Light gray border color
        'unilight-border-gray-200': '#E5E7EB', // Slightly darker gray border color
        'unilight-border-rose-200': '#FFCDD2', // Rose border color (light)

        // GRADIENTS
        'unigradient-gold-red': 'linear-gradient(to right, #FFD301, #FF3B3B)', // Gold to red gradient
        'unigradient-red-gold': 'linear-gradient(to right, #FF3B3B, #FFD301)', // Red to gold gradient
        'unigradient-amber-rose': 'linear-gradient(to right, #FFB300, #FF3B3B)', // Amber to rose gradient
        'unigradient-amber-rose-400': 'linear-gradient(to right, #FFB300, #FF3B3B)', // Amber to rose gradient 400
        'unigradient-red-bright-gold': 'linear-gradient(to right, #FF5252, #FFD301)', // Bright red to gold gradient
        'unigradient-black-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)', // Black overlay gradient
        
        // UTILITIES
        'unilight-placeholder-bg': '#FFEBEE', // Placeholder background for light theme
        'unilight-placeholder-text': '#D32F2F', // Placeholder text for light theme
        'unidark-placeholder-bg': '#1F2937', // Placeholder background for dark theme
        'unidark-placeholder-text': '#FFD301', // Placeholder text for dark theme
      },
      // Custom box shadows
      boxShadow: {
        'gold-glow': '0 4px 16px 0 rgba(255, 211, 1, 0.3)', // Gold glow shadow
        'rose-glow': '0 4px 16px 0 rgba(255, 59, 59, 0.25)', // Rose glow shadow
        'amber-glow': '0 4px 16px 0 rgba(255, 179, 0, 0.3)', // Amber glow shadow
      },
      // Custom transition properties
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke', // Colors transition
        'transform': 'transform', // Transform transition
      },
      // Custom background images (gradients)
      backgroundImage: {
        'gold-red-gradient': 'linear-gradient(to right, #FFD301, #FF3B3B)', // Gold to red background gradient
        'red-gold-gradient': 'linear-gradient(to right, #FF3B3B, #FFD301)', // Red to gold background gradient
      },
    },
  },
  // Add any Tailwind CSS plugins here
  plugins: [],
};
