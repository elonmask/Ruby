import { links } from '../links/links'
import { getAllLeaguesId, getRequest } from '../helpers/utils'
import { getCurrentView, getCurrentViewId } from '../selectors/selectors'
import { writeToStorage } from '../storage/storageMethod'
import _ from 'lodash'

export class InplayTree {
	constructor(add, remove, empty) {
		this.link = links.inplayTree
		this.add = add
		this.remove = remove
		this.empty = empty
		this.timerId = null
	}

	actionWithLeagueNode = (arr, cb) => {
		arr.forEach(leagueId => cb(leagueId))
	}

	findDifference = current => {
		const old = getCurrentView()

		this.empty(current.inPlayMatchCount)

		const removed = _.difference(getAllLeaguesId(old), getAllLeaguesId(current))

		const added = _.difference(getAllLeaguesId(current), getAllLeaguesId(old))

		if (removed.length) {
			writeToStorage('currentView', current)
			this.actionWithLeagueNode(removed, this.remove)
		}

		if (added.length) {
			writeToStorage('currentView', current)
			this.actionWithLeagueNode(added, this.add)
		}
	}

	init = () => {
		this.timerId = setInterval(async () => {
			try {
				const data = await getRequest(this.link)

				if(!data){
					return
				}

				writeToStorage('inplay', data)

				const currentId = getCurrentViewId()

				const findCurrent = data.find(sport => sport.id === Number(currentId))

				if (!findCurrent) {
					writeToStorage('currentViewId', data[0].id)
					return
				}

				this.findDifference(findCurrent)
			} catch (e) {
				console.log(e)
				this.destroy()
			}
		}, 2000)
	}

	destroy = () => {
		clearInterval(this.timerId)
	}
}
