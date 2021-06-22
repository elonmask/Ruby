window.Betslip = class Betslip {
    constructor() {
        this.container = '';
        this.dropDownOptions = [];
        this.activeOpt = 'Standard';
        this.stBetInput = [];
        this.multInputs = [];
        this.singleStake = '';
        this.placeBet = '';
        this.qB = JSON.parse(sessionStorage.getItem('qB'));
        this.currencySymbol = config._config.CUSTOMER_CONFIG.CURRENCY_SYMBOL;
    }

    currencySymbolTemplate = () => {
        return `<span>${this.currencySymbol}</span>`
    };

    quickBetChBoxEv = () => {
        if (this.stBetInput.length === 0) {
            this.enableQuickBet()
        } else {
            this.activateQbPopup()
        }
    };

    activateQbPopup = () => {
        const div = document.createElement('div');
        div.className = 'activate-qb'
        div.innerHTML = ` 
            <div class="activate-qb-inner">
                <span class="fa fa-times close-acQb"></span>
                <h2>Selection On Your Bet Slip </h2> 
                <h4> Your existing selections will need to be cleared to enable Quick Bet.</h4>
                <div class="activate-qb-buttons">
                    <button id="actQb-btn">Activate Quick Bet</button>
                    <button id="backTo-placeBet">Back to Place Bet</button>
                </div>
            </div>
           
        `

        div.querySelector('.close-acQb').addEventListener('click', this.removeQbPopup);
        div.querySelector('#actQb-btn').addEventListener('click', this.activateQbType);
        div.querySelector('#backTo-placeBet').addEventListener('click', this.removeQbPopup);
        // this.actPopupQbTimer();

        document.body.appendChild(div)
    };

    activateQbType = (e) => {
        qbC.deleteAllItems()
            .then(res => this.removeQbPopup(e))
            .then(res => this.enableQuickBet())
    };

    removeQbPopup = (e) => {
        const parent = e.target.closest('.activate-qb');
        document.body.removeChild(parent);
    };

    enableQuickBet = () => {
        if (this.qB) {
            sessionStorage.setItem('qB', false)
        } else {
            sessionStorage.setItem('qB', true)
        }
        this.qB = JSON.parse(sessionStorage.getItem('qB'));

        this.addClassQuickBtn();
        this.changleSlipContOption();
        this.bsMessage();
    };

    addClassQuickBtn = () => {
        const btn = this.container.querySelector('.qb-Btn_Switch-false') || this.container.querySelector('.qb-Btn_Switch-true');

        if (this.qB) {
            btn.classList.add('qb-Btn_Switch-true');
            btn.classList.remove('qb-Btn_Switch-false')
        } else {
            btn.classList.add('qb-Btn_Switch-false');
            btn.classList.remove('qb-Btn_Switch-true')
        }

    };

    changleSlipContOption = () => {
        const bsType = this.container.querySelector('.bs-BetSlipType');
        const bsHelp = this.container.querySelector('.qb-Help_Wrapper-inactive');

        if (bsType && bsHelp) {
            if (this.qB) {
                bsType.classList.add('hide');
                bsHelp.classList.add('show');
            } else {
                bsType.classList.remove('hide');
                bsHelp.classList.remove('show');
            }
        }
    };

    bsMessage = () => {
        const enpMes = this.container.querySelector('.bs-EmptyMsg');
        const qbMes = this.container.querySelector('.qb-QuickBetMsg-inactive');

        if (enpMes && qbMes) {
            if (this.qB) {
                enpMes.classList.add('hide');
                qbMes.classList.add('show');
            } else {
                enpMes.classList.remove('hide');
                qbMes.classList.remove('show');
            }
        }
    };

    helpMenu = (e) => {
        const el = e.target.closest('.qb-Help_Wrapper-inactive');
        const hlMn = el.querySelector('.qb-Help-Menu');

        if (hlMn) {
            el.removeChild(hlMn)
        } else {
            const div = document.createElement('div');
            div.className = 'qb-Help-Menu';
            div.innerHTML = ` 
               <h1 class="help-menu-title">Quick Single Betting</h1>
               <ul class="help-menu-item-wrapper">
                    <li class="help-menu-item">Click a selection</li>
                    <li class="help-menu-item">Enter Stake</li>
                    <li class="help-menu-item">Press 'Place Bet'</li>               
                </ul>
            `
            el.appendChild(div)
        }
    };

    dropDownMenu = () => {
        const menu = this.container.querySelector('#betSlipTypeOptions');
        menu.classList.toggle('bs-Dropdown-show');
        menu.classList.toggle('bs-Dropdown');
    };

    dropDownItem = (e) => {
        console.log(e.target)
        const prnt = e.target.closest('.bs-Dropdown_Item ');
        const elem = prnt.querySelector('.bs-Dropdown_ItemText');

        this.activeOpt = elem.dataset.item;
        this.setSelectionVal();

        this.dropDownOptions.forEach(el => {
            el.classList.remove('selected');
        });

        prnt.classList.add('selected');

    };

    setSelectionVal = () => {
        this.container.querySelector('.bs-BetSlipType_SelectionText').innerText = this.activeOpt === '1' ? 'Standart' : 'Banker';
    };

    multiHeader = () => {
        const headClosClas = this.multipleContainer.classList.contains('closed');

        this.multipleContainer.querySelector('.bs-MultipleBets_SubHeader').classList.toggle('hide')
        this.multipleContainer.querySelectorAll('.bs-Item').forEach(el => {
            if (headClosClas) {
                if (!el.classList.contains('bs-MultipleBets_HighestAccumulator')) {
                    el.classList.add('hide');
                }
            } else {
                el.classList.remove('hide')
            }
        });
    };

    singleStClearVal = () => {
        this.singleStake ? this.singleStake.value = '' : null
    };

    multiplicationBet = (stake, mtplc) => {
        return Number(stake) * transformBetAsFraction(mtplc)
    };

    userStake = (e) => {
        const prnt = e.target ? e.target.closest('.bs-Item') : e.closest('.bs-Item');
        const value = e.target ? cleanInputValue(e.target.value) : cleanInputValue(e.value);

        if (!prnt.classList.contains('suspended')) {
            const fi = prnt.dataset.itemFpid;
            const cf = prnt.querySelector('.bs-Odds').innerText;
            const stake = Number(value);
            const toRet = this.multiplicationBet(value, cf);
            const toRetWithSeparator = withAllSeparators(toRet);

            prnt.querySelector('.bs-StakeToReturn_Value')
                .innerHTML = `${toRetWithSeparator} ${this.currencySymbolTemplate()}`;
            this.writeStakeToLocStor(fi, toRet, stake);
            this.addSeparatorToInputValue(e, value)
        }
    };

    singlesInputStake = (e) => {
        const value = e.target.value;
        this.stBetInput.forEach(inp => {
            if (!(inp.closest('.suspended'))) {
                inp.value = withAllSeparators(value);
                this.userStake(inp)
            } else {
                inp.value = '';
            }
        });

        const cleanValue = cleanInputValue(value);
        this.addSeparatorToInputValue(e, cleanValue)
    };

    addSeparatorToInputValue = (e, value) => {
        const newValue = addGroupSeparatorToStake(value);

        e.target ? e.target.value = newValue : e.value = newValue
    };

    addAllSeparators = (e) => {
        const value = e.target.value;
        e.target.value = withAllSeparators(value);
    };

    inputSelectAll = (e) => {
        const input = e.target;
        input.select();
    };

    writeStakeToLocStor = (fi, tr, st) => {
        const stkObj = JSON.parse(sessionStorage.getItem('bt'));
        const ns = stkObj.ns.split('||').map(str => {
            if (str.includes(fi)) {
                return str + `tr=${tr}#st=${st}#ust=${st}#`
            }
            return str
        }).join('||');

        stkObj.ns = ns;
        sessionStorage.setItem('bt', JSON.stringify(stkObj))
    };

    placeBetSum = () => {
        if (this.placeBet) {
            let stndBet = 0;
            let multiBet = 0;
            stndBet = [...this.stBetInput].reduce((sum, elem) => {
                const cleanValue = cleanInputValue(elem.value);
                return sum + Number(cleanValue)
            }, 0);

            if (this.multInputs) {
                multiBet = [...this.multInputs].reduce((sum, el) => {
                    const cleanValue = cleanInputValue(el.value);
                    return sum + Number(cleanValue);
                }, 0);
            }
            const result = (stndBet + multiBet).toString();
            this.placeBet.innerHTML = `${this.currencySymbolTemplate()} ${withAllSeparators(result)}`
        }
    };

    toReturnValue = () => {
        const data = JSON.parse(sessionStorage.getItem('bt'));
        if (data.ns) {
            data.ns.split('||').map(str => {
                let fp;
                let tr;
                str.split('#').map(kv => {
                    if (kv.includes('fp')) {
                        fp = kv.replace('fp=', '')
                    }
                    if (kv.includes('tr')) {
                        tr = kv.replace('tr=', '');
                    }
                });
                if (fp) {
                    this.elementReturnValue(fp, tr)
                }
            })
        }
    };

    elementReturnValue = (fp, tr = 0) => {
        document.querySelectorAll('.bs-Item').forEach(el => {
            if (el.dataset.itemFpid === fp) {
                const input = el.querySelector('.bs-Stake_TextBox');
                input.value = withAllSeparators(input.value);

                el.querySelector('.bs-StakeToReturn_Value')
                    .innerHTML = `${withAllSeparators(tr)} ${this.currencySymbolTemplate()}`
            }
        });
    };

    multiInputEv = (e) => {
        const parent = e.target.closest('.bs-Item');
        parent.classList.contains('bs-MultipleBets_HighestAccumulator') ? this.hightAcamulatedInput(parent, e.target) : null

        const id = parent.dataset.itemId;
        const value = cleanInputValue(e.target.value);
        this.storageData(value, id);
        this.addSeparatorToInputValue(e, value)
    };

    hightAcamulatedInput = (node, input) => {
        const countNode = node.querySelector('.bs-MultipleBets_Odds');
        let count;
        if (countNode) {
            count = countNode.innerText
        }
        const returnNode = node.querySelector('.bs-MultipleBets_ToReturnValue');
        if (returnNode) {
            const stake = this.multiplicationBet(cleanInputValue(input.value), count);
            returnNode.innerHTML = ` ${this.currencySymbolTemplate()} ${withAllSeparators(stake)}`
        }

    };

    storageData = (value, id) => {
        const sesStorData = JSON.parse(sessionStorage.getItem('bt'));

        const str = sesStorData.ms.split('||').map(item => {
            if (item.includes(`id=${id}#`)) {
                const str = this.cutMultiEvSTUST(item);
                return str + `st=${value}#ust=${value}#`
            }
            return item
        }).join('||');

        sesStorData.ms = str;
        sessionStorage.setItem('bt', JSON.stringify(sesStorData))
    };

    cutMultiEvSTUST = (str) => {
        const st = /(\bst=)(\d*)(\#\b)/g;
        const ust = /(\bust=)(\d*)(\#\b)/g;

        str = str.replace(st, '')
        str = str.replace(ust, '');

        return str
    };

    stakeData = (e) => {
        const prnt = e.target.closest('.bs-Item');
        const data = JSON.parse(sessionStorage.getItem('bt'));
        const id = prnt.dataset.itemFpid;

        qbC.removeStake(data, id)
    };

    deleteStakes = () => {
        qbC.deleteAllItems()
    };

    sendUpdateReq = () => {
        fetch('http://www.bestline.bet/betslip/?op=9', {
            method: 'POST',
            body: sessionStorage.getItem('bt')
        })
            .then(res => res.text())
            .then(res => console.log(res))
            .catch(err => console.log(err))
    };

    addListeners = () => {
        //Events for dropDown menu
        this.container.querySelector('.qb-Btn').addEventListener('click', this.quickBetChBoxEv);

        const selectionMenu = this.container.querySelector('#betSlipTypeSelection');
        if (selectionMenu) {
            selectionMenu.addEventListener('click', this.dropDownMenu);
        }

        this.container.querySelectorAll('.bs-Dropdown_Item').forEach(it => {
            this.dropDownOptions.push(it);
            it.addEventListener('click', this.dropDownItem)
        });
        //Help
        const help = this.container.querySelector('.qb-Help');
        if (help) {
            help.addEventListener('click', this.helpMenu);
        }
        //Remove single item
        this.container.querySelectorAll('.bs-RemoveColumn').forEach(btn => {
            btn.addEventListener('click', this.stakeData)
        });
        //Remove all items
        const removeAllBtn = this.container.querySelector('.bs-Header_RemoveAllLink');
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', this.deleteStakes)
        }
        //Show&hide multipleContainer
        this.multipleContainer = this.container.querySelector('#bsMultipleContainer') || '';
        if (this.multipleContainer) {
            this.multiHeader();

            this.multipleContainer.querySelector('#bs-MultipleBets_Header').addEventListener('click', () => {
                this.multipleContainer.classList.toggle('closed');
                this.multiHeader()
            })
        }

        //Input standartBet
        this.stBetInput = [];
        this.container.querySelectorAll('.bs-Stake_TextBox').forEach(inp => {
            inp.addEventListener('input', this.userStake);
            inp.addEventListener('input', this.placeBetSum);
            inp.addEventListener('input', this.singleStClearVal);
            inp.addEventListener('change', this.addAllSeparators);
            inp.addEventListener('focus', this.inputSelectAll);
            this.stBetInput.push(inp)
        });
        //Singles input
        this.singleStake = document.querySelector('#mltsngstk');
        if (this.singleStake) {
            this.singleStake.addEventListener('input', this.singlesInputStake);
            this.singleStake.addEventListener('change', this.addAllSeparators);
            this.singleStake.addEventListener('change', this.placeBetSum);
            this.singleStake.addEventListener('focus', this.inputSelectAll);
        }
        //BetRow elements
        const stakes = this.container.querySelectorAll('.bs-MultipleBets_BetRow');
        this.multInputs = [];
        if (stakes) {
            stakes.forEach(el => {
                const elem = el.querySelector('.bs-MultipleBets_Stake');
                el.classList.contains('bs-MultipleBets_HighestAccumulator') ? this.hightAcamulatedInput(el, elem) : null

                elem.addEventListener('input', this.multiInputEv);
                elem.addEventListener('input', this.placeBetSum);
                elem.addEventListener('change', this.addAllSeparators);
                elem.addEventListener('focus', this.inputSelectAll);
                this.multInputs.push(elem);
            });
        }
        //placeBet button
        this.placeBet = this.container.querySelector('.bs-TotalStake');

        //accept changes
        const acceptBtn = this.container.querySelector('.acceptChanges');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', this.sendUpdateReq)
        }
    };

    checkUserPage = () => {
        const loc = window.location.hash.split('/')[1];
        if (loc === 'sports') {
            this.disabledQuickBet()
        }
    };

    disabledQuickBet = () => {
        const qbContainer = this.container.querySelector('.qb-Container');
        qbContainer.classList.add('disable');
        sessionStorage.setItem('qB', false);
        this.qB = false;
    };

    betslipLoaderShow = () => {
        this.container.classList.add('overlay');
    };

    betslipLoaderHide = () => {
        this.container.classList.remove('overlay');
    };

    init = (node, data) => {
        this.container = node;
        this.container.innerHTML = `
        <div class="betslip" id="bet_SlipContCont">
            <ul class="betSlip full-text" data-ub="0.00" data-txr="0,-1,0,1,1#" data-tcm="0" data-bsuis="0" data-xrte="1" data-xrte-us="1" data-stk-inc="0-0.2*0.2#0.2-250*1#250-500*5#500-1000*10#1000-2500*50#2500-5000*100#5000-10000*100#10000-25000*100#25000-50000*100#50000-99999999*100" data-stk-mlt-inc="0-0.1*0.1#0.1-250*1#250-500*5#500-1000*10#1000-2500*50#2500-5000*100#5000-10000*100#10000-25000*100#25000-50000*100#50000-99999999*100" data-isocode="USD" data-betguid="" data-cus="E" data-mod="0#0" data-restrictedmultiples="" data-minstake="0" data-equally-divided="False">
                <li class="bs-Header" data-text="The fastest way for placing single bets">
                <div class="bs-ChangeSlipTypeContainer">
                  <div class="bs-ItemOverlay"></div>
                  <div class="qb-Container">
                    <div class="qb-Btn">
                      <span class="qb-Btn_Text-quick">Quick Bet</span>
                      <span class="qb-Btn_Switch-false" id="quickBet"></span>
                    </div>
                  </div>
                  <div class="bs-BetSlipType qb-BetSlipType" data-text="Standard">
                    <div id="betSlipTypeSelection" class="bs-BetSlipType_Selection">
                      <div id="betSlipTypeSelectionText" class="bs-BetSlipType_SelectionText">Standard</div>
                    </div>
                    <div id="betSlipTypeOptions" class="bs-BetSlipType_Options bs-Dropdown hide">
                      <ul class="bs-Dropdown_Items">
                        <li class="bs-Dropdown_Item selected">
                          <div class="bs-Dropdown_ItemText" data-item="1" data-value="Standard">Standard</div>
                        </li>
                        <li class="bs-Dropdown_Item ">
                          <div class="bs-Dropdown_ItemText" data-item="2" data-value="Banker">Banker</div>
                        </li>
                      </ul>
                    </div>
                    <select class="bet-slip-type">
                      <option selected="selected" value="1">Standard</option>
                      <option value="2">Banker</option>
                    </select>
                  </div>
                </div>
                <div class="bs-Header_RemoveAll">
                  <div class="bs-ItemOverlay"></div>
                  <a class="bs-Header_RemoveAllLink" id="rmButton" style="display: none">Remove All</a>
                </div>
              </li>
                <li class="bs-StandardBet">
                <ul id="standartBet">
                </ul>
              </li>
                <li class="bs-MultipleBets">
                <div class="bs-ItemOverlay"></div>
                <ul class="closed" id="bsMultipleContainer"> <!--open-->
                  <li id="bs-MultipleBets_Header" class="bs-MultipleBets_Header">
                    <a class="mlthd bs-MbHeader_Link open">Show all multiples</a>
                  </li>
                  <li class="bs-MultipleBets_SubHeader">
                    <div class="bs-MultipleBets_SubHeaderContainer">
                      <span class="bs-MultipleBets_BettypeHeader">Bet Type</span>
                      <span class="bs-MultipleBets_StakeHeader">
                        <span class="bs-MultipleBets_StakeHeadertext">Unit Stake</span>
                      </span>
                      <span class="bs-MultipleBets_EwHeader"></span>
                    </div>
                  </li>
                  <li data-item-id="-1" data-item-type="multiple" class="bs-Item bs-MultipleBets_StakeRow">
                    <div class="bs-MultipleBets_StakeContainer">
                      <div class="bs-MultipleBets_StakeRowLabel">Singles</div>
                      <div class="bs-MultipleBets_StakeData">
                        <div class="bs-MultipleBets_BetCount">3x</div>
                        <input id="mltsngstk" data-nbm="true" class="stk bs-MultipleBets_Stake" type="text" placeholder="Stake">
                      </div>
                      <div class="bs-MultipleBets_EW"></div>
                    </div>
                  </li>
                  <li data-item-id="2" data-item-type="multiple" class="bs-Item bs-MultipleBets_BetRow " data-item-plbtid="0" data-item-isjako="0" data-item-leaguecode="" data-item-fpid="">
                    <div class="bs-MultipleBets_StakeContainer" data-1="1">
                      <div class="bs-MultipleBets_StakeRowLabel">
                        <a class="mltbrk bs-MultipleBets_StakeRowLink">Doubles</a>
                      </div>
                      <div class="bs-MultipleBets_StakeData">
                        <div class="bs-MultipleBets_BetCount">3x</div>
                        <div class="bs-MultipleBets_Stakeitem">
                          <input data-inp-type="mltstk" data-system="true" type="text" class="stk bs-MultipleBets_Stake" value="" placeholder="Stake">
                          <div class="bs-HideBetMaxMultiple"></div>
                        </div>
                      </div>
                      <div class="bs-MultipleBets_EW"></div>
                    </div>
                  </li>
                </ul>
              </li>
                  
             <li class="bs-Alert " data-closeonstakeedit="False" data-usnjminstake=""> <!--hide-->
                <div class="bs-Alert_Msg red">The line, odds or availability of your selections has changed.</div>
              </li>
                <li class="bs-Footer placebet">
                <div class="bs-ItemOverlay hide"></div>
                <span id="totalStake hide"></span>
                <a href="javascript:void(0);" class="acceptChanges bs-BtnWrapper hide">
                  <div class="bs-BtnAccept">Accept Changes</div>
                </a>
                <a class="placeBet bs-BtnWrapper" data-placebet="1" data-atype="plc">
                  <div class="bs-Btn bs-BtnHover">
                    <span class="bs-TotalStake totalStake">$00.00</span>
                    <span class="bs-BtnText">Place Bet</span>
                  </div> </a>
                <a class="updatingOdds bs-BtnWrapper hide">
                  <div class="bs-BtnAccept">Updating Odds
                  <span class="bs-BtnText_NoMessageSpinner"></span>
                  </div>
                </a>
              </li>
            </ul></div>
        `;

        console.log(this.container);
        const str = this.container.querySelector('script').innerText;

        formStrToObj(str);
        this.addListeners();
        this.toReturnValue();
        this.placeBetSum();
        this.checkUserPage();
        this.addClassQuickBtn();
        this.bsMessage();
        this.changleSlipContOption();

        qbC.transformBetToOddType();
    }
};

window.BetslipMethod = class BetslipMethod {
    constructor() {
        this.qB = JSON.parse(sessionStorage.getItem('qB')) || false;
        this.currencySymbol = config._config.CUSTOMER_CONFIG.CURRENCY_SYMBOL;
        this.stBetInput = [];
    }

    currencySymbolTemplate = () => {
        return `<span>${this.currencySymbol}</span>`
    };
    /*Betslip header*/
    quickBetChBoxEv = () => {
        if (this.singlesStake.length === 0) {
            this.enableQuickBet()
        } else {
            this.activateQbPopup()
        }
    };

    enableQuickBet = () => {
        if (this.qB) {
            sessionStorage.setItem('qB', false)
        } else {
            sessionStorage.setItem('qB', true)
        }
        this.qB = JSON.parse(sessionStorage.getItem('qB'));

        this.addClassQuickBtn();
        this.changleSlipContOption();
        this.bsMessage();
    };

    activateQbPopup = () => {
        const div = document.createElement('div');
        div.className = 'activate-qb'
        div.innerHTML = ` 
            <div class="activate-qb-inner">
                <span class="fa fa-times close-acQb"></span>
                <h2>Selection On Your Bet Slip </h2> 
                <h4> Your existing selections will need to be cleared to enable Quick Bet.</h4>
                <div class="activate-qb-buttons">
                    <button id="actQb-btn">Activate Quick Bet</button>
                    <button id="backTo-placeBet">Back to Place Bet</button>
                </div>
            </div>
           
        `

        div.querySelector('.close-acQb').addEventListener('click', this.removeQbPopup);
        div.querySelector('#actQb-btn').addEventListener('click', this.activateQbType);
        div.querySelector('#backTo-placeBet').addEventListener('click', this.removeQbPopup);

        document.body.appendChild(div)
    };

    activateQbType = (e) => {
        this.container.innerHTML = '';
        this.composeEmptyQupon();
        this.removeQbPopup(e);
        this.enableQuickBet()
    };

    removeQbPopup = (e) => {
        const parent = e.target.closest('.activate-qb');
        document.body.removeChild(parent);
    };

    addClassQuickBtn = () => {
        const btn = this.container.querySelector('.qb-Btn_Switch-false') || this.container.querySelector('.qb-Btn_Switch-true');

        if (this.qB) {
            btn.classList.add('qb-Btn_Switch-true');
            btn.classList.remove('qb-Btn_Switch-false')
        } else {
            btn.classList.add('qb-Btn_Switch-false');
            btn.classList.remove('qb-Btn_Switch-true')
        }

    };

    changleSlipContOption = () => {
        const bsType = this.container.querySelector('.bs-BetSlipType');
        const bsHelp = this.container.querySelector('.qb-Help_Wrapper-inactive');

        if (bsType && bsHelp) {
            if (this.qB) {
                bsType.classList.add('hide');
                bsHelp.classList.add('show');
            } else {
                bsType.classList.remove('hide');
                bsHelp.classList.remove('show');
            }
        }
    };

    bsMessage = () => {
        const enpMes = this.container.querySelector('.bs-EmptyMsg');
        const qbMes = this.container.querySelector('.qb-QuickBetMsg-inactive');

        if (enpMes && qbMes) {
            if (this.qB) {
                enpMes.classList.add('hide');
                qbMes.classList.add('show');
            } else {
                enpMes.classList.remove('hide');
                qbMes.classList.remove('show');
            }
        }
    };

    helpMenu = (e) => {
        const el = e.target.closest('.qb-Help_Wrapper-inactive');
        const hlMn = el.querySelector('.qb-Help-Menu');

        if (hlMn) {
            el.removeChild(hlMn)
        } else {
            const div = document.createElement('div');
            div.className = 'qb-Help-Menu';
            div.innerHTML = ` 
               <h1 class="help-menu-title">Quick Single Betting</h1>
               <ul class="help-menu-item-wrapper">
                    <li class="help-menu-item">Click a selection</li>
                    <li class="help-menu-item">Enter Stake</li>
                    <li class="help-menu-item">Press 'Place Bet'</li>               
                </ul>
            `
            el.appendChild(div)
        }
    };

    dropDownMenu = () => {
        const menu = this.container.querySelector('#betSlipTypeOptions');
        menu.classList.toggle('bs-Dropdown-show');
        menu.classList.toggle('bs-Dropdown');
    };

    dropDownItem = (e) => {
        const prnt = e.target.closest('.bs-Dropdown_Item ');
        const elem = prnt.querySelector('.bs-Dropdown_ItemText');

        this.activeOpt = elem.dataset.item;
        this.setSelectionVal();

        this.dropDownOptions.forEach(el => {
            el.classList.remove('selected');
        });

        prnt.classList.add('selected');

    };

    setSelectionVal = () => {
        this.container.querySelector('.bs-BetSlipType_SelectionText').innerText = this.activeOpt === '1' ? 'Standart' : 'Banker';
    };

    /*Betslip header*/

    multiHeader = (e) => {
        const container = e.target.closest('#bsMultipleContainer');

        container.querySelector('.bs-MultipleBets_SubHeader').classList.toggle('max-height-0')
        container.querySelectorAll('.bs-Item').forEach(el => {
            if (!el.classList.contains('bs-MultipleBets_HighestAccumulator')) {
                el.classList.toggle('max-height-0');
            }
        });
    };

    multiplicationBet = (stake, mtplc) => {
        return Number(stake) * transformBetAsFraction(mtplc)
    };

    addSeparatorToInputValue = (e, value) => {
        const newValue = addGroupSeparatorToStake(value);

        e.target ? e.target.value = newValue : e.value = newValue
    };

    userStake = (e) => {
        const prnt = e.target ? e.target.closest('.bs-Item') : e.closest('.bs-Item');
        const value = e.target ? cleanInputValue(e.target.value) : cleanInputValue(e.value);

        if (!prnt.classList.contains('suspended')) {
            const fi = prnt.dataset.itemFpid;
            const cf = prnt.querySelector('.bs-Odds').innerText;
            const stake = Number(value);
            const toRet = this.multiplicationBet(value, cf);
            const toRetWithSeparator = withAllSeparators(toRet);

            prnt.querySelector('.bs-StakeToReturn_Value')
                .innerHTML = `${toRetWithSeparator} ${this.currencySymbolTemplate()}`;
            this.addSeparatorToInputValue(e, value)
        }

    };

    addAllSeparators = (e) => {
        const value = e.target.value;
        e.target.value = withAllSeparators(value);
    };

    forSingleRow = (e) => {
        const value = e.target.value;
        this.singlesStake.forEach(item => {
            if (!item.classList.contains('suspended')) {
                item.querySelector('.bs-Stake_TextBox').value = withAllSeparators(value)
            }
        });
    };

    clearSingleMultiBet = () => {
        if (this.singleMultiBet) {
            this.singleMultiBet.value = ''
        }
    };

    multiInputEv = (e) => {
        const parent = e.target.closest('.bs-Item');
        parent.classList.contains('bs-MultipleBets_HighestAccumulator') ? this.hightAcamulatedInput(parent, e.target) : null

        const id = parent.dataset.itemId;
        const value = cleanInputValue(e.target.value);
        this.addSeparatorToInputValue(e, value)
    };

    hightAcamulatedInput = (node, input) => {
        const countNode = node.querySelector('.bs-MultipleBets_Odds');
        let count;
        if (countNode) {
            count = countNode.innerText
        }
        const returnNode = node.querySelector('.bs-MultipleBets_ToReturnValue');
        if (returnNode) {
            const stake = this.multiplicationBet(cleanInputValue(input.value), count);
            returnNode.innerHTML = ` ${this.currencySymbolTemplate()} ${withAllSeparators(stake)}`
        }

    };

    showRoReturnValue = (e) => {
        const parent = e.target.closest('.bs-Item');
        const inputValue = cleanInputValue(e.target.value);
        const returnContainer = parent.querySelector('.bs-MultipleBets_StakeToReturn');
        const count = parent.querySelector('.bs-MultipleBets_BetCount').innerText;
        const returnElem = parent.querySelector('.multiStake-tr');

        const returnValue = Number(inputValue) * Number(count.replace('x', ''));
        returnValue ? returnContainer.classList.remove('hide') : returnContainer.classList.add('hide');

        returnElem.innerHTML = `${withAllSeparators(returnValue)} ${this.currencySymbolTemplate()}`
    };

    placeBetSum = () => {
        if (this.placeBet) {
            const singlesSum = this.singlesStake.reduce((sum, el) => {
                const value = el.querySelector('.bs-Stake_TextBox').value;
                const cleanVal = cleanInputValue(value)
                return sum + Number(cleanVal)
            }, 0);
            const multipleSum = this.multiBets.reduce((sum, el) => {
                if (el.classList.contains('bs-MultipleBets_BetRows')) {
                    const value = el.querySelector('.bs-MultipleBets_Stake').value;
                    const cleanVal = cleanInputValue(value)
                    return sum + Number(cleanVal)
                }
                return sum + 0
            }, 0);

            const resultSum = singlesSum + multipleSum;
            this.placeBet.innerHTML = `${this.currencySymbolTemplate()} ${withAllSeparators(resultSum)}`
        }
    };

    //

    inputSelectAll = (e) => {
        const input = e.target;
        input.select();
    };

    betslipLoaderShow = () => {
        this.container.classList.add('overlay');
    };

    betslipLoaderHide = () => {
        this.container.classList.remove('overlay');
    };
};

window.BetslipNew = class BetslipNew extends BetslipMethod {
    constructor() {
        super()
        this.container;
        this.data;
        this.singlesStake = [];
        this.multiBets = [];
        this.singleMultiBet;
        this.placeBet;
    }

    betslipMainContainer = () => {
        const ul = document.createElement('ul');
        ul.className = 'betSlip full-text';

        return ul
    };

    betslipHeader = () => {
        const { bt } = this.data;
        const li = document.createElement('li');
        li.className = 'bs-Header bs-Header_Hide';
        li.innerHTML = `
            <div class="bs-ChangeSlipTypeContainer"> </div>
            ${bt && bt.length !== 0 ? this.templateHeaderRemove() : ''}
        `

        const headerContent = li.querySelector('.bs-ChangeSlipTypeContainer');
        headerContent.append(this.templateQbContainer());
        headerContent.append(this.templateBetslipType());
        headerContent.append(this.helpMenuTemplate());
        return li
    };

    templateHeaderRemove = () => {
        return `
            <div class="bs-Header_RemoveAll "> 
                <div class="bs-ItemOverlay"></div> 
                <a href="javascript:void(0);" class="bs-Header_RemoveAllLink">Remove All</a> 
            </div>
        `
    };

    templateQbContainer = () => {
        const div = document.createElement('div');
        div.className = 'qb-Container';
        div.innerHTML = ` 
                <div class="qb-Btn"> 
                    <span class="qb-Btn_Text-quick">Quick Bet</span> 
                    <span class="qb-Btn_Switch-false"></span> 
                </div> `;

        div.querySelector('.qb-Btn').addEventListener('click', this.quickBetChBoxEv)
        return div
    };

    templateBetslipType = () => {
        const div = document.createElement('div');
        div.className = 'bs-BetSlipType qb-BetSlipType';
        div.setAttribute('data-text', 'Standard');
        div.innerHTML = `
                <div id="betSlipTypeSelection" class="bs-BetSlipType_Selection"> 
                    <div id="betSlipTypeSelectionText" class="bs-BetSlipType_SelectionText">Standart</div> 
                </div> 
                <div id="betSlipTypeOptions" class="bs-BetSlipType_Options bs-Dropdown">   
                    <ul class="bs-Dropdown_Items">
                        <li class="bs-Dropdown_Item selected">
                            <div class="bs-Dropdown_ItemText" data-item="1">Standard</div>
                        </li>
                        <li class="bs-Dropdown_Item">
                            <div class="bs-Dropdown_ItemText" data-item="2">Banker</div>
                        </li>
                    </ul> 
                </div> 
                <select class="bet-slip-type">
                    <option selected="selected" value="1">Standard</option>
                    <option value="2">Banker</option>
                </select>`
        div.querySelector('#betSlipTypeSelection').addEventListener('click', this.dropDownMenu)
        this.dropDownOptions = div.querySelectorAll('.bs-Dropdown_Item');
        this.dropDownOptions.forEach(item => item.addEventListener('click', this.dropDownItem))

        return div
    };

    helpMenuTemplate = () => {
        const div = document.createElement('div');
        div.className = 'qb-Help_Wrapper-inactive';
        div.innerHTML = ` 
            <div class="qb-Help"> 
                <span class="qb-Help_Text">Help</span> 
            </div>`
        div.addEventListener('click', this.helpMenu)
        return div
    };

    templateForSingleSection = () => {
        const { bt } = this.data;
        const li = document.createElement('li');
        li.className = 'single-section bs-StandardBet';
        li.innerHTML = `
            <ul></ul>
        `
        const ul = li.querySelector('ul');

        bt.forEach(item => ul.append(this.templateForSingleStake(item)));

        return li;
    };

    templateForSingleStake = (item) => {
        const { fi, bt, mt, mr, pf, pt, oc, fd, od, su, st } = item;
        const tr = this.multiplicationBet(st, od);

        const li = document.createElement('li');
        li.className = `bs-Item bs-SingleItem 
                        ${su ? 'suspended' : ''} 
                        ${mr ? 'bs-RestrictedCong' : ''} 
                        ${oc ? 'oddsChange' : ''}`;
        li.setAttribute('data-item-fpid', fi);
        li.setAttribute('data-item-bt', bt);
        li.setAttribute('data-item-mt', mt);
        li.setAttribute('data-item-pf', pf);
        li.innerHTML = `
                <div class="bs-SelectionRow"> 
                    <div class="bs-RestrictedBet"></div> 
                    <div class="bs-RemoveColumn">
                        <a href="javascript:void(0);" class="bs-RemoveColumn_Button remove"></a>
                    </div> 
                    <div class="bs-Selection"> 
                        <div class="bs-Selection_Desc">${pt[0].bd}</div> 
                        <div class="bs-Selection_Details">${pt[0].md}</div>
                        <div class="bs-Selection_Details">${fd}</div> 
                    </div> 
                    <div class="bs-OddsContainer"> 
                        <div class="bs-Odds">${od}</div> 
                        <div class="oddsChangeHighlightWrapper"> 
                            <div class="oddsChangeHighlight"></div> 
                        </div> 
                    </div> 
                </div>
                <div class="bs-ItemOverlay"></div>
                <div class="stake bs-StakeData "> 
                    <div class="bs-StakeAndToReturnContainer"> 
                        <div class="bs-Stake"> 
                            <input 
                                data-inp-type="sngstk" 
                                type="text" 
                                class="stk bs-Stake_TextBox" 
                                value="${withAllSeparators(st || 0)}" 
                                placeholder="Stake"> 
                        </div> 
                        <div class="bs-StakeToReturn"> 
                            <div class="bs-StakeToReturn_Text">To Return</div> 
                            <span class="bs-StakeToReturn_Value ">${withAllSeparators(tr)}
                                ${this.currencySymbolTemplate()}
                            </span> 
                        </div> 
                        <div class="bs-StakeToReturnBreakDownContainer"> 
                            <a href="javascript:void(0);" 
                               class="sngbrk bs-StakeToReturnBreakDownLink bs-StakeToReturnBreakDownLink_Hidden">To Return</a> 
                        </div> 
                    </div> 
                    <div class="bs-HideBetMax"></div> 
                </div>`

        const input = li.querySelector('.bs-Stake_TextBox');

        input.addEventListener('focus', this.inputSelectAll);
        input.addEventListener('input', this.userStake);
        input.addEventListener('input', this.clearSingleMultiBet);
        input.addEventListener('input', this.placeBetSum);
        input.addEventListener('change', this.addAllSeparators);
        this.singlesStake.push(li);
        return li

        //mr = bs-RestrictedCong
        //     data-item-id="0"
        //     data-item-type="single"
        //     class="bs-Item bs-SingleItem oddsChange bs-RestrictedCong"
        //     data-item-plbtid="1778"
        //     data-item-isjako="0"
        //     data-item-leaguecode="NICARA YTH"
        //     data-item-exclusion="503015503"
        //     data-item-exclusion2="503015603"
        //     data-item-fpid="681237506"
        //     data-item-push="0"
        //     data-fixtureid="87499215">
    };

    templateEmptyMessage = () => {
        const li = document.createElement('li');
        li.className = 'bs-EmptyMsg';
        li.innerText = 'Click a price to add a selection'
        return li
    };

    templateQbMessage = () => {
        const li = document.createElement('li');
        li.className = 'qb-QuickBetMsg-inactive';
        li.innerHTML = `
            <span class="qb-QuickBetMsg_Text">Quick Bet is active. Place a bet to continue.</span> 
        `
        return li
    };

    templateMultiBets = () => {
        const { mo, dm } = this.data;
        const li = document.createElement('li');
        li.className = 'bs-MultipleBets';
        li.innerHTML = `
            <div class="bs-ItemOverlay"></div> 
            <ul class="" id="bsMultipleContainer"></ul>
        `
        const ul = li.querySelector('#bsMultipleContainer');
        ul.append(this.templateForMultibetsHeader());
        ul.append(this.templateForMultibetsSubHeader());
        mo ? mo.forEach(item => ul.append(this.templateForMultiBetsStake(item))) : null;
        dm ? ul.append(this.templateForMultiBetsStake(dm, true)) : null;
        ul.append(this.templateForMultiBoxError());

        return li
    };

    templateForMultibetsHeader = () => {
        const li = document.createElement('li');
        li.id = 'MultipleBets_Header'
        li.className = 'bs-MultipleBets_Header';
        li.innerHTML = `<a href="javascript:void(0);" 
                            class="mlthd bs-MbHeader_Link" 
                            id="mlthdr" 
                            data-stext="Show all multiples" 
                            data-htext="Hide all multiples">
                            Show all multiples
                        </a>`

        li.addEventListener('click', this.multiHeader)
        return li
    };

    templateForMultibetsSubHeader = () => {
        const li = document.createElement('li');
        li.className = 'bs-MultipleBets_SubHeader max-height-0';
        li.innerHTML = `
             <div class="bs-MultipleBets_SubHeaderContainer">
                <span class="bs-MultipleBets_BettypeHeader">Bet Type</span>
                <span class="bs-MultipleBets_StakeHeader">
                    <span class="bs-MultipleBets_StakeHeadertext">Unit Stake</span>
                </span>
                <span class="bs-MultipleBets_EwHeader"></span>
            </div>
        `
        return li
    };

    templateForMultiBetsStake = (item, hac = false) => {
        const { bt, bd, bc, st, rt, od } = item;
        const tr = st && bc ? st * bc : 0;
        const li = document.createElement('li');
        li.className = `bs-Item 
                        ${bd ? 'bs-MultipleBets_BetRows' : 'bs-MultipleBets_StakeRow'} 
                        ${hac ? 'bs-MultipleBets_HighestAccumulator' : 'max-height-0'}`;
        li.setAttribute('data-item-type', 'multiple');
        li.setAttribute('data-item-id', bt);
        li.innerHTML = `
             <div class="bs-MultipleBets_StakeContainer" data-1="1"> 
                <div class="bs-MultipleBets_StakeRowLabel"> 
                    <a href="javascript:void(0);" class="mltbrk bs-MultipleBets_StakeRowLink">${bd || 'Одиночные'}</a> 
                    ${hac ? this.templateMultiBetsReturnValue(st, rt, od) : ''}
                </div> 
                <div class="bs-MultipleBets_StakeData"> 
                     <div class="bs-MultipleBets_BetCount">${bc}x</div> 
                     <div class="bs-MultipleBets_Stakeitem"> 
                            <input 
                                data-inp-type="mltstk" 
                                data-system="true" 
                                type="text" 
                                class="stk bs-MultipleBets_Stake" 
                                value="" 
                                placeholder="Unit Stake"> 
                            <div class="bs-HideBetMaxMultiple"></div> 
                     </div> 
                 </div> 
                 <div class="bs-MultipleBets_EW"></div> 
            </div>
            <div class="bs-MultipleBets_StakeToReturn ${!bd && !hac && st ? '' : 'hide'}">
                To Return:
                <span class="multiStake-tr">${withAllSeparators(tr)} ${this.currencySymbolTemplate()}</span>
            </div> 
        `

        const input = li.querySelector('.bs-MultipleBets_Stake');

        if (li.classList.contains('bs-MultipleBets_StakeRow')) {
            this.singleMultiBet = input;
            this.singleMultiBet.addEventListener('input', this.forSingleRow);
        }

        if (li.classList.contains('bs-MultipleBets_BetRows') && !li.classList.contains('bs-MultipleBets_HighestAccumulator')) {
            input.addEventListener('input', this.showRoReturnValue)
        }

        input.addEventListener('focus', this.inputSelectAll);
        input.addEventListener('input', this.multiInputEv);
        input.addEventListener('input', this.placeBetSum);
        input.addEventListener('change', this.addAllSeparators);
        this.multiBets.push(li);
        return li
    };

    templateMultiBetsReturnValue = (st, rt, od) => {
        return `
            <span class="bs-MultipleBets_Odds">${od || 1}</span>
            <div class="bs-MultipleBets_ToReturn">
                To Return
                <span class="bs-MultipleBets_ToReturnValue"> 
                    <span>€</span> ${rt || 0.00}
                </span>
            </div>
        `
    };

    templateForMultiBoxError = () => {
        const li = document.createElement('li');
        li.className = 'bs-MultipleBets_Error hidden';
        li.innerHTML = `
            <div class="bs-MultipleBets_RestrictedBet"></div>
            <div class="bs-MultipleBets_RestrictedText">Multiple options are restricted for the highlighted selections</div>
        `
        return li
    };

    templateAlertMessage = () => {
        const li = document.createElement('li');
        li.className = 'bs-Alert';
        li.innerHTML = `
            <div class="bs-Alert_Msg"></div>
        `
        return li
    };

    templateForFooter = () => {
        const { mi } = this.data;

        const li = document.createElement('li');
        li.className = 'bs-Footer';
        li.innerHTML = `
            <div class="bs-ItemOverlay"></div> 
            <span id="totalStake"></span> 
            <a href="javascript:void(0);" class="acceptChanges bs-BtnWrapper ${!mi && 'hidden'}"> 
                <div class="bs-BtnAccept">Accept Changes</div>
            </a> 
            <a href="javascript:void(0);" class="placeBet bs-BtnWrapper ${mi && 'hidden'} "data-placebet="1" data-atype="plc"> 
                <div class="bs-Btn bs-BtnHover"> 
                    <span class="bs-TotalStake totalStake"></span> 
                    <span class="bs-BtnText">Place Bet</span> 
                </div> 
            </a> 
            <a href="javascript:void(0);" class="bs-BtnWrapper  updatingOdds hidden"> 
                <div class="bs-BtnAccept">Updating Odds
                    <span class="bs-BtnText_NoMessageSpinner"></span> 
                </div> 
            </a> 
        `
        this.placeBet = li.querySelector('.bs-TotalStake');
        return li
    };

    composeBetslipQupon = () => {
        const container = this.betslipMainContainer();

        container.append(this.betslipHeader());
        container.append(this.templateForSingleSection());
        container.append(this.templateMultiBets());
        container.append(this.templateAlertMessage());
        container.append(this.templateForFooter());

        this.container.append(container);

    };

    composeEmptyQupon = () => {
        const container = this.betslipMainContainer();
        container.append(this.betslipHeader());
        container.append(this.templateEmptyMessage());
        container.append(this.templateQbMessage());
        container.append(this.templateAlertMessage());

        this.container.append(container);
    };

    init = (node, res) => {
        this.container = node;
        node.innerHTML = '';
        this.data = res;

        if (res.bt && res.bt.length !== 0) {
            this.composeBetslipQupon()
        } else {
            this.composeEmptyQupon()
        }

    };
};

window.MyBetsRight = class MyBetsRight {
    constructor() {
        this.container = '';
        this.betsContent = '';
        this.links = [];
    }

    myBetsItemTemplate = () => {
        this.container.innerHTML = `
            <div class="myBets-navLinks">
                <a class="myBets-link font white active" data-name="cashOut">Cash Out</a>
                <a class="myBets-link font white" data-name="live">Live</a>
                <a class="myBets-link font white" data-name="unsettled">Unsettled</a>
                <a class="myBets-link font white" data-name="settled">Settled</a>
                <a class="myBets-link font white" data-name="all">All</a>
              </div>
              <div class="myBets-body">
                  <div class="myBets-item">
                      <div class="myBets-item-header">
                        <div class="myBets-item-header-left">
                          <span>$ 0.40</span>
                          <span>Single</span>
                        </div>
                        <div class="myBets-item-header-right">
                          <button class="edit-bet">Edit Bet</button>
                        </div>
                      </div>
                      <div class="myBets-item-body">
                        <div class="myBets-item-body-left">
                          <div class="item-betResult">U23 Braga</div>
                          <div class="item-betKind">Fulltime Result</div>
                          <div class="item-betInfo">
                            <span class="item-betInfo-commands">Braga U23 v Estoni U23</span>
                            <span class="item-betInfo-result">0-1</span>
                            <span class="item-betInfo-time">23:20</span>
                          </div>
                        </div>
                        <div class="myBets-item-body-right">
                          <span class="item-bet-koef">1.71</span>
                        </div>
                      </div>
                      <div class="myBets-item-body-bottom">
                        <button class="sport-icon soccer"></button>
                      </div>
                      <div class="myBets-item-footer">
                        <div class="item-stake">To Stake <br> $0.40</div>
                        <div class="item-toReturn">To Return <br> $0.60</div>
                        <div class="item-CashOut">
                          <button class="CashOut-Btn">Cash Out $0.37</button>
                        </div>
                      </div>
                    </div>
                </div>`

        this.container.querySelectorAll('.myBets-link').forEach(a => {
            this.links.push(a);
            a.addEventListener('click', this.loadMyBetsContent)
        });

        this.betsContent = this.container.querySelector('.myBets-body');
    };

    templateForCashOut = () => {
        this.betsContent.innerHTML = `
                 <div class="myBets-item">
                  <div class="myBets-item-header">
                    <div class="myBets-item-header-left">
                      <span>$ 0.40</span>
                      <span>Single</span>
                    </div>
                    <div class="myBets-item-header-right">
                      <button class="edit-bet">Edit Bet</button>
                    </div>
                  </div>
                  <div class="myBets-item-body">
                    <div class="myBets-item-body-left">
                      <div class="item-betResult">U23 Braga</div>
                      <div class="item-betKind">Fulltime Result</div>
                      <div class="item-betInfo">
                        <span class="item-betInfo-commands">Braga U23 v Estoni U23</span>
                        <span class="item-betInfo-result">0-1</span>
                        <span class="item-betInfo-time">23:20</span>
                      </div>
                    </div>
                    <div class="myBets-item-body-right">
                      <span class="item-bet-koef">1.71</span>
                    </div>
                  </div>
                  <div class="myBets-item-body-bottom">
                    <button class="sport-icon soccer"></button>
                  </div>
                  <div class="myBets-item-footer">
                    <div class="item-stake">To Stake <br> $0.40</div>
                    <div class="item-toReturn">To Return <br> $0.60</div>
                    <div class="item-CashOut">
                      <button class="CashOut-Btn">Cash Out $0.37</button>
                    </div>
                  </div>
                </div>
                
        `
    };

    templateForLive = () => {
        this.betsContent.innerHTML = `
            <div class="myBets-body-defaultItem">
                <p>You are no bets Live Now</p>
                <p>Any of your In-Play can be viewed here</p>
            </div>
        `
    };

    templateForUnsettled = () => {
        this.betsContent.innerHTML = `
            <div class="myBets-body-defaultItem">
                <p>There are no unsettled bets</p>
                <p>Any of your Unsettled bets will appear here</p>
            </div>
        `
    };

    templateForSettled = () => {
        this.betsContent.innerHTML = `
            <div class="myBets-body-defaultItem">
                <p>There are no settled bets</p>
                <p>Settled bets appear here for 24 hours</p>
            </div>
        `
    };

    templateForAll = () => {
        this.betsContent.innerHTML = `
            <div class="myBets-body-defaultItem">
                <p>You have no bets</p>
                <p>Come back to Edit, Cash Out or find out your most recent bets</p>
            </div>
        `
    };

    loadMyBetsContent = (e) => {
        let name = e.target.dataset.name;

        if (name === 'cashOut') {
            this.templateForCashOut()
        } else if (name === 'live') {
            this.templateForLive()
        } else if (name === 'unsettled') {
            this.templateForUnsettled()
        } else if (name === 'settled') {
            this.templateForSettled()
        } else if (name === 'all') {
            this.templateForAll()
        }

        this.markAsActive(e)
    };

    markAsActive = (e) => {
        this.links.map(a => a.classList.remove('active'));
        e.target.classList.add('active')
    };

    init = (node) => {
        this.container = node;
        this.myBetsItemTemplate()
    };
};

window.RightContentColumn = class RightContentColumn {
    constructor() {
        this.container = '';
        this.linksContainer = '';
        this.links = [];
        this.currentLink = 'betslip';
    }

    markAsActive = (e) => {
        this.links.map(item => item.classList.remove('active'));
        e.target.classList.add('active');
    };

    addLinksToContainer = () => {
        this.linksContainer.innerHTML = `
            <a class="tab__link active font" data-name="betslip">Betslip</a>
            <a class="tab__link font" data-name="my_bets">My Bets</a>
        `

        this.linksContainer.querySelectorAll('.tab__link').forEach(a => {
            this.links.push(a);
            a.addEventListener('click', this.loadCurrentContent);
        });
    };

    addBetslipLink = () => {
        this.linksContainer.innerHTML = `
            <a class="tab__link active font" data-name="betslip">Betslip</a>
           `
    };

    loadCurrentContent = (e) => {
        this.currentLink = e.target.dataset.name;
        this.markAsActive(e);
        this.loadTemplate();
    };

    loadTemplate = () => {
        if (this.currentLink === 'betslip') {
            console.log("Loading Betslip");
            console.log(sessionStorage.getItem('bt'));
            fetch('http://bestline.bet/betslip/?refreshslip', {
                method: 'POST',
                body: sessionStorage.getItem('bt') || {}
            })
                .then(res => {
                    const responseType = res.headers.get('Content-Type');
                    return responseType.includes('text') ? res.text() : res.json()

                })
                .then(res => {
                    if (typeof res === 'object' && res) {
                        betslipNew.init(this.container, res)
                    } else {
                        betslip.init(this.container, res)
                    }
                })
                .catch(err => console.log(err))
        } else {
            myBets_right.init(this.container);
            console.log("Loading myBets");
        }
    };

    init = () => {
        this.container = document.getElementById('betslipContent');
        this.linksContainer = document.getElementById('betslip_tabs_container');

        config._config.CUSTOMER_CONFIG.LOGGED_IN ? this.addLinksToContainer() : this.addBetslipLink();
        this.loadTemplate();
    }
};

window.betslip = new Betslip();
window.betslipNew = new BetslipNew();
window.myBets_right = new MyBetsRight();
window.rightContent = new RightContentColumn();
rightContent.init();
