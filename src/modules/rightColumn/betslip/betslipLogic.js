import {
	findNode,
	getSession,
	isEmpty,
	isEqualOutcomes,
	setSession,
} from '../../../helpers/utils'
import { BetslipHeader } from './components/header/betslipHeader'
import { SingleStakesWrapperTemplate } from './components/singleStake/singleStakesWrapperTemplate'
import { MultiStakeWrapperTemplate } from './components/multiStake/multiStakeWrapperTemplate'
import { Empty } from './components/empty'
import { FooterWrapper } from './components/footer/footerWrapper'
import { PlacebetResult } from './components/placebetResult/placebetResult'
import { placeBetRequest, refreshStakes } from './actions/betslipRequests'
import { getBetslip } from '../../../selectors/selectors'
import { storageEmitter } from '../../../storage/storageEmmiter'
import {
	writeToStorage,
	writeToStorageWithoutUpdate,
} from '../../../storage/storageMethod'
import { Loader } from './components/loader'

class EventEmitter {
	constructor() {
		this.callbacks = {}
		this.storage = {}
	}

	subscribe = ({ name, cb }) => {
		if (!this.callbacks[name]) {
			this.callbacks[name] = []
		}

		this.callbacks[name].push(cb)
	}

	unsubscribe = ({ name, cb }) => {
		if (this.callbacks[name]) {
			this.callbacks[name] = this.callbacks[name].filter(
				callback => callback.toString() !== cb.toString()
			)
		}
	}

	triggerCallback = ({ name, data }) => {
		this.callbacks[name].forEach(callback => callback(data, this.setStorage))
	}

	checkObject = (name, data) => {
		if (this.storage[name] || this.storage[name] === null) {
			if (!isEqualOutcomes(this.storage[name], data)) {
				if (!isEmpty(this.callbacks[name])) {
					this.triggerCallback({ name, data })
					this.storage[name] = data
				}
			}
		} else {
			this.storage[name] = data
			if (!isEmpty(this.callbacks[name])) {
				this.triggerCallback({ name, data })
			}
		}
	}

	checkPrimitive = (name, data) => {
		if (this.storage[name] || this.storage[name] === null) {
			if (this.storage[name] !== data) {
				if (!isEmpty(this.callbacks[name])) {
					this.triggerCallback({ name, data })
				}
				this.storage[name] = data
			}
		} else {
			this.storage[name] = data
			if (!isEmpty(this.callbacks[name])) {
				this.triggerCallback({ name, data })
			}
		}
	}

	setStorage = ({ name, data }) => {
		if (typeof data === 'object' && data !== null) {
			return this.checkObject(name, data)
		}

		this.checkPrimitive(name, data)
	}
}

export class BetslipLogic extends EventEmitter {
	constructor() {
		super()
		this.container = null
		this.data = null
		this.betslipHeader = new BetslipHeader(this.initialStorage)
		this.stakesWrapper = new SingleStakesWrapperTemplate({
			placeBetCb: this.placeBetChange,
			btnChange: this.currentBtnChange,
		})
		this.multiStakesWrapper = new MultiStakeWrapperTemplate({
			singleValueChange: this.singlesChange,
			placeBetCb: this.placeBetChange,
		})
		this.betslipFooter = new FooterWrapper(this.placeBetHandler)
		this.placeBetResult = new PlacebetResult()
		this.loader = new Loader()



		this.initialStorage()
	}

	initialStorage =()=> {
		this.setStorage({ name: 'placeBet', data: 0 })
		this.setStorage({ name: 'currentBtn', data: {status:1, message:null} })
		this.setStorage({ name: 'singlesValue', data: 0 })
	}

	createMultipleItem = () => {
		const betslipData = getBetslip()

		if (isEmpty(betslipData?.dm)) {
			return null
		}
		const { bd, bt, od } = betslipData.dm

		let st, tr

		const multiStakesSession = getSession('multiStakes') || ''

		const [stake = '', ust, toReturn = ''] = (
			multiStakesSession[bt] || ''
		).split('#')

		st = stake.replace(/[^\d.]/gi, '') || 0
		tr = toReturn.replace(/[^\d.]/gi, '') || 0

		return {
			bt,
			st,
			tr,
			od,
			pt: [
				{
					bd,
					md: '',
				},
			],
		}
	}

	appendNodeInContainer = node => this.container.append(node)

	appendSuccessContent = (data, multiStake) => {
		this.container.innerHTML = this.placeBetResult.render(data, multiStake)
		findNode('.', 'bs_placeBet__header_done', this.container).addEventListener(
			'click',
		this.renderBetslip
		)
	}

	clearBetslipDataAfterPlaceBet = () => {
		setSession('stakesValues', {})
		setSession('multiStakes', {})
		writeToStorage('userStakes', {})
		writeToStorageWithoutUpdate('betslip', null)
	}

	removeTopBets = () => {
		sessionStorage.setItem('topBetsB', JSON.stringify([]));
		this.removeTopBetsClasses();
		//console.log(sessionStorage.getItem('topBetsB'));
	}

	removeTopBetsClasses = () => {
		console.log("Removing classes")

		document.getElementsByClassName('button coefficient coef_item on')
		.forEach( (item) => {
			console.log(item)
			item.classList.remove('on');
		});
		if (document.getElementsByClassName('button coefficient coef_item on').length > 0) {
			this.removeTopBets();
		}
	}

	placeBetSuccess =(data)=> {
		if (!isEmpty(data)) {
			const multiStake = this.createMultipleItem()
			this.clearBetslipDataAfterPlaceBet()
			this.appendSuccessContent(data, multiStake)
			console.log();
			location.hash.split('/')[1] == 'sports' && location.hash.split('/')[2] == "" || typeof location.hash.split('/')[2] == "undefined"
			? this.removeTopBets()
			: ''
			return
		}

		storageEmitter.writeEventToStorage('userStakes', this.update)
	}

	placeBetError =(data)=> {
		console.log("placebet error")
		writeToStorage('betslip', data)
		this.currentBtnChange(0, data.er)

		location.hash.split('/')[1] == 'sports' && location.hash.split('/')[2] == ""
			? this.removeTopBets()
			: ''
	}

	placeBetHandler = async () => {
		this.container.append(this.loader.render())
		storageEmitter.removeCallback('userStakes', this.update)
		console.log("Handling placebet");
		try {
			const data = await placeBetRequest()
			console.log(data)
			if (data.er){
				this.placeBetError(data)
			}else {
				this.placeBetSuccess(data)
			}

			this.loader.destroy()
		} catch (e) {
			console.log(e)
			this.loader.destroy()
		}
	}

	renderStakes = () => {
		const parts = [
			this.betslipHeader.render(),
			this.stakesWrapper.render(),
			this.multiStakesWrapper.render(),
			this.betslipFooter.render(this.storage.placeBet, this.storage.currentBtn),
		]

		parts.forEach(part => this.appendNodeInContainer(part))
		this.placeBetChange()
	}

	emptyBetslip = () => {
		const parts = [new BetslipHeader().render(), new Empty().render()]
		parts.forEach(part => this.appendNodeInContainer(part))
	}

	renderBetslip = () => {
		this.container.innerHTML = ''

		if (this.data) {
			if (!isEmpty(this.data.bt) && !this.data.bt.every(bet => bet === null)) {
				this.renderStakes()
			} else {
				this.emptyBetslip()
			}
		} else {
			this.emptyBetslip()
		}
	}

	placeBetCallback = data => {
		this.betslipFooter.update(data)
	}

	placeBetChange = () => {
		const single = this.stakesWrapper.getAllInputsValue()
		const multi = this.multiStakesWrapper.getAllInputsValue()

		if (typeof single !== 'number' || typeof multi !== 'number') {
			return
		}

		const result = Number(single + multi)

		this.setStorage({ name: 'placeBet', data: result })
	}

	currentBtnCallback = (data, cb) => {
		this.betslipFooter.changeBtn(data, cb)
	}

	currentBtnChange = (status, message = null) => {
		this.setStorage({ name: 'currentBtn', data: {
			status,message
		}})
	}

	singlesCallback = data => {
		this.stakesWrapper.updateSingles(data)
	}

	singlesChange = value => {
		this.setStorage({ name: 'singlesValue', data: value })
	}

	updateBetslipData =()=> {
		this.data = getBetslip()

		this.data.er ?
			this.currentBtnChange(0, this.data.er) : this.currentBtnChange(1)

		this.renderBetslip()

	}

	init = () => {
		this.container = findNode('.', 'betSlip')

		storageEmitter.writeEventToStorage('betslip', this.updateBetslipData)
		storageEmitter.writeEventToStorage('userStakes', this.update)

		this.subscribe({ name: 'placeBet', cb: this.placeBetCallback })
		this.subscribe({ name: 'currentBtn', cb: this.currentBtnCallback })
		this.subscribe({ name: 'singlesValue', cb: this.singlesCallback })

		refreshStakes()
	}


	update = () => {
		this.stakesWrapper.update()
		this.multiStakesWrapper.update()
	}

	destroy = () => {
		storageEmitter.removeCallback('betslip', this.renderBetslip)
		storageEmitter.removeCallback('userStakes', this.update)

		this.unsubscribe({ name: 'placeBet', cb: this.placeBetCallback })
		this.unsubscribe({ name: 'currentBtn', cb: this.currentBtnCallback })
		this.unsubscribe({ name: 'singlesValue', cb: this.singlesCallback })

	}
}
