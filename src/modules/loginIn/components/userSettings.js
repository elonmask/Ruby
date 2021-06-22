import { createElement } from '../../../helpers/createElement'
import { OddType } from './settings/oddType'
import { InactivityTime } from './settings/inactivityTime'
import { Currency } from './settings/currency'
import { TimeZone } from './settings/timeZone'

export class UserSettings {
	constructor() {
		this.node = null
		this.type = 'div'

		this.innerItems = [
			new OddType(),
			new InactivityTime(),
			new Currency(),
			new TimeZone()
		]
	}

	renderComponents =()=> {
		this.innerItems.forEach(item => {
			this.node.append(item.render())
		})
	}

	render = () => {
		this.node = createElement({
			type: this.type,
		})

		this.renderComponents()

		return this.node
	}
}
