window.PopupUserMenu = class PopupUserMenu {
    constructor(){
        this.activeContent = true;
        this.changedContentWrapper;
        this.TZ = config._config.CUSTOMER_CONFIG.TZ;
        this.ODDS_TYPE = config._config.CUSTOMER_CONFIG.ODDS_TYPE;
        this.INACTIVITY_TIMEOUT = config._config.CUSTOMER_CONFIG.INACTIVITY_TIMEOUT;
        this.CURRENCY_CODE = config._config.CUSTOMER_CONFIG.CURRENCY_CODE;
    }

    userMenuWrapper =()=> {
        const div = document.createElement('div');
        div.className = 'user-menu-wrapper';
        div.innerHTML = `
                <div class="user-account-setting">
                    <button class="show-settings fa fa-cog"></button>
                </div>
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
        div.querySelector('.show-settings').addEventListener('click', this.showUserAccountSetting)
        return div
    };

    changedContainer =()=> {
        const div = document.createElement('div');
        div.className = 'user-setting-menu flex-container flex-dir-column';

        this.activeContent
            ? div.append(this.userMenuLinks())
            : div.append(this.userAccountSettingContainer());

        this.changedContentWrapper = div;
        return div
    };

    userMenuLinks =()=> {
        const div = document.createElement('div');
        div.className = 'user-menu-tabs';
        div.innerHTML = `
            <a href="./#/account" class="user-menu-link flex-container align-middle">
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
        div.querySelectorAll('.user-menu-link')
            .forEach(a => a.addEventListener('click', this.hideUserMenu))
        return div
    };

    userAccountSettingContainer =()=> {
        const div = document.createElement('div');
        div.append(this.userAccountSettingTimeZone());
        div.append(this.userAccountSettingOddsType());
        div.append(this.userAccountSettingMaxInactivityTime());
        div.append(this.userAccountSettingBettingCurrency());

        return div;
    };

    userAccountSettingOddsType =()=> {
        const div = document.createElement('div');
        div.className = 'user-setting-menu-item';
        div.innerHTML = `
                    <div class="user-setting-menu-item-header">
                        <h4>Odds Type</h4>
                        <p class="current-active-option">${this.transformBetTypeFromId()}</p>
                        <span class="row"></span>
                    </div>
                    <ul class="user-setting-menu-item-inner hide">
                        <li class="user-setting-option" 
                            data-name="ODDS_TYPE" 
                            data-id="1"
                        >
                            Decimal
                        </li>
                        <li class="user-setting-option" 
                            data-name="ODDS_TYPE" 
                            data-id="2"
                        >
                            Fraction
                        </li>
                        <li class="user-setting-option" 
                            data-name="ODDS_TYPE" 
                            data-id="3"
                        >
                            American
                        </li>
                    </ul>`;

        const settingHeader = div.querySelector('.user-setting-menu-item-header');
        settingHeader.addEventListener('click', this.markAsActive);
        settingHeader.addEventListener('click', this.showInnerSettings);

        div.querySelectorAll('.user-setting-option')
            .forEach(li => li.addEventListener('click', this.setCoefOption));
        return div;
    };

    userAccountSettingTimeZone =()=> {
        const div = document.createElement('div');
        div.className = 'user-setting-menu-item';
        div.innerHTML = `
                    <div class="user-setting-menu-item-header">
                        <h4>Time Zone</h4>
                        <p class="current-active-option">${this.TZ}</p>
                        <span class="row"></span>
                    </div>
                    <ul class="user-setting-menu-item-inner hide">
                        <li class="user-setting-option" data-name="TZ" data-id="1">UK</li>
                        <li class="user-setting-option" data-name="TZ" data-id="2">ET</li>
                        <li class="user-setting-option" data-name="TZ" data-id="3">PT</li>
                        <li class="user-setting-option" data-name="TZ" data-id="4">CET</li>
                        <li class="user-setting-option" data-name="TZ" data-id="5">CT</li>
                        <li class="user-setting-option" data-name="TZ" data-id="6">MT</li>
                        <li class="user-setting-option" data-name="TZ" data-id="7">GMT-12</li>
                        <li class="user-setting-option" data-name="TZ" data-id="8">GMT-11</li>
                        <li class="user-setting-option" data-name="TZ" data-id="9">GMT-10</li>
                        <li class="user-setting-option" data-name="TZ" data-id="10">GMT-9</li>
                        <li class="user-setting-option" data-name="TZ" data-id="11">GMT-8</li>
                        <li class="user-setting-option" data-name="TZ" data-id="12">GMT-7</li>
                        <li class="user-setting-option" data-name="TZ" data-id="13">GMT-6</li>
                        <li class="user-setting-option" data-name="TZ" data-id="14">GMT-5</li>
                        <li class="user-setting-option" data-name="TZ" data-id="15">GMT-4</li>
                        <li class="user-setting-option" data-name="TZ" data-id="16">GMT-3</li>
                        <li class="user-setting-option" data-name="TZ" data-id="17">GMT-2</li>
                        <li class="user-setting-option" data-name="TZ" data-id="18">GMT-1</li>
                        <li class="user-setting-option" data-name="TZ" data-id="19">GMT</li>
                        <li class="user-setting-option" data-name="TZ" data-id="20">GMT+1</li>
                        <li class="user-setting-option" data-name="TZ" data-id="21">GMT+2</li>
                        <li class="user-setting-option" data-name="TZ" data-id="22">GMT+3</li>
                        <li class="user-setting-option" data-name="TZ" data-id="23">GMT+4</li>
                        <li class="user-setting-option" data-name="TZ" data-id="24">GMT+5</li>
                        <li class="user-setting-option" data-name="TZ" data-id="25">GMT+6</li>
                        <li class="user-setting-option" data-name="TZ" data-id="26">GMT+7</li>
                        <li class="user-setting-option" data-name="TZ" data-id="27">GMT+8</li>
                        <li class="user-setting-option" data-name="TZ" data-id="28">GMT+9</li>
                        <li class="user-setting-option" data-name="TZ" data-id="35">GMT+9.5</li>
                        <li class="user-setting-option" data-name="TZ" data-id="29">GMT+10</li>
                        <li class="user-setting-option" data-name="TZ" data-id="36">GMT+10.5</li>
                        <li class="user-setting-option" data-name="TZ" data-id="30">GMT+11</li>
                        <li class="user-setting-option" data-name="TZ" data-id="31">GMT+12</li>
                        <li class="user-setting-option" data-name="TZ" data-id="32">GMT+13</li>
                        <li class="user-setting-option" data-name="TZ" data-id="33">EET</li>
                        <li class="user-setting-option" data-name="TZ" data-id="34">POR</li>
                    </ul>`;

        const settingHeader = div.querySelector('.user-setting-menu-item-header');
        settingHeader.addEventListener('click', this.markAsActive);
        settingHeader.addEventListener('click', this.showInnerSettings);

        div.querySelectorAll('.user-setting-option')
            .forEach(li => li.addEventListener('click', this.setCoefOption));
        return div;
    };

    userAccountSettingMaxInactivityTime =()=> {
        const actTime = Number(this.INACTIVITY_TIMEOUT)/3600;
        const div = document.createElement('div');
        div.className = 'user-setting-menu-item';
        div.innerHTML = `
                    <div class="user-setting-menu-item-header">
                        <h4>Max Inactivity Time</h4>
                        <p class="current-active-option">${actTime} hour</p>
                        <span class="row"></span>
                    </div>
                    <ul class="user-setting-menu-item-inner hide">
                        <li class="user-setting-option" 
                            data-name="INACTIVITY_TIMEOUT" 
                            data-id="1">
                            1 hour
                        </li>
                        <li class="user-setting-option" 
                            data-name="INACTIVITY_TIMEOUT" 
                            data-id="2">
                            2 hour
                        </li>
                        <li class="user-setting-option" 
                            data-name="INACTIVITY_TIMEOUT" 
                            data-id="3">
                            3 hour
                        </li>
                        <li class="user-setting-option" 
                            data-name="INACTIVITY_TIMEOUT" 
                            data-id="4">
                            4 hour
                        </li>
                        <li class="user-setting-option" 
                            data-name="INACTIVITY_TIMEOUT" 
                            data-id="5">
                            5 hour
                        </li>
                    </ul>`;

        const settingHeader = div.querySelector('.user-setting-menu-item-header');
        settingHeader.addEventListener('click', this.markAsActive);
        settingHeader.addEventListener('click', this.showInnerSettings);

        div.querySelectorAll('.user-setting-option')
            .forEach(li => li.addEventListener('click', this.setCoefOption));
        return div;
    };

    userAccountSettingBettingCurrency =()=> {
        const div = document.createElement('div');
        div.className = 'user-setting-menu-item';
        div.innerHTML = `
                    <div class="user-setting-menu-item-header">
                        <h4>Betting curency</h4>
                        <p class="current-active-option">${this.CURRENCY_CODE}</p>
                        <span class="row"></span>
                    </div>
                    <ul class="user-setting-menu-item-inner hide">
                        <li class="user-setting-option" 
                            data-name="CURRENCY_CODE" 
                            data-id="1">
                            USD
                        </li>
                        <li class="user-setting-option" 
                            data-name="CURRENCY_CODE" 
                            data-id="2">
                            EUR
                        </li>
                    </ul>`;

        const settingHeader = div.querySelector('.user-setting-menu-item-header');
        settingHeader.addEventListener('click', this.markAsActive);
        settingHeader.addEventListener('click', this.showInnerSettings);

        div.querySelectorAll('.user-setting-option')
            .forEach(li => li.addEventListener('click', this.setCoefOption));
        return div;
    };

    showUserAccountSetting =(e)=> {
        const elem = e.target;
        elem.classList.toggle('fa-cog');
        elem.classList.toggle('fa-bars');

        e.stopPropagation();
        this.activeContent = !this.activeContent;
        this.changedContentWrapper.innerHTML = '';
        this.activeContent
            ? this.changedContentWrapper.append(this.userMenuLinks())
            : this.changedContentWrapper.append(this.userAccountSettingContainer());

    };

    showInnerSettings =(e)=> {
        const parent = e.target.closest('.user-setting-menu-item');
        const innerSettings = parent.querySelector('.user-setting-menu-item-inner');
        innerSettings.classList.toggle('hide');
        innerSettings.classList.toggle('show');
    };

    setCoefOption =(e)=> {
        const elem = e.target;
        const name = elem.dataset.name;

        this.showInnerSettings(e);
        this.setChangesInUserConfig(elem);
        this.showChangedOption(elem, name);
        this.markAsActive(e)

    };

    setChangesInUserConfig =(elem)=> {
        const id = elem.dataset.id;
        const name = elem.dataset.name;
        const user_config = config._config.CUSTOMER_CONFIG;

        switch (name) {
            case 'ODDS_TYPE':
                user_config[name] = id;
                this[name] = id;
                break;
            case 'INACTIVITY_TIMEOUT':
                user_config[name] = this.transfromToMinutes(elem.innerText);
                this[name] = this.transfromToMinutes(elem.innerText);
                break;
            default:
                user_config[name] = elem.innerText;
                this[name] = elem.innerText;
        }
    };

    showChangedOption =(elem, name)=> {
        const elName = elem.dataset.name;
        const user_config = config._config.CUSTOMER_CONFIG;
        const parent = elem.closest('.user-setting-menu-item');
        const currentOption = parent.querySelector('.current-active-option');

        switch (elName) {
            case 'ODDS_TYPE':
                const type = this.transformBetTypeFromId();
                currentOption.innerText = `${type}`
                break;
            case 'INACTIVITY_TIMEOUT':
                const hour = Number(this[name])/3600;
                currentOption.innerText = `${hour} hour`;
                break;
            default:
                currentOption.innerText = user_config[name]
        }
    };

    //

    transformBetTypeFromId =()=> {
        return this.ODDS_TYPE === '1'
            ? 'Decimal'
            : this.ODDS_TYPE === '2'
            ? 'Fraction' : 'American';
    };

    transfromToMinutes =(text)=> {
        const cleanNumber = text.replace('hour', '');
        return Number(cleanNumber)*3600
    };

    markAsActive =(e)=> {
        const elem = e.target.closest('.user-setting-menu-item');
        elem.classList.toggle('active');
    };

    hideUserMenu =()=> {
        this.usermenuContainer.classList.add('hide');
        this.usermenuContainer.classList.remove('show');
    };
};

window.LoginIn = class LoginIn extends PopupUserMenu{
    constructor() {
        super()
        this.container;
        this.name;
        this.currencyCode;
        this.usermenuContainer;
    }

    renderUserData1 =()=> {
        const div = document.createElement('div');
        div.className = 'block mr';
        div.innerHTML = `
                <a class="font title login-in__name">${this.name}</a>
                <div class="flex-container align-right align-middle login-in__wrapper">
                  <a class="font mr login-in__price">4.36 ${this.currencyCode}</a>
                  <a class="font login-in__deposit">Deposit</a>
                </div>`

        return div
    };

    renderUserData2 =()=> {
        const a = document.createElement('a');
        a.className = 'login-in__img';
        a.innerHTML = `
                <img src="./img/user.png" alt="User"/>
                <p class="login-in__circle">
                    <span class="font">21</span>
                </p>
        `;

        a.addEventListener('click', this.userPopupMenu);
        return a
    };

    containerForUserMenuPopup =()=> {
        const div = document.createElement('div');
        div.className = 'login_usermenu hide';

        div.append(this.userMenuWrapper());
        div.append(this.changedContainer());

        this.usermenuContainer = div;
        return div
    };

    userPopupMenu =()=> {
        this.usermenuContainer.classList.toggle('show');
        this.usermenuContainer.classList.toggle('hide');

        document.addEventListener('click', this.closeUserPopup)
    };

    closeUserPopup =(e)=> {
        const elem = e.target;
        if (!elem.closest('.loginIn')){
            this.usermenuContainer.classList.add('hide');
            this.usermenuContainer.classList.remove('show');
            document.removeEventListener('click', this.closeUserPopup)
        }
    };

    appendElements =()=> {
        this.container.append(this.renderUserData1());
        this.container.append(this.renderUserData2());
        this.container.append(this.containerForUserMenuPopup());
    };

    init =()=> {
        this.container = document.getElementById('loginIn');
        const { CUSTOMER_CONFIG } = config._config;
        this.name = CUSTOMER_CONFIG.USER_NAME;
        this.currencyCode = CUSTOMER_CONFIG.CURRENCY_CODE;
        this.appendElements()
    };
};

window.loginIn = new LoginIn();
loginIn.init();

