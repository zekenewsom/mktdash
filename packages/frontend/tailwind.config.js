/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"], // Enable dark mode using the 'dark' class
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				default: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))',
    				DEFAULT: 'hsl(var(--primary))'
    			},
    			secondary: {
    				default: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))',
    				DEFAULT: 'hsl(var(--secondary))'
    			},
    			destructive: {
    				default: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))',
    				DEFAULT: 'hsl(var(--destructive))'
    			},
    			muted: {
    				default: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))',
    				DEFAULT: 'hsl(var(--muted))'
    			},
    			accent: {
    				default: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))',
    				DEFAULT: 'hsl(var(--accent))'
    			},
    			popover: {
    				default: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))',
    				DEFAULT: 'hsl(var(--popover))'
    			},
    			card: {
    				default: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))',
    				DEFAULT: 'hsl(var(--card))'
    			},
    			positive: 'hsl(142, 70%, 49%)',
    			negative: 'hsl(0, 70%, 50%)',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [
      require("tailwindcss-animate"),
      // Add shadcn/ui plugin if they provide one, or configure via manual setup
    ],
  }