export const transformEventData = odds => {
	if (!odds) {
		return {}
	}

	const markets = {}

	odds.forEach(odd => {
		let keyId = odd.id

		if (odd.name.includes('!')) {
			keyId = createId(odd)
		}

		if (!markets[keyId]) {
			markets[keyId] = {
				id: odd.id,
				name: odd.name,
				outcomes: [],
			}
		}

		const createOdd = {
			specifiers: odd.specifiers || null,
			odds: [...odd.outcomes],
			id: createId(odd),
		}

		markets[keyId].outcomes.push(createOdd)
	})

	function createId(odd) {
		if (odd.specifiers) {
			const allSpecifiers = Object.values(odd.specifiers).reduce((acc, odd) => {
				if (Number(odd)) {
					acc = acc + Number(odd)
					return acc
				}

				const uniq = odd.replace(/[^\d.]/gi, '')
				acc = acc + Number(uniq)

				return acc
			}, 0)

			// console.log(odd.id.toString() + allSpecifiers)

			return odd.id.toString() + allSpecifiers
		}

		return odd.id
	}

	return markets
}

export const transformInplayData =(data)=> {
	if (!data){
		return []
	}

	return data.sort((a, b) => a.priority > b.priority ? 1 : -1)
}

export const transformLeagueData = events => {
	// const { id, sportId, categoryId } = league

	const groupOdds = {}

	events &&
		events.forEach(event =>
			event.odds
				? event.odds.forEach(odd => groupOddsForColumns(groupOdds, odd))
				: null
		)

	return groupOdds
}

export const getSpecifiersValue = spec => {
	return spec ? spec[Object.keys(spec)[0]] : null
}

export const groupOddsForColumns = (initialObj, odd) => {
	const { id, name } = odd

	if (!initialObj[id]) {
		initialObj[id] = {
			id,
			name,
			odds: [],
		}
	}

	initialObj[id].odds = initialObj[id].odds.filter(item => {
		if (item.specifiers && odd.specifiers) {
			if (
				getSpecifiersValue(item.specifiers) !==
				getSpecifiersValue(odd.specifiers)
			) {
				return item
			} else {
				return null
			}
		}
	})

	initialObj[id].odds = [...initialObj[id].odds, odd].sort((a, b) => {
		if (a.specifiers && b.specifiers) {
			return Number(getSpecifiersValue(a.specifiers)) >
				Number(getSpecifiersValue(b.specifiers))
				? -1
				: 1
		}
		return null
	})

	if (initialObj[id].odds[0] && initialObj[id].odds[0].specifiers) {
		initialObj[id].currentOdd = initialObj[id].odds[0]
	}
}

export const transformOutcomeName = (
	name,
	specifiers,
	competitors,
	currentOutcome = null
) => {
	if (!name) {
		return name
	}

	let data = {}

	if (Array.isArray(competitors)){
		data = {
			...specifiers,
			competitor1: competitors[0].name,
			competitor2: competitors[1].name,
		}
	}

	// const inBreckets = /(?<=\{).+\?|\w+(?=\})/gi
	// const words = name.match(inBreckets)

	if (currentOutcome) {
		if (typeof currentOutcome === 'object') {
			const { title, idx } = currentOutcome

			if (data[title]?.includes(':')) {
				return data[title]
			}

			let result = idx ? (Number(data[title]) * -idx).toFixed(1) : data[title]

			return Number(result) > 0 ? `+${result}` : result
		}

		return specifiers[currentOutcome]
	}

	const withBreckets = /{(.*?)}/gi
	const onlyWords = /\w+/gi

	const wordsInBreckets = name.match(withBreckets)

	if (wordsInBreckets) {
		const word = wordsInBreckets.reduce((acc, item) => {
			const cleanWord = item.match(onlyWords)
			const value = data[cleanWord[0]] || ''

			acc = acc.replace(item, value)
			return acc
		}, name)

		return uppercaseFirstLetter(word)
	}

	return uppercaseFirstLetter(name)
}

export const transformBetName = (name, { fd, pt }) => {
	name = name.replace(/{\$competitor1}/gi, fd.split(' v ')[0])
	name = name.replace(/{\$competitor2}/gi, fd.split(' v ')[1])
	name = name.replace(/X/gi, 'Draw')
	name = name.replace(/{\+hcp}/gi, pt.ha)
	name = name.replace(/{-hcp}/gi, pt.ha)
	name = name.replace(/{total}/gi, pt.ha)
	name = name.replace(/{!goalnr}/gi, pt.ha)
	return name
}

export const uppercaseFirstLetter = str =>
	(str = str.replace(str[0], str[0].toUpperCase()))

export const transformOverUnder = (odd, obj) => {
	const oddName = odd.outcome.toLowerCase()

	if (oddName.includes('over')) {
		obj.over.push(odd)
	}

	if (oddName.includes('under')) {
		obj.under.push(odd)
	}
}
