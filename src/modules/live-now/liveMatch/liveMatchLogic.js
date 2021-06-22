import { findNode, getRequest } from '../../../helpers/utils'
import { BetButton } from '../../markets/components/betButton'
import { links } from '../../../links/links'
import { transformOutcomeName } from '../../../helpers/transform/transform'

export class LiveMatchLogic {
	constructor({ container, id, update, name }) {

		this.parentUpdate = update
		this.container = container
		this.id = id
		this.name = name

		this._data = null
		this.odds = []
		this.competitors = []
		this.sportId = null
		this.leagueId = null

		this.timerId = null
		this.updateEnable = false
		this.buttons = {}
	}

	get data(){
		return this._data
	}

	set data(data){
		const {competitors, sportId, leagueId, odds = [] } = data

		this._data = data
		this.competitors = competitors
		this.sportId = sportId
		this.leagueId = leagueId
		this.odds = odds

		this.updateComponents()
	}

	getOdds =()=> {
		return this.odds.find(odd => odd.name === '3 Way') || this.odds[0]
	}

	renderButtons =()=> {
		const buttonsContainer = findNode('.', 'live-now-right-button', this.container)
		const marketNameContainer = findNode('.', 'market_name', this.container)


		if (this.getOdds()){
			buttonsContainer.innerHTML = ''
			marketNameContainer.innerHTML = ''

			const { id, outcomes, specifiers, name } = this.getOdds()

			let buttonCounter = 0;
			outcomes.forEach(odd => {
				const button = new BetButton({ competitors: this.competitors, groupId:id, odd, specifiers, event: this.data})

				this.buttons[odd.id] = button

				buttonsContainer.append(button.render())
				buttonCounter++;
			})

			if (buttonCounter == 2) {
				this.container.style.paddingTop = "15px";
			}

			marketNameContainer.innerHTML = transformOutcomeName(name, specifiers, this.competitors)

		}
	}

	renderScore =()=> {

		const score = findNode('.', 'score', this.container)

		const { currentAwayScore = 0, currentHomeScore = 0 } = this.data.additionalData?.scoreboard?.data || {}

		score.innerHTML = `${currentHomeScore} : ${currentAwayScore}`
	}

	render =()=> {
		this.container.innerHTML = `
			<div class="flex-container align-middle live-now-right-text">
					<a href="./#/live/event/${this.sportId}/${this.leagueId}/${this.id}" class="font mr ellipsis">${ this.competitors.map(({ name }) => name).join(' v ') }</a>
					<p class="font text-uppercase">Live</p>
			</div>
			<div class="flex-container align-middle live-now-right-text">
					<p class="font mr ellipsis market_name"></p>
					<p class="font primary lg score"></p>
			</div>
			<div class="block live-now-right-button"></div>`

		this.renderScore()
		this.renderButtons()
	}

	loadEvent = async ()=> {
		try {
			const { event } = await getRequest(links.event + this.id)
			this.data = event

		}catch (e){
			console.log(e)
		}
	}

	init = async ()=> {
  	try {
			if (this.id){
				await this.loadEvent()
				await this.render()

				this.update()
			}
		} catch (e){
  		console.log(e)
		}
	}

	update =()=> {
		try {
			this.updateEnable = true
			this.timerId = setInterval(this.loadEvent, 3000)
		} catch (e){
			this.updateEnable = false
			this.parentUpdate()
			console.log(e)
		}
	}

	updateComponents =()=> {
			if (this.updateEnable){
				if (this.data.providerStatus === 'ended'){
					return this.parentUpdate()
				}

				this.renderScore()

				if (this.buttons && this.getOdds().outcomes){

					const check = this.getOdds().outcomes.every(odd => this.buttons[odd.id])

					if (!check){
						this.buttons = {}
						this.renderButtons()
						return
					}

					this.getOdds().outcomes.map(odd => {
						Object.keys(this.buttons).forEach(key => {
							if (odd.id === Number(key)){
								this.buttons[key].update(odd)
							}
						})
					})
				}
			}
	}

	destroy =()=> {
		clearInterval(this.timerId)
	}

}





