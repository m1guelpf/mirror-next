import { gql } from '@apollo/client'

export default gql`
	query PublicationInfo($publicationAddress: String!) {
		projectFeed(projectAddress: $publicationAddress) {
			displayName
			avatarURL
			domain
			ens
			headerImage {
				url
			}
			theme {
				colorMode
				accent
			}
			description
			mailingListURL
			members {
				address
				displayName
				avatarURL
			}
		}
	}
`
