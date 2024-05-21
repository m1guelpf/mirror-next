import { cache } from 'react'
import { mirrorQL } from '@/lib/graphql'
import getConfig from '@/hooks/getConfig'
import fetchPublication from '@/queries/mirror/fetch-publication'

export type Publication = {
	ens: string
	domain: string
	avatarURL: string
	displayName: string
	headerImage?: { url: string }
	theme: { colorMode: 'DARK' | 'LIGHT'; accent: string }
	description: string
	mailingListURL?: string
	members: Array<{
		address: string
		avatarURL: string
		displayName: string
	}>
}

const getPublication = async (): Promise<Publication> => {
	const { publicationAddress } = getConfig()

	const {
		data: { projectFeed: publication },
	} = await mirrorQL.query({ query: fetchPublication, variables: { publicationAddress } })

	return publication
}

export default cache(getPublication)
