import { getModule } from '../../templates/templatesModules'
import '../../styles/inplay.css'
import '../../styles/banner.css'
import '../../styles/sportsIcon.css'

export class OverviewTemplate {
	render = () =>
		`
		<div style="width: 100%; padding-right: 20px;">
		<div class="slider inplaySlider" id="inplay_slider" style="margin-bottom: 10px">${getModule(
			'slider'
		)}</div></div>
       <div class="inplayResultTable screen_height content live play-table" id="inplay-playTable" data-simplebar data-simplebar-auto-hide="false">
          <div class="wrapper__item" id="inplay_container"></div>
       </div>`
}
