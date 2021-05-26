import { getConfig } from '@/hooks/getConfig'
import { mirrorQL } from '@/lib/graphql'
import fetchPublication from '@/queries/mirror/fetch-publication'

export const getPublication = async () => {
	const { ensDomain } = getConfig()

	const {
		data: { publication, publicationContributors: contributors },
	} = await mirrorQL.query({ query: fetchPublication, variables: { publication: ensDomain } })

	return { publication, contributors }
}
