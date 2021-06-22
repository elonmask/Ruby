import { Routing } from './routing/routing'
import { hideMainLoader, showMainLoader } from './modules/loaders/mainLoader'
import { initialSubscription, initStorage } from './storage/storageMethod'
import { loadConfig, loadTranslation } from './config/config'

import 'simplebar'
import 'simplebar/dist/simplebar.min.css'

import './styles/index.css'
import './styles/preloader.css'

const routing = new Routing()

const startProject = async () => {
	showMainLoader()
	try {
		await loadConfig()
		await loadTranslation()
		await initialSubscription()
		await initStorage()
		await routing.init()

		hideMainLoader()
	} catch (e) {
		console.log(e)
	}
}

startProject()
