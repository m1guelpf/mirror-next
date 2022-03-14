import { publicationAddress } from '@/data/ens'

export const getConfig = () => {
	return { ensDomain: process.env.NEXT_PUBLIC_MIRROR_SUBDOMAIN, publicationAddress }
}
