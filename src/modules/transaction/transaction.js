var Transaction = class Transaction{
    constructor(){
        this.parentNode='';
        this.contentNode='';
    }

    transactionTemplate=()=>{
        this.parentNode.innerHTML=`
            <div class="flex-container align-center-middle setting-wrapper no-wrap">
                <div class="flex-container align-middle padding" style="margin: 5px">
                    <p class="font text-right mr">Range:</p>
                    <input type="text" class="field [ setting-field ]" value="15/04/2018">
                    <button class="button primary square fa fa-calendar-check-o [ setting-wrapper-button ]"></button>
                </div>
                <div class="flex-container align-middle padding" style="margin: 5px">
                    <input type="text" class="field [ setting-field ]" value="15/04/2018">
                    <button class="button primary square fa fa-calendar-check-o [ setting-wrapper-button ]"></button>
                </div>
                <div class="flex-container align-middle padding" style="margin: 5px">
                    <input type="text" class="field [ setting-field ]" value="All">
                    <button class="button primary square fa fa-search [ setting-wrapper-button ]"></button>
                </div>
            </div>
        `
    };

    transactionTemplateItem=()=>{
        this.contentNode.innerHTML=`
            <div class="setting-wrapper-transaction flex-container align-center-middle">
                <p class="font white text-uppercase">NO TRANSACTION FOUND</p>
            </div>
      `
    };

    init=()=>{
        this.parentNode=document.getElementById('setting-sub-nav');
        this.contentNode=document.getElementById('setting-box-second');

        this.transactionTemplate();
        this.transactionTemplateItem();
    }
};
var transaction = new Transaction();
transaction.init();