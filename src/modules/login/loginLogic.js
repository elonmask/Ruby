import { findAllNodes, findNode, getRequest, useTranslate } from '../../helpers/utils'
import { createElement } from '../../helpers/createElement'
import { registration } from '../registration/registration'
import { links } from '../../links/links'
import { ForgotPassword } from '../forgotPassword/forgotPassword'
import { popUp } from '../LoginFailure'

export class LoginLogic {
	constructor() {

		this.div = null
		this.classes = ['flex-container', 'align-right']

		this.registerBtn = null
		this.container = null
		this.submitBtn = null
		this.form = null
		this.inputs = null

		this.login = null
		this.password = null
	}

	showRegisterForm = () => {
		registration.init()
	}

	showForgotPasswordForm =()=> {
		document.body.append(new ForgotPassword().render())

		const blur = findNode('.', 'blur')
		blur.classList.remove('none')
		blur.classList.add('block')
	}

	validateCredential = () => this.password?.length > 5 && this.login?.length > 5

	loginSuccess = () => {
		this.inputs.forEach(input => (input.value = ''))

		this.login = null
		this.password = null

		window.location.reload()
	}

	loginFailed = () => {
		this.inputs.forEach(input => input.classList.add('error'))
		this.submitBtn.classList.add('disabled')
		popUp.init()
	}

	onSubmit = async (e) => {
		e.preventDefault()
		if (!this.validateCredential()) {
			return
		}

		try {
			const data = await getRequest(links.login, 'post', {
				username: this.login,
				password: this.password,
			})

			console.log(data)

			if (data?.LOGIN?.SUCCESS) {
				this.loginSuccess()
			} else {
				this.loginFailed()
			}
		} catch (e) {
			console.log(e)
		}
	}

	onInput = e => {
		this.inputs.forEach(input => input.classList.remove('error'))

		this[e.target.name] = e.target.value

		if (this.validateCredential()) {
			this.submitBtn.classList.remove('disabled')
		} else {
			this.submitBtn.classList.add('disabled')
		}
	}

	addListeners = () => {
		this.form.addEventListener('submit', this.onSubmit)
		this.inputs.forEach(input => input.addEventListener('input', this.onInput))
		this.registerBtn.addEventListener('click', this.showRegisterForm)
		this.forgotPassword.addEventListener('click', this.showForgotPasswordForm)
	}

	appendElements = () => {
		 this.div = createElement({
				type: 'div',
				classes: ['flex-container', 'align-right'],
			})

		this.div.innerHTML = `
				<form class="flex-container align-center-middle">
						<div class="block login__wrapper">
							<input class="field login__field"
										 type="text"
										 placeholder="${useTranslate('login')}"
										 name="login"
							 />
							<a class="font text-underline login__link"
								 id="register"
								 data-lang="register_now">
								 ${useTranslate('reg_now')}
							</a>
						</div>
						<div class="block sign-in-wrapper">
							<input class="field login__field"
										 type="password"
										 placeholder="${useTranslate('password')}"
										 name="password"
							 />
							<a class="font text-underline login__link forgot__password"
								 data-lang="password">
								 ${useTranslate('fog_pass')}
							 </a>
						</div>
						<div class="block">
							<button type="submit" class="button primary square login__button disabled"></button>
						</div>
				</form>`

		this.form = findNode('', 'form', this.div)
		this.submitBtn = findNode('.', 'login__button', this.div)
		this.inputs = findAllNodes('.', 'login__field', this.div)
		this.registerBtn = findNode('#', 'register', this.div)
		this.forgotPassword = findNode('.', 'forgot__password', this.div)

		this.addListeners()

		this.container.append(this.div)
	}

	init = () => {
		this.container = findNode('.', 'login')

		this.appendElements()
	}
}
