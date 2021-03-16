import { gql } from '@apollo/client'

export default gql`
	query ContributorInfo($address: String) {
		contributor(address: $address) {
			displayName
			avatarURL
		}
	}
`
