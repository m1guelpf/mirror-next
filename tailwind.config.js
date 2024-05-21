import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				gray: colors.neutral,
				fuchsia: colors.fuchsia,
				orange: colors.orange,
				cyan: colors.cyan,
				emerald: colors.emerald,
			},
			fontFamily: {
				sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
				mono: ['iAWriter Mono', ...defaultTheme.fontFamily.mono],
			},
			boxShadow: {
				card: '0 0 0.5rem rgba(0, 0, 0, 0.075)',
			},
			typography: theme => ({
				DEFAULT: {
					css: {
						whiteSpace: 'pre-wrap',
						'> *, blockquote > *': {
							marginTop: '0 !important',
							marginBottom: '0 !important',
						},
						figcaption: {
							textAlign: 'center',
						},
						strong: {
							fontWeight: theme('fontWeight.medium'),
						},
						img: {
							marginTop: null,
							marginBottom: null,
							borderRadius: theme('borderRadius.lg'),
						},
						blockquote: {
							display: 'flex',
							fontStyle: null,
							borderLeftWidth: '2px',
							borderColor: theme('colors.blue.600'),
							fontWeight: theme('fontWeight.normal'),
						},
						hr: {
							borderTopWidth: '2px',
							maxWidth: '12rem',
							marginLeft: 'auto',
							marginRight: 'auto',
						},
						'blockquote p:first-of-type::before, blockquote p:last-of-type::after': {
							content: 'unset !important',
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
						'ul > li::before': {
							backgroundColor: theme('colors.gray.400'),
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
						'[data-nft] *, .opengraph *, .opengraph *:hover': {
							margin: '0',
							textDecoration: 'none',
							borderRadius: 'unset',
						},
					},
				},
				dark: {
					css: {
						color: theme('colors.gray.300'),
						strong: {
							color: theme('colors.gray.300'),
						},
						'h1, h2, h3, h4, h5, h6': {
							color: theme('colors.gray.200'),
						},
						blockquote: {
							color: theme('colors.gray.300'),
							borderColor: theme('colors.yellow.400'),
						},
						'ol > li::before': {
							color: theme('colors.gray.500'),
						},
						'ul > li::before': {
							backgroundColor: theme('colors.gray.600'),
						},
						':not(pre) > code': {
							background: theme('colors.gray.800'),
							color: 'unset',
						},
						hr: {
							borderColor: theme('colors.gray.700'),
							opacity: '0.6',
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
	plugins: [require('@tailwindcss/typography')],
}
