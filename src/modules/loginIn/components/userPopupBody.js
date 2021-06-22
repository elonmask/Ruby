import { createElement } from '../../../helpers/createElement'
import { UserLinks } from './userLinks'
import { UserSettings } from './userSettings'
 
export class UserPopupBody {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['user-setting-menu', 'flex-container', 'flex-dir-column']

		this.settings = false
		this.linksInstance = new UserLinks()
		this.settingInstance = new UserSettings()
	}

	appendContent = () => {
		!this.settings
			? this.node.append(this.linksInstance.render())
			: this.node.append(this.settingInstance.render())
	}

	changeContent = () => {
		this.node.innerHTML = ''
		this.settings = !this.settings

		this.appendContent()
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendContent()

		return this.node
	}
}
