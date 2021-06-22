window.Access = class Accecs{
    constructor(){
        this.parentNode='';
    }

    accessTemplate=()=>{
        this.parentNode.innerHTML=`
            <div class="setting-nav flex-container align-middle">Access</div>
        `
    };

    init=()=>{
        this.parentNode=document.getElementById('setting-sub-nav');
        this.accessTemplate()
    }
};
window.access = new Access();
access.init()