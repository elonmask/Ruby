import { createElement } from '../../../helpers/createElement'
import { getPartURL, useTranslate } from '../../../helpers/utils'

export class MenuBottom {
  constructor() {
    this.node = null
    this.type = 'menu'
    this.classes = ['bottom-menu', 'flex-container', 'align-middle']
    this.linksData = [
      {
        attributes: [
          { name: 'data-name', value: 'overview' },
          { name: 'data-lang', value: 'overview' },
          { name: 'href', value: '#/live/overview' },
        ],
        classes: ['font', 'bottom-menu-item'],
        text: useTranslate('overview'),
      },
      {
        attributes: [
          { name: 'data-name', value: 'event' },
          { name: 'data-lang', value: 'event' },
          { name: 'href', value: '#/live/event' },
        ],
        classes: ['font', 'bottom-menu-item'],
        text: useTranslate('event'),
      },
      /*{
        attributes: [
          { name: 'data-name', value: 'calendar' },
          { name: 'data-lang', value: 'calendar' },
          { name: 'href', value: '#/live/calendar' },
        ],
        classes: ['font', 'bottom-menu-item'],
        text: 'Calendar',
      },*/
    ]
    this.linksNodes = []
  }

  lightLink = () => {
    this.linksNodes.forEach(node => {
      const linkName = node.dataset.name
      const currentLink = getPartURL(2)

      if (linkName === currentLink) {
        node.classList.add('active')
      } else {
        node.classList.remove('active')
      }
    })
  }


	linkTemplate = () => {
		this.linksData.forEach(({ href, attributes, classes, listeners, text }) => {
			// console.log(text)
			let id = '';
			if (text == 'Overview' || text == 'Обзор') {
				id = 'over';
			} else if (text == 'Event' || text == 'Матч') {
				id = 'ev';
			}
			const a = createElement({
				type: 'a',
				classes,
				attributes,
				listeners,
				id
			})
		
			a.innerText = text
			this.linksNodes.push(a)
			this.node.append(a)
		})
	}

	hideLinks =()=> {
		const location = window.location.href

		location.includes('live') ?
			this.linksNodes.forEach(node => node.style.display = 'flex') : this.linksNodes.forEach(node => node.style.display = 'none')
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.linkTemplate()
		this.lightLink()
		this.hideLinks()


		window.addEventListener('hashchange', this.lightLink)
		window.addEventListener('hashchange', this.hideLinks)
		return this.node
	}

	destroy =()=> {
		window.removeEventListener('hashchange', this.lightLink)
		window.removeEventListener('hashchange', this.hideLinks)
	}
}

