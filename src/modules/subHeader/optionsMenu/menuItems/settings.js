import { createElement } from '../../../../helpers/createElement'
import { findNode } from '../../../../helpers/utils'

export class Settings {
	constructor() {
		this.node = null
		this.innerContainer = null
		this.type = 'a'
		this.classes = ['bottom-menu-link-item']
		this.attributes = [{ name: 'data-name', value: 'pageSetting' }]
		this.itemName = 'pageSetting'
		this.inputs = [
			{
				name: 'coef_changes',
				value: 1,
				text: 'Не принимать',
			},
			{
				name: 'coef_changes',
				value: 2,
				text: 'Увеличение',
			},
			{
				name: 'coef_changes',
				value: 3,
				text: 'Любые',
			},
		]
	}

	appendInnerItems = () => {
		this.innerContainer.innerHTML = `<h3>Купон</h3>
						<div class="sum-settings">
							<span>Автосумма по умолчанию</span>
							<input type="number" class="autosum" name="Sum" value=0>
							<button class="fa corrected"></button>
						</div>
						<h4>Какие изменения принимать?</h4>
						<div class="settings-changes"></div>`

		const itemsContainer = findNode(
			'.',
			'settings-changes',
			this.innerContainer
		)

		this.inputs.forEach(({ name, value, text }) => {
			const div = createElement({
				type: 'div',
			})

			div.innerHTML = `
					<input type='radio' name=${name} value=${value} checked>
					<label>${text}</label>`

			itemsContainer.append(div)
		})
	}

	renderInnerItems = () => {
		this.innerContainer.classList.remove('hide')
		this.appendInnerItems()
	}

	destroyInnerItems = () => {
		this.innerContainer.classList.add('hide')
		this.innerContainer.innerHTML = ''
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		this.node.innerHTML = `
			<span class="fa fa-cogs"></span>
			<div class="dropDown-item page-settings hide"></div>`

		this.innerContainer = findNode('.', 'dropDown-item', this.node)

		return this.node
	}
}
