import { findNode } from '../../helpers/utils'
import { MenuBottom } from './menuBottom/menuBottom'
import { OptionsMenu } from './optionsMenu/optionsMenu'

export class SubHeaderLogic {
	constructor() {
		this.node = null
	}

	appendComponents = () => {
		const components = [new MenuBottom().render(), new OptionsMenu().render()]
		components.forEach(component => this.node.append(component))
	}

	init = () => {
		this.node = findNode('#', 'subheader__container')
		this.appendComponents()
	}
}
