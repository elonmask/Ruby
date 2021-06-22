import { getModule } from '../templates/templatesModules'

export class Casino {
	constructor() {}
	render = () =>
		`${getModule('casino')}`
}