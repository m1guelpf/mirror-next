import axios from 'axios'
import { serialize } from 'cookie'

const ONE_DAY = 60 * 60 * 24 * 1000

function createCookie(name, data, options = {}) {
	return serialize(name, data, {
		maxAge: ONE_DAY,
		expires: new Date(Date.now() + ONE_DAY * 1000),
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		...options,
	})
}

export default async ({ method, body: { signerAddress, signature, timestamp } }, res) => {
	if (method != 'POST') return res.status(405).send('Not Found')

	const token = await axios.post('https://theconvo.space/api/auth?apikey=CONVO', { signerAddress, signature, timestamp }).then(res => res.data?.message)

	res.setHeader('Set-Cookie', [createCookie('convo_token', token), createCookie('convo_authed', true, { httpOnly: false })])

	res.status(200).end()
}
