export const formatAddress = (address: string): string => {
	if (!address) return ''

	const chars = address.split('')
	return `${chars.slice(0, 6).join('')}…${chars.slice(-6).join('')}`
}
