import { contributorAddresses } from '@/data/ens'

const getConfig = (): { ensDomain: string; publicationAddress: string } => {
	return { ensDomain: process.env.NEXT_PUBLIC_AUTHOR_ENS!, publicationAddress: contributorAddresses[0] }
}

export default getConfig
