import { MarketColumn } from '../marketColumn'
import { createElement } from '../../../../helpers/createElement'
import { ShowMoreButton } from '../additional/showMoreButton'
import { isEmpty } from '../../../../helpers/utils'

export class Correct {
	constructor(outcomes, competitors, groupId) {
		this.outcomes = outcomes
		this.competitors = competitors
		this.groupId = groupId
		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']

		this.homeInstance = null
		this.awayInstance = null
		this.drawInstance = null
	}

	transformOutcomes = () => {
		const home = []
		const draw = []
		const away = []

		this.outcomes.forEach(({ odds }) => {
			odds.forEach(odd => {
				const [first, second] = odd.outcome.split(':')

				if (Number(first) > Number(second)) {
					home.push(odd)
					return
				}

				if (Number(first) < Number(second)) {
					away.push(odd)
					return
				}

				if (Number(first) === Number(second)) {
					draw.push(odd)
					return
				}
			})
		})

		return {
			home,
			away,
			draw,
		}
	}

	appendColumns = () => {
		const { home, away, draw } = this.transformOutcomes()

		this.homeInstance = new MarketColumn({
			odds: home,
			competitors: this.competitors,
			groupId: this.groupId,
			title: 'Home',
		})

		if (!isEmpty(draw)) {
			this.drawInstance = new MarketColumn({
				odds: draw,
				competitors: this.competitors,
				groupId: this.groupId,
				title: 'X',
			})
		}

		this.awayInstance = new MarketColumn({
			odds: away,
			competitors: this.competitors,
			groupId: this.groupId,
			title: 'Away',
		})

		const columns = [this.homeInstance, this.drawInstance, this.awayInstance]

		const maxLength = Math.max(home.length, away.length, draw.length)

		if (maxLength > 6) {
			this.div.append(new ShowMoreButton(this.div).render())
			this.div.classList.add('maTable__row_hidden')
		}

		columns.forEach(column => {
			if (column) {
				this.div.append(column.render())
			}
		})
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendColumns()

		return this.div
	}

	update = data => {
		if (data?.outcomes) {
			this.outcomes = data.outcomes

			const odds = this.transformOutcomes()

			const instances = {
				home: this.homeInstance,
				away: this.awayInstance,
				draw: this.drawInstance,
			}

			Object.keys(instances).forEach(key => {
				if (instances[key]) {
					instances[key].update(odds[key])
				}
			})
		}
	}
}
