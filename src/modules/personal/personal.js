window.Personal = class Personal{
    constructor(){
        this.parentNode='';
        this.hash='';
        this.modules = ['user-info','security', 'notification']
    }

    subNavBtn =()=> {
        this.parentNode.innerHTML=`
            <div class="setting-nav flex-container align-middle">
                <a class="setting-nav-link small" data-name="user-info" href="#/account/personal/user-info/">
                    <span class="font">USER INFORMATION</span>
                </a>
                <a class="setting-nav-link small" data-name="security" href="#/account/personal/security/">
                    <span class="font">SECURITY</span>
                </a>
                <a class="setting-nav-link small" data-name="notification" href="#/account/personal/notification/">
                    <span class="font">NOTIFICATION</span>
                </a>
            </div>
        `
        this.parentNode.querySelectorAll('a').
            forEach(item => {
                item.dataset.name === this.hash ? item.classList.add('active') : item.classList.remove('active')
        })
    };

    init =()=> {
        this.parentNode = document.getElementById('setting-sub-nav');
        let arr = window.location.hash.split('/');
        let hash = arr[3];
        if (hash !== '' && hash !== undefined){
            this.modules.map(ph => {
                if (hash === ph){
                    ld.loadSingleModule( './modules/personal', ph, '#setting-box-second');
                }
            });
        }
        this.hash = hash;
        this.subNavBtn()
    };

};

window.personal = new Personal();
personal.init();
