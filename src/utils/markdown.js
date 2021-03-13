import { Fragment } from 'react'
import Zoom from 'react-medium-image-zoom'

const Image = ({ alt, src }) => {
	return (
		<figure>
			<Zoom wrapElement="span" wrapStyle={{ width: '100%' }}>
				<img src={src} />
			</Zoom>
			{alt && <figcaption>{alt}</figcaption>}
		</figure>
	)
}

export const components = {
	image: Image,
}
