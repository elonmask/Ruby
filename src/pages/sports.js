import { getModule } from '../templates/templatesModules'
import '../styles/sports.css'
import '../styles/prematch.css'
import { FooterTemplate } from '../modules/footer/footerTemplate'

export class SportsTemplate {
	constructor() {
		this.pagesName = ['default', 'table', 'list']
		this.modulesData = {
			default: this.defaultContent,
			table: this.prematchTable,
			list: this.prematchList,
		}
	}

	getUrl = () => {
		const page = window.location.hash.split('/')[2] || 'default'
		return this.pagesName.find(item => page === item)
	}

	prematchList = () =>  
		`
    <div id="sports-prematch-list">${getModule('prematchList')}</div>`

	prematchTable = () =>
		`<div id="sports-prematch-table">${getModule('prematchTable')}</div>`

	defaultContent = () =>

		`${getModule('banner')}
		<div id="sports-live-now">${getModule('liveNow')}</div> 
          <div id="sports-sport-news">${getModule('sportsNews')}</div>
          <div id="sports-top-bets">${getModule('topBets')}</div>
          <div id="sports-highlights-bets" class="sports-highlights-bets open">${getModule(
			'highlightsBets'
		)}
		</div>`


	appendContent = () => {
		if (!this.modulesData[this.getUrl()]) {
			window.location = './#/sports'
		}

		return this.modulesData[this.getUrl()]() || ''
	}

	render = () =>
		`<div class="container flex-container" style="margin-bottom: 10px;">
        <div class="content left" style="min-width: 260px; padding-right: 20px; height: calc(100vh - 148px); overflow-y: auto;" data-simplebar data-simplebar-auto-hide="false">
          <div id="sports-classification" style="margin-bottom: 10px">${getModule(
			'classification'
		)}</div>
        </div>
        <div class="content center" data-simplebar data-simplebar-auto-hide="false">
         ${this.appendContent()}
		 <div class="footer" style="margin-top: 5px;">
		 ${new FooterTemplate().render()}
		 </div>
        </div>
        <div class="content right sports" data-simplebar data-simplebar-auto-hide="false">
          <div id="sports-right-column" style="margin-bottom: 10px">${getModule(
			'rightColumn'
		)}</div>
      </div> `
}
