import { createElement } from '../../../helpers/createElement'
import { findAllNodes, findNode, useTranslate } from '../../../helpers/utils'
import img from '../../../img/icon-country/gb.png'

export class Step_2 {
	constructor({ choose, error, checkValidity }) {
		this.data = null
		this.choose = choose
		this.error = error
		this.checkValidity = checkValidity

		this.node = null
		this.type = 'div'
		this.classes = ['sign-up-body']
	}

	appendHTML = () => {
		return `
        <div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase">
                <span>${useTranslate('country')}:</span>
                <sup>⚹</sup>
            </p>
            <select class="select sign-up-body-select" name="Country" required >
                <option value="">${useTranslate('country')}</option>
                <option value="1">Украина</option>
            </select>
        </div>
        <div class="sign-up-body-item ">
            <p class="sign-up-body-title font text-uppercase">
                <span>${useTranslate('currency')}:</span>
                <sup>⚹</sup>
            </p>
            <select class="select sign-up-body-select w25" name="Currency" required >
                <option value="">${useTranslate('currency')}</option>
                <option value="1">UAH</option>
                <option value="2">USD</option>
                <option value="3">EURO</option>
            </select>
        </div>
        <div class="sign-up-body-item flex-container align-middle" id="nameBlock">
            <div class="w50 mr">
                <p class="sign-up-body-title font text-uppercase">
                    <span>${useTranslate('name')}:</span>
                    <sup>⚹</sup>
                </p>
                <input type="text" 
                       class="field sign-up-body-field"     
                       name="FirstName"
                       required 
                       maxlength="15" 
                       minlength="2" 
                       value=${this.data.FirstName}>
            </div>
            <div class="w50">
                <p class="sign-up-body-title font text-uppercase">
                    <span>${useTranslate('surname')}:</span>
                    <sup>⚹</sup>
                </p>
                 <input type="text" 
                        class="field sign-up-body-field" 
                        name="SecondName"
                        required 
                        maxlength="20" 
                        minlength="2" 
                        value=${this.data.SecondName}>
                       
            </div>
        </div>
        <div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase">
                <span>${useTranslate('phone')}:</span>
                <sup>⚹</sup>
            </p>
             <div class="flex-container align-items">
                 <div class="block mr">
                    <img src="${img}" class="sign-up-body-country icon-country">
                    <select class="select sign-up-body-select country" name="Operator" required>
                        <option value=""></option>
                        <option value="1">+380</option>
                     </select>
                 </div>
                <input type="text" class="field sign-up-body-field" name="Number" minlength="9" maxlength="9" required value=${
									this.data.Phone.Number
								} >
             </div>
        </div>
        <div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase">
                <span>Email:</span>
                <sup>⚹</sup>
            </p>
            <input type="email" class="field sign-up-body-field" name="Email"  required value=${
							this.data.Email
						}>
        </div>
        <div class="sign-up-body-item ">
            <p class="sign-up-body-title font text-uppercase">
                <span>${useTranslate('bday')}:</span>
                <sup>⚹</sup>
            </p>
        <div class="flex-container align-middle">
            <select class="select sign-up-body-select mr" required name="Day">
                <option value="">00</option>
                <option value="1">04</option>
            </select>
            <select class="select sign-up-body-select mr" required name="Month">
                <option value="">00</option>
                <option value="1">Январь</option>
            </select>
            <select class="select sign-up-body-select" required name="Year">
                <option value="">0000</option>
                <option value="1">1980</option>
            </select>
        </div>
    		</div>
        <div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase">${useTranslate('adress')}:</p>
                <input type="text" class="field sign-up-body-field" name="Adress" minlength="5" maxlength="40" required  value=${
									this.data.Adress
								}>
         </div>
        <div class="sign-up-body-item">
            <p class="sign-up-body-title font text-uppercase mb">
                <span>${useTranslate('gender')}:</span>
                <sup>⚹</sup>
            </p>
            <div class="flex-container align-middle">
                <input type="radio" class="radio" id="male" name="Gender" value="male" required ${
									this.data.Gender === 'male' ? 'checked' : null
								}>
                <label for="male" class="font sign-up-body-label">${useTranslate('male')}</label>
                <input type="radio" class="radio" id="female" name="Gender" value="female" required  ${
									this.data.Gender === 'female' ? 'checked' : null
								}>
                <label for="female" class="font sign-up-body-label">${useTranslate('female')}</label>
            </div>
        </div>
        <div class="block">
            <hr class="sign-up-body-separate">
                <p class="font text-center sign-up-body-inform ">${useTranslate('fields')}</p>
        </div>`
	}

	addListeners = () => {
		this.node.querySelectorAll('input').forEach(item => {
			if (item.type !== 'radio') {
				item.value !== '' ? this.choose(item) : null
				item.addEventListener('input', this.personalBlockInputValidity)
			} else {
				item.checked ? this.choose(item) : null
				item.addEventListener('change', this.personalBlockInputValidity)
			}
		})

		this.node.querySelectorAll('select').forEach(item => {
			item.addEventListener('change', this.personalBlockSelectValidity)
			this.selectedOptions(item)
			item.value !== '' ? this.choose(item) : null
		})
	}

	selectedOptions = elem => {
		findAllNodes('', 'option', elem).forEach(item => {
			let value = this.elemClasification(elem.name)[elem.name]
			if (item.value === value) {
				item.selected = 'selected'
			}
		})
	}

	personalBlockInputValidity = e => {
		let elem = e.target
		this.elemClasification(elem.name)[elem.name] = elem.value

		if (elem.name === 'FirstName' || elem.name === 'SecondName') {
			this.checkNameAndSurname(elem)
		}
		if (elem.name === 'Number') {
			this.checkNumberPhone(elem)
		}
		if (elem.name === 'Email') {
			this.checkEmail(elem)
		}

		if (elem.name === 'Adress' || elem.name === 'Gender') {
			this.choose(elem)
		}

		this.checkValidity()
	}

	checkNameAndSurname = elem => {
		let str = elem.value
		const name = str.match(/[^A-Za-zА-Яа-я\s -]/g)

		const nameBlock = findNode('#', 'nameBlock', this.node)
		const inputs = findAllNodes('', 'input', nameBlock)

		let checking = [...inputs].every(item => name || item.value === '')

		checking ? this.error(elem) : this.choose(elem)
	}

	checkNumberPhone = elem => {
		let str = elem.value
		const num = str.match(/\d{9}/g)

		num ? this.choose(elem) : this.error(elem)
	}

	checkEmail = elem => {
		let str = elem.value
		const email = str.match(/(\w+)(\.|\-)?(\w+)?(\@)(\w+\.)(\w+)(\.)?(\w+)?/g)

		email && email[0] === elem.value ? this.choose(elem) : this.error(elem)
	}

	elemClasification = name => {
		if (name === 'Day' || name === 'Month' || name === 'Year') {
			return this.data.BirthDate
		} else if (name === 'Operator' || name === 'Number') {
			return this.data.Phone
		} else {
			return this.data
		}
	}

	personalBlockSelectValidity = e => {
		let elem = e.target
		this.choose(elem)
		this.elemClasification(elem.name)[elem.name] = elem.value

		this.checkValidity()
	}

	render = (step, data) => {
		this.data = data

		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = this.appendHTML()

		this.addListeners()

		return this.node
	}
}
