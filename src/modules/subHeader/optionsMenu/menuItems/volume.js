import { createElement } from '../../../../helpers/createElement'
import { findNode } from '../../../../helpers/utils'

export class Volume {
	constructor() {
		this.node = null
		this.innerContainer = null
		this.type = 'a'
		this.classes = ['bottom-menu-link-item']
		this.attributes = [{ name: 'data-name', value: 'volumeSetting' }]
		this.itemName = 'volumeSetting'
	}

	appendInnerItems = () => {
		return `<h3>Video Volume</h3>
                <div class="volume-changer">
                  <span class="fa fa-volume-up" id="volume_icon"></span>
                  <input type="range" 
                         name="volume" 
                         min="0" max="100" 
                         value=20 
                         id="inputVolumeNum">
                </div>
                <div class="volume-on-off">
                  <h3>Sound Effects</h3>
                  <label class="on" >
                    <input type="checkbox" id="volume_status"checked>
                  </label>
                </div>`
		//	off
	}

	renderInnerItems = () => {
		this.innerContainer.classList.remove('hide')
		this.innerContainer.innerHTML = this.appendInnerItems()
	}

	destroyInnerItems = () => {
		this.innerContainer.classList.add('hide')
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		this.node.innerHTML = `
						<span class="fa fa-volume-up" ></span>
						<div class="dropDown-item volume-editor hide"></div>`

		this.innerContainer = findNode('.', 'dropDown-item', this.node)

		return this.node
	}
}
