import { createElement } from '../../helpers/createElement'
import { findNode } from '../../helpers/utils'

export class ForgotPassword{

	constructor() {
		this.type = 'div'
		this.classes = ['popup', 'flex-container', 'align-center', 'align-middle']
		this.div = null
	}

	destroy =()=> {
		const blur = findNode('.', 'blur')

		blur.classList.remove('block')
		blur.classList.add('none')

		this.div.remove()
	}

	addListeners =()=> {
		const close = findNode('#', 'closeRegForm', this.div)

		close.addEventListener('click', this.destroy)
	}

	render =()=> {

		this.div = createElement({
			type:this.type,
			classes: this.classes
		})

		this.div.innerHTML =  `
				<div class="popup__inner">
					<div class="close sign-up-close" id="closeRegForm"></div>
					<div class="sign-up scroll">
						<iframe width="100%" height="400px" src="https://m.ruby.bet/lostPasswordIframe/main.php"></iframe>
					</div>		
				</div>`

		this.addListeners()

		return this.div
	}


}
