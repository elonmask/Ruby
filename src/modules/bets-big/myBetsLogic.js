import { Settled } from './components/settled'
import { Unsettled } from './components/unsettled'
import { All } from './components/all'
import {
	findAllNodes,
	findNode,
	getPartURL,
	getRequestWithLoader,
} from '../../helpers/utils'

export class MyBetsLogic {
	constructor() {
		this.container = null
		this.content = {
			settled: new Settled(),
			unsettled: new Unsettled(),
			all: new All(),
		}
	}

	appendContent = async () => {
		const name = getPartURL(2)
		let content = this.content[name]

		if (!content) {
			content = this.content.all
			window.history.pushState('', '', `./#/mybets/${content}`)
		}

		this.lightLink()

		const children = await content.init()

		if (Array.isArray(children)) {
			return this.container.append(...children)
		}

		this.container.append(children)
	}

	lightLink = () => {
		findAllNodes('.', 'my_bets__link').forEach(link => {
			if (link.dataset.name === getPartURL(2)) {
				return link.classList.add('active')
			}
			link.classList.remove('active')
		})
	}

	init = () => {
		this.container = findNode('#', 'myBets-body')

		getRequestWithLoader(this.appendContent)()
	}
}
