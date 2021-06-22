import { useTranslate } from "../../helpers/utils";

export class TopBetsTemplate {
    constructor(data) {
        this.data = data;
    }

    render = () => (
        `
        <div class="live-play" style="margin-top: 10px;">
    <div class="live-play-category closed flex-container align-middle">
        <p class="fa fa-bar-chart mr"></p>
        <p class="font">${useTranslate('top_bets')}</p>
    </div>
    <div class="live-play-header flex-container align-middle" id="topBetsCategories">
        
    </div>
    <div class="table-topBets" id="sportTop-Bets_container">
        <div class="column-topBets-frs" id="column-topBets-frs">
        </div>
    </div>
</div>
        `
    )
}
