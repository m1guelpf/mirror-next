import { contributorAddresses } from '@/data/ens'

export const getConfig = () => {
	return { ensDomain: process.env.NEXT_PUBLIC_AUTHOR_ENS, publicationAddress: contributorAddresses[0] }
}
