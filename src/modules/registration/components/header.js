import { createElement } from '../../../helpers/createElement'
import { useTranslate } from '../../../helpers/utils'

export class Header {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['sign-up-nav', 'flex-container', 'align-middle']

		this.data = [
			{
				id: '1',
				title: useTranslate('user_det'),
			},
			{
				id: '2',
				title: useTranslate('pers_inf'),
			},
			{
				id: '3',
				title: useTranslate('confim'),
			},
		]
	}

	linkTemplate = ({ title, id, active, correct }) => {
		return `
			<a 
			class="sign-up-nav-item 
			${active ? 'active' : ''} 
			${correct ? 'correct' : ''}" 
			data-index="${id}">
            <p class="font title">${id}</p>
            <p class="font">${title}</p>
				</a>
		`
	}

	render = id => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})


		this.node.innerHTML = this.data
			.map(item => {
				item.active = id === Number(item.id)
				item.correct = id > Number(item.id)
				return this.linkTemplate(item)
			})
			.join('')

		return this.node
	}

	destroy = () => {
		this.node.remove()
	}
}
