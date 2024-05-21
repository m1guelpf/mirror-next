import metascraper from 'metascraper'
import urlFetcher from 'metascraper-url'
import langFetcher from 'metascraper-lang'
import dateFetcher from 'metascraper-date'
import logoFetcher from 'metascraper-logo'
import titleFetcher from 'metascraper-title'
import imageFetcher from 'metascraper-image'
import authorFetcher from 'metascraper-author'
import { Metadata } from '@/types/link-preview'
import clearbitFetcher from 'metascraper-clearbit'
import { calculateImageSize } from '@/utils/images'
import publisherFetcher from 'metascraper-publisher'
import faviconFetcher from 'metascraper-logo-favicon'
import { NextRequest, NextResponse } from 'next/server'
import descriptionFetcher from 'metascraper-description'

const scraper = metascraper([
	titleFetcher(),
	descriptionFetcher(),
	langFetcher(),
	authorFetcher(),
	publisherFetcher(),
	imageFetcher(),
	dateFetcher(),
	urlFetcher(),
	logoFetcher(),
	clearbitFetcher(),
	faviconFetcher(),
])

export async function GET(request: NextRequest): Promise<NextResponse> {
	const url = request.nextUrl.searchParams.get('url')

	if (!url) return NextResponse.json({ error: 'Missing url parameter' }, { status: 422 })

	return NextResponse.json(await getMeta(url))
}

const getMeta = async (url: string): Promise<Metadata> => {
	const html = await fetch(url).then(res => res.text())
	const meta = await scraper({ html, url })

	await Promise.all(
		['image', 'logo'].map(async key => {
			if (!meta[key]) return

			// @ts-ignore
			meta[key] = {
				url: meta[key],
				...(await calculateImageSize(meta[key]!)),
			}
		})
	)

	return meta as Metadata
}
