import { links } from '../../../links/links'
import { createElement } from '../../../helpers/createElement'
import { findNode, getEventName } from '../../../helpers/utils'

const isActive =(id)=> window.location.hash.split('/')[5] === id.toString()

export class EventCategory {
	constructor(data) {
		this.data = data
		this.div = null
		this.type = 'div'
		this.classes = ['classification__link']
		this.listeners = [
			{
				event: 'click',
				cb: this.onClick,
			},
		]
		this.url = links.event
		this.eventType = this.data.eventType
		this.active = false

		if (isActive(data.id)){
			this.classes.push('classification__link--active')
		}
	}

	onClick = e => {
		e.stopPropagation()
	}

	toList = () => { }

	toTable = () => {}

	render = () => {
		//console.log(this.data);
		const elementData = {
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		}

		this.div = createElement(elementData)

		const name =
			this.eventType === 'Tournament'
				? this.data.name
				: getEventName(this.data.competitors)

		this.div.innerHTML = `
                    <a href="./#/sports/table/${this.data.sportId}/${this.data.leagueId}/${this.data.id}">
                      <p class="font m-white ellipsis" style="margin-left: 55px;">${name}</p>
										</a>`


		return this.div
	}
}

// const {NA, ID, IT, PD} = obj;
// const div = document.createElement('div');
// div.setAttribute('data-id', ID)
// div.setAttribute('data-id', IT)
// div.setAttribute('data-id', PD)
// div.className = 'classification__link';
// div.innerHTML = `
//                     <a href="#/sports/${encodeURL(PD)}">
//                       <p class="font m-white ellipsis">${NA}</p>
//                     </a>`
//
// div.addEventListener('click', this.stopPropEvent)
// return div
