import { getModule } from '../templates/templatesModules'

export class LiveTemplate {
	constructor() {
		this.pagesName = ['overview', 'event', /*'calendar'*/]
	}

	getUrl = () => {
		const page = window.location.hash.split('/')[2]
		const name = this.pagesName.find(item => page === item)

		if (!name) {
			window.location = './#/live/overview'
		}

		return name
	}

	// <div class="container flex-container" style="margin-bottom: 10px">
	// 		<div class="content center">
	// 		<div id="inplay-hot-news">${getModule('hotNews')}</div>
	// 		</div>
	// 		</div>

	// <div id="inplay-search" style="margin-bottom: 10px">
	// 		${getModule('search')}
	// 		</div>

	render = () =>
		`
      <div class="container flex-container" style="margin-bottom: 10px">
        <div class="content center live" id="contentCenter">
					${getModule(this.getUrl())}</div>
        <div class="content right live" data-simplebar data-simplebar-auto-hide="false">
          <div id="inplay-right-column" style="margin-bottom: 10px">
						${getModule('rightColumn')}
					</div>
        </div>
      </div>`
}
