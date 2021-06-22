import { createElement } from '../../../../helpers/createElement'
import _ from 'lodash'

export class EventScore {
	constructor(additionalData) {
		this.additionalData = additionalData

		this.div = null
		this.type = 'div'
		this.style = { width: '10%' }

	}

	getScore = () => {
		const { currentHomeScore, currentAwayScore } = this.additionalData
			?.scoreboard?.data || {
			currentAwayScore: 0,
			currentHomeScore: 0,
		}
		return [currentHomeScore, currentAwayScore]
	}

	appendHTML = () => {
		this.div.innerHTML = `
								${this.getScore()
									.map(
										score =>
											`<p class="font text-center team-score">${score}</p>`
									)
									.join('')}`
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			style: this.style,
		})

		this.appendHTML()

		return this.div
	}

	update = data => {
		if (!_.isEqual(this.additionalData, data)) {
			this.additionalData = data
			this.appendHTML()
		}
	}
}
