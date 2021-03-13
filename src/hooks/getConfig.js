import { default as getNextConfig } from 'next/config'

export const getConfig = () => {
	const { publicRuntimeConfig } = getNextConfig()

	return publicRuntimeConfig
}
