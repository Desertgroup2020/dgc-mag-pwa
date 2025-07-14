import type { Config } from "tailwindcss"

const config = {
    darkMode: ['class'],
    // darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	fontFamily: {
  		mons: ['var(--font_montserrat)']
  	},
  	fontWeight: {
  		'400': 'var(--weight_normal)',
  		'500': 'var(--weight_medium)',
  		'600': 'var(--weight_semi)',
  		'700': 'var(--weight_bold)'
  	},
  	fontSize: {
  		h1: ['2.375rem', {lineHeight: '2.75rem', fontWeight: "var(--weight_bold)"}],
  		h2: ['1.875rem', {lineHeight: '2rem', fontWeight: "var(--weight_bold)"}],
  		h3: ['1.5rem', {lineHeight: '2rem'}],
  		header_font: ['0.875rem', {lineHeight: '1.2'}],
  		cat_font: ['1.125rem', {lineHeight: '2rem', fontWeight: 'var(--weight_semi)'}],
  		btn_txt: ['0.875rem', {lineHeight: '1.2', fontWeight: 'var(--weight_medium)'}],
  		pcard_num: ['0.6875rem', {lineHeight: '1.2', fontWeight: 'var(--weight_medium)'}],
  		pcard_title: ['0.875rem', {lineHeight: '1.2', fontWeight: 'var(--weight_bold)'}],
  		pcard_old_price: ['0.875rem', {lineHeight: '1.2', fontWeight: 'var(--weight_bold)'}],
  		pcard_price: ['1rem', {lineHeight: '1.2', fontWeight: 'var(--weight_bold)'}]
  	},
  	container: {
  		center: true,
  		padding: '1.25rem',
  		screens: {
  			'desktop': '1516px',
  			'laptop': '1200px'
  		}
  	},
  	screens: {
  		'desktop': {
  			max: '1600px'
  		},
  		'laptop': {
  			max: '1400px'
  		},
  		'ipadpro': {
  			max: '1200px'
  		},
  		'ipad': {
  			max: '991px'
  		},
  		'mobile': {
  			max: '767px'
  		},
		'desk_only':{
			min: '992px'
		},
		'mobile_only':{
			max: '991px'
		},
  	},
  	spacing: {
  		'0': '0',
  		'1': '0.5rem',
  		'2': '1rem',
  		'3': '1.5rem',
  		'4': '2rem',
  		'5': '2.5rem',
  		'6': '3rem',
  		'7': '3.5rem',
  		'8': '4rem',
  		'h1_btm': '0.6em',
  		'h2_btm': '1em'
  	},
  	backgroundImage: {
  		gradiant_slider: 'linear-gradient(0deg, rgba(0, 0, 0, 0.79) 0%, rgba(0, 0, 0, 0.00) 120.89%)',
  		skeleton_gradiant_slider: 'linear-gradient(0deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.00) 120.89%)'
  	},
  	backdropBlur: {
  		blur_slider: 'blur(3px)'
  	},
  	extend: {
  		colors: {
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			btn_rounded: '22.47px',
  			btn_sqr: '1.84px'
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
  			},
  			'caret-blink': {
  				'0%,70%,100%': {
  					opacity: '1'
  				},
  				'20%,50%': {
  					opacity: '0'
  				}
  			},
  			
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'caret-blink': 'caret-blink 1.25s ease-out infinite',  			
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config