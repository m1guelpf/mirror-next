import routeToBlock from 'react-embed/lib/routeToBlock'

export const shouldEmbed = (url: string): boolean => {
	return routeToBlock({}, { url, ...new URL(url) }) !== undefined
}
