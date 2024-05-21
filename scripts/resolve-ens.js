import fs from 'fs'
import { normalize } from 'viem/ens'
import { mainnet } from 'viem/chains'
import { createPublicClient, http } from 'viem'

export default async () => {
	if (!process.env.NEXT_PUBLIC_AUTHOR_ENS) {
		console.error('NEXT_PUBLIC_AUTHOR_ENS is not set')
	}

	if (fs.existsSync('./src/data/ens.ts')) {
		// If the author ENS wasn't set on the first run, we might have an invalid publication address.
		// This makes sure invalid addresses are re-calculated on every run instead of just the first one.
		if (!String(fs.readFileSync('./src/data/ens.ts')).includes("'null'")) return
	}

	const client = createPublicClient({ chain: mainnet, transport: http(process.env.NEXT_PUBLIC_RPC_URL) })

	const publicationAddress = await client.getEnsAddress({ name: normalize(process.env.NEXT_PUBLIC_AUTHOR_ENS) })

	fs.writeFileSync('./src/data/ens.ts', `export const contributorAddresses = ['${publicationAddress}']\n`)
}
