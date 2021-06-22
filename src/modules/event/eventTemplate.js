import '../../styles/maTable.css'

export class EventTemplate {
	render = () =>
		`<div class="flex-container" >
				<div class="screen_height--event classification_inplay_wrapper"" data-simplebar data-simplebar-auto-hide="false">
						<div id="classification_inplay_container"></div>
				</div>
				<div class="screen_height--event scoreboard__wrapper" style=" width: 100%; padding-right: 20px; height: calc(100vh - 148px); overflow-y: auto; " data-simplebar>
					  <div id="scoreboardWrapper" ></div>
				</div>
		</div>`
}
