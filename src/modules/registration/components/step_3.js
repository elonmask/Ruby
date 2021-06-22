import { createElement } from '../../../helpers/createElement'
import { findAllNodes, useTranslate } from '../../../helpers/utils'

export class Step_3 {
	constructor({ choose, success, error, toggleBtn }) {
		this.data = null
		this.error = error
		this.toggleBtn = toggleBtn

		this.node = null
		this.type = 'div'
		this.classes = ['sign-up-body']
	}

	appendHTML = () => {
		return `
        <div class="flex-container align-middle mb">
            <input type="checkbox" class="checkbox sign-up-body-checkbox" required name="InfoProcessed" ${
							this.data.InfoProcessed ? 'checked' : null
						}>
        <p class="font sign-up-body-title">${useTranslate('conf_one')}</p>
        </div>
        <div class="flex-container align-middle mb">
            <input type="checkbox" class="checkbox sign-up-body-checkbox" required name="LegalAge" ${
							this.data.LegalAge ? 'checked' : null
						}>
            <p class="font sign-up-body-title">${useTranslate('conf_two')}</p>
        </div>
        <div class="flex-container align-middle mb">
            <input type="checkbox" class="checkbox sign-up-body-checkbox" required name="LegalAgeCasino" ${
							this.data.LegalAgeCasino ? 'checked' : null
						}>
            <p class="font sign-up-body-title">${useTranslate('conf_three')}</p>
        </div>`
	}

	addListeners = () => {
		this.node.querySelectorAll('input').forEach(item => {
			item.addEventListener('change', this.confirmationInputValidity)
		})
	}

	confirmationInputValidity = e => {
		let elem = e.target
		this.data[elem.name] = elem.checked

		this.checkConfirmationPageValidity()
	}

	checkConfirmationPageValidity = () => {
		const inputs = findAllNodes('', 'input', this.node)

		let valid = [...inputs].every(item => item.checked)
		this.toggleBtn(valid)
	}

	render = (step, data) => {
		this.data = data

		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = this.appendHTML()
		this.addListeners()

		return this.node
	}
}
