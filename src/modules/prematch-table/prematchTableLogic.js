import { getFromStorage, writeToStorage} from '../../storage/storageMethod'
import { writeToBetButtons } from '../../storage/nodes/betButtonsStorage'
import {
	findNode,
	getRequest,
	getRequestWithLoader,
	getRequestWithoutCredentials,
} from '../../helpers/utils'
import { transformOutcomeName } from '../../helpers/transform/transform'
import { betButtonHandler } from '../rightColumn/betslip/actions/betslipActions'
import { removeFromBetButtons } from '../../storage/nodes/betButtonsStorage'
import { links } from '../../links/links'

export class PrematchTableLogic {
	constructor() {
		this.type = 'PrematchTableLogic'
		this.currentSportId = window.location.hash.split('/')[3]
		this.currentSportName = null
		this.sportsID = [];

		this.leagueName = null
		this.competitorOne = null
		this.competitorTwo = null
		this.date = null
		this.oddsArray = null

		this.eventType = null
		this.tournamentName = null
		this.eventData = null

		this.updateinterval = null;

		this.tempContainer = null;
		this.settledBets = JSON.parse(sessionStorage.getItem('topBetsB')) == null ? [] : JSON.parse(sessionStorage.getItem('topBetsB'));
	}

	loadData = async () => {
		try {
			const { oddTypes } = await getRequest(links.oddTypes)
			this.eventData = await getRequestWithoutCredentials(
				links.event + window.location.hash.split('/')[5]
			)

			//console.log(this.eventData)
			this.eventType = this.eventData.event.eventType

			this.date = this.eventData.event.startDate.slice(8, 10) + '.' + this.eventData.event.startDate.slice(5, 7) + '.' + this.eventData.event.startDate.slice(0, 4) + ' ' + this.eventData.event.startDate.slice(11, 16);

			if (this.eventType == 'Tournament') {
				this.tournamentName = this.eventData.event.name
			} else {
				this.competitorOne = this.eventData.event.competitors[0].name
				this.competitorTwo = this.eventData.event.competitors[1].name
			}

			this.oddsArray = this.eventData.event.odds
		} catch (e) {
			console.log(e)
		}
	}

	formBetsContainer = odd => {
		let goalnr = ''
		let hcp = ''
		let total = ''
		let periodnr = ''

		let suffix1 = ''
		let suffix2 = ''
		
		const container = document.createElement('div')
		container.className = 'maTable__row'

		const betName = document.createElement('div')
		betName.className = 'maTable__cell full'
		const betNameChildContainer = document.createElement('div')
		betNameChildContainer.className = 'flex-container align-middle maInfo'

		if (typeof odd.specifiers !== 'undefined') {
			if (odd.specifiers.goalnr) {
				goalnr = odd.specifiers.goalnr
			} else if (odd.specifiers.hcp) {
				hcp = odd.specifiers.hcp
			} else if (odd.specifiers.total) {
				total = odd.specifiers.total
			} else if (odd.specifiers.suffix1) {
				suffix1 = odd.specifiers.suffix1
			} else if (odd.specifiers.suffix2) {
				suffix2 = odd.specifiers.suffix2
			} else if (odd.specifiers.periodnr) {
				periodnr = odd.specifiers.periodnr
			}
		}

		const titleSpan = document.createElement('span')
		titleSpan.className = 'font white ellipsis maInfo__text'
		titleSpan.textContent = odd.name
			.replace('{$competitor1}', this.competitorOne)
			.replace('{$competitor2}', this.competitorTwo)
			.replace('{!goalnr}', goalnr)

		const separator = document.createElement('hr')
		separator.className = 'maInfo__separate'
		/*const inform = document.createElement('a');
    inform.className = 'maInfo__inform';*/

		betNameChildContainer.appendChild(titleSpan)
		betNameChildContainer.appendChild(separator)
		//betNameChildContainer.appendChild(inform);

		betName.appendChild(betNameChildContainer)

		container.appendChild(betName)

		odd.outcomes.forEach(outcome => {
			//console.log(outcome)
			const bet_ = document.createElement('div')
			bet_.className = 'maTable__cell'
			const betButton = document.createElement('button')
			betButton.className = `button coefficient coef_item ${this.settledBets.includes(outcome.id) ? 'on' : ''}`
			betButton.dataset.outcome = outcome.id

			const name = document.createElement('p')
			name.className = 'font ellipsis mra'
			name.textContent = outcome.outcome
				.replace('{$competitor1}', this.competitorOne)
				.replace('{$competitor2}', this.competitorTwo)
				.replace('under {total}', 'Under ' + parseFloat(total).toFixed(3))
				.replace('over {total}', 'Over ' + parseFloat(total).toFixed(3))
				.replace('{$suffix1}', '')
				.replace('{$suffix2}', '')
				.replace(
					'{+hcp}',
					isNaN(parseFloat(hcp)) ? parseFloat(hcp) * (-1).toFixed(3) : hcp
				)
				.replace(
					'{-hcp}',
					isNaN(parseFloat(hcp)) ? parseFloat(hcp).toFixed() : hcp
				)
				.replace('{!goalnr}', goalnr)
				.replace('{!periodnr}', periodnr)

			const val = document.createElement('p')
			val.dataset.id = 'prematch_coef'
			val.dataset.stakeID = outcome.id;
			val.className = 'font blink'
			val.textContent = outcome.oddValue.toFixed(3)

			betButton.appendChild(name)
			betButton.appendChild(val)

			bet_.appendChild(betButton)
			container.appendChild(bet_)
			writeToBetButtons(betButton)
			betButton.addEventListener('click', event => {
				if (betButton.classList.contains('on')) {
					betButton.classList.remove('on')

					const betObj = {
						event: this.eventData.event,
						oddId: odd.id,
						stakeId: outcome.id,
						e: event,
					}
					betButtonHandler(betObj)
					this.settledBets.forEach((item, idx) => {
						if (item == outcome.id) {
							this.settledBets[idx] = '';
						}
					})
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				} else {
					betButton.classList.add('on')
					const betObj = {
						event: this.eventData.event,
						oddId: odd.id,
						stakeId: outcome.id,
						e: event,
					}
					betButtonHandler(betObj)
					this.settledBets.push(outcome.id);
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				}
			})
		})

		//document.getElementById('mainContainer').appendChild(container);
		return container
	}

	reDraw = () => {
	//	document.getElementById('mainContainer').innerHTML = '';
		//console.log(this.tempContainer.event.odds)
		document.querySelectorAll(`[data-id="prematch_coef"]`).forEach((coef) => {
			const coefVal = coef.textContent;
			const stakeId = coef.dataset.stakeID;

			this.tempContainer.event.odds.forEach((odd) => {
				odd.outcomes.forEach((outc) => {
					//console.log(outc.id + ' : ' + stakeId)
					if (outc.id == stakeId && parseFloat(outc.oddValue).toFixed(3) > coefVal) {
						console.log('changes')
						coef.classList.remove('donw');
						coef.classList.remove('up');
						coef.classList.add('up')
						coef.textContent = parseFloat(outc.oddValue).toFixed(3)
					} else if (outc.id == stakeId && parseFloat(outc.oddValue).toFixed(3) < coefVal) {
						console.log('changes')
						coef.classList.remove('donw');
						coef.classList.remove('up');
						coef.classList.add('down')
						coef.textContent = parseFloat(outc.oddValue).toFixed(3)
					}
				})
			})
		})
		/*this.oddsArray.forEach(bet => {
			document
				.getElementById('mainContainer')
				.appendChild(this.formBetsContainer(bet))
		})*/
	}

	Update = async () => {
		try {
			this.tempContainer = await getRequestWithoutCredentials(links.event + window.location.hash.split('/')[5]);
			await this.reDraw();
		} catch (err) {
			console.log(err);
		}
	}

	setTimer = () => {
		this.updateinterval = setInterval(() => {
			console.log('update');
			this.Update();
		}, 3000)
		window.addEventListener('hashchange', this.destroyTimer)
	}

	destroyTimer = () => {
		clearInterval(this.updateinterval);
		window.removeEventListener('hashchange', this.destroyTimer)
	}

	fillSportsID = async () => {
		let allData = null
		try {
			allData = await getRequestWithoutCredentials(links.prematchAll, 'GET')
			allData.forEach(sport => {
				let tempObj = {
					id: sport.id,
					name: sport.name,
				}
				this.sportsID.push(tempObj)
			})
		} catch (e) {
			console.log(e)
		}
		writeToStorage('sportsID', this.sportsID)
	}

	Draw = () => {
		console.log(this.sportsID)
		this.sportsID.forEach(item => {
			if (item.id == this.currentSportId) {
				this.currentSportName = item.name.toLowerCase()
			}
		})

		document.getElementById('headerTitle').textContent = this.currentSportName
		document.getElementById('headerIcon').style.content =
			'url(' +
			'http://bestline.bet/icon/sport/' + this.currentSportId +
			')'
		document.getElementById('headerIcon').style.marginLeft = '2px'
		document.getElementById('headerIcon').style.width = '55px'
		document.getElementById('headerIcon').style.height = '55px'

		getFromStorage('prematchLeagues').forEach(item => {
			if (item.id == window.location.hash.split('/')[4]) {
				this.leagueName = item.name
			}
		})

		document.getElementById('titleLeagueName').textContent = this.leagueName
		if (this.eventType == 'Tournament') {
			document.getElementById(
				'titleCompetition'
			).textContent = this.tournamentName
		} else {
			document.getElementById('titleCompetition').textContent =
				this.competitorOne + ' - ' + this.competitorTwo
		}
		/*let time = this.date.substring(this.date.indexOf('T') + 1).substring(0, 5)
		let date_ = this.date.substring(0, 10)*/
		document.getElementById('titleDate').textContent = this.date;

		//document.getElementById("mainContainer").appendChild(this.formBetsContainer('Some bet'));

		this.oddsArray.forEach(bet => {
			document
				.getElementById('prematch-forTable')
				.appendChild(this.formBetsContainer(bet))
		})
	}

	showData = async () => {
		try {
			await getRequestWithLoader(this.loadData)()
			await this.fillSportsID();
			await this.Draw()
		} catch (e) {
			console.log(e)
		}
	}

	init = () => {
		this.showData()
		this.setTimer();
	}

	destroy =()=> {
		console.log('timer')
		this.destroyTimer()
		findNode('#', 'prematch-forStat', document).innerHTML = ''
		findNode('#', 'prematch-forTable', document).innerHTML = ''
	}
}
