import { Timer } from '../../../helpers/timer'
import { createElement } from '../../../helpers/createElement'
import { findNode, isEmpty, isEqualOutcomes } from '../../../helpers/utils'
import {
	getCompetitorsScore,
	getCurrentServer,
	getScore,
} from '../../../helpers/score'
import { storageEmitter } from '../../../storage/storageEmmiter'

const isActive =(id)=> window.location.hash.split('/')[5] === id.toString()

export class EventCategoryAsideLive {
	constructor(event) {
		this.event = event
		this.id = event.id
		this.leagueId = event.leagueId
		this.sportId = event.sportId
		this.competitors = event.competitors
		this.additionalData = event.additionalData

		this.type = 'div'
		this.classes = ['event_container_outer', 'flex-container', 'align-justify']
		this.listeners = [{ event: 'click', cb: this.onClick }]

		this.node = null
		this.leftPart = null 
		this.rightPart = null
		this.timer = null

		if (isActive(this.id)){
			this.classes.push('active')
		}

	}

	onClick = e => {
		e.preventDefault()
		e.stopPropagation()
 
		window.history.pushState(
			'',
			'',
			`./#/live/event/${this.sportId}/${this.leagueId}/${this.id}`
		)

		window.changeContent()

	}

	startTimer = () => {
		if (!isEmpty(this.additionalData)) {
			const { eventClock, periodId } = this.additionalData

			const node = findNode('.', 'event_time', this.node)

			this.timer = new Timer({ clock: eventClock, periodId, node })
			this.timer.init()
		}
	}

	setScoreTemplate = () => {
		const { homeScore, awayScore } = getCompetitorsScore(
			this.event.sportId,
			this.additionalData
		)

		return `
			<div class="event_right">
					<div class="event_set_score flex-container">
							${homeScore.map(score => `<div>${score}</div>	`).join('')}
					</div>
					<div class="event_set_score flex-container">
						${awayScore.map(score => `<div>${score}</div>	`).join('')}
					</div>
			</div>`
	}

	periodScoreTemplate = () => {
		const { currentAwayScore = 0, currentHomeScore = 0 } = getScore(
			this.additionalData
		)

		return `
				<div class="event_right">
						 <div class="event_score">${currentHomeScore} - ${currentAwayScore}</div>
						 <div class="event_time">00:00</div>
			 	 </div>`
	}

	withCurrentServerTemplate = () => {
		const current = getCurrentServer(this.additionalData)
		const currentNames = ['HOME', 'AWAY']

		return `${this.competitors
			.map(({ name }, idx) =>
				this.competitorsSetTemplate(name, currentNames[idx] === current)
			)
			.join('')}`
	}

	withoutCurrentServerTemplate = () => {
		return ` ${this.competitors
			.map(({ name }) => this.competitorsTemplate(name))
			.join('')}`
	}

	competitorsTemplate = name => `<div class="event_command">${name}</div>`

	competitorsSetTemplate = (name, current) =>
		`<div class="event_command ${current ? 'primary' : 'second'}">${name}</div>`

	leftPartTemplate = () => {
		this.leftPart.innerHTML = this.additionalData.currentServer
			? this.withCurrentServerTemplate()
			: this.withoutCurrentServerTemplate()
	}

	rightPartTemplate = () => {
		this.rightPart.innerHTML = this.additionalData.eventClock
			? this.periodScoreTemplate()
			: this.setScoreTemplate()
	}

	forTournamentTemplate = () => {
		this.node.innerHTML = `<div class="event_command">${this.event.name}`
	}

	forMatchTemplate =()=> {
		this.node.innerHTML = `
				<!--<div class="star event-to_fav"></div>-->
				 <div class="event_left"></div>
				 <div class="event_right"></div>`

		this.leftPart = findNode('.', 'event_left', this.node)
		this.rightPart = findNode('.', 'event_right', this.node)

		this.leftPartTemplate()
		this.rightPartTemplate()
		this.startTimer()
	}

	light =()=> {
		isActive(this.id) ? this.node.classList.add('active') : this.node.classList.remove('active')
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		if (this.event.eventType === 'Tournament') {
			this.forTournamentTemplate()
		}else {
			this.forMatchTemplate()
		}

		storageEmitter.writeEventToStorage('event', this.light)

		return this.node
	}

	updatePeriod = () => {
		this.timer.update({
			eventClock: this.additionalData.eventClock,
			periodId: this.additionalData.periodId,
		})

		this.rightPartTemplate()
	}

	updateSet = () => {
		this.leftPartTemplate()
		this.rightPartTemplate()
	}

	update = event => {
		if (event.additionalData) {
			if (!isEqualOutcomes(this.additionalData, event.additionalData)) {
				this.additionalData = event.additionalData

				if (event.additionalData.eventClock) {
					this.updatePeriod()
				} else {
					this.updateSet()
				}
			}
		}
	}

	destroy = () => {

		if (this.timer) {
			this.timer.destroy()
		}

		storageEmitter.removeCallback('event', this.light)
		this.node.remove()
	}
}
