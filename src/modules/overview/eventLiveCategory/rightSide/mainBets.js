import { transformOutcomeName } from '../../../../helpers/transform/transform'
import {
	getFromStorage,
	writeToStorage,
} from '../../../../storage/storageMethod'
import _ from 'lodash'
import { createElement } from '../../../../helpers/createElement'
import { findAllNodes, findNode, fixed } from '../../../../helpers/utils'
import { getUserStakes } from '../../../../selectors/selectors'
import { refreshStakes } from '../../../rightColumn/betslip/actions/betslipRequests'

export class MainBets {
	constructor(
		{ id, name = '', odds },
		competitors,
		oddsCount,
		{ id: eventId, sportId, leagueId }, marketName) {

		this.odds = odds
		this.name = name
		this.id = id
		this.competitors = competitors
		this.oddsCount = oddsCount
		this.leagueId = leagueId
		this.sportId = sportId
		this.eventId = eventId
		this.leagueCurrentMarket = marketName

		this.div = null
		this.type = 'div'
		this.classes = ['main-bets', 'inplay-right_menu', 'active']

		this.marketTitleNode = null
		this.buttonsContainer = null
		this.oddsCountNode = null
		this.buttons = {}
	}

	buttonTemplate = ({ oddValue, id, status }) => {
		console.log("Status",status);
		const button = createElement({
			type: 'button',
			classes: [
				'coef_item',
				'coefficient',
				'button',
				'flex-container',
				`${getFromStorage('userStakes')[id] ? 'on' : 'off'}`,
			],
			attributes: [
				{ name: 'data-outcome', value: id },
				{ name: 'data-odd', value: this.id },
			],
			style:{
				justifyContent:'center'
			}
		})

		if (status == 1) {
			button.style.backgroundColor = "#313145";
			button.innerHTML = `<span class="fa fa-lock lock"></span>`;
			button.dataset.locked = true;
		} else {
			button.innerHTML = `<p class="font blick">${fixed(oddValue, 3)}</p>`
		}

		this.buttons[id] = button

		return button
	}

	renderButtons = () => {
		const { outcomes, specifiers } = this.odds[0]

		if (outcomes.length < 2) {
			console.log(outcomes.length)
		}
		outcomes.forEach(outcome => {
			outcome.outcome = transformOutcomeName(
				outcome.outcome,
				specifiers,
				this.competitors
			)
			this.buttonsContainer.append(this.buttonTemplate(outcome))
		})
	}

	marketHeaderTemplate =()=> {
		if (this.name !== this.leagueCurrentMarket){
			if (this.odds?.[0]){
				const odds = this.odds[0].outcomes
				if (odds.length === 3){
					this.marketTitleNode.innerHTML = `
						<div class="flex-container full_width align-center-middle">
							<p class="font m-white text-center" style="flex:1 1 25%">1</p>
							<p class="font m-white text-center" style="flex:1 1 25%">X</p>
							<p class="font m-white text-center" style="flex:1 1 25%">2</p>
							<p class="font m-white mr text-center ellipsis" style="max-width: 80px; min-width: 80px">${this.name}</p>	
						</div>	
					`
				}

				if (odds.length === 2){
					this.marketTitleNode.innerHTML = `
						<div class="flex-container full_width align-center-middle">
							<p class="font m-white text-center" style="flex:1 1 33%">1</p>
							<p class="font m-white text-center" style="flex:1 1 33%">2</p>
							<p class="font m-white mr text-center ellipsis" style="max-width: 80px; min-width: 80px">${this.name}</p>	
						</div>	
					`
				}
			}
		}else {
			this.marketTitleNode.innerHTML = `<p class="font white ml flex-container">${this.name}</p>`
		}
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.innerHTML = `
			 		<div class="flex-container align-middle market_title full_width"></div>
					<div class="flex-container align-middle">
						<button class="button reload reload--left">
							<i class="fa fa-angle-left"></i>
						</button>
						<div class="flex-container align-middle inplayTeamButtons"></div>
						<button class="button reload reload--right">
							<i class="fa fa-angle-right"></i>
						</button>
						<a class="button coefficient last" href="#/live/event/${this.sportId}/${this.leagueId}/${this.eventId}">
							<p class="font ellipsis inplayLM" >+${this.oddsCount}</p> 
						</a>
				</div>`

		this.marketTitleNode = findNode('.', 'market_title', this.div)
		this.buttonsContainer = findNode('.', 'inplayTeamButtons', this.div)
		this.oddsCountNode = findNode('.', 'inplayLM', this.div)

		if (this.odds) {
			this.renderButtons()
			this.marketHeaderTemplate()
		}

		return this.div
	}

	updateBetslip = async ({ id, oddValue }) => {
		const allStakes = getUserStakes()
		if (allStakes[id]) {
			const splited = allStakes[id].split('#')
			splited[1] = `o=${oddValue}`

			writeToStorage('userStakes', {
				...allStakes,
				[id]: splited.join('#'),
			})
		}
	}

	updateButtons = currentOdd => {

		if (!this.odds){

			this.odds = currentOdd.odds
			this.name = currentOdd.odds[0].name

			this.renderButtons()
			this.marketHeaderTemplate()
			return
		}

		const difference = _.difference(
			currentOdd.odds[0].outcomes,
			this.odds[0].outcome
		)

		difference.forEach(({ id, oddValue }) => {
			const span = findNode('.', 'blick', this.buttons[id])

			this.updateBetslip({ id, oddValue })

			const oldValue = span.innerText

			if (Number(oldValue) > oddValue) {
				span.classList.add('down')
				span.classList.remove('up')
			}

			if (Number(oldValue) < oddValue) {
				span.classList.add('up')
				span.classList.remove('down')
			}

			if (Number(oldValue) === oddValue) {
				span.classList.remove('up')
				span.classList.remove('down')
			}

			span.innerText = fixed(oddValue, 2)
		})
	}

	update = ({ currentOdd, oddsCount }) => {

		if (currentOdd) {
			this.updateButtons(currentOdd)
		} else {
			this.odds = null
			this.buttonsContainer.innerHTML = ''
			this.marketTitleNode.innerHTML = ''
		}

		if (oddsCount) {
			this.oddsCountNode.innerHTML = `+${oddsCount}`
		}
	}
}
