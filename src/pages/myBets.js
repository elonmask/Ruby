import { getModule } from '../templates/templatesModules'

// <div id="my-bets-search" style="margin-bottom: 10px">${getModule(
// 					'search'
// 				)}</div>

export class MyBetsTemplate {
	constructor() {}

	render = () =>
		`<div class="container flex-container" style="margin-bottom: 10px;">
    <div class="content center">${getModule('myBetsCenter')}</div>
    <div class="content right">
        <div id="my-bets-right-column">${getModule('rightColumn')}</div>
    </div>
</div>`
}
