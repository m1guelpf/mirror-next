import Link from 'next/link'
import Embed from 'react-embed'
import Zoom from 'react-medium-image-zoom'
import { useTheme } from '../context/theme'
import { getConfig } from '../hooks/getConfig'
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

const LinkOrEmbed = ({ href, children }) => {
	const { ensDomain } = getConfig()
	const theme = useTheme()

	if (typeof window !== 'undefined' && children.length == 0 && shouldEmbed(href)) {
		return <Embed url={href} isDark={theme === 'dark'} />
	}

	if (href.startsWith(`${ensDomain}.mirror.xyz`) || href.startsWith('/') || (typeof window !== 'undefined' && href.startsWith(window.location.origin))) {
		return (
			<Link href={href}>
				<a>{children}</a>
			</Link>
		)
	}

	return (
		// eslint-disable-next-line react/jsx-no-target-blank
		<a href={href} target={href.startsWith('#') ? '' : '_blank'} rel="noopener">
			{children || 'hello'}
		</a>
	)
}

export const components = {
	image: Image,
	link: LinkOrEmbed,
}
