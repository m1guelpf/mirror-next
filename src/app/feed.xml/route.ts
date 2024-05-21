import RSS from 'rss'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import getEntries from '@/data/entries'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import getPublication from '@/data/publication'
import { NextRequest, NextResponse } from 'next/server'
import highlightMarkdown from '@/utils/highlightMarkdown'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const host = request.headers.get('host')

	let [publication, entries] = await Promise.all([getPublication(), getEntries()])

	const markdownRenderer = unified()
		.use(remarkParse) // Parse markdown
		.use(highlightMarkdown, { theme: 'light' }) // Highlight code, doesn't work on production yet
		.use(remark2rehype, { allowDangerousHtml: true }) // Convert to HTML
		.use(rehypeStringify) // Serialize HTML

	const feed = new RSS({
		title: publication.displayName,
		description: publication.description || 'A Mirror publication',
		image_url: publication?.headerImage?.url,
		managingEditor: publication.members.length == 1 ? publication.members[0].displayName : publication.displayName,
		webMaster: 'MirrorXYZ',
		ttl: 1 * 60, // cache for an hour
		site_url: `https://${host}/`,
		generator: 'RSS for Mirror, by Miguel Piedrafita',
		feed_url: `https://${host}/feed.xml`,
	})

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

	return new NextResponse(feed.xml({ indent: true }), {
		headers: {
			'Content-Type': 'application/rss+xml',
		},
	})
}
