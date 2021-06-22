import { MarketsRow } from '../marketsRow'
import { createElement } from '../../../../helpers/createElement'
import {
	getDifference,
	isEmpty,
	isEqualOutcomes,
} from '../../../../helpers/utils'

export class DefaultBody {
	constructor(outcomes, competitors, groupId) {
		this.groupId = groupId
		this.outcomes = outcomes
		this.competitors = competitors

		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']
		this.marketsRows = {}
	}

	removeOutcome = id => {
		this.marketsRows[id].destroy()

		this.marketsRows = Object.keys(this.marketsRows).reduce((acc, key) => {
			if (key !== id) {
				acc[key] = this.marketsRows[key]
			}

			return acc
		}, {})
	}

	addOutcome = outcome => {
		outcome.id = Number(outcome.id)

		this.marketsRows[outcome.id] = new MarketsRow({
			outcome,
			competitors: this.competitors,
			groupId: this.groupId,
		})
		this.div.append(this.marketsRows[outcome.id].render())
	}

	appendOutcomes = () => {
		this.outcomes.forEach(outcome => {
			this.addOutcome(outcome)
		})
	}

	render = () => {
		this.div = createElement({
			type: 'div',
			classes: ['maTable__row'],
		})

		this.appendOutcomes()

		return this.div
	}

	update = data => {
		if (data) {
			const { outcomes } = data

			const oldOutcomesId = this.outcomes.map(outcome => Number(outcome.id))
			const newOutcomesId = outcomes.map(outcome => Number(outcome.id))

			const { added, removed, others } = getDifference(
				oldOutcomesId,
				newOutcomesId
			)

			if (!isEmpty(removed)) {
				removed.forEach(key => {
					this.removeOutcome(key)
				})
			}

			if (!isEmpty(added)) {
				added.forEach(key => {
					const addedOutcome = outcomes.find(
						outcome => Number(outcome.id) === key
					)
					this.addOutcome(addedOutcome)
				})
			}

			if (!isEmpty(others)) {
				others.forEach(key => {
					const updated = outcomes.find(outcome => Number(outcome.id) === key)

					this.marketsRows[key].update(updated)
				})
			}

			this.outcomes = outcomes
		}
	}
}
