import { createElement } from '../../../../helpers/createElement'

export class Loader {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['bs__loader']
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = '<div class="spinner"></div>'

		return this.node
	}

	destroy =()=> {
		this.node.remove()
	}
}
