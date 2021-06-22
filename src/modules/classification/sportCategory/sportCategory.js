import { createElement } from '../../../helpers/createElement'
import { getAllLeaguesClassification } from '../../../helpers/utils'
import { LeaguesCategory } from '../leaguesCategory/leaguesCategory'

const isOpen =(id)=> window.location.hash.split('/')[3] === id.toString()

export class SportCategory {
	constructor(data) {
		this.data = data
		this.div = null
		this.attributes = [{ name: 'data-id', value: data.id }]
		this.listeners = [
			{
				event: 'click',
				cb: this.onClick,
			},
		]
		this.type = 'div'
		this.classes = ['classification__category']
		this.open = false
		this.lastCountry = null;
		this.countryOpen = null;
		this.countryContainer = null;
	}

	codeToName = (data, code) => {
		let name = null;
		data.categories.forEach( (item) => {
			//console.log(item)
			if (item.iconCode == code) {
				//console.log(item.iconCode + ' : ' + item.name)
				name =  item.name;
			}
		})

		return name == null ? code : name;
	}

	showLeagues = () => {

		this.open = true

		const sortedCategories = this.data.categories.filter(cat => cat.priority !== 0).sort((a, b) => a.priority - b.priority);
			this.data.categories.filter(cat => cat.priority === 0).map(item => sortedCategories.push(item));

		const leagues = getAllLeaguesClassification(sortedCategories)
		const leaguesContainer = this.div.querySelector(
			'.classification__category_container'
		)

		if (leaguesContainer.style.display == 'none') {
			leaguesContainer.style.display = 'block';
		} else {
			leagues.forEach((league, idx) => { 
				//console.log(league.name)
				if (league.name.includes("Outrights") == false && league.name.includes("outrights") == false) {
					if ( this.lastCountry == null || this.lastCountry != sessionStorage.getItem('lastIconCode')) {
						let isCountryOpen = null;
						if (typeof window.openedCountries !== 'undefined' && window.openedCountries.includes(sessionStorage.getItem('lastIconCode'))) {
							isCountryOpen = true;
						} else {
							isCountryOpen = false;
						}
						const leagueItem = new LeaguesCategory(league); 
		
						const country = leagueItem.renderCountry( this.codeToName(this.data, league.iconCode) );
		
						country.removeEventListener(this.listeners[0].event, this.listeners[0].cb);
						country.addEventListener('click', (ev) => {
							if (isCountryOpen) {
								country.childNodes[3].style.display = 'none';
								isCountryOpen = false;
		
								if (typeof window.openedCountries !== 'undefined') {
									window.openedCountries.forEach( (item, idx) => {
										if (item == sessionStorage.getItem('lastIconCode')) {
											window.openedCountries[idx] = '';
										}
									})
								}
							} else {
		
								if (typeof window.openedCountries !== 'undefined') {
									window.openedCountries.push(sessionStorage.getItem('lastIconCode'));
								} else {
									window.openedCountries = [sessionStorage.getItem('lastIconCode')]
								}
		
								country.childNodes[3].style.display = 'block';
								isCountryOpen = true;
							}
						})
						const countryContainer = country.childNodes[3];
						
						countryContainer.append(leagueItem.render(league.iconCode));
						countryContainer.style.display = isCountryOpen == true ? 'block' : 'none';
						
		
						leaguesContainer.append(country);
						this.lastCountry = sessionStorage.getItem('lastIconCode')
					} else {
						const leagueItem = new LeaguesCategory(league)
						//console.log(this.lastCountry)
						if (document.getElementById(this.lastCountry) == null) {
							//console.log(this.lastCountry)
							//sessionStorage.setItem('LastIconCode', undefined)
							//this.lastCountry = null;
							//this.showLeagues();
						} else {
							//console.log(league.iconCode + ' : ' + this.lastCountry)
							//document.getElementById(this.lastCountry).append(leagueItem.render());
							//sessionStorage.setItem('lastIconCode', league.iconCode);
							if (league.iconCode != this.lastCountry) {
								//document.getElementById(this.lastCountry).append(leagueItem.render().style.display = 'none');
								sessionStorage.setItem('lastIconCode', league.iconCode);
		
								//this.lastCountry = league.iconCode;
								setTimeout(() => {
									//console.log(document.getElementById(league.iconCode).children[0].childNodes);
									document.getElementById(league.iconCode).append(leagueItem.render(league.iconCode));
								}, 300);
								//document.getElementById(this.lastCountry).append(leagueItem.render(league.iconCode));
							} else {
								document.getElementById(this.lastCountry).append(leagueItem.render(league.iconCode));
							}
						}
						//leaguesContainer.append(leagueItem.render())
					}
				}
			})
	
			//this.lastCountry = null;
		}
	}

	hideLeagues = () => {

		this.open = false
		const leaguesContainer = this.div.querySelector(
			'.classification__category_container'
		)
		//leaguesContainer.innerHTML = null
		leaguesContainer.style.display = 'none';
	}

	onClick = (ev) => {
		//ev.stopPropagation();
		const el = ev.target;

		if (typeof el.getAttribute('data-id') === 'undefined' || el.getAttribute('data-id') != 'cname') {
			if (this.open) {
				this.hideLeagues()
			} else {
				this.showLeagues()
			}
		}
	}

	render = () => {
		const elementData = {
			type: this.type,
			attributes: this.attributes,
			classes: this.classes,
			listeners: this.listeners,
		}

		//console.log(this.data)

		this.div = createElement(elementData)
		/*let imgURl =
			'http://bestline.bet/media/icons/sports/png/' +
			(this.data.name.includes('ES')
				? 'esport'
				: this.data.name.toLowerCase()) +
			'.png'*/
		 let imgURl = "http://bestline.bet/icon/sport/" + this.data.id;

		this.div.innerHTML = `
                  <div class="sm-loader-bl"></div>
                  <div id="${this.data.name.toLowerCase()}" data-isopen="false" class="classification__category_content" style="padding-left: 5px">
                  <div class="icon__black" style=" content:url('${imgURl.replace(
										/\s/g,
										'-'
									)}'); width: 25px; height: 25px;"></div>
                      <p class="font">${this.data.name}</p>
                      <p class="sports-1 icon"></p>
                  </div>
                  <div class="classification__category_container"></div>`

		this.lastCountry = null;
		if (window.location.hash.split('/')[3] == this.data.id) {
			setTimeout( () => { 
				this.showLeagues();
				if (window.location.hash.split('/')[4]) {
					document.querySelector(`[data-lid="${window.location.hash.split('/')[4]}"]`).parentNode.parentNode.style.display = "block"
				} 
			}, 500);
		}

		return this.div
	}
}
