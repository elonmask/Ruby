import { getRequest } from '../../helpers/utils'

export class UsermenuLogic {
    constructor() {
        
    }

    getBalance = async () => {
		return await getRequest('https://api.ruby.bet/balance/get/');
    }

	fillData = async () => {
		let res = null;
		try {
			res = await this.getBalance();

			document.getElementById("total").textContent = res.balance.total;
			document.getElementById("main").textContent = res.balance.main;
			document.getElementById("bonuses").textContent = res.balance.bonus;
		} catch(err) {
			console.log(err);
		}
	}

    showData = async() => {
        try {
            await this.fillData();

        } catch(err) {
            console.log(err);
        }
    }

    init = () => {
        this.showData();
    }
}