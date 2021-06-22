import { findNode, getRequest } from '../../helpers/utils'
import { getCurrencySymbol, getUserName } from '../../selectors/configSelectors'
import { createElement } from '../../helpers/createElement'
import { UserPopup } from './components/userPopup'
import { links } from '../../links/links'

import user from '../../img/user.png'

export class LoginInLogic {
	constructor() {
		this.node = null
		this.userDataNodeLeft = null
		this.userDataNodeRight = null
		this.priceNode = null
		this.popupInstance = new UserPopup(this.changeStatus)
		this.popup = false
		this.timer = null
	}

	createLeft = () => {
		this.userDataNodeLeft = createElement({
			type: 'div',
			classes: ['block', 'mr'],
		})

		this.userDataNodeLeft.innerHTML = `
			  <a class="font title login-in__name">${getUserName()}</a>
					<div class="flex-container align-right align-middle login-in__wrapper">
						<a class="font mr login-in__price"></a>
						<a class="font login-in__deposit">Deposit</a>
				</div>`

		this.priceNode = findNode('.', 'login-in__price', this.userDataNodeLeft)

		return this.userDataNodeLeft
	}

	createRight = () => {
		this.userDataNodeRight = createElement({
			type: 'div',
			classes: ['login-in__img'],
			listeners: [{ event: 'click', cb: this.showPopup }]
		})

		this.userDataNodeRight.innerHTML = `<img src="${user}" alt="User"/>`

			// <p class="login-in__circle">
			// 		<span class="font">0</span>
			// </p>

		return this.userDataNodeRight
	}

	changeStatus = () => this.popup = !this.popup

	showPopup = () => {
		this.changeStatus()

		this.popup
			? this.node.append(this.popupInstance.render())
			: this.popupInstance.destroy()

	}

	appendParts = () => {
		const parts = [this.createLeft(), this.createRight()]

		parts.forEach(part => this.node.append(part))
	}

	loadBalance = async () => {
		try {
			return await getRequest(links.balance)
		} catch (e) {
			console.log(e)
		}
	}

	update = async ()=> {
		clearTimeout(this.timer)
		const { balance } = await this.loadBalance()
		this.priceNode.innerHTML = `${balance.main} ${getCurrencySymbol()}`
		this.timer = setTimeout(this.update, 3000)
	}

	init = () => {
		this.node = findNode('#', 'loginIn')
		this.appendParts()
		this.update()
	}

	destroy =()=> {
		//clearTimeout(this.timer)
	}
}
