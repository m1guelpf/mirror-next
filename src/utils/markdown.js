import Link from 'next/link'
import Embed from 'react-embed'
import Zoom from 'react-medium-image-zoom'
import { useTheme } from '@/context/theme'
import { getConfig } from '@/hooks/getConfig'
import { shouldEmbed } from './embeds'
import NextImage from 'next/image'
import { useImageSizes } from '@/context/image_sizes'
import { NFTE } from '@nfte/react'

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

const LinkOrEmbed = ({ href, children, node: { blockSize } }) => {
	const { ensDomain } = getConfig()
	const { theme, accentColor } = useTheme()

	if (new URL(href).protocol === 'ethereum:' && blockSize == 1) {
		const [contract, tokenId] = new URL(href).pathname.substring(2).split('/')

		return <NFTE contract={contract} tokenId={tokenId} darkMode={theme === 'dark'} className="mx-auto" style={{ '--nfte-colors-bg': 'black' }} />
	}

	if (typeof window !== 'undefined' && blockSize == 1 && shouldEmbed(href)) {
		return <Embed url={href} isDark={theme === 'dark'} />
	}

	if (href.startsWith(`${ensDomain}.mirror.xyz`) || href.startsWith('/') || (typeof window !== 'undefined' && href.startsWith(window.location.origin))) {
		return (
			<Link href={href}>
				<a className={getClass(accentColor)}>{children}</a>
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
