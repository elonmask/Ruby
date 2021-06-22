import {  getRequest} from '../../helpers/utils'

export class CasinoLogic {
    constructor() {
        this.casino = null;
    }

    loadData = async () => {
        try {
            this.casino = await getRequest('https://api.ruby.bet/casino.php');
        } catch (err) {
            console.log(err)
        }
    }

    drawData = () => {
        console.log(this.casino);
        document.getElementById('casinoContainer').innerHTML = this.casino;
    }

    showData = async () => {
        await this.loadData();
        await this.drawData();
    }

    init = () => {
        this.showData();
    }
}