import { createElement } from '../../helpers/createElement'
import { findNode } from '../../helpers/utils'
import { Loader } from '../rightColumn/betslip/components/loader'
import { isLoaderActive } from './mainLoader'

class ProgressLoader {
	constructor() {
		this.type = 'div'
		this.classes = ['progress-bar-outer']

		this.node = null
		this.progressInner = null
		this.timer = null
		this.width = 0
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = ``/*`
			<div class="progress-bar-inner">
			 	<div class="progress-bar-runner"></div>
			</div>`*/

		this.progressInner = findNode('.', 'progress-bar-inner', this.node)

		return this.node
	}

	start = () => {
		/*this.timer = setInterval(() => {
			//this.width = this.width + 100
			//this.progressInner.style.width = `${this.width}%`
		}, 100)*/
	}

	show = () => {
		document.body.append(this.node)
		this.start()
	}

	hide = () => {
		this.node.remove()
		this.width = 0
		clearInterval(this.timer)
	}
}

const progressLoader = new ProgressLoader()

export const showLoader = () => {
	if (!isLoaderActive()) {
		progressLoader.render()
		progressLoader.show()
	}
}

export const hideLoader = () => {
	if (!isLoaderActive()) {
		progressLoader.hide()
	}
}
