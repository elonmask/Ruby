import { createElement } from '../../../../helpers/createElement'
import construct from '@babel/runtime/helpers/esm/construct'
import { MarketColumn } from '../marketColumn'
import { transformOutcomeName } from '../../../../helpers/transform/transform'

export class HandicapWay {
	constructor(outcomes, competitors, groupId) {
		this.outcomes = outcomes
		this.competitors = competitors
		this.groupId = groupId
		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']

	}

	transformOutcomes = () => {
		const home = []
		const draw = []
		const away = []

		this.outcomes.forEach(({ odds, specifiers }) => {
			odds.forEach((odd, idx) => {
				const cloneSpecifiers = { ...specifiers }

				if (idx > 0) {
					cloneSpecifiers.hcp = Number(cloneSpecifiers.hcp) > 0
						? `-${cloneSpecifiers.hcp}`
						: `+${(cloneSpecifiers.hcp * -1).toFixed(3)}`
				}

				if (odd.outcome.includes('competitor1')) {
					home.push({ ...odd, specifiers: cloneSpecifiers })
				}
				if (odd.outcome.includes('competitor2')) {
					away.push({ ...odd, specifiers: cloneSpecifiers })
				}
				if (odd.outcome.includes('draw')) {
					draw.push({ ...odd, specifiers: cloneSpecifiers })
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

		const columns = [
			new MarketColumn({
				odds: home,
				competitors: this.competitors,
				groupId: this.groupId,
				title: 'Home',
				specifiersKey: 'hcp',
			}).render(),
			draw.length
				? new MarketColumn({
						odds: draw,
						competitors: this.competitors,
						groupId: this.groupId,
						title: 'Draw',
						specifiersKey: 'hcp',
				  }).render()
				: null,
			new MarketColumn({
				odds: away,
				competitors: this.competitors,
				groupId: this.groupId,
				title: 'Away',
				specifiersKey: 'hcp',
			}).render(),
		]

		columns.forEach(column => column && this.div.append(column))
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendColumns()

		return this.div
	}


	update =()=> {
		// console.log('handicap update')
	}
}
