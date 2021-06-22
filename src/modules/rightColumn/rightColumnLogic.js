import { Tab } from './myBets/tabs/tab'
import { getModule } from '../../templates/templatesModules'
import { findNode, getSession, setSession, useTranslate } from '../../helpers/utils'
import { isLoggedIn } from '../../selectors/configSelectors'

export class RightColumnLogic {
	constructor() {
		this.default = 'betslip'

		this.active = isLoggedIn()
			? getSession('asideRightCurrent') || this.default
			: this.default

		this.linksData = [
			{
				attr: [{ name: 'data-name', value: 'betslip' }],
				title: useTranslate('betslip'),
			},
		] 

		this.linksNodes = []
		this.linksContainer = null
		this.contentContainer = null

		if (isLoggedIn()) {
			this.linksData.push({
				attr: [{ name: 'data-name', value: 'myBetsAside' }],
				title: useTranslate('mybets'),
			})
		}

	}

	lightLink = () => {
		this.linksNodes.forEach(link => {
			const active = this.active || this.default

			if (link.dataset.name === active) {
				link.classList.add('active')
			} else {
				link.classList.remove('active')
			}
		})
	}

	linkEvent = e => {
		this.active = e.target.dataset.name

		setSession('asideRightCurrent', this.active)
		this.lightLink()
		this.contentTemplate()
	}

	linkTemplate = () => {
		this.linksData.forEach(({ title, attr }) => {
			const linkItem = new Tab(
				title,
				attr,
				[{ event: 'click', cb: this.linkEvent }],
				['tab__link', 'active', 'font']
			).render()

			this.linksNodes.push(linkItem)
			this.linksContainer.append(linkItem)
		})
		this.lightLink()
	}

	contentTemplate = () => {
		const key = this.active || this.default
		this.contentContainer.innerHTML = getModule(key)
	}

	appendData = () => {
		this.linkTemplate()
		this.contentTemplate()
	}

	init = () => {
		this.linksContainer = findNode('#', 'betslip_tabs_container')
		this.contentContainer = findNode('#', 'betslipContent')

		this.appendData()
	}

}
