import { getRequest, getRequestWithoutCredentials } from '../helpers/utils'
import { links } from '../links/links'

export let config = {
	TRANSLATION:null,
	EX_SPORTS: [],
	EX_EVENTS: [],
	EX_MARKETS: []
}

export const loadConfig = async () => {
	try {
		const data = await getRequest(links.config, 'post')

		if (data) {
			config = {
				...config,
				...data
			}
			console.log(data)
			config.EX_SPORTS = data.SITE_CONFIG.SITE_EXCLUDED_SPORTS;
			data.SITE_CONFIG.SITE_EXCLUDED_EVENTS ? config.EX_EVENTS = data.SITE_CONFIG.SITE_EXCLUDED_EVENTS : '';
			data.SITE_CONFIG.SITE_EXCLUDED_MARKETS ? config.EX_MARKETS = data.SITE_CONFIG.SITE_EXCLUDED_MARKETS : '';
		}
	} catch (e) {
		console.log('Load config error', e)
	}
}

export const loadTranslation = async ()=> {
	try {
		//config.TRANSLATION = en
		if (typeof localStorage.getItem('lang') === 'undefined' || typeof localStorage.getItem('lang') === undefined || localStorage.getItem('lang') == undefined || localStorage.getItem('lang') == 'undefined') {
			localStorage.setItem('lang', 'en');
		}
	}catch (e){
		console.log('Load translation error', e)
	}
}
