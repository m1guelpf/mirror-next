import Link from 'next/link'
import Embed from 'react-embed'
import Zoom from 'react-medium-image-zoom'
import { useTheme } from '@/context/theme'
import { getConfig } from '@/hooks/getConfig'
import { shouldEmbed } from './embeds'

const Image = ({ alt, src }) => {
	return (
		<figure>
			<Zoom wrapElement="span" wrapStyle={{ width: '100%' }}>
				<img src={src} />
			</Zoom>
			{alt && <figcaption>{alt}</figcaption>}
		</figure>
	)
}

const getClass = accentColor => {
	console.log(accentColor)
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

const LinkOrEmbed = ({ href, children }) => {
	const { ensDomain } = getConfig()
	const { theme, accentColor } = useTheme()

	if (typeof window !== 'undefined' && children.length == 0 && shouldEmbed(href)) {
		return <Embed url={href} isDark={theme === 'dark'} />
	}

	if (href.startsWith(`${ensDomain}.mirror.xyz`) || href.startsWith('/') || (typeof window !== 'undefined' && href.startsWith(window.location.origin))) {
		return (
			<Link href={href} className={getClass(accentColor)}>
				<a>{children}</a>
			</Link>
		)
	}

	return (
		// eslint-disable-next-line react/jsx-no-target-blank
		<a href={href} target={href.startsWith('#') ? '' : '_blank'} rel="noopener" className={getClass(accentColor)}>
			{children || 'hello'}
		</a>
	)
}

export const components = {
	image: Image,
	link: LinkOrEmbed,
}
