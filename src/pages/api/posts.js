import { getEntries } from '@/data/entries'

export default async ({ headers: { host } }, res) => {
	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

	return res.json((await getEntries()).map(entry => ({ ...entry, url: `https://${host}/post/${entry.slug}` })))
}
