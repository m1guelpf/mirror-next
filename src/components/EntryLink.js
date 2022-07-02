import Link from 'next/link'
import { useTheme } from '@/context/theme'

const EntryLink = ({ href, children, className }) => {
	const { accentColor } = useTheme()
	className = className ? className : getClass(accentColor)

	if (href.startsWith('/') || (typeof window !== 'undefined' && href.startsWith(window.location.origin))) {
		return (
			<Link href={href}>
				<a className={className}>{children}</a>
			</Link>
		)
	}

	return (
		// eslint-disable-next-line react/jsx-no-target-blank
		<a href={href} target={href.startsWith('#') ? '' : '_blank'} rel="noopener" className={className}>
			{children}
		</a>
	)
}

const getClass = accentColor => {
	switch (accentColor) {
		case 'purple':
			return '!text-fuchsia-400'
		case 'pink':
			return '!text-red-500'
		case 'red':
			return '!text-red-500'
		case 'orange':
			return '!text-orange-400'
		case 'yellow':
			return '!text-yellow-400'
		case 'teal':
			return '!text-cyan-400'
		case 'blue':
			return '!text-blue-500'
		case 'indigo':
			return '!text-indigo-400'
		case 'green':
			return '!text-emerald-400'
		case 'foreground':
			return '!text-white'

		default:
			return '!text-blue-400'
	}
}

export default EntryLink
