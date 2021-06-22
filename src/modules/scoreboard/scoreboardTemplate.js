import { createElement } from '../../helpers/createElement'
import { findNode } from '../../helpers/utils'
import { getEvent, getInplay } from '../../selectors/selectors'
import { scoreboardBackgrounds } from '../../helpers/transform/scoreboardTransform'
import '../../styles/scoreboard.css'

export class ScoreboardTemplate {
	constructor() {
		this.type = 'scoreboardTemplate'
		this.event = getEvent()
		this.competitors = this.event.competitors
		this.additionalData = this.event.additionalData
		this.sportName = ''
		this.leagueName = ''
		this.div = null
		this.type = 'div'
		this.classes = ['scoreboard']
		this.id = ['event-forScoreboard']

		this.getSportName()
	}

	getSportName = () => {
		getInplay().forEach(({ id, name, categories }) => {
			if (id === this.event.sportId) {
				this.sportName = name
				categories.forEach(({ leagues }) => {
					leagues.forEach(league => {
						if (league.id === this.event.leagueId) {
							this.leagueName = league.name
						}
					})
				})
			}
		})
	}

	onToggleScreen = e => {
		const button = e.target

		button.classList.toggle('toggle__show')
		button.classList.toggle('toggle__hide')

		const screen = findNode('.', 'scoreboardScreen', this.div)

		screen.classList.toggle('show_screen')
		screen.classList.toggle('hide_screen')
	}

	addListeners = () => {
		const button = findNode('#', 'toggleButton', this.div)
		button.addEventListener('click', this.onToggleScreen)
	}

	appendInnerHtml = () =>
		`<div class="scorebordImg" style="background-image: url(${
			scoreboardBackgrounds[this.event.sportId] || scoreboardBackgrounds[1]
		})"></div>
		 <div class="scoreboardMenu">
					<div class="flex-container align-middle scoreboardMenu__wrapper big">
							<p class="sports-${this.sportName.split(' ').join('').toLowerCase()}"></p>
							<p class="font primary ml text-transform" 
								  style="line-height: 25px;">${this.sportName}</p>
							<p class="font ellipsis ml" 
								  style="line-height: 25px;">${this.leagueName}</p>
					</div>
					<div class="font scoreboardShow toggle__hide" id="toggleButton"></div>
					<p class="font text-nowrap" id="match_time"></p>
			</div>
			<div class="scoreboardScreen show_screen"></div>`

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
			id: this.id,
		})

		this.div.innerHTML = this.appendInnerHtml()

		this.addListeners()

		return this.div
	}
}
