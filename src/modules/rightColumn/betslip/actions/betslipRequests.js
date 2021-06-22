import {
	formStringForPlaceBet,
	getRequest,
	getSession, removeSession,
	setSession,
} from '../../../../helpers/utils'
import { writeToStorage } from '../../../../storage/storageMethod'
import {
	updateStakesAfterRequest,
	updateMultiStakesAfterRequest,
} from './betslipActions'
import { getUserStakes } from '../../../../selectors/selectors'
import { links } from '../../../../links/links'
import axios from 'axios'

class bsRequestHandler {
    constructor() {
        this.requestTrace = []
        this.available = true

		this.history = []
    }

	add = (data, type, url) => {
		if (this.available) {
			this.initRequest(data, type, url, Date.now());
		} else {
			this.addRequestToTrace(data, type, url)
		}
	}

    addRequestToTrace = (data, type, url) => {
        this.requestTrace.push( {url: url, type: type, data: data, id: Date.now()} )
    }

    removeRequestFromTrace = (data) => {
        const currTrace = this.requestTrace;
        const newTrace = [];
        currTrace.forEach(req => {
            if (req.data != data) {
                newTrace.push(req);
            }
        })
		this.requestTrace = newTrace;
    }

    initRequest = (data, type, url, id) => {
		if (this.history.includes(id) === false && this.available === true) {
			this.available = false;
        axios({
			method: type,
			url: url,
			data: data,
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'text/plain;charset=UTF-8',
			},
			withCredentials: true,
		})
			.then(res =>{
				
				writeToStorage('betslip', res.data)
				updateStakesAfterRequest(res.data && res.data.bt)
				updateMultiStakesAfterRequest(res.data?.dm, res.data?.mo)
				this.removeRequestFromTrace(data)
				this.history.push(id)
				this.available = true;
			})
			.catch(err => console.log(err))
		} else {
			console.log("Includes")
		}
    }

    start = () => {
        setInterval(() => {
			//console.log(this.history)
            if (this.requestTrace.length >= 1) {
				this.requestTrace.forEach(req => {
					
						this.initRequest(req.data, req.type, req.url, req.id);
					
				})
			}
        }, 500);        
    }
}

const bsHandler = new bsRequestHandler();
bsHandler.start();

const getRequestBody = () => {
	const values = Object.values(getUserStakes()).join('') || ''

	const body = {
		ns: values,
		ms: '||',
	}
	return body
}

const getRequestBodyForPlaceBet = () => {
	const keys = Object.keys(getUserStakes()) || []
	const userStakes = getUserStakes()
	const stakesValues = getSession('stakesValues') || {}
	const multiStakes = getSession('multiStakes') || {}

	const ns = keys
		.map(key => formStringForPlaceBet(userStakes[key], stakesValues[key]))
		.join('')

	const ms = Object.keys(multiStakes)
		.map(key => {
			return `#id=${key}#` + multiStakes[key]
		})
		.join('')

	return {
		ns,
		ms,
	}

	// const values = Object.values(getUserStakes()).join('') || ''
}

export const addStakeRequest = async () => { 
	removeSession('multiStakeValue')
	const body = getRequestBody()
	bsHandler.add(body, 'POST', links.addBet)
}

export const removeStakeRequest = async () => {
	removeSession('multiStakeValue')
	const body = getRequestBody()

	bsHandler.add(body, 'POST', links.removeBet)
}

export const refreshStakes = async () => {
	const body = getRequestBody()

	bsHandler.add(body, 'POST', links.refreshslip)
}

export const removeAllStakes = async () => {
	try {
		const result = await getRequest(links.removeAll, 'POST', {})
		writeToStorage('betslip', result)
		updateStakesAfterRequest(result && result.bt)
		updateMultiStakesAfterRequest(result?.dm, result?.mo)
	} catch (e) {
		writeToStorage('betslip', {})
		console.log(e)
	}
}

export const placeBetRequest = async () => {
	const body = getRequestBodyForPlaceBet()

	bsHandler.add(body, 'POST', links.placeBet)
}
