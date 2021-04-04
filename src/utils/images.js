import requestImageSize from 'request-image-size'

export const calculateSizes = async markdown => {
	return Object.fromEntries(await Promise.all([...markdown.matchAll(/!\[[^\]]*\]\((?<url>.*?)\s*("(?:.*[^"])")?\s*\)/gm)].map(async match => [match.groups.url, await requestImageSize(match.groups.url)])))
}
