import RSS from 'rss'
import { getEntries } from '@/data/entries'
import { getPublication } from '@/data/publication'
import unified from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
//import highlightCode from '@/utils/highlightMarkdown'

export default async ({ headers: { host } }, res) => {
	res.setHeader('Cache-Control', 's-maxage=86400')

	let [publication, entries] = await Promise.all([getPublication(), getEntries()])

	const feed = new RSS({
		title: publication.displayName,
		description: publication.description || 'A Mirror publication',
		image_url: publication?.headerImage?.url,
		managingEditor: publication.members.length == 1 ? publication.members[0].name : publication.displayName,
		webMaster: 'MirrorXYZ',
		ttl: 1 * 60, // cache for an hour
		site_url: `https://${host}/`,
		generator: 'RSS for Mirror, by Miguel Piedrafita',
		feed_url: `https://${host}/feed.xml`,
	})

	const markdownRenderer = unified()
		.use(remarkParse) // Parse markdown
		// .use(highlightCode, { theme: 'light' }) // Highlight code, doesn't work on production yet
		.use(remark2rehype, { allowDangerousHtml: true }) // Convert to HTML
		.use(rehypeStringify) // Serialize HTML

	await Promise.all(
		entries.map(async entry => {
			const body = String(await markdownRenderer.process(entry.body))

			feed.item({
				title: entry.title,
				guid: entry.digest,
				url: `https://${host}/${entry.digest}`,
				date: new Date(entry.timestamp * 1000).toISOString(),
				description: body,
			})
		})
	)

	res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate') // cache for an hour, refresh on the background

	res.status(200).send(feed.xml({ indent: true }))
}
