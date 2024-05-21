import resolveEns from './scripts/resolve-ens.js'

export default () => {
	resolveEns()

	return {
		images: {
			remotePatterns: [{ hostname: 'images.mirror-media.xyz' }],
		},
	}
}
