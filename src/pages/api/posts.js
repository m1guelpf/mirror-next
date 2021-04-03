import { getEntries } from '@/data/entries'

export default async (_, res) => {
	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

	return res.json(await getEntries())
}
