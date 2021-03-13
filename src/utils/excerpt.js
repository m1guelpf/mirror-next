export const getExcerpt = content => {
	const firstParagraphs = content.split('\n\n').slice(0, 4)
	let separatorIndex = null

	firstParagraphs.forEach((p, i) => {
		if (p === '---') separatorIndex = i
	})

	return firstParagraphs.slice(0, separatorIndex ? separatorIndex : 4).join('\n\n')
}
