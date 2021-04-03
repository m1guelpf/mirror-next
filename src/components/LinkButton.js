import Link from 'next/link'
import { useTheme } from '@/context/theme'

const LinkButton = ({ children, ...props }) => {
	const { accentColor } = useTheme()

	return (
		<Link {...props}>
			<a {...props} className={`${getClasses(accentColor)} dark:bg-opacity-20 font-medium rounded-lg p-4 hover:ring-4 dark:ring-opacity-20 transition duration-300 text-base shadow-xs hover:shadow-xs sm:text-lg sm:px-10`}>
				{children}
			</a>
		</Link>
	)
}

const getClasses = accentColor => {
	switch (accentColor) {
		case 'yellow':
			return 'bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-300 ring-yellow-100 dark:ring-yellow-400'
		case 'purple':
			return 'bg-fuchsia-100 dark:bg-fuchsia-400 text-fuchsia-500 dark:text-fuchsia-300 ring-fuchsia-100 dark:ring-fuchsia-400'
		case 'pink':
		case 'red':
			return 'bg-red-100 dark:bg-red-400 text-red-500 dark:text-red-300 ring-red-100 dark:ring-red-400'
		case 'orange':
			return 'bg-orange-100 dark:bg-orange-400 text-orange-500 dark:text-orange-300 ring-orange-100 dark:ring-orange-400'
		case 'teal':
			return 'bg-cyan-100 dark:bg-cyan-400 text-cyan-500 dark:text-cyan-300 ring-cyan-100 dark:ring-cyan-400'
		case 'indigo':
			return 'bg-indigo-100 dark:bg-indigo-400 text-indigo-500 dark:text-indigo-300 ring-indigo-100 dark:ring-indigo-400'
		case 'green':
			return 'bg-emerald-100 dark:bg-emerald-400 text-emerald-500 dark:text-emerald-300 ring-emerald-100 dark:ring-emerald-400'
		case 'foreground':
			return 'bg-white text-white ring-white'

		case 'blue':
		default:
			return 'bg-blue-100 dark:bg-blue-400 text-blue-500 dark:text-blue-300 ring-blue-100 dark:ring-blue-400'
	}
}

export default LinkButton
