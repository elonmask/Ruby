import { createElement } from '../../helpers/createElement'
import logo from '../../img/header/logo/img/logo.png'

class MainLoader {
	constructor() {
		this.type = 'div'
		this.classes = ['loader']
		this.node = null

		this.active = true
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = `
			 <div class="loader-logo">
			 <img src="${logo}" alt="logo">
				</div>
				<div class="spinner">
				</div>`
				/*<div class="loader-logo">
					<img src="${logo}" alt="logo">
				</div>
				<div class="spinner"></div>*/

		return this.node
	}

	show = () => {
		document.body.append(this.node)
	}

	hide = () => {
		this.active = false
		this.node.remove()
	}
}

export const mainLoader = new MainLoader()

export const showMainLoader = () => {
	mainLoader.render()
	mainLoader.show()
}

export const hideMainLoader = () => {
	mainLoader.hide()
}

export const isLoaderActive =()=> mainLoader.active
