import Link from 'next/link'
import Embed from 'react-embed'
import Zoom from 'react-medium-image-zoom'
import { useTheme } from '@/context/theme'
import { getConfig } from '@/hooks/getConfig'
import { shouldEmbed } from './embeds'
import NextImage from 'next/image'
import { useImageSizes } from '@/context/image_sizes'
import { NFTE } from '@nfte/react'
import OpenGraph from '@/components/OpenGraph'
import EntryLink from '@/components/EntryLink'

const Image = ({ alt, src }) => {
	const { theme } = useTheme()
	const {
		[src]: { width, height },
	} = useImageSizes()

	return (
		<figure>
			<Zoom wrapElement="span" wrapStyle={{ width: '100%' }} overlayBgColorStart={theme == 'dark' ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)'} overlayBgColorEnd={theme == 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'}>
				<NextImage width={width} height={height} src={src} />
			</Zoom>
			{alt && <figcaption>{alt}</figcaption>}
		</figure>
	)
}

const LinkOrEmbed = ({ href, children, node: { blockSize } }) => {
	const { theme } = useTheme()

	if (blockSize != 1) return <EntryLink href={href}>{children}</EntryLink>

	if (new URL(href).protocol === 'ethereum:') {
		const [contract, tokenId] = new URL(href).pathname.substring(2).split('/')

		return <NFTE contract={contract} tokenId={tokenId} darkMode={theme === 'dark'} className="mx-auto" style={{ '--nfte-colors-bg': 'black' }} apiUrl="/api/nft-data" />
	}

	if (typeof window !== 'undefined' && shouldEmbed(href)) {
		return <Embed url={href} isDark={theme === 'dark'} />
	}

	return <OpenGraph url={href}>{children}</OpenGraph>
}

const getClass = accentColor => {
	switch (accentColor) {
		case 'purple':
			return '!border-fuchsia-400'
		case 'pink':
			return '!border-red-500'
		case 'red':
			return '!border-red-500'
		case 'orange':
			return '!border-orange-400'
		case 'yellow':
			return '!border-yellow-400'
		case 'teal':
			return '!border-cyan-400'
		case 'blue':
			return '!border-blue-500'
		case 'indigo':
			return '!border-indigo-400'
		case 'green':
			return '!border-emerald-400'
		case 'foreground':
			return '!border-white'

		default:
			return '!border-blue-400'
	}
}

const BlockQuote = ({ children }) => {
	const { accentColor } = useTheme()

	return <blockquote className={getClass(accentColor)}>{children}</blockquote>
}

const Block = ({ children }) => {
	const blockAwareChildren = children.map(child => {
		if (child.props.node) child.props.node.blockSize = children.length

		return child
	})

	return <p>{blockAwareChildren}</p>
}

export const components = {
	image: Image,
	link: LinkOrEmbed,
	blockquote: BlockQuote,
	paragraph: Block,
}

const allowedLinkProtocols = ['http', 'https', 'mailto', 'tel', 'ethereum']

export const uriTransformer = uri => {
	const url = (uri || '').trim()
	const first = url.charAt(0)

	if (first === '#' || first === '/') {
		return url
	}

	const colon = url.indexOf(':')
	if (colon === -1) {
		return url
	}

	const length = allowedLinkProtocols.length
	let index = -1

	while (++index < length) {
		const protocol = allowedLinkProtocols[index]

		if (colon === protocol.length && url.slice(0, protocol.length).toLowerCase() === protocol) {
			return url
		}
	}

	index = url.indexOf('?')
	if (index !== -1 && colon > index) {
		return url
	}

	index = url.indexOf('#')
	if (index !== -1 && colon > index) {
		return url
	}

	return '#'
}
