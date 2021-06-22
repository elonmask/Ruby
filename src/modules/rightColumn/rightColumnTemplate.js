import '../../styles/betslip.css'
import '../../styles/myBets.css'
import '../../styles/quickbet.css'

import { getModule } from '../../templates/templatesModules'

export class RightColumnTemplate {

	checkUrl =()=> window.location.hash.includes('live')

	render = () =>
		`${this.checkUrl() ? `
			<div class="match-live">
				${getModule('translation')}
			</div>` : ''
		}
		<div class="tab" >
        <div class="flex-container align-middle tab__header border" id="betslip_tabs_container"></div>
     </div>
     <div class="betslip" id="betslipContent"></div>
		`
}
