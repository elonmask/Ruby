import { Tab } from './tabs/tab'
import { findNode } from '../../../helpers/utils'
import { Unsettled } from '../../bets-big/components/unsettled'
import { All } from '../../bets-big/components/all'
import { Settled } from '../../bets-big/components/settled'

export class MyBetsTemplateAsideLogic {
	constructor() {
		this.contentNode = null
		this.linkNode = null
		this.links = [
			{
				attr: [{ name: 'data-name', value: 'unsettled' }],
				title: 'Unsettled',
			},

			{
				attr: [{ name: 'data-name', value: 'settled' }],
				title: 'Settled',
			},
			{
				attr: [{ name: 'data-name', value: 'all' }],
				title: 'All',
			},
		]
		this.linksNodes = []

		this.contentTemplate = {
			all: new All(),
			unsettled: new Unsettled(),
			settled: new Settled(),
		}
		this.active = 'unsettled'
	}

	changeContent = e => {
		this.active = e.target.dataset.name

		this.lightLink()
		this.bodyTemplate()
	}

	lightLink = () => {
		this.linksNodes.forEach(link => {
			if (link.dataset.name === this.active) {
				link.classList.add('active')
			} else {
				link.classList.remove('active')
			}
		})
	}

	linkTemplate = () => {
		this.links.forEach(({ attr, title }) => {
			const linkItem = new Tab(
				title,
				attr,
				[
					{
						event: 'click',
						cb: this.changeContent,
					},
				],
				['myBets-link', 'font', 'white']
			).render()

			this.linksNodes.push(linkItem)
			this.linkNode.append(linkItem)
		})

		this.lightLink()
	}

	bodyTemplate = async () => {
		this.contentNode.innerHTML = ''

		const content = await this.contentTemplate[this.active].init()

		if (Array.isArray(content)) {
			this.contentNode.append(...content)
			return
		}

		this.contentNode.append(content)
	}

	appendContent = () => {
		this.linkTemplate()
		this.bodyTemplate()
	}

	init = () => {
		this.contentNode = findNode('#', 'myBets_body__aside')
		this.linkNode = findNode('#', 'myBets_links__aside')

		this.appendContent()
	}
}
