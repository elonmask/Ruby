import { writeToStorage } from '../../../../storage/storageMethod'
import {
	addStakeRequest,
	removeAllStakes,
	removeStakeRequest,
} from './betslipRequests'
import { formString, formStringForMulti, getSession, isEmpty, setSession } from '../../../../helpers/utils'
import { getQuickBet, getUserStakes } from '../../../../selectors/selectors'
import { QuickbetPopup } from '../../quickbet/quickbetPopup'

export const betButtonHandler = ({ event, oddId, stakeId, e }) => {
	if (getQuickBet()) {
		showQuickBetPopup(e)
		return
	}

	if (getUserStakes()[stakeId]) {
		removeStake(stakeId)
	} else {
		createStake(event, oddId, stakeId)
	}
}

const showQuickBetPopup = e => {
	document.body.append(new QuickbetPopup(e.pageX, e.pageY).render())
}

const createStake = ({ odds, id: eventId, sportId }, oddId, stakeId) => {
	odds &&
		odds.forEach(({ id, outcomes, specifiers }) => {
			if (Number(oddId) === id) {
				outcomes.forEach(({ id: outcomeId, oddValue }) => {
					if (Number(stakeId) === outcomeId) {
						addStake({
							eventId,
							stakeId,
							oddValue,
							sportId,
							hcp: specifiers?.hcp || null,
						})
					} else {
						//console.log(stakeId + ' ' + outcomeId);
					}
				})
			}
		})
}

const addStake = async data => {
	const string = formString(data)

	await writeStakeValueToSession(data.stakeId)

	await writeStakeToProjectStorage(data.stakeId, string)
	await addStakeRequest()
}

export const removeStake = async id => {

	let topBetsStakes = JSON.parse(sessionStorage.getItem('topBetsB')) || []
	topBetsStakes.forEach((stake, idx) => {
		stake == id ? topBetsStakes[idx] = '' : ''
	})

	sessionStorage.setItem('topBetsB', JSON.stringify(topBetsStakes));

	document.querySelector(`[data-stake="${id}"]`) != null ? document.querySelector(`[data-stake="${id}"]`).classList.remove('on') : ''

	document.querySelector(`[data-outcome="${id}"]`) != null ? document.querySelector(`[data-outcome="${id}"]`).classList.remove('on') : ''

	if (document.querySelector(`[data-outcome="${id}"]`) != null) {
		const type = document.querySelector(`[data-outcome="${id}"]`).getAttribute('data-type');

		if (type == 'one') {
			sessionStorage.setItem('isOneSet', 'false')
		} else if (type == 'two') {
			sessionStorage.setItem('isTwoSet', 'false')
		} else {
			sessionStorage.setItem('isXSet', 'false')
		}
	}

	removeStakeValueFromSession(id)
	await removeBetFromProjectStorage(id)
	await removeStakeRequest()
}

export const removeAll = async () => {

	const buttons = document.getElementsByClassName('button coefficient coef_item on');
	while (buttons.length) {
		buttons[0].classList.remove('on')
	}
	sessionStorage.setItem('topBetsB', JSON.stringify([]))
	sessionStorage.setItem('isOneSet', 'false')
	sessionStorage.setItem('isTwoSet', 'false')
	sessionStorage.setItem('isXSet', 'false')

	removeStakeValueFromSession('All')
	writeToStorage('userStakes', {})
	await removeAllStakes()
}

const writeStakeValueToSession = id => {
	const stakesValues = getSession('stakesValues') || {}

	stakesValues[id] = {
		stake: 0,
		return: 0,
		limit:null
	}

	setSession('stakesValues', stakesValues)
}

export const replaceStakeValueToLimit =()=> {
	const stakesValues = getSession('stakesValues') || {}
	const multiStake = getSession('multiStakeValue') || {}

	const result = Object.keys(stakesValues).reduce((acc, key) => {

		const { limit, stake } = stakesValues[key]

	 	acc[key] = {
			...stakesValues[key],
			stake:limit || stake,
			limit:null
		}

		return acc
	}, {})

	if (multiStake.stake && multiStake.limit){
		setSession('multiStakeValue', {stake: multiStake.limit, limit:null})
	}

	setSession('stakesValues', result)
}

const removeStakeValueFromSession = id => {
	if (id === 'All') {
		setSession('stakesValues', {})
	}

	let stakesValues = getSession('stakesValues') || {}

	stakesValues = Object.keys(stakesValues).reduce((acc, key) => {
		if (key !== id) {
			acc[key] = stakesValues[key]
		}

		return acc
	}, {})

	setSession('stakesValues', stakesValues)
}

const writeStakeToProjectStorage = (stakeId, string) => {
	const stakesStorage = { ...getUserStakes(), [stakeId]: string }

	writeToStorage('userStakes', stakesStorage)
}

const removeBetFromProjectStorage = id => {
	getUserStakes()[id] = null

	const stakesStorage = { ...getUserStakes() }

	writeToStorage('userStakes', stakesStorage)
}

export const updateStakesAfterRequest = bets => {
	if (!bets) {
		writeToStorage('userStakes', {})
		return
	}

	const userStakes = bets.reduce((acc, bet) => {
		if (bet) {
			const { cl, fi, od, pt } = bet
			const { ha, pi } = pt[0]
			acc[pi] = formString({
				eventId: fi,
				sportId: cl,
				stakeId: pi,
				oddValue: od,
				hcp: ha,
			})
		}

		return acc
	}, {})

	writeToStorage('userStakes', userStakes)
}

export const updateMultiStakesAfterRequest =(dm, mo)=> {

	const { stake } = getSession('multiStakeValue') || { }

	if (!isEmpty(dm) && !isEmpty(mo)){
		const multiStakes = [...mo, dm].reduce((acc, { bt }) => {
			bt = bt.toString()
			acc[bt] = formStringForMulti({st: stake})
			return acc
		}, {})

		setSession('multiStakes', multiStakes)
	}

}
