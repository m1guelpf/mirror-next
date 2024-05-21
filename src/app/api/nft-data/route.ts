import ERC721 from '@/data/ERC721'
import { NextRequest, NextResponse } from 'next/server'
import { mainnet, base, optimism, zora, polygon } from 'viem/chains'
import { createPublicClient, http, getContract, extractChain } from 'viem'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const chainId = request.nextUrl.searchParams.get('chain')
	const tokenId = request.nextUrl.searchParams.get('tokenId') as bigint | null
	const contractAddress = request.nextUrl.searchParams.get('contract') as `0x${string}` | null

	if (!chainId || !contractAddress || !tokenId) {
		return NextResponse.json({ error: 'Missing chain, contract or tokendId parameters' }, { status: 400 })
	}

	const chain = extractChain({
		// @ts-ignore
		id: parseInt(chainId),
		chains: [mainnet, base, optimism, zora, polygon],
	})

	const contract = getContract({
		abi: ERC721,
		address: contractAddress,
		client: createPublicClient({ chain, transport: http() }),
	})

	const token = await fetch(buildURL(await contract.read.tokenURI([tokenId]))).then(res => res.json())

	return NextResponse.json({
		...token,
		tokenId,
		contractAddress,
		image: buildURL(token.image),
		mimeType: await getMimeType(buildURL(token.image)),
	})
}

const buildURL = (rawURL: string): string => {
	const url = new URL(rawURL)

	switch (url.protocol) {
		case 'ipfs:':
			return `https://ipfs.io/ipfs/${url.hostname}${url.pathname}`
		case 'ar:':
		case 'arweave:':
			return `https://arweave.net/${url.hostname}${url.pathname}`

		default:
			return rawURL
	}
}

const getMimeType = async (url: string): Promise<string | null> => {
	return fetch(url, { method: 'HEAD' }).then(res => res.headers.get('Content-Type'))
}
