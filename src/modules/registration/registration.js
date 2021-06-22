import { findNode, getRequest } from '../../helpers/utils'
import { createElement } from '../../helpers/createElement'
import { links } from '../../links/links'
import { Step_1 } from './components/step_1'
import { Step_2 } from './components/step_2'
import { Step_3 } from './components/step_3'
import { Header } from './components/header'
import { Footer } from './components/footer'

class Registration {
	constructor() {
		this.step = 1
		this.user = {
			Details: {
				Login: '',
				Password: '',
			},
			Information: {
				Country: '',
				Currency: '',
				FirstName: '',
				SecondName: '',
				Phone: {
					Operator: '',
					Number: '',
				},
				Email: '',
				BirthDate: {
					Day: '',
					Month: '',
					Year: '',
				},
				Adress: '',
				Gender: '',
			},
			Confirmation: {
				InfoProcessed: false,
				LegalAge: false,
				LegalAgeCasino: false,
				Rules: false,
			},
		}

		this.type = 'div'
		this.classes = ['popup', 'flex-container', 'align-center', 'align-middle']
		this.node = null
		this.closeBtn = null
		this.header = null
		this.body = null
		this.footer = null
		this.container = null

		this.stepTemplate1 = new Step_1({
			choose: this.chooseAllElements,
			success: this.markFieldAsSuccess,
			error: this.markFieldAsFail,
			checkValidity: this.checkPageValidity,
		})
		this.stepTemplate2 = new Step_2({
			choose: this.chooseAllElements,
			success: this.markFieldAsSuccess,
			error: this.markFieldAsFail,
			checkValidity: this.checkPageValidity,
		})
		this.stepTemplate3 = new Step_3({
			choose: this.chooseAllElements,
			success: this.markFieldAsSuccess,
			error: this.markFieldAsFail,
			toggleBtn: this.disabledOrEnableBtn,
		})

		this.headerInstance = new Header()
		this.footerInstance = new Footer({
			prev: this.toPrevStep,
			next: this.toNextStep,
		})

		this.bodies = {
			1: {
				data: this.user.Details,
				template: this.stepTemplate1,
			},
			2: {
				data: this.user.Information,
				template: this.stepTemplate2,
			},
			3: {
				data: this.user.Confirmation,
				template: this.stepTemplate3,
			},
		}
	}

	checkPageValidity = () => {
		const inputs = this.node.querySelectorAll('input')
		const selects = this.node.querySelectorAll('select')

		let elements = [...inputs, ...selects]

		let valid = elements.every(elem => {
			let correct = elem
				.closest('.sign-up-body-item')
				.classList.contains('corrected')
			return elem.validity.valid && correct
		})

		this.disabledOrEnableBtn(valid)
	}

	appendContent = () => {
		this.container.innerHTML = ''
		/*this.appendHeader()
		this.appendBody()
		this.appendFooter()*/
		this.container.innerHTML = `
		<iframe style="width: 510px; height: 400px;" src="https://dev.ruby.bet/registrationIframe/main.php"></iframe>
		`
	}

	appendHeader = () => {
		this.container.append(this.headerInstance.render(this.step))
	}

	appendBody = () => {
		this.container.append(
			this.bodies[this.step].template.render(
				this.step,
				this.bodies[this.step].data
			)
		)
	}

	appendFooter = () => {
		this.container.append(this.footerInstance.render(this.step))
	}

	disabledOrEnableBtn = bool => {
		const btn = findNode('#', 'next', this.node)
		if (bool) {
			btn.removeAttribute('disabled')
			btn.classList.remove('disabled')
		} else {
			btn.setAttribute('disabled', 'true')
			btn.classList.add('disabled')
		}
	}

	toNextStep = () => {
		if (this.step === 3) {
			return this.sendData()
		}

		if (this.step < 3) {
			this.step++
			this.appendContent()
		}
	}

	toPrevStep = () => {
		if (this.step > 1) {
			this.step--
			this.appendContent()
		}
	}
	chooseAllElements = elem => {
		let parentElem = elem.closest('.sign-up-body-item')
		let inputs = parentElem.querySelectorAll('input')
		let selects = parentElem.querySelectorAll('select')
		let arr = [...inputs, ...selects]

		if (arr.length > 1) {
			let valid = arr.every(item => item.validity.valid)
			valid ? this.markFieldAsSuccess(elem) : this.markFieldAsFail(elem)
		} else {
			elem.validity.valid
				? this.markFieldAsSuccess(elem)
				: this.markFieldAsFail(elem)
		}
	}

	markFieldAsSuccess = elem => {
		let parentElem = elem.closest('.sign-up-body-item')
		parentElem.classList.add('corrected')
		parentElem.classList.remove('uncorrected')
	}

	markFieldAsFail = elem => {
		let parentElem = elem.closest('.sign-up-body-item')
		parentElem.classList.remove('corrected')
		parentElem.classList.add('uncorrected')
	}

	sendData = async () => {
		console.log(this.user)

		try {
			const data = await getRequest(links.registration, 'post', this.user)

			if (data?.CREATE?.SUCCESS) {
				window.location.reload()
			} else {
				this.error()
			}
		} catch (e) {
			console.log(e)
			this.error()
		}
	}

	showOverlay = () => {
		this.blur = findNode('.', 'blur')
		this.blur.classList.add('block')
		this.blur.classList.remove('none')

		//this.node.addEventListener('click', this.overlayDestroy)
	}

	hideOverlay = () => {
		this.blur.classList.remove('block')
		this.blur.classList.add('none')
	}

	overlayDestroy = e => {
		if (e.target === e.currentTarget) {
			this.destroy()
			this.node.removeEventListener('click', this.overlayDestroy)
		}
	}

	tryAgainHandler = () => {
		this.step = 1
		this.appendContent()
	}

	error = () => {
		this.container.innerHTML = `
			<div class="sign-up-nav flex-container align-middle font white" style="padding: 0px 10px; font-size: 16px">Registration Error</div>
			<div class="sign-up-body">
				<div class="flex-container align-middle mb font white ">
					Something went wrong, please check your data and try again
				</div>
			</div>
			<div class="sign-up-footer flex-container align-middle">
				<button class="button primary sign-up-footer-button">
							Try again 
				</button>
			</div>
		`

		findNode('.', 'button', this.container).addEventListener(
			'click',
			this.tryAgainHandler
		)
	}

	init = () => {
		
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})
		

		this.node.innerHTML = `
				<div class="popup__inner">
					<div class="close sign-up-close" id="closeRegForm"></div>
				  <div class="sign-up scroll"></div>
			  </div>`

		this.container = findNode('.', 'sign-up', this.node)
		this.closeBtn = findNode('#', 'closeRegForm', this.node)
		this.closeBtn.addEventListener('click', this.destroy)

		this.showOverlay()
		this.appendContent()

		document.body.append(this.node)
	}

	destroy = () => {
		this.closeBtn.removeEventListener('click', this.destroy)

		this.hideOverlay()
		this.node.remove()
	}
}

export const registration = new Registration()
