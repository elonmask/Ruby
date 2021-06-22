import { createElement } from '../../../../helpers/createElement'
import { findNode } from '../../../../helpers/utils'

export class MenuInfo {
	constructor() {
		this.node = null
		this.innerContainer = null
		this.type = 'a'
		this.classes = ['bottom-menu-link-item']
		this.attributes = [{ name: 'data-name', value: 'menuInfo' }]
		this.itemName = 'menuInfo'
	}

	renderInnerItems = () => {
		this.innerContainer.classList.remove('hide')
	}

	destroyInnerItems = () => {
		this.innerContainer.classList.add('hide')
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		this.node.innerHTML = `
				<span class="fa fa-list mr"></span>
        <span class="fa fa-caret-down" style="color: #c8304d"></span>
			  <div class="dropDown-item menu_info hide">
					 <ul>
							<li>О нас</li>
							<li>Правила приёма ставок</li>
							<li>Правила использования ресурса</li>
							<li>Помощь</li>
					</ul>
				</div>
		`

		this.innerContainer = findNode('.', 'dropDown-item', this.node)

		return this.node
	}
}
