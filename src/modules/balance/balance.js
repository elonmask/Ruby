window.Balance = class Balance{
    constructor(){
        this.parentNode = '';
        this.hash = '';
        this.modules = ['casier', 'deposit',  'withdraw', 'account-managment' ]
    }

    subNavBtn=()=>{
        this.parentNode.innerHTML= `
        <div class="setting-nav flex-container align-middle">
            <a class="setting-nav-link small" data-name="casier" href="#/account/balance/casier/">
                <span class="font">CASIER</span>
            </a>
            <a class="setting-nav-link small" data-name="deposit" href="#/account/balance/deposit/">
                <span class="font">DEPOSIT</span>
            </a>
            <a class="setting-nav-link small" data-name="withdraw" href="#/account/balance/withdraw/">
                <span class="font">WITHDRAW</span>
            </a>
            <a class="setting-nav-link small" data-name="account-managment" href="#/account/balance/account-managment/">
                <span class="font">ACCOUNT MANAGEMENT</span>
            </a>
        </div>
      `
        this.parentNode.querySelectorAll('a').forEach(item=>{
            item.dataset.name === this.hash ?
                item.classList.add('active') :
                item.classList.remove('active')
        });
    };

    init =()=> {
        this.parentNode = document.getElementById('setting-sub-nav');
        const arr = window.location.hash.split('/');
        const hash = arr[3];

        if (hash !== '' && hash !== undefined){
            this.modules.map( ph => {
                if (hash === ph ){
                    ld.loadSingleModule( './modules/balance', ph, '#setting-box-second');
                }
            });

        }
        this.hash = hash;
        this.subNavBtn()
    };

};
window.balance = new Balance();
balance.init();