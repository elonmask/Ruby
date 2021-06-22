import axios from 'axios'
import _ from 'lodash'
import { hideLoader, showLoader } from '../modules/loaders/progressLoader'
import en from '../json/en.json';
import ru from '../json/ru.json';
import { getBetslip } from '../selectors/selectors'

export const getAllLeaguesId = data => {
	const leagues = getAllLeagues(data)

	return leagues.map(league => league.id)
}

export const getEventsId = events => {
	return events.map(event => event.id)
}

export const getRequestWithLoader = fn => {
	return async () => {
		showLoader()
		try {
			await fn()
			await hideLoader()
		} catch (e) {
			console.log(e)
			hideLoader()
		}
	}
}

export const getRequest = (url, method, data) => {
	return axios({
		method,
		url,
		data,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'text/plain;charset=UTF-8',
		},
		withCredentials: true,
	})
		.then(res => res.data)
		.catch(err => console.log(err))
}

export const getAll = async (promises) => {
	try {
		return await axios.all(promises)
	}catch (e){

	}
}

export const getBetradarId =(externalIds)=> {
	const betRadarStr = externalIds?.betradar

	return betRadarStr ? betRadarStr.split(':')[2] : null
}

export const getRequestWithoutCredentials = (url, method, data) => {
	return axios({
		method,
		url,
		data,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'text/plain;charset=UTF-8',
		},
	})
		.then(res => res.data)
		.catch(err => console.log(err))
}

export const getAllLeagues = sport => {
//	console.log(sport)
	if (!sport.categories) {
		return []
	}

	return sport.categories.reduce((acc, { leagues, iconCode }) => {
		if (!leagues) {
			return acc
		}

		leagues.forEach(league => league.iconCode = iconCode)

		acc = [...acc, ...leagues]
		return acc
	}, [])
}

export const getAllLeaguesClassification = sport => {
	/*if (!sport.categories) {
		return []
	}*/

	return sport.reduce((acc, { leagues, iconCode }) => {
		if (!leagues) {
			return acc
		}

		leagues.forEach(league => league.iconCode = iconCode)

		acc = [...acc, ...leagues]
		return acc
	}, [])
}

export const getEventName = competitors => {
	if (!competitors) {
		return ''
	}

	return competitors.reduce((acc, { name }, idx) => {
		acc = idx === 0 ? acc + name : acc + ` vs ${name}`

		return acc
	}, '')
}

export const findNode = (symbol, selector, node = null) => {
	const element = node || document

	return element.querySelector(`${symbol + selector}`)
}

export const findAllNodes = (symbol, selector, node) => {
	const element = node || document

	return element.querySelectorAll(`${symbol + selector}`)
}

export const setSession = (name, value) =>
	sessionStorage.setItem(name, JSON.stringify(value))

export const setLocal = (name, value) =>
	localStorage.setItem(name, JSON.stringify(value))

export const getSession = name => JSON.parse(sessionStorage.getItem(name))

export const getLocal = name => JSON.parse(localStorage.getItem(name))

export const removeSession = name => sessionStorage.removeItem(name)

export const removeLocal = name => localStorage.removeItem(name)

export const getPartURL = part => window.location.hash.split('/')[part]

export const timestamp = () => {
	const date = new Date().getTime()
	const timestamp = Math.round(date / 1000).toString(16)

	return timestamp + '-' + '60D0DCE9'
}

export const fixed = (value, num) => value.toFixed(num)

export const formString = ({
	eventId,
	stakeId,
	oddValue,
	sportId,
	hcp = '',
}) => {
	return `pt=N#o=${oddValue}#f=${eventId}#fp=${stakeId}#so=#sa=${timestamp()}#|FO=False#c=${sportId}${
		hcp ? `#ln=${hcp}` : ''
	}#mt=2#id=${eventId}-${stakeId}Y#|TP=BS${eventId}-${stakeId}#pbc=0||`
}

export const formStringForMulti = ({ ust = '', st = '', tr = '' }) =>
	`st=${st}#ust=${ust}#tr=${tr}||`

export const formStringForPlaceBet = (stake, value) => {
	if (!stake) {
		return ''
	}

	if (!value) {
		return stake
	}

	const { stake: st, return: tr } = value

	const str = stake.split('#')

	str.splice(6, 0, ...[`st=${st}`, `ust=`, `tr=${tr}`])

	return str.join('#')
}

export const isEqualOutcomes = (base, other) => {
	return _.isEqual(base, other)
}

export const isEmpty = obj => {
	return _.isEmpty(obj)
}

export const getDifference = (base, other) => {
	const removed = _.difference(base, other)
	const added = _.difference(other, base)

	const others = []

	other.forEach(item => {
		if (base.includes(item)) {
			others.push(item)
		}
	})

	return { removed, added, others }
}

export const isRestricted =(md, id, eventId)=> {

	const betslip = getBetslip()

	if (betslip?.bt){
		return !!betslip.bt.find(single => {
			if (id !== single?.pt[0].pi && single?.pt[0].md === md && eventId === single?.fi){
				return single
			}
		})
	}

	return false
}

export const useTranslate = (key) => {
	const lang = localStorage.getItem('lang');
	// console.log(lang)

	if (lang === 'ru') {
		switch(key) {
			case 'details':
				return ru.LOGIN.POP_UP_DETAILS;
			case 'pass':
				return ru.LOGIN.POP_UP_PASS;
			case 'attempt':
				return ru.LOGIN.POP_UP_ATTEMPT;
			case 'header_lang':
				return ru.COMMON.HEADER.LANGUAGE;
			case 'login':
				return ru.LOGIN.LOGIN;
			case 'password':
				return ru.LOGIN.PASSWORD;
			case 'fog_pass':
				return ru.COMMON.HEADER.FORGOT_PASSWORD;
			case 'reg_now':
				return ru.COMMON.HEADER.REGISTER_NOW;
			case 'sports':
				return ru.COMMON.HEADER.SPORTS;
			case 'inplay':
				return ru.COMMON.ASIDE.INPLAY;
			case 'mybets':
				return ru.COMMON.HEADER.MY_BETS;
			case 'event':
				return ru.COMMON.LIVE.EVENT;
			case 'overview':
				return ru.COMMON.LIVE.OVERVIEW;
			case 'betslip':
				return ru.BETSLIP.BETSLIP;
			case 'no_stake':
				return ru.BETSLIP.NO_STAKE;
			case 'top_bets':
				return ru.MY_BETS.TOP_BETS;
			case 'eng':
				return ru.COMMON.HEADER.ENGLISH;
			case 'rus':
				return ru.COMMON.HEADER.RUSSIAN;
			case 'user_det':
				return ru.REGISTRATION.USER_DET;
			case 'pers_inf':
				return ru.REGISTRATION.PERS_INF;
			case 'confim':
				return ru.REGISTRATION.CONFIM;
			case 'usrname':
				return ru.REGISTRATION.USRNAME;
			case 'pass_conf':
				return ru.REGISTRATION.PASS_CONF;
			case 'fields':
				return ru.REGISTRATION.FIELDS;
			case 'next':
				return ru.REGISTRATION.NEXT;
			case 'back':
				return ru.REGISTRATION.BACK;
			case 'country':
				return ru.REGISTRATION.COUNTRY;
			case 'currency':
				return ru.REGISTRATION.PREFERRED_CURRENCY;
			case 'name':
				return ru.REGISTRATION.NAME;
			case 'surname':
				return ru.REGISTRATION.SURNAME;
			case 'phone':
				return ru.REGISTRATION.PHONE;
			case 'bday':
				return ru.REGISTRATION.BDAY;
			case 'gender':
				return ru.REGISTRATION.GENDER;
			case 'male':
				return ru.REGISTRATION.MALE;
			case 'female':
				return ru.REGISTRATION.FEMALE;
			case 'adress':
				return ru.REGISTRATION.ADRESS;
			case 'conf_one':
				return ru.REGISTRATION.AGREE_PERS_INFO;
			case 'conf_two':
				return ru.REGISTRATION.TOTE_LEGAL_AGE;
			case 'conf_three':
				return ru.REGISTRATION.CASINOS_LEGAL_AGE;
			case 'casino':
				return ru.COMMON.HEADER.CASINO;
			case 'partners':
				return ru.COMMON.FOOTER.PARTNER;
			case 'sec':
				return ru.COMMON.FOOTER.TRUST;
			case 'cop':
				return ru.COMMON.FOOTER.COPYRING;
			case 'info':
				return 'Информация';
			case 'social':
				return 'Социальные сети';
			case 'about':
				return 'Про нас';
			case 'rules':
				return 'Правила';
			case 'bill':
				return 'Методы оплаты';
			case 'confidence':
				return 'Конфиденциальность';
			case 'contacts':
				return 'Контакты';
			case 'chat':
				return 'Live чат';
		}
	} else {
		//console.log(Object.keys(en));
		switch(key) {
			case 'details':
				return en.LOGIN.POP_UP_DETAILS;
			case 'pass':
				return en.LOGIN.POP_UP_PASS;
			case 'attempt':
				return en.LOGIN.POP_UP_ATTEMPT;
			case 'header_lang':
				return en.COMMON.HEADER.LANGUAGE;
			case 'login':
				return en.LOGIN.LOGIN;
			case 'password':
				return en.LOGIN.PASSWORD;
			case 'fog_pass':
				return en.COMMON.HEADER.FORGOT_PASSWORD;
			case 'reg_now':
				return en.COMMON.HEADER.REGISTER_NOW;
			case 'sports':
				return en.COMMON.HEADER.SPORTS;
			case 'inplay':
				return en.COMMON.ASIDE.INPLAY;
			case 'mybets':
				return en.COMMON.HEADER.MY_BETS;
			case 'event':
				return en.COMMON.LIVE.EVENT;
			case 'overview':
				return en.COMMON.LIVE.OVERVIEW;
			case 'betslip':
				return en.BETSLIP.BETSLIP;
			case 'no_stake':
				return en.BETSLIP.NO_STAKE;
			case 'top_bets':
				return en.MY_BETS.TOP_BETS;
			case 'eng':
				return en.COMMON.HEADER.ENGLISH;
			case 'rus':
				return en.COMMON.HEADER.RUSSIAN;
			case 'user_det':
				return en.REGISTRATION.USER_DET;
			case 'pers_inf':
				return en.REGISTRATION.PERS_INF;
			case 'confim':
				return en.REGISTRATION.CONFIM;
			case 'usrname':
				return en.REGISTRATION.USRNAME;
			case 'pass_conf':
				return en.REGISTRATION.PASS_CONF;
			case 'fields':
				return en.REGISTRATION.FIELDS;
			case 'next':
				return en.REGISTRATION.NEXT;
			case 'back':
				return en.REGISTRATION.BACK;
			case 'country':
				return en.REGISTRATION.COUNTRY;
			case 'currency':
				return en.REGISTRATION.PREFERRED_CURRENCY;
			case 'name':
				return en.REGISTRATION.NAME;
			case 'surname':
				return en.REGISTRATION.SURNAME;
			case 'phone':
				return en.REGISTRATION.PHONE;
			case 'bday':
				return en.REGISTRATION.BDAY;
			case 'gender':
				return en.REGISTRATION.GENDER;
			case 'male':
				return en.REGISTRATION.MALE;
			case 'female':
				return en.REGISTRATION.FEMALE;
			case 'adress':
				return en.REGISTRATION.ADRESS;
			case 'conf_one':
				return en.REGISTRATION.AGREE_PERS_INFO;
			case 'conf_two':
				return en.REGISTRATION.TOTE_LEGAL_AGE;
			case 'conf_three':
				return en.REGISTRATION.CASINOS_LEGAL_AGE;
			case 'casino':
				return en.COMMON.HEADER.CASINO;
			case 'partners':
				return en.COMMON.FOOTER.PARTNER;
			case 'sec':
				return en.COMMON.FOOTER.TRUST;
			case 'cop':
				return en.COMMON.FOOTER.COPYRING;
			case 'info':
				return 'Information';
			case 'social':
				return 'Social';
			case 'about':
				return 'About';
			case 'rules':
				return 'Rules';
			case 'bill':
				return 'Payments';
			case 'confidence':
				return 'Confidence';
			case 'contacts':
				return 'Contacts';
			case 'chat':
				return 'Live chat';
		}
	}
}
