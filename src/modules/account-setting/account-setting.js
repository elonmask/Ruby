window.AccountSetting = class AccountSetting {
    constructor() {
        this.modules = ['balance','access', 'personal','transaction',]
    }

    checkActiveButton=(id)=>{
        document.getElementById(`${id}`).classList.add('active');
    };

    init =()=> {
        const arr = window.location.hash.split('/');
        const hash = arr[2];

        if (hash !== '' && hash !== undefined ){
            this.modules.map( ph => {
                if (hash === ph){
                    ld.loadSingleModule('./modules', ph);
                    this.checkActiveButton(ph)
                }
            })
        }
    }
};

window.setting = new AccountSetting();
setting.init();




