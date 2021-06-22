import { EventLiveCategory } from '../eventLiveCategory/eventLiveCategory'
import { inplayLeague } from '../../../webApi/inplayLeagues'
import { transformLeagueData } from '../../../helpers/transform/transform'
import { createElement } from '../../../helpers/createElement'
import {
	findNode,
	getDifference,
	getEventsId,
	getRequest,
	isEmpty,
} from '../../../helpers/utils'
import { links } from '../../../links/links'
import countryImages from '../../../json/countries.json'
import internationalFlag from '../../../img/icon-country/int.png'
import { EventLiveCategoryEmpty } from '../eventLiveCategory/empty/eventLiveCategoryEmpty'

export class LeagueLiveCategory {
	constructor(data) {
		this.data = data
		this.name = data.name
		this.id = data.id
		this.iconCode = data.iconCode
		this.inPlayMatchCount = data.inPlayMatchCount
		this.type = 'div'
		this.classes = ['inplay-league-wrapper']
		this.div = null

		this.eventsContainer = null
		this.marketsTitleNode = null
		this.marketsName = null
		this.marketsTitleLength = null
		this.header = null;

		this.events = []
		this.eventsInstances = {}

	}

	loadEvents = async () => {
		try {
			const { events } = await getRequest(links.league + this.id)

			this.data.groupOdds = transformLeagueData(events)
			this.events = events

			this.renderTitle()
			this.renderEvents()
		} catch (e) {
			console.log('League inplay error', e)
		}
	}

	subscribeToUpdate = () => {
		inplayLeague.addLeagueId({ id: this.id, cb: this.updateEvents })
	}

	unsubscribeOfUpdate = () => {
		inplayLeague.removeLeagueId(this.id)
	}

	leagueLoading = async () => {
		try {
			await this.loadEvents()
			await this.subscribeToUpdate()
		} catch (e) {
			console.log('Loading league failed', e)
		}
	}

	renderEvents = () => {

		this.eventsContainer.innerHTML = ''

		this.events.reverse();

		this.events.forEach(event => {
			if (event.eventType !== 'Tournament'){
				this.addEvent(event)
			}
		})
	}

	addEvent = event => {

		const eventItem = new EventLiveCategory(event, this.marketsName)

		this.eventsInstances[event.id] = eventItem

		this.eventsContainer.append(eventItem.render())
	}

	removeEvent = id => {
		this.eventsInstances[id].destroy()
		// this.eventsInstances[id] = null
		this.eventsInstances = Object.keys(this.eventsInstances).reduce(
			(acc, id) => {
				if (this.eventsInstances[id]) {
					acc[id] = this.eventsInstances[id]
				}
				return acc
			},
			{}
		)
	}

	updateEvents = events => {
		const old = getEventsId(this.events)

		const current = getEventsId(events)

		const { removed, added } = getDifference(old, current)

		if (!isEmpty(removed)) {
			console.log('removed events', removed)
			removed.forEach(id => {
				this.removeEvent(id)
			})
		}

		if (!isEmpty(added)) {
			console.log('added events', added)
			added.forEach(id => {
				const added = events.find(event => event.id === id)
				this.addEvent(added)
			})
		}

		this.events = events

		this.events.forEach(event => {
			if (this.eventsInstances[event.id]) {
				this.eventsInstances[event.id].update(event)
			}
		})
	}

	getImage = async ()=> {
		if (this.iconCode && countryImages[this.iconCode]){
			const imagePath = countryImages[this.iconCode] + '.png'
			return await import(`../../../img/icon-country/${imagePath}`)
		}
		return internationalFlag
	}

	appendImage = async ()=> {
		const subcategory = findNode('.', 'inplaySubcategory__title', this.div)

			try {
				const image = await this.getImage()
				const img = createElement({
					type:'img',
					attributes:[{name:'src', value:image.default || image}],
					classes:['icon']
				})
				subcategory.prepend(img)
			} catch(e){
				console.log(e)
			}
	}

	marketTitleTemplate =()=> {

		if(this.marketsTitleLength === 3){
			this.marketsTitleNode.innerHTML = `	
						<p class="font white text-center" style="flex: 1 1 25%">1</p>
						<p class="font white text-center" style="flex: 1 1 25%">X</p>
						<p class="font white text-center" style="flex: 1 1 25%">2</p>
						<p style="width: calc(10% + 80px)"></p>`
		}

		if (this.marketsTitleLength === 2){
			this.marketsTitleNode.innerHTML = `	
					<p class="font white text-center" style="flex: 1 1 33%">1</p>
					<p class="font white text-center" style="flex: 1 1 33%">2</p>
					<p  style="width: calc(10% + 80px)"></p>`
		}
	}

	renderTitle =()=> {
		if (this.data.groupOdds){
			const values = Object.values(this.data.groupOdds)

			if (values && values[0]){
				this.marketsName = values[0].name
				this.marketsTitleLength = values[0].odds[0].outcomes.length

				this.marketTitleTemplate()
			}
		}
	}

	renderEmptyTemplate =()=> {
		new Array(this.inPlayMatchCount).fill(0).forEach(item => this.eventsContainer.innerHTML = new EventLiveCategoryEmpty().render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.innerHTML = `	
						<div class="inplaySubcategory open" >
								<div class="inplaySubcategory__title flex-container align-middle" style="flex: 1 1 45%">
									<p class="font">${this.name}</p>
								</div>
								<div class="flex-container align-middle align-spaced inplaySubcategory__markets_title" style="flex: 1 1 55%; justify-self: flex-end"></div>
						</div>
						<div class="inplay-events-container"></div>`

		this.eventsContainer = findNode('.', 'inplay-events-container', this.div)
		this.marketsTitleNode = findNode('.', 'inplaySubcategory__markets_title', this.div)

		this.header = findNode('.', 'inplaySubcategory', this.div)

		this.appendImage()
		this.renderEmptyTemplate()

		inplayLeague.init()
		this.leagueLoading()

		this.header.addEventListener('click', () => {
			if (this.header.classList.contains('open')) {

				this.eventsContainer.style.display = "none";
				this.header.classList.remove('open');
				this.header.classList.add('closed');
			} else {
				this.eventsContainer.style.display = "block";
				this.header.classList.remove('closed');
				this.header.classList.add('open');
			}
		});

		return this.div
	}

	destroy = () => {
		// console.log('destroy league category')

		this.div.remove()
		this.unsubscribeOfUpdate()

		Object.values(this.eventsInstances).forEach(instance => {
			instance.destroy()
		})

		this.eventsInstances = {}
	}
}
