import { EventCategoryAsideLive } from './eventCategoryAsideLive'
import { createElement } from '../../../helpers/createElement'
import {
	findNode,
	getDifference,
	getRequest,
	isEmpty,
} from '../../../helpers/utils'
import { links } from '../../../links/links'
import { inplayLeague } from '../../../webApi/inplayLeagues'
import countryImages from '../../../json/countries.json'
import internationalFlag from '../../../img/icon-country/int.png'

export class LeagueCategoryAsideLive {
	constructor(league) {
		this.league = league
		this.id = league.id
		this.iconCode = league.iconCode

		this.type = 'div'
		this.classes = ['classification_inplay_competition_league'] /*closed*/
		this.listeners = [{ event: 'click', cb: this.onClick }]

		this.node = null
		this.eventsContainer = null
		this.events = null
		this.titleNode = null

		this.eventsInstance = {}
		this.open = this.checkLeagueId()
	}

	checkLeagueId = () =>
		window.location.hash.split('/')[4] === this.id.toString()

	onClick = async e => {
		e.stopPropagation()

		this.open = !this.open
		if (!this.events || !this.events.length) {
			await this.loadEvents()
		}

		this.lightTitle()
		this.renderEvents()
	}

	lightTitle = () => {
		if (this.open) {
			this.titleNode.classList.add('active')
		} else {
			this.titleNode.classList.remove('active')
		}
	}

	addEvent = event => {
		this.eventsInstance[event.id] = new EventCategoryAsideLive(event)

		this.eventsContainer.append(this.eventsInstance[event.id].render())
	}

	removeEvent = id => {
		this.eventsInstance[id].destroy()

		this.eventsInstance = Object.keys(this.eventsInstance).reduce(
			(acc, key) => {
				if (id !== key) {
					acc[key] = this.eventsInstance[key]
				}
				return acc
			},
			{}
		)
	}

	loadEvents = async () => {
		try {
			const { events } = await getRequest(links.league + this.id)
			const eventsCleared = [];
			console.log("EVENTS: ", events);
			this.events = events
		} catch (e) {
			this.events = []
			console.log(e)
		}
	}

	renderEvents = () => {
		if (this.open) {
			this.events.forEach(event => this.addEvent(event))
			inplayLeague.addLeagueId({ id: this.id, cb: this.update })
		} else {
			inplayLeague.removeLeagueId(this.id)
			if (!isEmpty(this.eventsInstance)) {
				Object.values(this.eventsInstance).forEach(instance => {
					instance.destroy()
				})
			}
			this.eventsInstance = {}
		}
	}

	openEvents = async () => {
		try {
			if (this.open) {
				if (!this.events || !this.events.length) {
					await this.loadEvents()
				}

				this.lightTitle()
				this.renderEvents()
			}
		} catch (e) {
			console.log('leagueCategoryAside', e)
		}
	}

	getImage = async ()=> {
		if (this.iconCode && countryImages[this.iconCode]){
			const imagePath = countryImages[this.iconCode] + '.png'
			return await import(`../../../img/icon-country/${imagePath}`)
		}
		return internationalFlag
	}

	appendImage = async ()=> {
		const subcategory = findNode('.', 'classification_inplay_competition_league_title', this.node)

		try {
			const image = await this.getImage()
			const img = createElement({
				type:'img',
				attributes:[{name:'src', value:image.default || image}],
				classes:['icon_country']
			})
			subcategory.prepend(img)
		} catch(e){
			console.log(e)
		}
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.node.innerHTML = `
				<div class="flex-container classification_border__league">
						 <div class="classification_inplay_competition_league_title ellipsis flex-container align-middle">
						 <p class="font ellipsis" style="line-heigh: 34px;">
						 ${this.league.name}
						 </p>		
							</div>
				</div>
				<div class="classification_inplay_competition_league_events"></div>`


		this.appendImage()

		this.titleNode = findNode(
			'.',
			'classification_inplay_competition_league_title',
			this.node
		)

		this.eventsContainer = findNode(
			'.',
			'classification_inplay_competition_league_events',
			this.node
		)

		this.openEvents()
		inplayLeague.init()

		return this.node
	}

	update = events => {
		if (events && !isEmpty(events)) {
			const old = this.events.map(event => event.id)
			const current = events.map(event => event.id)

			const { removed, added, others } = getDifference(old, current)

			if (!isEmpty(removed)) {
				removed.forEach(id => {
					this.removeEvent(id)
				})
			}

			if (!isEmpty(added)) {
				added.forEach(key => {
					const event = events.find(event => event.id === key)

					this.addEvent(event)
				})
			}

			if (!isEmpty(others)) {
				others.forEach(key => {
					const event = events.find(event => event.id === key)

					this.eventsInstance[key].update(event)
				})
			}

			this.events = events
		}
	}

	destroy = () => {

		inplayLeague.removeLeagueId(this.id)
		Object.values(this.eventsInstance).forEach(instance => instance.destroy())

		this.node.remove()
	}
}
