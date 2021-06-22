import { getModule } from '../templates/templatesModules'
// <div class="container flex-container" style="margin-bottom: 10px">
// 	<div class="content center">
// 	<div id="account-forMainHotNews">${getModule('hotNews')}</div>
// 	</div>
// 	</div>
// <div id="account-search" style="margin-bottom: 10px">${getModule(
// 									'search'
// 								)}</div>

export class AccountTemplate {
	render = () => {
		return `
  			<div class="container flex-container" style="margin-bottom: 10px;">
						<div class="content left">
								<div id="account-usermenu">${getModule('usermenu')}</div>
						</div>
						<div class="content center">
								<iframe src="https://api.ruby.bet/myaccount/balance/casier.php" width="100%" height="100%" allowfullscreen></iframe>
						</div>
						<div class="content right">
								<div id="account-right-column">${getModule('rightColumn')}</div>
						</div>
				</div>	
  	`
	}
}
