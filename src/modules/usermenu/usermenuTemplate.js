import {
	getCurrencySymbol,
	getFullName,
	getUserName,
} from '../../selectors/configSelectors'
import { findNode, getRequest } from '../../helpers/utils'
import { links } from '../../links/links'

export class UsermenuTemplate {
	logOut = async e => {
		e.preventDefault()
		try {
			const data = await getRequest(links.logout)
			if (data?.LOGIN?.SUCCESS) {
				window.location.reload()
			}
		} catch (e) {
			console.log(e)
		}
	}

	addListener = () => {
		setTimeout(() => {
			findNode('#', 'logOut').addEventListener('click', this.logOut)
		}, 0)
	}

	render = () => { 
		this.addListener()
		return `<div class="[ user-menu ]">
		 <div class="[ user-menu-wrapper ]">
				<div class="[ user-menu-img ]"></div>
				<p class="[ user-menu-name ] text-center">${getFullName()}</p>
				<p class="[ user-menu-email ] text-center">${getUserName()}</p>
				<hr class="[ user-menu-separate ]">
				<p class="font [ user-menu-text ]">Total:</p>
				<p id="total" class="font text-uppercase [ user-menu-big primary ]">1707101</p>
				<p class="font [ user-menu-text ]">Main:</p>
				<p id="main" class="font text-uppercase [ user-menu-big second ]">1.50 ${getCurrencySymbol()}</p>
				<p class="font [ user-menu-text ]">Bonuses:</p>
				<p id="bonuses" class="font text-uppercase [ user-menu-big primary ]">0.00 ${getCurrencySymbol()}</p>
		 </div>
		 <div class="[ user-menu-links ]">
				<a href="./#/account" class="[ user-menu-link ] flex-container align-middle">
					 <p class="fa fa-money"></p>
					 <p class="font">Account history</p>
				</a>
				<a href="./#/account" class="[ user-menu-link ] flex-container align-middle">
					 <p class="fa fa-cogs"></p>
					 <p class="font">Account settings</p>
					 <div class="[ user-menu-notification ]"></div>
				</a>
				<a href="./#/account" class="[ user-menu-link ] flex-container align-middle">
					 <p class="fa fa-refresh"></p>
					 <p class="font">Deposit/Withdraw funds</p>
				</a>
				<a href="./#/account" class="[ user-menu-link ] flex-container align-middle" id="logOut">
					 <p class="fa fa-sign-out"></p>
					 <p class="font">Exit</p>
				</a>
		 </div>
</div>`
	}
}
