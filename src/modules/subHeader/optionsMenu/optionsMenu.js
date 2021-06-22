import { MenuInfo } from './menuItems/menuInfo'
import { Settings } from './menuItems/settings'
import { Volume } from './menuItems/volume'
import { Languages } from './menuItems/languages'
import { Time } from './menuItems/time'
import { createElement } from '../../../helpers/createElement'

export class OptionsMenu {
	constructor() {
		this.node = null
		this.type = 'menu'
		this.classes = ['bottom-menu-link', 'flex-container', 'align-middle']
		this.listeners = [{ event: 'click', cb: this.menuListeners }]
		this.innerComponents = [
			// new MenuInfo(),
			// new Settings(),
			// new Volume(),
			new Languages(),
			new Time(),
		]
		this.currentClick = ''
	}

	listenClick = e => {
		const currentClick = e.target.closest('.bottom-menu-link')

		if (!currentClick) {
			this.innerComponents.forEach(component => {
				component.destroyInnerItems()
				this.currentClick = ''
			})

			document.body.removeEventListener('click', this.listenClick)
		}
	}

	menuListeners = e => {
		const currentClick = e.target.closest('.bottom-menu-link-item').dataset.name

		this.innerComponents.forEach(component => {
			if (currentClick === component.itemName) {
				if (currentClick === this.currentClick) {
					component.destroyInnerItems()
					this.currentClick = ''
					return
				}
				component.renderInnerItems()
				this.currentClick = currentClick
				document.body.addEventListener('click', this.listenClick)
			} else {
				component.destroyInnerItems()
			}
		})
	}

	appendComponents = () => {
		this.innerComponents.forEach(component =>
			this.node.append(component.render())
		)
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.appendComponents()

		return this.node
	}
}
