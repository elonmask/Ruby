import { createElement } from '../../../../helpers/createElement'
import _ from 'lodash'

export class Competitors {
	constructor(competitors, id) {
		this.id = id
		this.competitors = competitors
		this.div = null
		this.type = 'div'
		this.style = { width: '55%', flex:"1" }
	}

	appendHTML = () => {
		// console.log(this.competitors)
		this.div.innerHTML = `
			${this.competitors
				.map(
					({ name }) =>
						`<p class="font ellipsis text-left team-name">${name}</p>`
				)
				.join('')} 
		`
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			style: this.style,
		})

		this.appendHTML()

		return this.div
	}

	update = competitors => {
		if (!_.isEqual(this.competitors, competitors)) {
			this.competitors = competitors
			this.appendHTML()
		}
	}
}
