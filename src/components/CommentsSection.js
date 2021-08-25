import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import Web3Modal from 'web3modal'
import axios from 'axios'
import { format as timeago } from 'timeago.js'

const serverWeb3 = new ethers.providers.InfuraProvider(null, process.env.NEXT_PUBLIC_INFURA_ID)

const commentFetcher = url =>
	fetch(url)
		.then(res => res.json())
		.then(comments => Promise.all(comments.map(async comment => ({ ...comment, authorAvatar: comment.authorENS ? (await (await serverWeb3.getResolver(comment.authorENS)).getText('avatar')) || 'https://cdn.tryshowtime.com/profile_placeholder.jpg' : 'https://cdn.tryshowtime.com/profile_placeholder.jpg' }))))

const CommentsSection = ({ digest, theme, className = '' }) => {
	const [comment, setComment] = useState('')
	const [_web3, setWeb3] = useState(null)
	const [userAvatar, setUserAvatar] = useState('https://cdn.tryshowtime.com/profile_placeholder.jpg')

	useEffect(() => {
		if (!_web3) return

		_web3
			.getSigner()
			.getAddress()
			.then(address => _web3.lookupAddress(address))
			.then(async userENS => {
				if (!userENS) return

				return (await _web3.getResolver(userENS)).getText('avatar')
			})
			.then(avatar => setUserAvatar(avatar || 'https://cdn.tryshowtime.com/profile_placeholder.jpg'))
	}, [_web3])

	const web3Modal = useMemo(() => {
		if (typeof window == 'undefined') return

		return new Web3Modal({
			cacheProvider: true,
			theme,
			providerOptions: {
				walletconnect: {
					display: {
						description: 'Use Rainbow & other popular wallets',
					},
					package: WalletConnectProvider,
					options: {
						infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
					},
				},
			},
		})
	}, [])

	const authenticateConvo = async web3 => {
		const timestamp = Date.now()
		const signerAddress = await web3.getSigner().getAddress()
		const signature = await web3.getSigner().signMessage(`I allow this site to access my data on The Convo Space using the account ${signerAddress}. Timestamp:${timestamp}`)

		await axios.post('/api/comments/login', { signerAddress, signature, timestamp })
	}

	const { data: comments, mutate } = useSWR(`https://theconvo.space/api/comments?apikey=CONVO&threadId=${digest}`, commentFetcher, { revalidateOnFocus: false })

	const publishComment = async event => {
		event.preventDefault()

		const web3 = await web3Modal.connect().then(provider => new ethers.providers.Web3Provider(provider))
		setWeb3(web3)

		if (!document.cookie.includes('convo_authed')) await authenticateConvo(web3)

		const result = await axios.post('/api/comments/post', { signerAddress: await web3.getSigner().getAddress(), comment, digest }).then(res => res.data)

		setComment('')
		mutate(comments => {
			comments.push({ ...result, authorAvatar: userAvatar })
		}, true)
	}

	return (
		<div className={`space-y-8 ${className}`}>
			<ul role="list" className="space-y-8">
				{!Array.isArray(comments) ? (
					<div>loading...</div>
				) : (
					comments.map(comment => (
						<li key={comment._id} className="flex justify-between gap-4">
							<img className="w-14 h-14 rounded-full flex-shrink-0" alt="profile image" src={comment.authorAvatar} />
							<div className="flex-1">
								<div className="flex items-center space-x-2">
									<p className="text-sm text-gray-300 font-semibold">{comment.authorENS || comment.author}</p>
									<p className="text-xs text-gray-500 font-medium">{timeago(new Date(parseInt(comment.createdOn)))}</p>
								</div>
								<p className="font-medium text-lg text-gray-400">{decodeURIComponent(comment.text)}</p>
							</div>
						</li>
					))
				)}
			</ul>
			<form onSubmit={publishComment} className="space-y-4">
				<div className="flex justify-between gap-4">
					<img className="w-14 h-14 rounded-full flex-shrink-0" alt="profile image" src={userAvatar} />
					<div className="flex-1">
						<textarea className="font-medium resize-none w-full outline-none text-lg rounded-xl bg-black border-2 border-gray-800 focus:border-gray-400 p-4 transition h-40 text-gray-400" placeholder="Your comment…" value={comment} onChange={event => setComment(event.target.value)} required />
					</div>
				</div>
				<div className="flex justify-end">
					<button type="submit" className="bg-white text-white dark:text-gray-200 ring-white dark:bg-opacity-10 font-medium rounded-lg p-4 hover:ring-4 dark:ring-opacity-20 transition duration-300 text-base shadow-xs hover:shadow-xs sm:text-lg sm:px-10">
						Publish Comment
					</button>
				</div>
			</form>
		</div>
	)
}

export default CommentsSection
