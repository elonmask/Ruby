import { UserPopupHeader } from './userPopupHeader'
import { UserPopupBody } from './userPopupBody'
import { createElement } from '../../../helpers/createElement'
import '../../../styles/usermenu.css'

export class UserPopup {
	constructor(changeStatus) {
		this.node = null
		this.type = 'div'
		this.classes = ['login_usermenu']
		this.changeStatus = changeStatus

		this.header = new UserPopupHeader(this.changeContent)
		this.body = new UserPopupBody()
	}

	changeContent = () => {
		this.body.changeContent()
	}

	appendComponents = () => {
		this.node.append(this.header.render())
		this.node.append(this.body.render())
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendComponents()

		this.node.addEventListener('mouseleave', this.destroy)

		return this.node
	}

	destroy = () => {
		this.node.removeEventListener('mouseleave', this.destroy)
		this.node.remove()
	}
}
