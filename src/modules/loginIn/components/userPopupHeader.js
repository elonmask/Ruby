import { createElement } from '../../../helpers/createElement'
import {
	getCurrencySymbol,
	getFullName,
	getUserName,
} from '../../../selectors/configSelectors'
import { findNode, getRequest } from '../../../helpers/utils'

export class UserPopupHeader {
	constructor(fn) {
		this.node = null
		this.type = 'div'
		this.classes = ['user-menu-wrapper']
		this.fn = fn
		this.values = [];
		try {
			this.showData();
		} catch(err) {
			console.log(err)
		}
		this.rows = [
			{
				title: 'Total:',
				value: '0',
			},
			{
				title: 'Main:',
				value: `${'0'} ${getCurrencySymbol()}`,
			},
			{
				title: 'Bonuses:',
				value: `${'0'} ${getCurrencySymbol()}`,
			},
		]
	}

	getBalance = async () => {
		return await getRequest('https://api.ruby.bet/balance/get/');
	}

	fillData = async () => {
		let res = null;
		try {
			res = await this.getBalance();
			// console.log(res.balance.bonus);

			this.rows[0].value = res.balance.total;
			this.rows[1].value = res.balance.main;
			this.rows[2].value = res.balance.bonus;
		} catch(err) {
			console.log(err);
		}
	}

	showData = () => {
		this.fillData();
	}

	header = () => {
		return ` 
			
				<div class="user-menu-img"></div>
				<p class="user-menu-name text-center">${getFullName()}</p>
				<p class="user-menu-email text-center">${getUserName()}</p>
				<hr class="user-menu-separate">
		`
	}

	rowTemplate = ({ title, value }) =>
		`<p class="font user-menu-text">${title}</p>
		 <p class="font text-uppercase user-menu-big white">${value}</p>`

	appendHTML = () =>
		`${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		/*`${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`
		 `${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`
		 `${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`
		 `${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`
		 `${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`
		 `${this.header()}
		 ${this.rows.map(item => this.rowTemplate(item)).join('')}`*/

		this.node.innerHTML = this.appendHTML()

		//findNode('.', 'show-settings', this.node).addEventListener('click', this.fn)

		return this.node
	}

	destroy = () => {
		this.node.remove()
	}
}
