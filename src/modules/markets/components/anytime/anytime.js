import { MarketCellTitle } from '../marketCellTitle'
import { ShowMoreButton } from '../additional/showMoreButton'
import { createElement } from '../../../../helpers/createElement'
import { getDifference } from '../../../../helpers/utils'

export class Anytime {
	constructor(outcomes, competitors, groupId) {
		this.outcomes = outcomes
		this.competitors = competitors
		this.odds = this.getAllOdds(this.outcomes)
		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']
		this.groupId = groupId

		this.marketsCellTitles = {}
	}

	getAllOdds = outcomes => {
		return outcomes.reduce((acc, item) => {
			item.odds.forEach(odd => (odd.specifiers = item.specifiers))
			acc = [...acc, ...item.odds]
			return acc
		}, [])
	}

	addCell = odd => {
		this.marketsCellTitles[odd.id] = new MarketCellTitle({
			odd,
			competitors: this.competitors,
			specifiers: odd.specifiers,
			groupId: this.groupId,
		})
		this.div.append(this.marketsCellTitles[odd.id].render())
	}

	removeCell = id => {
		this.marketsCellTitles[id].destroy()

		this.marketsCellTitles = Object.keys(this.marketsCellTitles).reduce(
			(acc, key) => {
				if (key !== id) {
					acc[key] = this.marketsCellTitles[key]
				}
				return acc
			},
			{}
		)
	}

	appendCells = () => {
		let counter = 0

		this.odds.forEach(odd => {
			counter = counter + 1
			this.addCell(odd)
		})

		if (counter > 6) {
			this.div.append(new ShowMoreButton(this.div).render())

			this.div.classList.add('maTable__row_hidden')
		}
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendCells()

		return this.div
	}

	update = data => {
		if (data?.outcomes) {
			const allOdds = this.getAllOdds(data.outcomes)

			const oldIds = this.odds.map(odd => odd.id)
			const newIds = allOdds.map(odd => odd.id)

			const { removed, added, others } = getDifference(oldIds, newIds)

			if (removed.length) {
				removed.forEach(key => {
					this.removeCell(key)
				})
			}
			if (added.length) {
				added.forEach(key => {
					const addedOdd = allOdds.find(odd => odd.id === key)
					this.addCell(addedOdd)
				})
			}

			if (others.length) {
				others.forEach(key => {
					const updated = allOdds.find(odd => odd.id === key)
					this.marketsCellTitles[key].update(updated)
				})
			}

			this.outcomes = data.outcomes
		}
	}
}
