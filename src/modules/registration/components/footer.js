import { createElement } from '../../../helpers/createElement'
import { findNode, useTranslate } from '../../../helpers/utils'

export class Footer {
	constructor({ prev, next }) {
		this.node = null
		this.type = 'div'
		this.classes = ['sign-up-footer', 'flex-container', 'align-middle']
		this.prev = prev
		this.next = next
	}
	template1 = () =>
		`<button
				class="button primary sign-up-footer-button disabled" 
				id="next" disabled>
				${useTranslate('next')}
			  <p class="fa fa-angle-right"> </p>
			</button>`

	template2 = () =>
		`<button class="button primary sign-up-footer-button" id="prev">
				<p class="fa fa-angle-left mr"></p> 
					${useTranslate('back')}
		 </button>
		 <button class="button primary sign-up-footer-button disabled" id="next" disabled>
					${useTranslate('next')}
				 <p class="fa fa-angle-right"></p>
		 </button>`

	appendHTML = id => {
		return Number(id) > 1 ? this.template2() : this.template1()
	}

	addListeners = id => {
		if (Number(id) > 1) {
			findNode('#', 'prev', this.node).addEventListener('click', this.prev)
		}
		findNode('#', 'next', this.node).addEventListener('click', this.next)
	}

	render = id => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = this.appendHTML(id)
		this.addListeners(id)

		return this.node
	}
}
