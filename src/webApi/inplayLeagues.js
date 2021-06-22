import { links } from '../links/links'
import axios from 'axios'
import { isEmpty } from '../helpers/utils'

axios.allSettled = function allSettled(promises) {
	return Promise.allSettled(promises)
}

let leagueInstance = null

class InplayLeagues {
	constructor() {
		if (leagueInstance) {
			return leagueInstance
		}

		this.link = links.league
		this.leaguesId = {}
		this.enable = false
		this.timerId = null

		leagueInstance = this
	}

	getAllPromise = () =>
		Object.keys(this.leaguesId).map(id => {
			return axios.get(this.link + id, {
				id,
			})
		})

	loadData = async () => {
		try {
			const responses = await axios.allSettled(this.getAllPromise())

			responses.forEach(({ value }) => {
				const { data, config } = value

				const callback = this.leaguesId[config.id]
				if (callback) {
					if (data && data.events) {
						callback(data.events)
					}
				}
			})
		} catch (e) {
			console.log('Inplay leagues live reload', e)
			this.destroy()
		}
	}

	addLeagueId = ({ id, cb }) => {
		this.leaguesId[id] = cb
	}

	removeLeagueId = id => {
		this.leaguesId[id] = null

		this.leaguesId = Object.keys(this.leaguesId).reduce((acc, leagueId) => {
			if (this.leaguesId[leagueId]) {
				acc[leagueId] = this.leaguesId[leagueId]
			}
			return acc
		}, {})
	}

	init = () => {
		if (this.enable) {
			return
		}

		this.enable = true
		this.timerId = setInterval(() => {
			this.loadData()
		}, 1000)

		window.addEventListener('hashchange', this.destroy)
	}

	destroy = () => {
		console.log('destroy league subscribtion')

		clearInterval(this.timerId)
		this.leaguesId = []
		this.enable = false
		window.removeEventListener('hashchange', this.destroy)
	}
}

export const inplayLeague = new InplayLeagues()
