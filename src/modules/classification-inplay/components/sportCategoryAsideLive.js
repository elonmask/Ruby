import { LeagueCategoryAsideLive } from './leagueCategoryAsideLive'
import { createElement } from '../../../helpers/createElement'
import { findNode, getAllLeagues, getDifference } from '../../../helpers/utils'

export class SportCategoryAsideLive {
	constructor(sport) {
		this.div = null
		this.leaguesContainer = null
		this.leaguesInstance = {}

		this.sport = sport
		this.id = sport.id

		this.type = 'div'
		this.classes = ['classification_inplay_competition']
		this.listeners = [{ event: 'click', cb: this.onClick }]

		this.leagues = getAllLeagues(sport) || []
		this.open = this.checkSportId()
	}

	checkSportId = () => window.location.hash.split('/')[3] === this.id.toString()

	onClick = () => {
		this.open = !this.open
		this.lightTitle()

		this.renderLeagues()
	}

	lightTitle = () => {
		if (this.open) {
			this.titleNode.classList.add('active')
			this.titleNode.classList.remove('closed')
		} else {
			this.titleNode.classList.remove('active')
			this.titleNode.classList.add('closed')
		}
	}

	addLeague = league => {
		this.leaguesInstance[league.id] = new LeagueCategoryAsideLive(league)
		this.leaguesContainer.append(this.leaguesInstance[league.id].render())
	}

	removeLeague = id => {
		this.leaguesInstance[id].destroy()

		this.leaguesInstance = Object.keys(this.leaguesInstance).reduce(
			(acc, key) => {
				if (id !== key) {
					acc[key] = this.leaguesInstance[key]
				}
				return acc
			},
			{}
		)
	}

	renderLeagues = () => {
		if (this.open) {
			this.leagues.forEach(league => this.addLeague(league))
		} else {
			this.leaguesContainer.innerHTML = ''

			if (Object.values(this.leaguesInstance).length) {
				Object.values(this.leaguesInstance).forEach(league => league.destroy())

				this.leaguesInstance = {}
			}
		}
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		const name = this.sport.name.toLowerCase().includes('es')
			? 'esport'
			: this.sport.name

		const url = `http://bestline.bet/icon/sport/${this.id}`

		this.div.innerHTML = `
						<div class="classification_inplay_competition_title flex-container align-justify">	
								 <div class="classification_inplay_competition_title_icons flex-container align-justify">
										 <div class="classification_inplay_sport-icon icon__black">
												 <div style="background-image: url(${url})"></div>
										 </div>
								 <div class="classification_inplay_competition_title_name">${this.sport.name}</div>
							   </div>
							   <div class="collapse fa fa-angle-up"></div>
						 </div>
						 <div class="classification_inplay_competition_leagues_container"></div>
		`

		this.titleNode = findNode(
			'.',
			'classification_inplay_competition_title',
			this.div
		)

		this.leaguesContainer = findNode(
			'.',
			'classification_inplay_competition_leagues_container',
			this.div
		)

		this.renderLeagues()
		this.lightTitle()

		return this.div
	}

	update = sport => {
		// console.log(sport)

		if (!this.open) {
			return
		}

		const currentLeagues = getAllLeagues(sport)

		const old = this.leagues.map(item => item.id)
		const current = currentLeagues.map(item => item.id)

		const { removed, added } = getDifference(old, current)

		if (removed.length) {
			removed.forEach(id => {
				this.removeLeague(id)
			})
		}

		if (added.length) {
			added.forEach(key => {
				const league = currentLeagues.find(league => league.id === key)

				this.addLeague(league)
			})
		}

		this.sport = sport
		this.leagues = currentLeagues
	}

	destroy = () => {
		this.div.remove()
		Object.values(this.leaguesInstance).forEach(leagues => leagues.destroy())
		this.div.remove()
	}
}
