import { storage } from '../storage'
import { setSession } from '../../helpers/utils'
import { getUserStakes } from '../../selectors/selectors'

export const betButtons = []

export const writeToBetButtons = button => {
	betButtons.push(button)
}

export const removeFromBetButtons = key => {
	betButtons[key] = null
}

export const lightButton = () => {

	const stakesIds = Object.keys(storage.userStakes) || []

	if (!stakesIds.length) {
		Object.values(betButtons).forEach(button => button.classList.remove('on'))
		return
	}

	betButtons.forEach(button => {
		if (stakesIds.includes(button.dataset.outcome)) {
			button.classList.add('on')
			return
		}
		button.classList.remove('on')
	})
}

export const saveDataToSessionStorage = () => {
	setSession('stakes', getUserStakes())
}
