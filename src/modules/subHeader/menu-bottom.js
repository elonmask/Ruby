var menuSettings = document.getElementById('menu_settings');
var nodeForVolume = menuSettings.querySelector('#volume_editor');
var nodeForPageSetting = menuSettings.querySelector('#page_editor');
var nodeForMenuInfo = menuSettings.querySelector('#menu_info');
var langMun_container = menuSettings.querySelector('#langMenu_container');
var itemList = menuSettings.querySelectorAll('.doprDowm-item');
var clock = document.getElementById('clock');

window.Volume = class VolumeSetting {
    constructor(node, volumeSize, volumeStatus){
        this.parentNode=node;
        this.inputNumber='';
        this.volumeIcon='';
        this.volumeSize=volumeSize;
        this.volumeStatus=volumeStatus;
    }

    render=()=>{
        this.parentNode.innerHTML = `
                <h3>Video Volume</h3>
                <div class="volume-changer">
                  <span class="fa fa-volume-up" id="volume_icon"></span>
                  <input type="range" 
                         name="volume" 
                         min="0" max="100" 
                         value=${this.volumeSize || this.volumeSize === 0  ? this.volumeSize : 20} 
                         id="inputVolumeNum">
                </div>
                <div class="volume-on-off">
                  <h3>Sound Effects</h3>
                  <label class=${this.volumeStatus ? 'on' : 'off'} >
                    <input type="checkbox" 
                           id="volume_status"
                           ${this.volumeStatus ? 'checked' : null}>
                  </label>
                </div>  
            `


        this.inputNumber = this.parentNode.querySelector('#inputVolumeNum');
        this.inputNumber.addEventListener('change', this.saveChangesInLS)

        this.volumeIcon = this.parentNode.querySelector('#volume_icon');
        this.volumeIcon.addEventListener('click', this.disableVolume);

        this.parentNode.querySelector('#volume_status').addEventListener('click', this.enableOrDisableVolume);

    };

    disableVolume=(e)=>{
        e.target.classList.toggle('fa-volume-up');
        e.target.classList.toggle('fa-volume-off');
        if (e.target.classList.contains('fa-volume-off')) {
            this.inputNumber.value = 0;
        } else {
            this.inputNumber.value = 20;
        }

        this.saveChangesInLS()
    };

    enableOrDisableVolume=(e)=>{
        const label=e.target.closest('label');
        label.classList.toggle('on');
        label.classList.toggle('off');

        localStorage.setItem('VolumeStatus', e.target.checked);
    };

    saveChangesInLS=()=>{
        if ( Number(this.inputNumber.value) > 0){
            this.volumeIcon.classList.add('fa-volume-up');
            this.volumeIcon.classList.remove('fa-volume-off');
        } else {
            this.volumeIcon.classList.remove('fa-volume-up');
            this.volumeIcon.classList.add('fa-volume-off');
        }

        localStorage.setItem('VolumeSize', this.inputNumber.value)
    };

};

window.PageSettings = class PageSetting {
    constructor(node, sum, value){
        this.parentNode=node;
        this.inputsSettings=[
            {
                name:'CoefChanges',
                value:1,
                type:'radio',
                id:'not_conf',
                text:'Не принимать'
            },
            {
                name:'CoefChanges',
                value:2,
                type:'radio',
                id:'increase',
                text:'Увеличение'
            },{
                name:'CoefChanges',
                value:3,
                type:'radio',
                id:'everyone',
                text:'Любые'
            }
        ];
        this.sumValue=sum;
        this.coefValue=value;
    }

    render=()=>{
        this.parentNode.innerHTML=`
                <h3>Купон</h3>
                <div class="sum-settings">
                  <span>Автосумма по умолчанию</span>
                  <input type="number" class="autosum" name="Sum" value=${this.sumValue ? this.sumValue : null}>
                  <button class="fa corrected"></button>
                </div>
                <h4>Какие изменения принимать?</h4>
                <div class="settings-chahges">
                
                ${ this.inputsSettings.map(e => {
                    let checked = this.coefValue === e.value ? 'checked' : null; 
                    return `
                        <div>
                            <input type=${e.type} name=${e.name} value=${e.value} id=${e.id} ${checked}>
                             <label for=${e.id}>${e.text}</label>
                        </div> 
                    `
                })}
                 
                </div>
        `
        this.parentNode.querySelector('.autosum').addEventListener('input', this.writeDataToLS)
        this.parentNode.querySelectorAll('input').forEach(elem => {
            if (elem.type === 'radio'){
                elem.addEventListener('change', this.writeDataToLS)
            }
        })
    };

    writeDataToLS=(e)=>{
        let value = e.target.value;
        let name = e.target.name;

        console.log('name',name)
        console.log('value',value)

        JSON.stringify(localStorage.setItem(name, value))
    };
};

window.InfoBlock = class Info {
    constructor(node){
        this.parentNode=node;
    }

    render=()=>{
      this.parentNode.innerHTML=`
        <ul>
            <li>О нас</li>
            <li>Правила приёма ставок</li>
            <li>Правила использования ресурса</li>
            <li>Помощь</li>
        </ul>
      `
    };
};

window.LanguageMenu = class LanguageMenu {
    constructor(node) {
        this.container = node;
        this.activeLang;
    }

    render =()=> {
        const template = document.createElement('template');
        template.innerHTML = `<a class="font languages-link" data-val="English">English</a>
                                <a class="font languages-link" data-val="Russian">Russian</a>`

        template.content.querySelectorAll('.languages-link').forEach(el => {
           el.addEventListener('click', this.changeLang)
        });
        return template.content
    };

    changeLang =(e)=> {
        const lang = e.target.dataset.val;
        this.activeLang.innerText = lang;
        sessionStorage.setItem('lang', lang);

        changeLanguage()
    };

    init =()=> {
        this.container.appendChild(this.render());
        this.activeLang = menuSettings.querySelector('#act_lang');
        this.activeLang.innerText = sessionStorage.getItem('lang') || 'English';
    };

};

window.BottomMenu = class BottomMenu {
    constructor(){
        this.activeLn = localStorage.getItem('ActBtMen') || '1';
        this.links = [];
    }


    markAsActive =(hsh)=> {
        this.links.forEach(a => {
            if (hsh === a.dataset.name){
                a.classList.add('active')
            } else {
                a.classList.remove('active');
            }
        });
    };

    init =()=> {
        this.links =  document.querySelectorAll('.bottom-menu-item');

        window.addEventListener('hashchange', ()=> {
          const hsh = window.location.hash.split('/');
          if (hsh[1] === 'inplay'){
              this.markAsActive(hsh[2])
          } else {
              this.markAsActive('')
          }
        });
    };
};

function closeAllDropItem(e) {
    let elem = e.target;

    if (!elem.closest('#menu_settings')){
        hideAllDropItem()
    }
}

function hideAllDropItem(name) {
    itemList.forEach(e => {
        e.classList.remove('show');
        e.classList.add('hide');
    });
}

function showDropDownMenu(name) {
    hideAllDropItem(name);
    if (name==='volumeSetting') {
        nodeForVolume.classList.add('show');
    }
    if (name==='pageSetting') {
        nodeForPageSetting.classList.add('show');
    }
    if (name==='menu_info'){
        nodeForMenuInfo.classList.add('show')
    }
    if (name === 'language_change'){
        langMun_container.classList.add('show');
    }
}

function getDataFromLocalStorage() {
    const LSData = [ 'VolumeSize','VolumeStatus', 'Sum', 'CoefChanges'];



    let data = LSData.map(item => {
        return JSON.parse(localStorage.getItem(item));
    });

    return data
}

function init(){
    menuSettings.querySelectorAll('.bottom-menu-link-item').forEach(item=>{
        item.addEventListener('click', ()=> showDropDownMenu(item.dataset.name))
    });

    let LSData = getDataFromLocalStorage();

    const volume = new Volume(nodeForVolume,LSData[0],LSData[1]);
    volume.render();

    const pageSetting = new PageSettings(nodeForPageSetting, LSData[2], LSData[3]);
    pageSetting.render();

    const infoMenu = new InfoBlock(nodeForMenuInfo);
    infoMenu.render();

    const botMenu = new BottomMenu();
    botMenu.init();

    const language = new LanguageMenu(langMun_container);
    language.init();

    document.addEventListener('click', closeAllDropItem);
};

// setInterval(function() {
//     let today = new Date();
//     let h = today.getHours();
//     let m = today.getMinutes();
//     let s = today.getSeconds();
//
//     if(h<10){ h = "0"+h; }
//     if(m<10){ m = "0"+m; }
//     if(s<10){ s = "0"+s; }
//
//     clock.innerText = h+":"+m+":"+s+" GMT+2"
// }, 500);

(function showTime() {
    const { TZ, TZA } = config._config.CUSTOMER_CONFIG;

    setTimeout(()=> {
        const time = new Date().toLocaleTimeString();
        clock.innerText = `${time} ${TZ}`
        showTime()
    }, 1000)
})();

init();