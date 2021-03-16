import { ethers } from 'ethers'
import mem from 'mem'

const provider = new ethers.providers.EtherscanProvider(null, process.env.ETHERSCAN_TOKEN)

const resolveEnsSubdomain = subdomain => {
	return provider.resolveName(`${subdomain}.mirror.xyz`)
}

export const resolveSubdomain = mem(resolveEnsSubdomain)
