import axios from 'axios'
import { createElement } from '../../../../helpers/createElement'
import { findNode, useTranslate } from '../../../../helpers/utils'
import '../../../../styles/language.css'

export class Languages {
	constructor() {
		this.node = null
		this.innerContainer = null
		this.type = 'div'
		this.classes = ['bottom-menu-link-item']
		this.attributes = [{ name: 'data-name', value: 'languageChange' }]
		this.itemName = 'languageChange'
	}

	formLangSection = () => {
		const span = document.createElement('span');
		span.className = 'font-m-white mr';
		span.dataset.lang = 'language';
		span.textContent = useTranslate('header_lang');

		this.node.appendChild(span);

		const a = document.createElement('a');
		a.className = 'font white';

		const curLang = document.createElement('span');
		curLang.className = 'mr';
		curLang.id = 'act_lang';
		curLang.textContent = localStorage.getItem('lang') == 'en' ? 'English' : 'Русский';
		//localStorage.setItem('lang', 'en');
		a.appendChild(curLang);

		const angleDown = document.createElement('span');
		angleDown.className = 'fa fa-angle-down';
		a.appendChild(angleDown);

		this.node.appendChild(a);
		
		const div = document.createElement('div');
		div.className = 'dropDown-item languages hide scroll';
		div.style.width = '250px';

		const en = document.createElement('a');
		en.className = 'font languages-link';
		en.dataset.val = "English";
		en.textContent = useTranslate('eng');
		en.addEventListener('click', (ev) => {
			console.log("Eng");
			axios({
				method: 'post',
				url: 'https://api.ruby.bet/account/setting',
				data: {"Language":1}
			  });
			localStorage.setItem('lang', 'en');
			location.reload()
		});
		div.appendChild(en);

		const rus = document.createElement('a');
		rus.className = 'font languages-link';
		rus.dataset.val = "Russian";
		rus.textContent = useTranslate('rus');
		rus.addEventListener('click', (ev) => {
			console.log("Rus");
			axios({
				method: 'post',
				url: 'https://api.ruby.bet/account/setting',
				data: {"Language":2}
			  });
			localStorage.setItem('lang', 'ru');
			location.reload()
		});
		div.appendChild(rus);

		this.node.appendChild(div);
	}

	renderInnerItems = () => {
		this.innerContainer.classList.remove('hide')
	}

	destroyInnerItems = () => {
		this.innerContainer.classList.add('hide')
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		/*try {
			this.node.innerHTML = `
			<span class="font-m-white mr" data-lang="language">Language</span>
        <a class="font white">
        	<span class="mr" id="act_lang">English</span>
          <span class="fa fa-angle-down"></span>
       </a>
			 <div class="dropDown-item languages hide scroll">
			 			<a class="font languages-link" id="en" data-val="English">English</a>
						<a class="font languages-link" id="ru" data-val="Russian">Russian</a>
			 </div>`
		} catch(err) {
			console.log(err);
		}*/

		this.formLangSection();
		
		this.innerContainer = findNode('.', 'dropDown-item', this.node)

		return this.node
	}
}
