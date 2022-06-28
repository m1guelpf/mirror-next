import { getEntries } from '@/data/entries'

export default async ({ query: { slug } }, res) => {
	res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')

	if (!slug) return res.redirect(308, '/')

	const entry = (await getEntries()).filter(entry => entry.slug === slug)?.[0]

	if (!entry) return res.redirect(308, '/')

	return res.redirect(308, `/${entry.transaction}`)
}
