import { getRequest, getRequestWithLoader, getRequestWithoutCredentials, useTranslate, getSession, setSession} from '../../helpers/utils'
import { writeToStorage } from '../../storage/storageMethod'
import { getFromStorage } from '../../storage/storageMethod'
import { links } from '../../links/links'
import { betButtonHandler, removeStake } from '../rightColumn/betslip/actions/betslipActions'
import { get } from 'lodash'
import { writeToBetButtons } from '../../storage/nodes/betButtonsStorage'
 
export class TopBetsLogic {
	constructor() {
		this.data = null
		this.sportsID = []
		this.sports = []
		this.allOdds = []
		this.containerCategories = document.getElementById('topBetsCategories')
		this.betTable = document.getElementById('column-topBets-frs')
		this.lastClickedBet = null;
		this.settledBets = JSON.parse(sessionStorage.getItem('topBetsB')) == null ? [] : JSON.parse(sessionStorage.getItem('topBetsB'));

		this.eventName = null;
		this.leagueName = null;
		this.sport = null;
		this.lasDate = null;
		this.ids = [];
	}

	formAllOdds = async (data) => {
		//console.log(data);
		data.forEach(item => {
			if (typeof item.odds !== 'undefined') {
				let oddItem = {
					fullEvent: item,
					event: null,
					sport: null,
					comp1: null,
					comp2: null,
					date: null,
					odds: {
						name: null,
						val1: {
							val: null,
							outcome: null,
							stakeId: null,
						},
						val2: {
							val: null,
							outcome: null,
							stakeId: null,
						},
						val3: {
							val: null,
							outcome: null,
							stakeId: null,
						},
					},
				}
	
				this.sportsID.forEach(elem => {
					if (elem.id == item.sportId) {
						oddItem.sport = elem.name
					}
				})
	
	
				oddItem.event = item.id;
				oddItem.comp1 = item.competitors[0].name
				oddItem.comp2 = item.competitors[1].name
				oddItem.date = item.startDate
				
				item.odds.forEach(od => {
					if (od.name.includes('Way') || od.name.includes('Матча') || od.name.includes("1x2") || od.name.includes('way')) {
						oddItem.odds.name = od.name
						if (od.outcomes.length == 2) {
							oddItem.odds.val1.val = od.outcomes[0].oddValue
							oddItem.odds.val1.outcome = od.id
							oddItem.odds.val1.stakeId = od.outcomes[0].id
							oddItem.odds.val3.val = od.outcomes[1].oddValue
							oddItem.odds.val3.outcome = od.id
							oddItem.odds.val3.stakeId = od.outcomes[1].id
						} else if (od.outcomes.length == 3) {
							oddItem.odds.val1.val = od.outcomes[0].oddValue
							oddItem.odds.val1.outcome = od.id
							oddItem.odds.val1.stakeId = od.outcomes[0].id
							oddItem.odds.val2.val = od.outcomes[1].oddValue
							oddItem.odds.val2.outcome = od.id
							oddItem.odds.val2.stakeId = od.outcomes[1].id
							oddItem.odds.val3.val = od.outcomes[2].oddValue
							oddItem.odds.val3.outcome = od.id
							oddItem.odds.val3.stakeId = od.outcomes[2].id
						}
					}
				})
	
				if (oddItem.odds.name != null) {
					this.allOdds.push(oddItem)
				}
			}
		})

		//console.log(this.allOdds)
	}

	constructTitleElement = (date, type) => {

		if (type == '3 Way' || type == 'Результат Матча 1 X 2' || type == '1x2' || type == "3 way ") {
		const container = document.createElement('div');
		container.style.backgroundColor = '#281420';
		container.style.height = '34px';
		container.className = 'topBets-cell';
		const leftContainer = document.createElement('div');
		leftContainer.className = 'flex-container align-center-middle time';
		leftContainer.style.minWidth = '268px';
		leftContainer.style.backgroundColor = '#212121';
		leftContainer.style.paddingLeft = '10px';
		leftContainer.style.justifyContent = 'flex-start';

		const Date = document.createElement('p');
		Date.className = 'font white ellipsis text-left team-name';
		Date.textContent = date;
		Date.style.width = '188px';

		leftContainer.append(Date);
		container.append(leftContainer);
/*
		const right = document.createElement('div');
		right.style.paddingTop = '5px';
		right.style.height = '34px';
		*/

		const oneContainer = document.createElement('div');
		oneContainer.className = 'flex-container align-center-middle';
		oneContainer.style.width = '10px';
		oneContainer.style.backgroundColor = '#212121';

		const twoContainer = document.createElement('div');
		twoContainer.className = 'flex-container align-center-middle';
		twoContainer.style.width = '10px';
		twoContainer.style.backgroundColor = '#212121';

		const xContainer = document.createElement('div');
		xContainer.className = 'flex-container align-center-middle';
		xContainer.style.width = '10px';
		xContainer.style.backgroundColor = '#212121';

		const one = document.createElement('p');
		one.width = '100%';
		one.style.display = 'flex';
		one.style.justifyContent = 'center';
		one.style.textAlign = 'center';
		one.className = 'font white ellipsis';
		one.textContent = '1';

		oneContainer.append(one);

		const x = document.createElement('p');
		x.style.width = '100%';
		x.style.display = 'flex';
		x.style.justifyContent = 'center';
		x.style.textAlign = 'center';
		x.className = 'font white ellipsis';
		x.textContent = 'X';

		xContainer.append(x);

		const two = document.createElement('p');
		two.style.width = '100%';
		two.style.display = 'flex';
		two.style.textAlign = 'center';
		two.style.justifyContent = 'center';
		two.className = 'font white ellipsis';
		two.textContent = '2';

		twoContainer.append(two)


		container.append(oneContainer);
		container.append(xContainer);
		container.append(twoContainer);
		
		const all = document.createElement('div');
				all.className = 'button coefficient last';
				all.style.maxWidth = "60px";
				all.style.backgroundColor = "rgb(33, 33, 33)";
		container.append(all);

		//container.append(right);

		return container;
		} else {
		const container = document.createElement('div');
		container.style.backgroundColor = '#281420';
		container.className = 'topBets-cell';
		container.style.height = '34px';
		const leftContainer = document.createElement('div');
		leftContainer.className = 'flex-container align-center-middle time';
		leftContainer.style.minWidth = '268px';
		leftContainer.style.backgroundColor = '#212121';
		leftContainer.style.paddingLeft = '10px';
		leftContainer.style.justifyContent = 'flex-start';

		const Date = document.createElement('p');
		Date.className = 'font white ellipsis text-left team-name';
		Date.textContent = date;
		Date.style.width = '188px';

		leftContainer.append(Date);
		container.append(leftContainer);

		/*const right = document.createElement('div');
		right.style.width = '55%';
		right.style.paddingTop = '5px';
		right.style.height = '34px';
		right.style.display = 'flex';
		right.style.justifyContent = 'space-between';*/

		const oneContainer = document.createElement('div');
		oneContainer.className = 'flex-container align-center-middle';
		oneContainer.style.width = '10px';
		oneContainer.style.backgroundColor = '#212121';


		const one = document.createElement('p');
		one.style.width = '100%';
		one.style.display = 'flex';
		one.style.justifyContent = 'center';
		one.style.textAlign = 'center';
		one.className = 'font white ellipsis';
		one.textContent = '1';

		oneContainer.append(one);

		const twoContainer = document.createElement('div');
		twoContainer.className = 'flex-container align-center-middle';
		twoContainer.style.width = '10px';
		twoContainer.style.backgroundColor = '#212121';

		

		const two = document.createElement('p');
		two.style.width = '100%';
		two.style.display = 'flex';
		two.style.textAlign = 'center';
		two.style.justifyContent = 'center';
		two.className = 'font white ellipsis'; 
		two.textContent = '2';

		twoContainer.append(two);

		container.append(oneContainer);
		container.append(twoContainer);
		const all = document.createElement('div');
				all.className = 'button coefficient last';
				all.style.maxWidth = "60px";
				all.style.backgroundColor = "rgb(33, 33, 33)";
		container.append(all);

		return container;
		}
	}

	constructTabElement = (active, name, id) => {
		/*let link =
			'http://bestline.bet/media/icons/sports/png/' +
			name +
			'.png' /*.toLowerCase().replace(/\s/g, '-')*/
		let link = 'http://bestline.bet/icon/sport/' + id;

		let a = document.createElement('a')
		a.className = active
			? 'live-play-header-link active'
			: 'live-play-header-link' /*'live-play-header-link active';*/

		let div = document.createElement('div')
		div.style.cssText =
			'content:url(' +
			link.toLocaleLowerCase().replace(/\s/g, '-') +
			'); width: 25px; height: 25px; margin-right: 5px;'

		a.appendChild(div)

		let span = document.createElement('span')
		span.className = 'font'
		span.textContent = name

		a.appendChild(span)

		a.addEventListener('click', event => {
			let cur = event.target.closest('a')
			let clickedName = cur.childNodes[1].textContent

			writeToStorage('topBetsCurrentView', clickedName)
			this.lasDate = null;

			let currentActive = null
			this.containerCategories.childNodes.forEach(item => {
				if (item.classList.contains('active')) {
					item.classList.remove('active')
				}
			})

			cur.classList.add('active')

			this.betTable.innerHTML = '';
			this.reDrawTable(clickedName);

			console.log(getFromStorage('topBetsCurrentView'))
		})

		return a
	}

	reDrawTable = (sport) => {
		this.allOdds.forEach((odd) => {
			if (odd.sport == sport) {
				console.log(odd)
				if (odd.odds.name == "2 Way") {
					this.betTable.appendChild(this.constructBetelement( odd.fullEvent ,odd.event, odd.odds.name, odd.date, odd.comp1, odd.comp2, odd.odds.val1.val.toFixed(3), odd.odds.val1.outcome, odd.odds.val1.stakeId, odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.val : '', odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.outcome : '', odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.stakeId : '', odd.odds.val3.val.toFixed(3), odd.odds.val3.outcome, odd.odds.val3.stakeId));
				} else {
					this.betTable.appendChild(this.constructBetelement( odd.fullEvent ,odd.event, odd.odds.name, odd.date, odd.comp1, odd.comp2, odd.odds.val1.val.toFixed(3), odd.odds.val1.outcome, odd.odds.val1.stakeId, odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.val.toFixed(3) : '', odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.outcome : '', odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.stakeId : '', odd.odds.val3.val.toFixed(3), odd.odds.val3.outcome, odd.odds.val3.stakeId));
				}
				
			}
		})
	}

	removeStakeValueFromSession = id => {
		if (id === 'All') {
			setSession('stakesValues', {})
		}
	
		let stakesValues = getSession('stakesValues') || {}
	
		stakesValues = Object.keys(stakesValues).reduce((acc, key) => {
			if (key !== id) {
				acc[key] = stakesValues[key]
			}
	
			return acc
		}, {})
	
		setSession('stakesValues', stakesValues)
	}

	remove = async (id) => {
		try {
			await removeStake(id);
		} catch(err) {
			console.log(err)
		}
	}

	startRemove = (id) => {
		this.remove(id)
	}
	constructBetelement = (fullEvent, event, type, time, comp1, comp2, one, outcome1, stake1, two, outcome2, stake2, three, outcome3, stake3) => {
		console.log(two)

		console.log(time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4))

		let classnameOne = 'button coefficient coef_item';
		let classnameTwo = 'button coefficient coef_item';
		let classNameThree = 'button coefficient coef_item';

			if (this.settledBets.length >= 1) {
				this.settledBets.forEach((item) => {
					if (item == stake1) {
						classnameOne = 'button coefficient coef_item on';
					} else if (item == stake2) {
						classnameTwo = 'button coefficient coef_item on';
					} else if (item == stake3) {
						classNameThree = 'button coefficient coef_item on';
					}
				})
			}
			
		if (type == '3 Way' || type == 'Результат Матча 1 X 2' || type == '1x2' || type == '3 way ') {

			const container = document.createElement('div');
			container.className = 'topBets-cell';

			const ttName = document.createElement('div');
			ttName.className = 'flex-container align-center-middle time';
			ttName.style.width = '200px';
			ttName.style.paddingLeft = '10px';
			ttName.style.justifyContent = 'flex-start';
			const ttNameTitle = document.createElement('p');
			ttNameTitle.className = 'font white ellipsis text-left team-name';

			const ttTT = document.createElement('span');
			ttTT.style.marginRight = '15px';
			ttTT.textContent = time.slice(11, 16);
			ttNameTitle.appendChild(ttTT);

			const ttTeams = document.createElement('span');
			ttTeams.className = 'top-bets-font';
			ttTeams.textContent = comp1 + ' v ' + comp2;

			ttNameTitle.addEventListener('click', (ev) => {
				this.showEvent(event);
				//setTimeout( () => {window.location = './#/sports/table/1/' + this.lastClickedBet.event.leagueId + '/' + event; }, 1000); 
			})
			//ttTeams.attributes.href = './#/sports/table/1/' + Math.floor(Math.random() * 60) + 400 + '/' + event;
			ttNameTitle.appendChild(ttTeams);

			ttName.appendChild(ttNameTitle);

			const firstOdd = document.createElement('div');
			firstOdd.className = 'flex-container align-center-middle';
			firstOdd.style.width = '10px'
			const betButton = document.createElement('button');
			betButton.className = classnameOne;
			betButton.dataset.outcome = outcome1;
			betButton.dataset.stake = stake1;
			betButton.style.display = 'flex';
			betButton.style.justifyContent = 'center';
			//const bName = document.createElement('p');
			//bName.className = 'font ellipsis mra';
			//bName.textContent = '1';
			const oddVal = document.createElement('p');
			oddVal.className = 'font';
			oddVal.textContent = one;
			//betButton.appendChild(bName);
			betButton.appendChild(oddVal);

			
			betButton.addEventListener('click', (e) => {
				if(!e.detail || e.detail == 1){
					if (betButton.classList.contains('on')) {
						betButton.classList.remove('on');
						this.removeStakeValueFromSession(stake1);
						betButtonHandler({event: fullEvent, oddId: outcome1, stakeId: stake1, e: e})
						this.startRemove(stake1)
						this.settledBets.forEach((item, idx) => {
							if (item == stake1) {
								this.settledBets[idx] = '';
							}
						})
						sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
						
						
					} else {
						betButton.classList.add('on');
						this.settledBets.push(stake1)
						sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
						console.log(this.settledBets)
						betButtonHandler({event: fullEvent, oddId: outcome1, stakeId: stake1, e: e})
						console.log(stake1)
						console.log(outcome1)
					}
				  }
			})

			firstOdd.appendChild(betButton);

			const secondOdd = document.createElement('div');
			secondOdd.className = 'flex-container align-center-middle';
			secondOdd.style.width = '10px';
			const betButton2 = document.createElement('button');
			betButton2.className = classnameTwo;
			betButton2.dataset.outcome = outcome2;
			betButton2.dataset.stake = stake2;
			betButton2.style.display = 'flex';
			betButton2.style.justifyContent = 'center';
			//const bName2 = document.createElement('p');
			//bName2.className = 'font ellipsis mra';
			//bName2.textContent = 'X';
			const oddVal2 = document.createElement('p');
			oddVal2.className = 'font';
			oddVal2.textContent = two;
			//betButton2.appendChild(bName2);
			betButton2.appendChild(oddVal2);

			
			betButton2.addEventListener('click', (e) => {
				if(!e.detail || e.detail == 1){
					console.log('clicks')
				if (betButton2.classList.contains('on')) {
					betButton2.classList.remove('on');
					this.removeStakeValueFromSession(stake2);
					betButtonHandler({event: fullEvent, oddId: outcome2, stakeId: stake2, e: e})
					this.startRemove(stake2)
					this.settledBets.forEach((item, idx) => {
						if (item == stake2) {
							this.settledBets[idx] = '';
						}
					})
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				} else {
					betButton2.classList.add('on');
					betButtonHandler({event: fullEvent, oddId: outcome2, stakeId: stake2, e: e})
					this.settledBets.push(stake2);
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				}
				}
			})

			secondOdd.appendChild(betButton2);

			const thirdOdd = document.createElement('div');
			thirdOdd.className = 'flex-container align-center-middle';
			thirdOdd.style.width = '10px';
			const betButton3 = document.createElement('button');
			betButton3.className = classNameThree;
			betButton3.dataset.outcome = outcome3;
			betButton3.dataset.stake = stake3;
			betButton3.style.display = 'flex';
			betButton3.style.justifyContent = 'center';
			//const bName3 = document.createElement('p');
			//bName3.className = 'font ellipsis mra';
			//bName3.textContent = '2';
			const oddVal3 = document.createElement('p');
			oddVal3.className = 'font';
			oddVal3.textContent = three;
			//betButton3.appendChild(bName3);
			betButton3.appendChild(oddVal3);

		
			betButton3.addEventListener('click', (e) => {
				if(!e.detail || e.detail == 1){
					console.log('clicks')
				if (betButton3.classList.contains('on')) {
					betButton3.classList.remove('on');
					this.removeStakeValueFromSession(stake3);
					betButtonHandler({event: fullEvent, oddId: outcome3, stakeId: stake3, e: e})
					this.startRemove(stake3)
					this.settledBets.forEach((item, idx) => {
						if (item == stake3) {
							this.settledBets[idx] = '';
						}
					})
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				} else {
					betButton3.classList.add('on');
					betButtonHandler({event: fullEvent, oddId: outcome3, stakeId: stake3, e: e})
					this.settledBets.push(stake3);
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				}
				}
			})

			thirdOdd.appendChild(betButton3);

			if (this.lasDate == null || this.lasDate != time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4)) {

				const cont = document.createElement('div');
				cont.style.display = 'flex';
				cont.style.flexDirection = 'column';

				container.appendChild(ttName);
				container.appendChild(firstOdd);
				container.appendChild(secondOdd);
				container.appendChild(thirdOdd);
				/*
				<a class="button coefficient last" href="#/sports/table/1/638/982303" style="max-width: 70px;display: flex;justify-content: center;">
								<p class="font ellipsis inplayLM">+651</p> 
				</a>
				*/
				const all = document.createElement('a');
				all.className = 'button coefficient last';
				all.href = `#/sports/table/${fullEvent.sportId}/${fullEvent.leagueId}/${fullEvent.id}`;
				all.style.maxWidth = "60px";

				const allP = document.createElement("p");
				allP.className = "font ellipsis inplayLM";
				allP.textContent = `+${fullEvent.oddsCount}`;

				all.appendChild(allP)
				container.appendChild(all);
				
				cont.appendChild(this.constructTitleElement(time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4), type))
				cont.appendChild(container)

				this.lasDate = time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4);

				return cont;
			} else {
				container.appendChild(ttName);
				container.appendChild(firstOdd);
				container.appendChild(secondOdd);
				container.appendChild(thirdOdd);

				const all = document.createElement('a');
				all.className = 'button coefficient last';
				all.href = `#/sports/table/${fullEvent.sportId}/${fullEvent.leagueId}/${fullEvent.id}`;
				all.style.maxWidth = "60px";

				const allP = document.createElement("p");
				allP.className = "font ellipsis inplayLM";
				allP.textContent = `+${fullEvent.oddsCount}`;

				all.appendChild(allP)
				container.appendChild(all);

				this.lasDate = time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4);

				return container;
			}

		
		} else if (type == '2 Way' || type == 'Победитель Матча 1 2') {
			const container = document.createElement('div');
			container.className = 'topBets-cell';


			const ttName = document.createElement('div');
			ttName.className = 'flex-container align-center-middle time';
			ttName.style.width = '200px';
			ttName.style.paddingLeft = '10px';
			ttName.style.justifyContent = 'flex-start';
			const ttNameTitle = document.createElement('p');
			ttNameTitle.className = 'font white ellipsis';

			const ttTT = document.createElement('span');
			ttTT.style.marginRight = '15px';
			ttTT.textContent = time.slice(11, 16);
			ttNameTitle.appendChild(ttTT);

			const ttTeams = document.createElement('span');
			ttTeams.className = 'top-bets-font';
			ttTeams.textContent = comp1 + ' v ' + comp2;
			ttNameTitle.appendChild(ttTeams);

			ttName.appendChild(ttNameTitle);

			const firstOdd = document.createElement('div');
			firstOdd.className = 'flex-container align-center-middle';
			firstOdd.style.width = '10px'
			const betButton = document.createElement('button');
			betButton.className = this.settledBets.includes(stake1) ? 'button coefficient coef_item on' : 'button coefficient coef_item';
			betButton.dataset.outcome = outcome1;
			betButton.dataset.stake = stake1;
			betButton.style.display = 'flex';
			betButton.style.justifyContent = 'center';
			//const bName = document.createElement('p');
			//bName.className = 'font ellipsis mra';
			//bName.textContent = '1';
			const oddVal = document.createElement('p');
			oddVal.className = 'font';
			oddVal.textContent = one;
			//betButton.appendChild(bName);
			betButton.appendChild(oddVal);

			betButton.addEventListener('click', (e) => {
				if(!e.detail || e.detail == 1){
					console.log('clicks')
				if (betButton.classList.contains('on')) {
					betButton.classList.remove('on');
					this.removeStakeValueFromSession(stake1);
					betButtonHandler({event: fullEvent, oddId: outcome1, stakeId: stake1, e: e})
					this.startRemove(stake1)
					this.settledBets.forEach((item, idx) => {
						if (item == stake1) {
							this.settledBets[idx] = '';
						}
					})
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				} else {
					betButton.classList.add('on');
					betButtonHandler({event: fullEvent, oddId: outcome1, stakeId: stake1, e: e})
					this.settledBets.push(stake1)
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				}
				}
			})

			firstOdd.appendChild(betButton);

			const thirdOdd = document.createElement('div');
			thirdOdd.className = 'flex-container align-center-middle';
			thirdOdd.style.width = '10px';
			const betButton3 = document.createElement('button');
			betButton3.className = this.settledBets.includes(stake3) ? 'button coefficient coef_item on' : 'button coefficient coef_item';
			betButton3.dataset.outcome = outcome3;
			betButton3.dataset.stake = stake3;
			betButton3.style.display = 'flex';
			betButton3.style.justifyContent = 'center';
			//const bName3 = document.createElement('p');
			//bName3.className = 'font ellipsis mra';
			//bName3.textContent = '2';
			const oddVal3 = document.createElement('p');
			oddVal3.className = 'font';
			oddVal3.textContent = three;
			//betButton3.appendChild(bName3);
			betButton3.appendChild(oddVal3);

			
			betButton3.addEventListener('click', (e) => {
				if(!e.detail || e.detail == 1){
					console.log('clicks')
				if (betButton3.classList.contains('on')) {
					betButton3.classList.remove('on');
					this.removeStakeValueFromSession(stake3);
					betButtonHandler({event: fullEvent, oddId: outcome3, stakeId: stake3, e: e})
					this.startRemove(stake3)
					this.settledBets.forEach((item, idx) => {
						if (item == stake3) {
							this.settledBets[idx] = '';
						}
					})
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				} else {
					betButton3.classList.add('on');
					betButtonHandler({event: fullEvent, oddId: outcome3, stakeId: stake3, e: e})
					this.settledBets.push(stake3)
					sessionStorage.setItem('topBetsB', JSON.stringify(this.settledBets));
				}
				}
			})

			/*thirdOdd.appendChild(betButton3);

			container.appendChild(ttName);
			container.appendChild(firstOdd);

			container.appendChild(thirdOdd);*/

			//return container;

			if (this.lasDate == null || this.lasDate != time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4)) {

				const cont = document.createElement('div');
				cont.style.display = 'flex';
				cont.style.flexDirection = 'column';

				thirdOdd.appendChild(betButton3);

				container.appendChild(ttName);
				container.appendChild(firstOdd);

				container.appendChild(thirdOdd);
				
				cont.appendChild(this.constructTitleElement(time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4), type))
				cont.appendChild(container)

				this.lasDate = time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4);

				return cont;
			} else {
				thirdOdd.appendChild(betButton3);

				container.appendChild(ttName);
				container.appendChild(firstOdd);

				container.appendChild(thirdOdd);

				this.lasDate = time.slice(8, 10) + '.' + time.slice(5, 7) + '.' + time.slice(0, 4);

				return container;
			}
		}
	}

	getEvent = async (id) => {
		try {
			this.lastClickedBet= await getRequest(links.event + id);
			this.eventName = this.lastClickedBet.event.competitors[0].name + ' vs ' + this.lastClickedBet.event.competitors[1].name;
			const sports = await getRequest(links.prematchAll);
			//console.log(window.openedEV);
			//console.log(window.opened)
		//	console.log(sports)
			sports.forEach( (item) => {
				//console.log(getFromStorage('topBetsCurrentTab'))
				if (item.name == this.sport) {
					item.categories.forEach( (it) => {
						//console.log(it)
						it.leagues.forEach( (lg) => {
							if (lg.id == this.lastClickedBet.event.leagueId) {
								console.log('ok')
								this.leagueName = lg.name;
								//typeof window.opened !== 'undefined' ? window.opened.push(this.sport) : window.opened = [this.sport];
								//typeof window.openedEV !== 'undefined' ? window.openedEV.push(this.leagueName) : window.openedEV = [this.leagueName];

								window.location = './#/sports/table/1/' + this.lastClickedBet.event.leagueId + '/' + id;
							}
						})
					})
				}
			})
			
		} catch(err) {
			console.log(err);
		}
	}

	showEvent = (evID) => {
		this.getEvent(evID);
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

	loadData = async () => {
		try {
			this.data = await getRequestWithoutCredentials(links.topGames, 'GET')
			writeToStorage('topBets', this.data)

			console.log(this.data)
		} catch (e) {
			console.log(e)
		}
	}

	drawData = () => {
		this.betTable.innerHTML = '';
		this.data.forEach(item => {
			let itemSpID = item.sportId
			let spName = null

			this.sportsID.forEach(el => {
				if (el.id == itemSpID) {
					spName = el.name
				}
			})

			if (!this.sports.includes(spName) && (spName != 'Rugby' && spName != 'Регби') && (spName != 'Ice Hockey' && spName != 'Хоккей')) {
				this.sports.push(spName)
				this.ids.push({name: spName, id: itemSpID})
			}
		})

		let categories = this.containerCategories
		categories.innerHTML = ''

		let tabCounter = getFromStorage('topBetsCurrentTab')
		tabCounter == null
			? tabCounter = "Soccer"
			: ""
		this.sport = tabCounter;
		this.sports.forEach((item, idx) => {
			if (tabCounter == item) {
				categories.appendChild(this.constructTabElement(true, item, this.ids[idx].id))
			} else {
				categories.appendChild(this.constructTabElement(false, item, this.ids[idx].id))
			}

		})
		
		//this.allOdds[0] = null;

		//this.betTable.appendChild(this.constructTitleElement('28.05.2001'))

		this.allOdds.forEach((odd) => {
			if (odd.sport == tabCounter) {
				 console.log(odd)
				this.betTable.appendChild(this.constructBetelement(odd.fullEvent, odd.event, odd.odds.name, odd.date, odd.comp1, odd.comp2, odd.odds.val1.val.toFixed(3), odd.odds.val1.outcome, odd.odds.val1.stakeId, odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.val.toFixed(3) : '', odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.outcome : '', odd.odds.name == '3 Way' || odd.odds.name == 'Результат Матча 1 X 2' || odd.odds.name == '1x2' || odd.odds.name == '3 way ' ? odd.odds.val2.stakeId : '', odd.odds.val3.val.toFixed(3), odd.odds.val3.outcome, odd.odds.val3.stakeId));
			}
		})
	}

	showData = async () => {
		try {
			await this.fillSportsID()
			await getRequestWithLoader(this.loadData)()

			await this.formAllOdds(this.data)
			await this.drawData()
		} catch (e) {
			console.log(e)
		}
	}

	init = () => {
		this.showData()
	}
}
