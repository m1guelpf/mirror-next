'use client'

import Embed from 'react-embed'
import NextImage from 'next/image'
import NFT from '@/components/NFT'
import { shouldEmbed } from './embeds'
import getConfig from '@/hooks/getConfig'
import { useTheme } from '@/context/theme'
import Zoom from 'react-medium-image-zoom'
import OpenGraph from '@/components/OpenGraph'
import EntryLink from '@/components/EntryLink'
import { useImageSizes } from '@/context/image_sizes'

export const Image = ({ alt, src }) => {
	const { colorMode } = useTheme()
	const {
		[src]: { width, height },
	} = useImageSizes()

	return (
		<figure>
			<Zoom
				wrapElement="span"
				wrapStyle={{ width: '100%' }}
				overlayBgColorStart={colorMode == 'DARK' ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)'}
				overlayBgColorEnd={colorMode == 'DARK' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'}
			>
				<NextImage width={width} height={height} alt={alt} src={src} />
			</Zoom>
			{alt && <figcaption>{alt}</figcaption>}
		</figure>
	)
}

export const LinkOrEmbed = ({ href, children, ...props }) => {
	const { colorMode } = useTheme()
	const { ensDomain } = getConfig()

	const blockSize = props?.node?.blockSize
	if (blockSize != 1) return <EntryLink href={href}>{children}</EntryLink>

	const parsedURL = new URL(href)
	if (parsedURL.protocol === 'nft:') {
		const [chainId, contract, tokenId] = parsedURL.pathname.replace(/^\/+/, '').split('/')

		return <NFT chainId={chainId} contract={contract} tokenId={tokenId} />
	}

	if (parsedURL.protocol === 'crowdfund:') {
		const [, crowdfundAddress] = href.match(/crowdfund:\/\/(\w*)/m)

		return <EntryLink href={`https://${ensDomain}.mirror.xyz/crowdfunds/${crowdfundAddress}`}>{children}</EntryLink>
	}

	if (typeof window !== 'undefined' && shouldEmbed(href)) {
		return <Embed url={href} isDark={colorMode === 'DARK'} />
	}

	return <OpenGraph url={href}>{children}</OpenGraph>
}

const getClass = (accentColor: string): string => {
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

export const BlockQuote = ({ children }) => {
	const { accent } = useTheme()

	return <blockquote className={getClass(accent)}>{children}</blockquote>
}

export const Block = ({ children }) => {
	children = Array.isArray(children) ? children : [children]

	const blockAwareChildren = children.map(child => {
		if (child?.props?.node) child.props.node.blockSize = children.length

		return child
	})

	return <p>{blockAwareChildren}</p>
}
