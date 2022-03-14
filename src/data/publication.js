import { getConfig } from '@/hooks/getConfig'
import { mirrorQL } from '@/lib/graphql'
import fetchPublication from '@/queries/mirror/fetch-publication'

export const getPublication = async () => {
	const { publicationAddress } = getConfig()

	const {
		data: { projectFeed: publication },
	} = await mirrorQL.query({ query: fetchPublication, variables: { publicationAddress } })

	return publication
}
