import { createElement } from '../../helpers/createElement'

export class ClassificationInplayTemplate {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['classification']
		this.id = 'classification_inplay_container'
		// this.attr = [{ name:'data-simplebar', value:'' }]
	}



	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			id: this.id,
			// attributes:	this.attr
		})

		this.node.innerHTML = `
			<a href="./#/sports" class="classification_inplay_button flex-container align-justify">
				<div class="button-left flex-container align-center">
				<i class="fa fa-home" aria-hidden="true" style="margin-right: 6px; font-size: 20px"></i>
				<div class="all">Home</div>
	<!--                <button class="watch"></button>-->
				</div>
	<!--            <div class="button-right">-->
	<!--                <button class="arrows fa fa-angle-double-left"></button>-->
	<!--            </div>-->
			</a>`

		return this.node
	}
}
