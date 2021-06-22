import { createElement } from '../../../../helpers/createElement'
import {
	getCurrentServer,
	getCompetitorsScore,
} from '../../../../helpers/score'
import _ from 'lodash'

export class EventSetScore {
	constructor(additionalData, sportID) {
		this.additionalData = additionalData
		this.sportId = sportID
		this.node = null
		this.type = 'table'
		this.classes = ['inplayTeamScoreTableInfo']
	}

	scoreRowTemplate = (scores, place) => {
		const circle = getCurrentServer(this.additionalData) === place

		return `
				<tr>
					<td> ${circle ? '<div class="circle"></div>' : ''}</td> 
					${scores.map(score => `<td><p class="font primary">${score}</p></td>`).join('')}			
				</tr>
		`
	}

	appendHTML = () => {
		const { homeScore, awayScore } = getCompetitorsScore(this.sportId, this.additionalData)

		this.node.innerHTML = `
			${this.scoreRowTemplate(homeScore, 'HOME')}
			${this.scoreRowTemplate(awayScore, 'AWAY')}
		`
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendHTML()

		return this.node
	}

	update = additionalData => {
		if (!_.isEqual(this.additionalData, additionalData)) {
			this.additionalData = additionalData
			this.appendHTML()
		}
	}
}
