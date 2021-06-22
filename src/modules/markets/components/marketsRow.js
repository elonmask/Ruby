import { MarketCell } from './marketCell'
import { createElement } from '../../../helpers/createElement'
import { getDifference, isEqualOutcomes } from '../../../helpers/utils'

export class MarketsRow {
	constructor({ outcome: { odds, specifiers }, groupId, competitors }) {
		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']

		this.specifiers = specifiers
		this.competitors = competitors
		this.odds = odds
		this.groupId = groupId

		this.marketCellsInstances = {}
	}

	removeCell = id => {
		this.marketCellsInstances[id].destroy()

		this.marketCellsInstances = Object.keys(this.marketCellsInstances).reduce(
			(acc, key) => {
				if (!key !== id) {
					acc[key] = this.marketCellsInstances[key]
				}

				return acc
			},
			{}
		)
	}

	addCell = odd => {
		this.marketCellsInstances[odd.id] = new MarketCell({
			odd,
			specifiers: this.specifiers,
			competitors: this.competitors,
			groupId: this.groupId,
		})

		this.div.append(this.marketCellsInstances[odd.id].render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.odds.forEach(odd => {
			this.addCell(odd)
		})

		return this.div
	}

	update = outcome => {
		if (outcome?.odds) {
			const oldIds = this.odds.map(odd => odd.id)
			const newIds = outcome.odds.map(odd => odd.id)

			const { removed, added, others } = getDifference(oldIds, newIds)

			if (removed.length) {
				removed.forEach(key => {
					this.removeCell(key)
				})
			}

			if (added.length) {
				added.forEach(key => {
					const addedOdd = outcome.odds.find(odd => odd.id === key)

					if (addedOdd) {
						this.addCell(addedOdd)
					}
				})
			}

			if (others.length) {
				others.forEach(key => {
					const updated = outcome.odds.find(odd => odd.id === key)

					this.marketCellsInstances[key].update(updated)
				})
			}
			this.odds = outcome.odds
		}
	}

	destroy = () => {
		this.div.classList.add('destroy')
		setTimeout(()=> {
			this.div.remove()
		}, 400)
	}
}
