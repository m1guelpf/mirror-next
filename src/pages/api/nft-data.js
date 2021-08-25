import { NFTData } from '@nfte/handler'
import { ethers } from 'ethers'

export default async ({ query: { contract, tokenId } }, res) => {
	if (!contract || !tokenId) return res.status(400).json({ error: 'Missing contract or tokendId parameters' })

	res.setHeader('Cache-Control', 's-maxage=86400')

	// eslint-disable-next-line no-undef
	const nftData = new NFTData({ provider: new ethers.providers.CloudflareProvider(), historicalProvider: new ethers.providers.InfuraProvider(null, process.env.NEXT_PUBLIC_INFURA_ID) })

	res.json(await nftData.getData({ contract, tokenId }))
}
