const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	purge: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				gray: colors.trueGray,
			},
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
				mono: ['iAWriter Mono', ...defaultTheme.fontFamily.mono],
			},
			typography: theme => ({
				DEFAULT: {
					css: {
						figcaption: {
							textAlign: 'center',
						},
						strong: {
							fontWeight: theme('fontWeight.medium'),
						},
						// Image margin is handled by `figure`
						img: {
							marginTop: null,
							marginBottom: null,
						},
						a: {
							color: theme('colors.blue.600'),
							wordWrap: 'break-word',
							fontWeight: theme('fontWeight.normal'),
							textDecoration: 'none',
							textUnderlineOffset: '0.2em',
							'&:hover': {
								textDecoration: 'underline',
							},
						},
						'ol > li::before': {
							fontFamily: theme('fontFamily.mono').join(', '),
							color: theme('colors.gray.400'),
						},
						'.twitter-tweet': {
							marginLeft: 'auto',
							marginRight: 'auto',
						},
						code: {
							fontWeight: theme('fontWeight.normal'),
							background: theme('colors.gray.200'),
							color: theme('colors.gray.600'),
							borderRadius: theme('borderRadius.lg'),
							padding: `0.125rem ${theme('padding.1')}`,
							'&::before, &::after': {
								content: 'unset !important',
							},
						},
					},
				},
				lg: {
					css: {
						'ol > li, ul > li': {
							marginTop: '0',
							marginBottom: '0',
						},
						// Image margin is handled by `figure`
						img: {
							marginTop: null,
							marginBottom: null,
						},
					},
				},
			}),
		},
	},
	variants: {
		extend: {
			ringWidth: ['hover'],
			padding: ['hover'],
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
