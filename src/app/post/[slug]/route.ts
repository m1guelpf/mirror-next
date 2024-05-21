import getEntries from '@/data/entries'
import { notFound, redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params: { slug } }: { params: { slug: string } }
): Promise<NextResponse> {
	const entry = (await getEntries()).filter(entry => entry.slug === slug)?.[0]

	if (!entry) return notFound()
	return redirect(`/${entry.digest}`)
}
