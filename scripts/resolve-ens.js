/* eslint-disable no-undef */
const fs = require('fs')
const { ethers } = require('ethers')

module.exports = async () => {
	if (fs.existsSync('./src/data/ens.js')) {
		// If the author ENS wasn't set on the first run, we might have an invalid publication address.
		// This makes sure invalid addresses are re-calculated on every run instead of just the first one.
		if (!String(fs.readFileSync('./src/data/ens.js')).includes("'null'")) return
	}

	const provider = new ethers.providers.InfuraProvider('mainnet', process.env.NEXT_PUBLIC_INFURA_ID)

	const publicationAddress = await provider.resolveName(process.env.NEXT_PUBLIC_AUTHOR_ENS)

	fs.writeFileSync('./src/data/ens.js', `export const contributorAddresses = ['${publicationAddress}']\n`)
}
