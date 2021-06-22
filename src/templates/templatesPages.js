import { SportsTemplate } from '../pages/sports'
import { LiveTemplate } from '../pages/live'
import { MyBetsTemplate } from '../pages/myBets'
import { SearchPageTemplate } from '../pages/search'
import { AccountTemplate } from '../pages/account'
import { destroyInstances } from '../storage/instances'
import { Casino } from '../pages/casino'

const pagesTemplate = {
	sports: SportsTemplate,
	live: LiveTemplate,
	mybets: MyBetsTemplate,
	search: SearchPageTemplate,
	account: AccountTemplate,
	casino: Casino,
}

export const getPageTemplate = page => {

	const Page = pagesTemplate[page]

	if (!Page) {
		return ''
	}

	destroyInstances()

	return new Page().render()
}
