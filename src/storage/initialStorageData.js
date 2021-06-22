import {  getSession } from '../helpers/utils'
import { refreshStakes } from '../modules/rightColumn/betslip/actions/betslipRequests'

export const initialStorageData = [
	{
		key: 'userStakes',
		value: getSession('stakes') || {},
		cb: [refreshStakes],
	},
	{
		key: 'quickBet',
		value: getSession('quickBet') || false,
	},
]
