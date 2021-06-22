import { MarketColumn } from '../marketColumn'
import { createElement } from '../../../../helpers/createElement'

export class OverUnder {
	constructor(outcomes, competitors, groupId) {
		this.outcomes = outcomes
		this.competitors = competitors
		this.groupId = groupId
		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']

		this.overInstance = null
		this.underInstance = null
	}

	transformOutcomes = () => {
		const overOdds = []
		const underOdds = []

		this.outcomes.forEach(({ odds, specifiers }) => {
			odds.forEach(odd => {
				if (odd.outcome.includes('over')) {
					overOdds.push({ ...odd, specifiers })
				} else {
					underOdds.push({ ...odd, specifiers })
				}
			})
		})

		return {
			overOdds,
			underOdds,
		}
	}

	render = () => {
		const { overOdds, underOdds } = this.transformOutcomes()

		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.overInstance = new MarketColumn({
			odds: overOdds,
			competitors: this.competitors,
			groupId: this.groupId,
			title: 'Over',
			specifiersKey: 'total',
		})

		this.underInstance = new MarketColumn({
			odds: underOdds,
			competitors: this.competitors,
			groupId: this.groupId,
			title: 'Under',
			specifiersKey: 'total',
		})

		const child = [this.overInstance.render(), this.underInstance.render()]

		this.div.append(...child)

		return this.div
	}

	update = data => {
		if (data?.outcomes) {
			this.outcomes = data.outcomes

			const { overOdds, underOdds } = this.transformOutcomes()

			this.overInstance.update(overOdds)
			this.underInstance.update(underOdds)
		}
	}
}
