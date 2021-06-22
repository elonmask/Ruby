import { LeagueLiveCategory } from '../leagueLiveCategory/leagueLiveCategory'
import { InplayTree } from '../../../webApi/inplayTree'
import { createElement } from '../../../helpers/createElement'
import { getAllLeagues } from '../../../helpers/utils'
import { getCurrentView } from '../../../selectors/selectors'
import { EmptySportCategory } from './emptySportCategory'
import { LiveTranslationUpdate } from '../../../webApi/liveTranslationUpdate'
import { FooterTemplate } from '../../footer/footerTemplate'


export class SportLiveCategory {
	constructor(data) {
		this.div = null
		this.type = 'div'
		this.classes = ['inplay-sport-wrapper']
		this.leagueInstances = {}
		this.data = data
		this.id = data.id
		this.name = data.name
		this.categories = data.categories

		this.shortPullSubscriber = new InplayTree(this.addLeague, this.removeLeague, this.emptyTemplate)
		this.translationSubscriber = new LiveTranslationUpdate()
		this.empty = new EmptySportCategory()
	}

	createCategory = league => {
		const categoryItem = new LeagueLiveCategory(league)
		this.leagueInstances[league.id] = categoryItem
		return categoryItem
	}

	appendCategory = category => {
		this.div
			.querySelector('.inplay-category-container')
			.append(category.render())
	}

	addNewCategory = league => {
		if (league.inPlayMatchCount !== 0){
			const categoryItem = this.createCategory(league)
			this.appendCategory(categoryItem)
		}
	}

	renderCategories = () => { 

		if (this.data.inPlayMatchCount === 0){
			return this.emptyTemplate(this.data.inPlayMatchCount)
		}

		let sportLeagues = getAllLeagues(this.data)
		/*sportLeagues = sportLeagues?.sort((a, b) => a.priority - b.priority) ?? []

          if (sportLeagues.length > 0) {
            const nonZero = sportLeagues.filter(a => a.priority !== 0)
            const zero = sportLeagues.filter(a => a.priority == 0)
            sportLeagues = _.concat(nonZero, zero)
          }*/

		sportLeagues.forEach(league => {
			this.addNewCategory(league)
		})

		/**<div class="footer" style="margin-top: 5px;"> */
		const footerContainer = document.createElement('div');
		footerContainer.classList.add("footer");
		footerContainer.style.marginTop = "5px";
		footerContainer.innerHTML = new FooterTemplate().render();

		this.div
			.querySelector('.inplay-category-container')
			.append(footerContainer);
		
	}

	emptyTemplate =(matchCount)=> {

		if (matchCount !== 0){
			this.empty.destroy()
		}else {
			this.empty.render(this.div)
		}

	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		const name = this.name.toLowerCase().includes('es') ? 'esport' : this.name

		const url = `https://bestline.bet/icon/sport/${this.id}`

		this.div.innerHTML = `
                        <div class="inplayCategory">
                          <div class="flex-container align-middle">
                              <p class="sports-icon__small icon__black" style="background-image: url(${url})"></p>
                              <p class="font primary ml text-transform">${this.name}</p>
                            </div>
                            <div class="flex-container align-middle inplayMenu"></div>
                         </div>
                         <div class="inplay-category-container"></div>`

		this.renderCategories()

		this.shortPullSubscriber.init()
		this.translationSubscriber.init()
		// storageEmitter.writeEventToStorage('inplay', this.emptyTemplate)

		return this.div
	}

	destroy = () => {
		console.log('destroy sport category')

		Object.values(this.leagueInstances).forEach(league => {
			if (league) {
				league.destroy()
			}
		})

		this.shortPullSubscriber.destroy()
		this.translationSubscriber.destroy()
	}

	// For live update methods

	removeLeague = id => {
		console.log('remove league', id)
		if (!this.leagueInstances[id]) {
			return
		}

		this.leagueInstances[id].destroy()

		this.leagueInstances = Object.keys(this.leagueInstances).reduce(
			(acc, leagueId) => {
				if (leagueId !== id) {
					acc[leagueId] = this.leagueInstances[leagueId]
				}
				return acc
			},
			{}
		)
	}

	addLeague = id => {
		const leagues = getAllLeagues(getCurrentView())

		const addLeague = leagues.find(league => league.id === id)

		this.addNewCategory(addLeague)
	}
}
