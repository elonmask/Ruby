window.UserMenu = class UserMenu {
    constructor(){
        this.container;
        this.currentOption = config._config.CUSTOMER_CONFIG.ODDS_TYPE || '1';
        this.currentOptionText = this.currentOption === '1' ? 'Дробные' : this.currentOption === '2' ? 'Десятичные' : 'Американские'
    }

    userMenuWrapper =()=> {
        const div = document.createElement('div');
        div.className = 'user-menu-wrapper';
        div.innerHTML = `
               <!-- <div class="user-account-setting">
                    <button class="show-settings fa fa-cogs"></button>
                </div>-->
                <div class="user-menu-img"></div>
                <p class="user-menu-name text-center">Сергей Ступаков</p>
                <p class="user-menu-email text-center">sergey@voliacable.com</p>
                <hr class="user-menu-separate">
                <p class="font user-menu-text">Игровой счет:</p>
                <p class="font text-uppercase user-menu-big primary">1707101</p>
                <p class="font user-menu-text">Баланс на счету:</p>
                <p class="font text-uppercase user-menu-big second">1.50 UAH</p>
                <p class="font user-menu-text">Нерасчитаные ставки:</p>
                <p class="font text-uppercase user-menu-big primary">0.00 UAH</p>
        `;
        // div.querySelector('.show-settings').addEventListener('click', this.showUserAccountSetting);
        return div
    };

    userMenuLinks =()=> {
        const div = document.createElement('div');
        div.className = 'user-menu-tabs';
        div.innerHTML = `
            <a href="./#/account" class="user-menu-link active flex-container align-middle">
                <p class="fa fa-money"></p>
                <p class="font">История счета</p>
            </a>
            <a href="./#/account" class="user-menu-link flex-container align-middle">
                <p class="fa fa-cogs"></p>
                <p class="font">Настройка счета</p>
                <div class="user-menu-notification "></div>
            </a>
            <a href="./#/account" class="user-menu-link flex-container align-middle">
                <p class="fa fa-refresh"></p>
                <p class="font">Ввод/вывод средств</p>
            </a>
            <a href="./#/account" class="user-menu-link flex-container align-middle">
                <p class="fa fa-gift"></p>
                <p class="font">Акции и бонусы</p>
            </a>
            <a href="./#/account" class="user-menu-link flex-container align-middle">
                <p class="fa fa-sign-out"></p>
                <p class="font">Выйти</p>
            </a>
        `
        return div
    };

    userAccountSettingItem =()=> {
        const div = document.createElement('div');
        div.className = 'user-setting-menu-item';
        div.innerHTML = `
                    <div class="user-setting-menu-item-header">
                        <h4>Коеффициент</h4>
                        <p class="current-active-option">${this.currentOptionText}</p>
                        <span class="row"></span>
                    </div>
                    <ul class="user-setting-menu-item-inner hide">
                        <li class="user-setting-option" data-id="1">Дробные</li>
                        <li class="user-setting-option" data-id="2">Десятичные</li>
                        <li class="user-setting-option" data-id="3">Американские</li>
                    </ul>`;

        div.querySelector('.user-setting-menu-item-header').addEventListener('click', this.showInnerSettings);
        div.querySelectorAll('.user-setting-option')
            .forEach(li => li.addEventListener('click', this.setCoefOption));
        return div;
    };

    userAccountSettingItem2 =(name1, name2, name3)=> {
        const div = document.createElement('div');
        div.className = 'user-setting-menu-item';
        div.innerHTML = `
                    <div class="user-setting-menu-item-header">
                        <h4>Коеффициент</h4>
                        <p class="current-active-option">${name1}</p>
                        <span class="row"></span>
                    </div>
                    <ul class="user-setting-menu-item-inner hide">
                        <li class="user-setting-option" data-id="1">${name1}</li>
                        <li class="user-setting-option" data-id="2">${name2}</li>
                        <li class="user-setting-option" data-id="3">${name3}</li>
                    </ul>`
        return div
    };

    showUserAccountSetting =(e, check=true)=> {
        e.stopPropagation();

        const userSet = this.container.querySelector('.user-setting-menu');
        userSet.classList.toggle('show');
        userSet.classList.toggle('hide');

        check ? document.addEventListener('click', this.closeAccountSettings) : null
    };

    showInnerSettings =(e)=> {
        const parent = e.target.closest('.user-setting-menu-item');
        const innerSettings = parent.querySelector('.user-setting-menu-item-inner');
        innerSettings.classList.toggle('hide');
        innerSettings.classList.toggle('show');
    };

    setCoefOption =(e)=> {
        const id = e.target.dataset.id;
        this.currentOption = id;
        config._config.CUSTOMER_CONFIG.ODDS_TYPE = id;
        this.setCurrentOptionInHeader(e);
        this.showInnerSettings(e)
    };

    setCurrentOptionInHeader =(e)=> {
        const elem = e.target;
        const parent = elem.closest('.user-setting-menu-item');
        parent.querySelector('.current-active-option').innerText = elem.innerText;
    };

    closeAccountSettings =(e)=> {
        const elem = e.target.closest('.user-setting-menu');

        if (!elem) {
            this.showUserAccountSetting(e,false);
            document.removeEventListener('click',this.closeAccountSettings)
        }
    };

    appendElement =()=> {
        this.container.append(this.userMenuWrapper());
        this.container.append(this.userMenuLinks());

        // const settings = this.userAccountSettingContainer();
        // settings.append(this.userAccountSettingItem());
        // settings.append(this.userAccountSettingItem2('Тест1','Тест2','Тест'));
        // settings.append(this.userAccountSettingItem2('Тест2','Тест2','Тест'));
        // settings.append(this.userAccountSettingItem2('Тест3','Тест2','Тест'));
        // this.container.append(settings)
    };

    init =()=> {
        this.container = document.querySelector('.user-menu');
        this.appendElement()
    };
};

window.usermenu = new UserMenu();
usermenu.init();
