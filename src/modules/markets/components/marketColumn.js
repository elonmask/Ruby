import { MarketCell } from './marketCell'
import { createElement } from '../../../helpers/createElement'
import { getDifference } from '../../../helpers/utils'

export class MarketColumn {
	constructor({
		odds,
		competitors,
		title = '',
		specifiersKey = null,
		groupId,
	}) {
		this.odds = odds
		this.competitors = competitors
		this.title = title
		this.specifiersKey = specifiersKey
		this.groupId = groupId
		this.type = 'div'
		this.classes = ['bets_column']
		this.div = null

		this.marketsCells = {}
	}

	addCell = odd => {
		this.marketsCells[odd.id] = new MarketCell({
			odd,
			specifiers: odd.specifiers,
			competitors: this.competitors,
			specifiersKey: this.specifiersKey,
			groupId: this.groupId,
		})

		this.div.append(this.marketsCells[odd.id].render())
	}

	removeCell = id => {
		this.marketsCells[id].destroy()

		this.marketsCells = Object.keys(this.marketsCells).reduce((acc, key) => {
			if (key !== id) {
				acc[key] = this.marketsCells[key]
			}
			return acc
		}, {})
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		if (this.title) {
			this.div.innerHTML = `<div class="bets_title">${this.title}</div>`
		}

		this.odds.forEach(odd => {
			this.addCell(odd)
		})

		return this.div
	}

	update = odds => {
		const oldIds = this.odds.map(odd => odd.id)
		const newIds = odds.map(odd => odd.id)

		const { removed, added, others } = getDifference(oldIds, newIds)

		if (removed.length) {
			removed.forEach(key => {
				this.removeCell(key)
			})
		}

		if (added.length) {
			added.forEach(key => {
				const addedOdd = odds.find(odd => odd.id === key)
				this.addCell(addedOdd)
			})
		}

		if (others.length) {
			others.forEach(key => {
				const updated = odds.find(odd => odd.id === key)

				this.marketsCells[key].update(updated)
			})
		}

		this.odds = odds
	}
}
