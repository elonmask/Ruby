import { getCurrencySymbol } from '../../../../../selectors/configSelectors'
import { fixed, isEmpty } from '../../../../../helpers/utils'
import { transformBetName } from '../../../../../helpers/transform/transform'

export class PlacebetResult {
	toReturn = tr =>
		tr ? `To Return ${getCurrencySymbol()} ${Number(tr).toFixed(2)}` : ''

	stake = st => (st ? `${getCurrencySymbol()} ${Number(st).toFixed(2)}` : '')

	stakeName = (bd, fd, pt) => {
		if (!fd || !pt) {
			return bd
		}
		return transformBetName(bd, { fd, pt })
	}

	itemTemplate = bt => {
		return `
			<li class="single-section bs-StandardBet">
				<ul>
					${bt
						.map(bet => {
							if (!bet) {
								return ''
							}
							const { fd, od, pt, st, tr } = bet
							return `
						<li class="bs-Item bs-SingleItem">
						<div class="bs-SelectionRow">
							<div class="bs-Selection bs-Selection__placeBet">
								<div class="bs-Selection_Desc">${this.stakeName(pt[0].bd, fd, pt[0])}</div>
								<div class="bs-Selection_Details">${pt[0]?.md || ''}</div>
								<div class="bs-Selection_Details">${fd || ''}</div>
							</div>
							<div class="bs-OddsContainer placeBet__left">
								<div class="bs-Odds">${Number(od).toFixed(2)}</div>
							</div>
							<div class="placeBet_userStake">
								<div class="placeBet_userStake__value">${this.stake(st)}</div>
							</div>
						</div>
						<div class="stake bs-StakeData">
							<div class="bs-StakeAndToReturnContainer">
								<div class="bs-StakeToReturnBreakDownContainer show">
									<a class="placeBet__returnValue">${this.toReturn(tr)}</a>
								</div>
							</div>
							<div class="bs-HideBetMax"></div>
						</div>
					</li>`
						})
						.join('')}
				</ul>
			</li>
		`
	}

	headerTemplate = br => {
		return `
				<div class="bs_placeBet__header flex-container align-justify">
				<div class="bs_placeBet__header_left flex-container">
					<div class="bs_placeBet__success_icon flex-container align-center-middle">
						<div class="success_icon fa fa-check"></div>
					</div>
					<div class="flex-container flex-dir-column">
						<div class="bs_placeBet__header_left__title">Bet Placed</div>
						<div class="bs_placeBet__header_left__subtitle">Bet Ref ${br}</div>
					</div>
				</div>
				<div class="bs_placeBet__header_right flex-container align-center-middle">
					<button class="bs_placeBet__header_done">Done</button>
				</div>
			</div>
		`
	}

	footerTemplate = (tr, ts) => {
		return `
				<div class="bs_placeBet__footer__wrap">
				<div class="bs_placeBet__footer flex-container align-justify align-center">
					<div class="bs_placeBet__footer_left">Total to return: ${fixed(
						Number(tr),
						2
					)}${getCurrencySymbol()}</div>	
					<div class="bs_placeBet__footer_right">Total stake: ${fixed(
						Number(ts),
						2
					)}${getCurrencySymbol()}</div>	
				</div>
			</div>
		`
	}

	render = (data, multiStake) => {
		if (data) {
			let { br, bt, tr, ts } = data

			if (!isEmpty(multiStake)) {
				bt.push(multiStake)
			}

			return `
			${this.headerTemplate(br)}
			${this.itemTemplate(bt)}
			${this.footerTemplate(tr, ts)}
		`
		}
	}
}
