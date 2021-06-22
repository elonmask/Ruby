import { createElement } from '../../helpers/createElement'
import { getRequest } from '../../helpers/utils'

export class SliderItem {
	constructor(data, active) {
		this.data = data
		this.name = data.name
		this.type = 'a'
		this.classes = ['slider__item']
		this.node = null
		this.attributes = [{ name: 'data-id', value: data.id }]

		if (active === data.id) {
			this.classes.push('active')
		}
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		const name = this.name.toLowerCase().includes('es') ? 'esport' : this.name

		const url = `http://bestline.bet/icon/sport/${this.data.id}`

		this.node.innerHTML = `
				<p 
					class="sports-icon" 
					 style="background-image: url(${url})">
				</p>
				<p class="font ellipsis text">${this.name}</p>`

		return this.node
	}
}
