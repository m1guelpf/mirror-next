import { mirrorQL } from '@/lib/graphql'
import fetchContributor from '@/queries/mirror/fetch-contributor'
import { publicationAddress } from '@/data/ens'

export const getContributor = async () => {
	const {
		data: { contributor },
	} = await mirrorQL.query({ query: fetchContributor, variables: { address: publicationAddress } })

	return contributor
}
