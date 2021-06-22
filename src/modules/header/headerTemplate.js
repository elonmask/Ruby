import { getModule } from '../../templates/templatesModules'
import { isLoggedIn } from '../../selectors/configSelectors'
import '../../styles/header.css'

export class HeaderTemplate {
	getLogin = () => {
		return isLoggedIn() ? getModule('loginIn') : getModule('login')
	}

	render = () =>
		`<div class="progress-bar-outer hide">
          <div class="progress-bar-inner">
            <div class="progress-bar-runner"></div>
          </div>
    </div>
    <div class="nav container-fluid">
          <div class="container flex-container align-middle">
            <div class="content left" id="header-forLogo">${getModule(
							'logo'
						)}</div>
            <div class="content center" id="header-forMenu">${getModule(
							'menu'
						)}</div>
            <div class="content right" id="header-forLogin">${this.getLogin()}</div>
          </div>
    </div>
    <div class="container-fluid bottom" id="header-forMenuBottom">${getModule(
			'subHeader'
		)}</div>`
}
