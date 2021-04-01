/* eslint-disable no-undef */
const fs = require('fs')
const { ethers } = require('ethers')

module.exports = () => {
	if (fs.existsSync('./src/data/ens.js')) return

	const provider = new ethers.providers.InfuraProvider(null, process.env.INFURA_ID)

	provider.resolveName(`${process.env.ENS_DOMAIN}.mirror.xyz`).then(publicationAddress => {
		fs.writeFileSync('./src/data/ens.js', `export const publicationAddress = '${publicationAddress}'`)
	})
}
