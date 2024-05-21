import getEntries from '@/data/entries'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const host = request.headers.get('host')
	const entries = (await getEntries()).map(entry => ({ ...entry, url: `https://${host}/post/${entry.slug}` }))

	return NextResponse.json(entries)
}
