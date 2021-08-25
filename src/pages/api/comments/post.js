import axios from 'axios'

export default async ({ method, headers: { referer }, body: { signerAddress, comment, digest }, cookies: { convo_token } }, res) => {
	if (method != 'POST') return res.status(405).send('Not Found')
	if (!comment || !digest || !signerAddress) return res.status(400).send('Invalid Params')
	if (!convo_token) return res.status(401).send('Unauthorized')

	try {
		await axios.post('https://theconvo.space/api/validateAuth?apikey=CONVO', { token: convo_token, signerAddress })
	} catch {
		return res.status(401).send('Unauthorized')
	}

	await axios.post('https://theconvo.space/api/comments?apikey=CONVO', { token: convo_token, signerAddress, comment, threadId: digest, url: referer }).then(resp => res.json(resp.data))
}
