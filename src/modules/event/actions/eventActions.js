import { getRequest } from '../../../helpers/utils'
import { links } from '../../../links/links'
import { writeToStorage } from '../../../storage/storageMethod'
import { storage } from '../../../storage/storage'
import { transformInplayData } from '../../../helpers/transform/transform'

export const getInplayData = async () => {
	try {
		const inplayData = await getRequest(links.inplayTree)
		writeToStorage('inplay', transformInplayData(inplayData))
	} catch (e) {
		console.log(e)
	}
}

export const getInplayLeague = async () => {
	const id = getFirstLeagueId()

	try {
		const firstLeague = await getRequest(links.league + id)
		writeToStorage('inplayLeagues', {
			...storage.inplayLeagues,
			[id]: firstLeague,
		})
	} catch (e) {
		console.log(e)
	}
}

export const getInplayEvent = async id => {
	if (!id) {
		const leagueId = getFirstLeagueId()
		const { id: eventId, sportId } = getFirstEvent(leagueId)

		id = eventId
		window.history.pushState(
			'',
			'',
			`#/live/event/${sportId}/${leagueId}/${id}`
		)
	}

	try {
		const { event } = await getRequest(links.event + id)
		if (event) {
			writeToStorage('event', event)
		} else {
			throw Error('Event null')
		}
	} catch (e) {
		console.log(e)
	}
}

const getFirstLeagueId = () => storage.inplay[0].categories[0].leagues[0].id

const getFirstEvent = id => storage.inplayLeagues[id].events[0]
