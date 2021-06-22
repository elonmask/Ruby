import { Competitors } from './leftSide/competitors'
import { EventScore } from './leftSide/eventScore'
import { createElement } from '../../../helpers/createElement'
import { findNode } from '../../../helpers/utils' 
import { EventSetScore } from './leftSide/eventSetScore'
import { EventTime } from './leftSide/eventTime'
import { slice } from 'lodash'

export class EventLeftTable {
	constructor({ sportId, leagueId, id, competitors, additionalData, set }, event) {
		this.event = event;
		this.sportId = sportId
		this.leagueId = leagueId
		this.id = id
		this.competitors = competitors
		this.additionalData = additionalData
		this.set = set

		this.div = null
		this.innerContainer = null
		this.type = 'div'
		this.classes = ['flex-container', 'align-middle', 'inplayTable__left']

		this.competitorsInstance = null
		this.scoreInstance = null
		this.timeInstance = null
		// this.scoreInstance = this.competitors.length < 1 ? '' : null;
		// this.timeInstance = this.competitors.length < 1 ? '' : null;
		// this.translationInstance = null
	}

	createComponents = () => {
		// console.log(this.competitors)
		// this.competitorsInstance = new Competitors(this.competitors, this.id)
		// this.timeInstance = this.timeInstance == '' ? '' :  new EventTime(this.additionalData, this.set)
		// this.scoreInstance = this.scoreInstance == '' ? '' : this.set
		// 	? new EventSetScore(this.additionalData, this.sportId)
		// 	: new EventScore(this.additionalData)
		if (window.location.hash.includes("sports") && window.location.hash.includes("list")) {
			this.competitorsInstance = new Competitors(this.competitors, this.id)
		} else {
			this.competitorsInstance = new Competitors(this.competitors, this.id)
		}
		this.timeInstance = new EventTime(this.additionalData, this.set)
		this.scoreInstance = this.set
			? new EventSetScore(this.additionalData, this.sportId)
			: new EventScore(this.additionalData)

		// this.translationInstance = new EventTranslation(this.enrichment, this.id)
	}

	appendComponents = () => {
		//console.log(this.competitors.length)
		// const leftB = document.createElement('div');
		// leftB.style.width = '71px';
		// this.competitors.length == 1 ? this.innerContainer.prepend(leftB) : this.innerContainer.prepend(this.timeInstance.render())
		// this.innerContainer.append(this.competitorsInstance.render())
		// this.competitors.length == 1 ? this.innerContainer.prepend(leftB) : this.innerContainer.append(this.scoreInstance.render())

		if (window.location.hash.includes("sports") && window.location.hash.includes("list")) {

			const timeContainer = document.createElement('div');
			timeContainer.className = "inplayTeamTime";
			const date = document.createElement('p');
			date.className = "font team-period";
			date.textContent = this.event.startDate.slice(8, 10) + "." + this.event.startDate.slice(5, 7) + "." + this.event.startDate.slice(2, 4);
			timeContainer.appendChild(date)
			const time = document.createElement('p');
			time.className = "font bold team-time";
			time.textContent = this.event.startDate.slice(11, 16)
			timeContainer.appendChild(time)

			timeContainer.style.marginLeft = "65px";
			
			this.innerContainer.prepend(timeContainer);
			//console.log(this.timeInstance.render())
			this.innerContainer.append(this.competitorsInstance.render())
		} else {
			this.innerContainer.prepend(this.timeInstance.render())
			this.innerContainer.append(this.competitorsInstance.render())
			this.innerContainer.append(this.scoreInstance.render())
		}
		// this.innerContainer.append(this.translationInstance.render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})
		if (window.location.hash.includes("sports") && window.location.hash.includes("list")) {
			this.div.innerHTML = `
			 				<a 
              	 href='#/sports/table/${this.sportId}/${this.leagueId}/${this.id}' 
                 class="flex-container align-justify align-middle inplayTeamScoreInfo">
              </a>`
		} else {
			this.div.innerHTML = `
			 				<a 
              	 href='#/live/event/${this.sportId}/${this.leagueId}/${this.id}' 
                 class="flex-container align-justify align-middle inplayTeamScoreInfo">
              </a>`
		}

		this.innerContainer = findNode('.', 'inplayTeamScoreInfo', this.div)

		this.createComponents()
		this.appendComponents()

		return this.div
	}

	update = ({ competitors, additionalData }) => {
		this.additionalData = additionalData
		this.competitors = competitors

		this.competitorsInstance.update(competitors)
		this.scoreInstance.update(additionalData)
		this.timeInstance.update(additionalData)
	}


	destroy = () => {
		this.timeInstance.destroy()
	}
}
