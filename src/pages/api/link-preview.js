import axios from 'axios'
import metascraper from 'metascraper'
import urlFetcher from 'metascraper-url'
import langFetcher from 'metascraper-lang'
import dateFetcher from 'metascraper-date'
import logoFetcher from 'metascraper-logo'
import titleFetcher from 'metascraper-title'
import imageFetcher from 'metascraper-image'
import authorFetcher from 'metascraper-author'
import requestImageSize from 'request-image-size'
import clearbitFetcher from 'metascraper-clearbit'
import publisherFetcher from 'metascraper-publisher'
import faviconFetcher from 'metascraper-logo-favicon'
import descriptionFetcher from 'metascraper-description'

const scraper = metascraper([titleFetcher(), descriptionFetcher(), langFetcher(), authorFetcher(), publisherFetcher(), imageFetcher(), dateFetcher(), urlFetcher(), logoFetcher(), clearbitFetcher(), faviconFetcher()])

export default async ({ query: { url } }, res) => {
	if (!url) return res.status(422).json({ error: 'Missing url parameter' })
	res.setHeader('Cache-Control', 's-maxage=86400')

	res.json(await getMeta(url))
}

export const getMeta = async url => {
	const html = await axios.get(url).then(res => res.data)
	const meta = await scraper({ html, url })

	await Promise.all(
		['image', 'logo'].map(async key => {
			if (!meta[key]) return

			meta[key] = {
				url: meta[key],
				...(await requestImageSize(meta[key])),
				downloaded: undefined,
			}
		})
	)

	return meta
}
