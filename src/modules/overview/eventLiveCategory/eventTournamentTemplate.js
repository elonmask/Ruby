  
import { EventLeftTable } from './eventLeftTable'
import { EventRightTable } from './eventRightTable'
import { groupOddsForColumns } from '../../../helpers/transform/transform'
import { createElement } from '../../../helpers/createElement'

export class EventTournamentTemplate {
	constructor(event) {
		this.event = event
		this.competitors = event.competitors || []
		this.additionalData = event.additionalData || null
		this.oddsCount = event.oddsCount
		this.id = event.id
		this.leagueId = event.leagueId
		this.sportId = event.sportId

		this.odds = {}
		this.currentOdd = null

		this.div = null
		this.type = 'div'
		this.classes = ['flex-container', 'inplayTable']

		this.getOdds()

		this.leftInstance = new EventLeftTable(this.formDataForLeftPart(), event)
		//this.rightInstance = new EventRightTable(this.formDataForRightPart())
	}

	getOdds = () => {
		/*this.event.odds &&
			this.event.odds.forEach(odd => groupOddsForColumns(this.odds, odd))
		this.currentOdd = Object.values(this.odds)[0] || {}*/
	}

	formDataForLeftPart = () => ({
		sportId: this.sportId,
		leagueId: this.leagueId,
		id: this.id,
		competitors: this.competitors.length < 1 ? [{name: this.event.name}] : this.competitors,
		additionalData: this.additionalData,
	})

	/*formDataForRightPart = () => ({
		competitors: this.competitors,
		currentOdd: this.currentOdd,
		oddsCount: this.oddsCount,
		sportId: this.sportId,
		leagueId: this.leagueId,
		id: this.id,
	})*/

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.append(this.leftInstance.render())
	/*	this.div.append(this.rightInstance.render())*/

		return this.div
	}

	update = event => {
		this.event = event
		this.competitors = event.competitors || []
		this.additionalData = event.additionalData || null
		this.oddsCount = event.oddsCount
		this.odds = {}

		this.getOdds()

		this.leftInstance.update(this.formDataForLeftPart())
		this.rightInstance.update(this.formDataForRightPart())
	}

	destroy = () => {
		//this.leftInstance.destroy()
		//this.rightInstance.destroy()
		// console.log('set template destroy')
	}
}