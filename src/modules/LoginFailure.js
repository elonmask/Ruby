import { createElement } from '../helpers/createElement'
import { findNode, useTranslate } from '../helpers/utils';

class LoginFailure {
    constructor() {
        this.node = null;
        this.container = null;
        this.closeBtn = null;

        this.blur = null;

        this.type = 'div'
		this.classes = ['popup', 'flex-container', 'align-center', 'align-middle']
    }

    hideOverlay = () => {
		this.blur.classList.remove('block')
		this.blur.classList.add('none')
	}

    appendContent = () => {
		this.container.innerHTML = ''
		this.container.innerHTML = `
		<div style="width: 510px; height: 250px; background-color: #33202b; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;">
        <div style="width: 100%; height: 100%; background-color: #281420; padding-top: 45px;">
        <div class="lmd-LoginModuleDefault_FailedLogin" style="display: block;
        padding: 10px;
        border-radius: 2px;
        font-family: Roboto Condensed, sans-serif;
        width: 100%;
        height: 100%;">
            <div class="lmd-LoginModuleDefault_FailedLoginHeader" style="font-size: 18px;
            padding-bottom: 10px;
            text-align: center;
            color: #a63838;">${useTranslate("details")}</div>
                <div class="lmd-LoginModuleDefault_FailedLoginPasswordCaseSensitive" style="font-size: 15px;
                text-align: center; color: white;">${useTranslate("pass")}</div>
                <div class="lmd-LoginModuleDefault_FailedLoginAccountLock" style="font-size: 15px;
                text-align: center; color: white;">${useTranslate("attempt")}</div>
            </div>
        </div>
        </div>
		`
	}

    showOverlay = () => {
		this.blur = findNode('.', 'blur')
		this.blur.classList.add('block')
		this.blur.classList.remove('none')

		//this.node.addEventListener('click', this.overlayDestroy)
	}

    destroy = () => {
		this.closeBtn.removeEventListener('click', this.destroy)

		this.hideOverlay()
		this.node.remove()
	}

    init = () => {
        this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

        this.node.innerHTML = `
				<div class="popup__inner">
					<div class="close sign-up-close" id="closePopUp"></div>
				  <div class="error-popup"></div>
			  </div>`
        this.container = findNode('.', 'error-popup', this.node)
		this.closeBtn = findNode('#', 'closePopUp', this.node)
        this.closeBtn.addEventListener('click', this.destroy)

        this.showOverlay()
		this.appendContent()

		document.body.append(this.node)

    }
}

export const popUp = new LoginFailure()