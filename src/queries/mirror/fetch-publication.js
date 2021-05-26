import { gql } from '@apollo/client'

export default gql`
	query PublicationInfo($publication: String!) {
		publication(ensLabel: $publication) {
			displayName
			avatarURL
			ensLabel
			publicationSettings {
				settings
			}
		}
		publicationContributors(ensLabel: $publication) {
			address
			displayName
			avatarURL
		}
	}
`
