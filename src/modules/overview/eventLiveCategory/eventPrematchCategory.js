import { EventCompetitorsPeriodTemplate } from './eventCompetitorsPeriodTemplate'
import { EventCompetitorsSetTemplate } from './eventCompetitorsSetTemplate'
import { EventTournamentTemplate } from './eventTournamentTemplate'
import { createElement } from '../../../helpers/createElement'
import { betButtonHandler } from '../../rightColumn/betslip/actions/betslipActions'
import { findAllNodes } from '../../../helpers/utils'
import { writeToBetButtons } from '../../../storage/nodes/betButtonsStorage'

const setSport = [23, 5, 34, 20] 

export class EventPrematchCategory {
	constructor(event, marketName) {
		this.eventType = event.eventType;
		this.event = event
		this.id = event.id
		this.sportId = event.sportId

		this.div = null
		this.type = 'div'
		this.classes = ['inplay-event-wrapper']

		this.eventInstance = {}
		this.marketName = marketName
	}

	periodTemplate = () => {
		this.eventInstance[this.event.id] = new EventCompetitorsPeriodTemplate(
			this.event, this.marketName
		)

		return this.eventInstance[this.event.id].render()
	}

	setTemplate = () => {
		this.eventInstance[this.event.id] = new EventCompetitorsSetTemplate(
			this.event, this.marketName
		)

		return this.eventInstance[this.event.id].render()
	}

	tournamentTemplate = () => {
		this.eventInstance[this.event.id] = new EventTournamentTemplate(
			this.event
		)

		return this.eventInstance[this.event.id].render();
	}

	rightButtonSlider = () => {
		console.log('right')
	}

	leftButtonSlider = () => {
		console.log('left')
	}

	betButton = e => {
		const { odd, outcome } = e.target.closest('.coef_item').dataset
		betButtonHandler({ event: this.event, oddId: odd, stakeId: outcome, e })
	}

	rightBlockListener = e => {
		const element = e.target

		if (element.closest('.reload--left')) {
			this.leftButtonSlider(e)
		}

		if (element.closest('.reload--right')) {
			this.rightButtonSlider(e)
		}
	}

	update = data => {
		if (this.eventInstance[data.id]) {
			this.eventInstance[data.id].update(data)
		}
	}

	addListeners = () => {
		// const rightBlock = this.div.querySelector('.inplayTable__right')

		findAllNodes('.', 'coef_item', this.div).forEach(button => {
			button.addEventListener('click', this.betButton)
			writeToBetButtons(button)
		})

		//rightBlock.addEventListener('click', this.rightBlockListener)
	}

	appendComponents = () => {
		if (this.eventType === 'Tournament') {
			this.div.append(
				this.tournamentTemplate()
			)
		} else {
			this.div.append(
				setSport.includes(this.event.sportId)
					? this.setTemplate()
					: this.periodTemplate()
			)
		}
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendComponents()
		this.addListeners()

		return this.div
	}

	destroy = () => {
		// console.log('destroy event category')

		this.div.remove()
		Object.values(this.eventInstance).forEach(instance => instance.destroy())

		this.eventInstance = {}
		// refreshStakes();
		// setTimeout( () => {
		// 	refreshStakes();
		// }, 1000)
	}
}