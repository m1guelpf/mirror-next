export const getExcerpt = content => {
	let firstParagraphs = content.split('\n\n').slice(0, 4)
	let separatorIndex = null

	firstParagraphs.forEach((p, i) => {
		if (p === '---') separatorIndex = i
	})

	firstParagraphs = firstParagraphs.slice(0, separatorIndex ? separatorIndex : 4)

	if (firstParagraphs[firstParagraphs.length - 1].startsWith('#')) firstParagraphs.pop()

	return firstParagraphs.join('\n\n')
}
