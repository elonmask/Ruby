import { EventPrematchCategory } from '../eventLiveCategory/eventPrematchCategory'
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
import { betButtonHandler } from '../../rightColumn/betslip/actions/betslipActions'

export class PrematchLeagueCategory {
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

		this.events = []
		this.eventsInstances = {}

		this.lastDate = "";
		this.settledBets = JSON.parse(sessionStorage.getItem('topBetsB')) == null ? [] : JSON.parse(sessionStorage.getItem('topBetsB'));

	}

	loadEvents = async () => {
		try {
			const { events } = await getRequest(links.prematchLeague + this.id)

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
			//await this.subscribeToUpdate()
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
		//console.log(event)
		if (true/*window.location.hash.split('/')[3] == 1*/) {
			//console.log(window.location)
			if (this.lastDate == "" || this.lastDate.slice(8, 10) + '.' + this.lastDate.slice(5, 7) + "." + this.lastDate.slice(0, 4) != event.startDate.slice(8, 10) + '.' + event.startDate.slice(5, 7) + '.' + event.startDate.slice(0, 4)) {
				if (event.odds[0].outcomes.length == 2) {
					const title = document.createElement('div');
				title.innerHTML = `
				<div class="topBets-cell" style="background-color: rgb(40, 20, 32); height: 34px; display: flex;     border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<div class="flex-container align-center-middle time" style="max-width: 350px; min-width: 350px; background-color: rgb(33, 33, 33); padding-left: 10px; justify-content: flex-start;">
			<p class="font white ellipsis text-left team-name" style="width: 188px;">${event.startDate.slice(8, 10) + '.' + event.startDate.slice(5, 7) + '.' + event.startDate.slice(0, 4)}</p>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; background-color: rgb(33, 33, 33); flex: 1 1 auto;"><p class="font white ellipsis" style="display: flex; justify-content: center; text-align: center;">1</p></div>
		<div class="flex-container align-center-middle" style="width: 10px; background-color: rgb(33, 33, 33); flex: 1 1 auto;"><p class="font white ellipsis" style="width: 100%; display: flex; text-align: center; justify-content: center;">2</p></div>
		<a class="button coefficient last" style="max-width: 70px; background-color: rgb(33, 33, 33)">
							</a>
	</div>
				` 
				this.eventsContainer.append(title);
				const bets = document.createElement('div');
					bets.innerHTML = `
				<div class="topBets-cell" style="display: flex; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;" >
		<div class="flex-container align-center-middle time" style="max-width: 350px; min-width: 350px; background-color: #392430; padding-left: 10px; justify-content: flex-start; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<p class="font white ellipsis text-left team-name"><span style="margin-right: 15px; ">${event.startDate.slice(11, 16)}</span><a class="top-bets-font" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}">${event.competitors[0].name + ' v ' + event.competitors[1].name}</a></p>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0]?.outcomes[0]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[0].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[0].oddValue).toFixed(3)}</p></button>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0]?.outcomes[1]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[1].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[1].oddValue).toFixed(3)}</p></button>
		</div>
		<a class="button coefficient last" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}" style="max-width: 70px;display: flex;justify-content: center;">
								<p class="font ellipsis inplayLM" >+${event.oddsCount}</p> 
							</a>
	</div>
				`
				this.eventsContainer.append(bets);
				this.lastDate = event.startDate;
				} else {
					const title = document.createElement('div');
				title.innerHTML = `
				<div class="topBets-cell" style="background-color: rgb(40, 20, 32); height: 34px; display: flex;     border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<div class="flex-container align-center-middle time" style="width: 268px; background-color: rgb(33, 33, 33); padding-left: 10px; justify-content: flex-start;">
			<p class="font white ellipsis text-left team-name" style="width: 188px;">${event.startDate.slice(8, 10) + '.' + event.startDate.slice(5, 7) + '.' + event.startDate.slice(0, 4)}</p>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; background-color: rgb(33, 33, 33); flex: 1 1 auto;"><p class="font white ellipsis" style="display: flex; justify-content: center; text-align: center;">1</p></div>
		<div class="flex-container align-center-middle" style="width: 10px; background-color: rgb(33, 33, 33); flex: 1 1 auto;"><p class="font white ellipsis" style="width: 100%; display: flex; justify-content: center; text-align: center;">X</p></div>
		<div class="flex-container align-center-middle" style="width: 10px; background-color: rgb(33, 33, 33); flex: 1 1 auto;"><p class="font white ellipsis" style="width: 100%; display: flex; text-align: center; justify-content: center;">2</p></div>
		<a class="button coefficient last" style="max-width: 70px; background-color: rgb(33, 33, 33)">
							</a>
	</div>
				` 
				this.eventsContainer.append(title);
				const bets = document.createElement('div');
					bets.innerHTML = `
				<div class="topBets-cell" style="display: flex; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;" >
		<div class="flex-container align-center-middle time" style="width: 268px; background-color: #392430; padding-left: 10px; justify-content: flex-start; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<p class="font white ellipsis text-left team-name"><span style="margin-right: 15px; ">${event.startDate.slice(11, 16)}</span><a class="top-bets-font" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}">${event.competitors[0].name + ' v ' + event.competitors[1].name}</a></p>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0]?.outcomes[0]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[0].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[0].oddValue).toFixed(3)}</p></button>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0]?.outcomes[1]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[1].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[1].oddValue).toFixed(3)}</p></button>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event?.odds[0]?.outcomes[2]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[2].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[2].oddValue).toFixed(3)}</p></button>
		</div>
		<a class="button coefficient last" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}" style="max-width: 70px;display: flex;justify-content: center;">
								<p class="font ellipsis inplayLM" >+${event.oddsCount}</p> 
							</a>
	</div>
				`
				this.eventsContainer.append(bets);
				this.lastDate = event.startDate;
				}
			} else {
				const bets = document.createElement('div');
				if (event.odds[0].outcomes.length == 2) {
					bets.innerHTML = `
				<div class="topBets-cell" style="display: flex; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;" >
		<div class="flex-container align-center-middle time" style="max-width: 350px; min-width: 350px; background-color: #392430; padding-left: 10px; justify-content: flex-start; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<p class="font white ellipsis text-left team-name"><span style="margin-right: 15px; ">${event.startDate.slice(11, 16)}</span><a class="top-bets-font" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}">${event.competitors[0].name + ' v ' + event.competitors[1].name}</a></p>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0]?.outcomes[0]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[0].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[0].oddValue).toFixed(3)}</p></button>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0]?.outcomes[1]?.id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[1].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[1].oddValue).toFixed(3)}</p></button>
		</div>
		<a class="button coefficient last" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}" style="max-width: 70px;display: flex;justify-content: center;">
								<p class="font ellipsis inplayLM" >+${event.oddsCount}</p> 
							</a>
	</div>
				`
				this.eventsContainer.append(bets);
				this.lastDate = event.startDate;
				} else {
					bets.innerHTML = `
				<div class="topBets-cell" style="display: flex; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;" >
		<div class="flex-container align-center-middle time" style="width: 268px; background-color: #392430; padding-left: 10px; justify-content: flex-start; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<p class="font white ellipsis text-left team-name"><span style="margin-right: 15px; ">${event.startDate.slice(11, 16)}</span><a class="top-bets-font" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}">${event.competitors[0].name + ' v ' + event.competitors[1].name}</a></p>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
			<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0].outcomes[0].id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[0].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[0].oddValue).toFixed(3)}</p></button>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0].outcomes[1].id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[1].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[1].oddValue).toFixed(3)}</p></button>
		</div>
		<div class="flex-container align-center-middle" style="width: 10px; flex: 1 1 auto; border-bottom: 1px solid #3a181d; border-right: 1px solid #3a181d;">
		<button data-listener="false" data-id="betbutton"  class="button coefficient coef_item ${ this.settledBets.includes(event.odds[0].outcomes[2].id) ? 'on' : 'off' }" data-outcome="${event.odds[0].outcomes[2].id}" data-odd="${event.odds[0].id}" style="display: flex; justify-content: center;"><p class="font">${parseFloat(event.odds[0].outcomes[2].oddValue).toFixed(3)}</p></button>
		</div>
		<a class="button coefficient last" href="#/sports/table/${event.sportId}/${event.leagueId}/${event.id}" style="max-width: 70px;display: flex;justify-content: center;">
								<p class="font ellipsis inplayLM" >+${event.oddsCount}</p> 
							</a>
	</div>
				`
				this.eventsContainer.append(bets);
				this.lastDate = event.startDate;
				}
			}
			
			document.querySelectorAll('[data-id="betbutton"]').forEach(button => {
				if (button.dataset.listener != "true") {
					button.addEventListener('click', (e) => {
						const { odd, outcome } = e.target.closest('.coef_item').dataset
						if (button.classList.contains('on')) {
							button.classList.remove('on')
							betButtonHandler({ event: event, oddId: odd, stakeId: parseInt(outcome), e })
							this.settledBets.forEach((item, idx) => {
								if (item == parseInt(outcome)) {
									this.settledBets[idx] = '';
								}
							})
							sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
						} else {
							button.classList.add('on')
							betButtonHandler({ event: event, oddId: odd, stakeId: outcome, e })
							this.settledBets.push(parseInt(outcome));
							//console.log(this.settledBets)
							sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
						}
					})
					button.dataset.listener = "true";
				}
			})
		} else {  
			const eventItem = new EventPrematchCategory(event, this.marketsName)
			this.eventsInstances[event.id] = eventItem
			this.eventsContainer.append(eventItem.render())
		}
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

		/*if(this.marketsTitleLength === 3){
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
		}*/
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

		this.appendImage()
		this.renderEmptyTemplate()
 
		inplayLeague.init()
		this.leagueLoading()

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
