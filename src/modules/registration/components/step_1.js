import { createElement } from '../../../helpers/createElement'
import { findAllNodes, findNode, useTranslate } from '../../../helpers/utils'

export class Step_1 {
	constructor({ choose, success, error, checkValidity }) {
		this.data = null
		this.choose = choose
		this.success = success
		this.error = error
		this.checkValidity = checkValidity

		this.node = null
		this.type = 'div'
		this.classes = ['sign-up-body']
	}

	appendHTML = () => {
		return `
			<div>
				<div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase">
                <span>${useTranslate('usrname')}:</span>
                <sup>⚹</sup>
            </p>
            <div class="wrapper a-center">
                <input type="text" class="field sign-up-body-field" name="Login" minlength="8" maxlength="16" required value=${
									this.data.Login
								}>
            </div>
        </div>
        <div class="sign-up-body-item">
             <p class="sign-up-body-title font text-uppercase">
                 <span>${useTranslate('password')}:</span>
                 <sup>⚹</sup>
             </p>
            <div class="flex-container align-middle">
                <input type="password" class="field sign-up-body-field" name="Password" minlength="6" maxlength="15" required>
                <div class="password_check"><!-- low, medium, hight -->
                    ${Array(6)
											.fill(0)
											.map(item => `<span class="password-check-item"></span>`)
											.join('')}
                </div>
            </div>
        </div>
        <div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase">
                <span>${useTranslate('pass_conf')}:</span>
                <sup>⚹</sup>
            </p>
            <input type="password" class="field sign-up-body-field" name="ConfirmPassword" id="confPass" minlength="6"  maxlength="15" required>
        </div>
        <div class="block">
             <hr class="sign-up-body-separate">
             <p class="font text-center sign-up-body-inform">${useTranslate('fields')}</p>
        </div>
        </div>
		`
	}

	detailsBlockInputValidity = e => {
		const elem = e.target
		const fieldChecking = elem.value.match(/(\W)/g)

		if (!fieldChecking) {
			this.choose(elem)
			this.data[elem.name] = elem.value
		} else {
			this.error(elem)
		}

		if (elem.name === 'Password') {
			this.securityPassword(elem)
			this.confirmationPassword()
		}

		if (elem.name === 'ConfirmPassword') {
			this.confirmationPassword()
		}

		this.checkValidity(e)
	}

	securityPassword = elem => {
		const value = elem.value
		const parent = findNode('.', 'password_check', this.node)

		const lowerLetter = value.match(/[a-z]/g)
		const upperLetter = value.match(/[A-Z]/g)
		const digit = value.match(/[0-9]/g)

		if (value.length === 0) {
			parent.classList.remove('low', 'medium', 'hight')
		}
		if (digit) {
			parent.classList.add('low')
			parent.classList.remove('medium', 'hight')
		}
		if (
			(digit && lowerLetter && value.length > 6) ||
			(digit && upperLetter && value.length > 6)
		) {
			parent.classList.remove('low', 'hight')
			parent.classList.add('medium')
		}
		if (digit && upperLetter && lowerLetter && value.length > 10) {
			parent.classList.remove('low', 'medium')
			parent.classList.add('hight')
		}
	}

	confirmationPassword = () => {
		const { Password } = this.data
		const confPass = findNode('#', 'confPass', this.node)

		Password === confPass.value && Password !== ''
			? this.success(confPass)
			: this.error(confPass)
	}

	addListeners = () => {
		const inputs = findAllNodes('', 'input', this.node)
		inputs.forEach(input => {
			input.addEventListener('input', this.detailsBlockInputValidity)
			input.value !== '' ? this.choose(input) : null
		})
	}

	render = (step ,data) => {
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
