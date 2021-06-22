window.QbCupon = class QbCupon {
    constructor(y, x, button) {
        this.x = x;
        this.y = y;
        this.button = button;
        this.div = null;
    }

    render = (x, y) => {
        const div = document.createElement('div');
        div.className = 'qb-Cupon'
        div.style.top = `${x}px`;
        div.style.left = `${y}px`;
        div.innerHTML = `
            <div class="qb-QuickBetMessageHeader hide ">
                <div class="qb-QuickBetMessageHeader_Message "></div>
                <div class="qb-QuickBetMessageHeader_Close "></div>
            </div>
            <div class="qb-QuickBetSelection ">
                <div class="qb-QuickBetSelection_Close fa fa-times "></div>
                <div class="qb-QuickBetSelection_Row ">
                    <div class="qb-QuickBetSelection_Selection ">Draw</div>
                    <div class="qb-QuickBetSelection_Handicap qb-QuickBetSelection_Handicap-empty "></div>
                    <div class="qb-QuickBetSelection_OddsAt ">@</div>
                    <div class="qb-QuickBetSelection_Oddscontainer ">
                        <div class="qb-QuickBetSelection_Odds ">9.00</div>
                    </div>
                </div>
                <div class="qb-QuickBetSelection_BetTypeContainer ">
                    <div class="qb-QuickBetSelection_BetType ">Fulltime Result</div>
                </div>
                <div class="qb-QuickBetSelection_Fixture ">AR Guelma Women v CF Akbou Women</div>
            </div>
            <div class="qb-QuickBetUseBetCredits hide ">
                <div class="qb-QuickBetUseBetCredits_CheckBoxWrapper ">
                    <div class="qb-QuickBetUseBetCredits_CheckBox "></div>
                </div>
                <div class="qb-QuickBetUseBetCredits_TextWrapper ">
                    <div class="qb-QuickBetUseBetCredits_Text "></div>
                </div>
            </div>
            <div class="qb-QuickBetStake ">
                <div class="qb-QuickBetStake_BumperLine ">
                    <div class="qb-QuickBetStake_StakeLine ">
                        <div class="qb-QuickBetStake_Button ">-</div>
                        <input type="text" class="qb-QuickBetStake_InputField ">
                        <div class="qb-QuickBetStake_Button ">+</div>
                    </div>
                    <div class="qb-QuickBetStake_Bumpers ">
                        <div class="qb-QuickBetStake_BumperButton ">+5</div>
                        <div class="qb-QuickBetStake_BumperButton ">+10</div>
                        <div class="qb-QuickBetStake_BumperButton ">+50</div>
                    </div>
                </div>
            </div>
            <div class="qb-QuickBetBetCreditsMessage hide ">
                <div class="qb-QuickBetBetCreditsMessage_Container ">
                    <div class="qb-QuickBetBetCreditsMessage_CreditMessage "></div>
                </div>
                <div class="qb-QuickBetBetCreditsMessage_ReturnsMessage "></div>
            </div>
            <div class="qb-QuickBetFooter ">
                <div class="qb-QuickBetFooter_Button ">
                    <div class="qb-QuickBetFooter_PlaceButtonContent ">
                        <div class="qb-QuickBetFooter_Stake ">$80.00</div>
                        <div class="qb-QuickBetFooter_PlaceText ">Place Bet</div>
                        <div class="qb-QuickBetFooter_ToReturnWrapper ">
                            <span class="qb-QuickBetFooter_ToReturnLabel ">To Return</span>
                            <span class="qb-QuickBetFooter_NetReturnLabel hide ">Net Return</span>
                            <span class="qb-QuickBetFooter_ToReturnAmount ">720.00</span>
                        </div>
                    </div>
                    <div class="qb-QuickBetFooter_AcceptButtonContent hide ">
                        <div class="qb-QuickBetFooter_AcceptText ">Accept &amp; Place Bet</div>
                    </div>
                    <div class="qb-QuickBetFooter_PlacingButtonContent hide ">
                        <div class="qb-QuickBetFooter_PlacingText ">Processing</div>
                    </div><!---->
                </div>
            </div>
        `
        div.querySelector('.qb-QuickBetSelection_Close').addEventListener('click', this.removeCupon)
        return div
    };

    saveDiv = (div) => {
        document.body.appendChild(div);
        this.div = div;
        this.button.classList.add('on');
    };

    removeCupon = () => {
        qbC.qbCupon = null;
        document.body.removeChild(this.div);
        this.button.classList.remove('on');
    };

    init = () => {
        this.saveDiv(this.render(this.x, this.y));
    };
};

window.QbCuponMethod = class QbCuponMethod {
    constructor() {
        this.qbCupon = null;
    }

    buttonData = (btn, e) => {
        const id = btn.dataset.id;
        let betslip = document.getElementById('standartBet');
        //betslip.innerHTML = '<div</div>';
        let content = betslip.outerHTML;
        let contentArray = Array.from(content);
        let sliced = contentArray.slice(24, contentArray.length - 5);
        betslip.innerHTML = sliced.join("") + this.formHTMLString(btn);

        /*<ul id="standartBet"><ul id="standartBet"></ul>*/

        //const data = JSON.parse(sessionStorage.getItem('bt'));
        //const qBStake = JSON.parse(sessionStorage.getItem('qB'));

        /*if (qBStake) {
            const left = e.pageX;
            const top = e.pageY;
            console.log(left);
            console.log(top);
            this.createQbCupon(left, top, btn);
        } else {
            this.checkStake(data, btn, id)
        }*/
    };

    formHTMLString = (btn) => {
        let name = btn.childNodes[0].textContent;
        let coef = btn.childNodes[2].textContent;

        let title = name == "Draw" ? "Draw" : "Fulltime Result"

        let elemString =
            `
        <li id="` + name + coef + `" data-item-id="0" data-item-type="single" class="bs-Item bs-SingleItem " data-item-plbtid="1777" data-item-isjako="0" data-item-leaguecode="ALG-WOMLEAGUE" data-item-exclusion="502971509" data-item-exclusion2="502971609" data-item-fpid="569130428" data-item-push="0" data-fixtureid="86091300">
                    <div class="bs-SelectionRow">
                      <div class="bs-RestrictedBet"></div>         
                      <div class="bs-RemoveColumn">
                        <a href="javascript:void(0);" class="bs-RemoveColumn_Button remove"></a>
                      </div>
                      <div class="bs-Selection">
                        <div class="bs-Selection_Desc">`+ title + `</div>
                        <div class="bs-Selection_Details">` + name + `</div>
                      </div>
                      <div class="bs-OddsContainer">
                        <div class="bs-Odds">` + coef + `</div>
                        <div class="oddsChangeHighlightWrapper">
                          <div class="oddsChangeHighlight"></div>
                        </div>
                      </div>
                    </div>
                    <div class="bs-ItemOverlay">
                    </div>
                    <div class="stake bs-StakeData ">
                      <div class="bs-StakeAndToReturnContainer">
                        <div class="bs-Stake">
                          <input data-inp-type="sngstk" type="text" class="stk bs-Stake_TextBox" value="" placeholder="Stake"> </div>
                        <div class="bs-StakeToReturn">
                          <div class="bs-StakeToReturn_Text">To Return</div>
                          <span class="bs-StakeToReturn_Value ">0.00</span>
                        </div>
                        <div class="bs-StakeToReturnBreakDownContainer">
                          <a href="javascript:void(0);" class="sngbrk bs-StakeToReturnBreakDownLink bs-StakeToReturnBreakDownLink_Hidden">To Return</a>
                        </div>
                      </div>
                      <div class="bs-HideBetMax"></div>
                    </div>
                  </li>
        `
        return elemString;
    }

    checkStake = (data, btn, id) => {
        //console.log("Clicked bet")
        const checking = data.ns ? data.ns.includes(id) : false;
        checking ? this.removeStake(data, id) : this.addStake(btn);
    };

    /*Add Stake To Betslip*/
    addStake = (btn) => {
        const fi = btn.dataset.fi;
        const sprID = btn.dataset.sportId;
        const id = btn.dataset.id;
        const od = btn.dataset.od;

        this.addToStorage(fi, sprID, id, od);
        this.addReq()
    };

    addToStorage = (fi, sprID, id, od) => {
        const reqStr = `pt=N#o=${od}#f=${fi}#fp=${id}#so=0#c=${sprID}#id=${fi}-${id}Y#|TP=BS${fi}-${id}#||`;
        const storDat = JSON.parse(sessionStorage.getItem('bt'));

        if (storDat) {
            storDat.ns = storDat.ns ? storDat.ns += reqStr : storDat.ns = reqStr;
            this.setSesStorage(storDat)
        }
    };

    addReq = () => {
        betslip.betslipLoaderShow();
        fetch('http://bestline.bet/betslip/refreshslip', {
            method: "POST",
            body: sessionStorage.getItem('bt')
        })
            .then(res => res.text())
            .then(res => {
                betslip.container.innerHTML = res;
                formStrToObj(betslip.container.querySelector('script').innerText);
                betslip.betslipLoaderHide();
                betslip.checkUserPage();
                this.transformBetToOddType()
            })
            .then(res => {
                this.searchActiveButton();
                this.addCurrencySymbol();
                betslip.addListeners();
                betslip.addClassQuickBtn();
            })
            .catch(err => console.log('addBetsItem', console.log(err)))
    };

    /*Remove Stake*/
    removeStake = (data, id) => {
        data.ns.split('||').map(el => {
            if (el.includes(id)) {
                const nwd = data.ns.replace(`${el}||`, '');
                data.ns = nwd;
                this.setSesStorage(data)
            }
        });
        this.deleteReq();
    };

    deleteReq = () => {
        betslip.betslipLoaderShow();
        fetch('https://www.bestline.bet/betslip/?refreshslip', {
            method: "POST",
            body: sessionStorage.getItem('bt')
        })
            .then(res => res.text())
            .then(res => {
                betslip.container.innerHTML = res;
                const str = betslip.container.querySelector('script').innerText;

                formStrToObj(str);
                betslip.checkUserPage();
                betslip.betslipLoaderHide()
                this.transformBetToOddType()
            })
            .then(res => {
                this.searchActiveButton();
                betslip.addListeners();
                betslip.addClassQuickBtn();
            })
            .catch(err => console.log('delete req', err))

    };

    deleteAllItems = () => {
        betslip.betslipLoaderShow()
        return fetch('https://www.bestline.bet/betslip/?refreshslip', {
            method: "POST",
            body: {}
        })
            .then(res => res.text())
            .then(res => {
                betslip.container.innerHTML = res;
                const str = betslip.container.querySelector('script').innerText;
                formStrToObj(str);
                betslip.checkUserPage();
                betslip.betslipLoaderHide()
            })
            .then(res => {
                this.unactiveAllActiveBtn();
                betslip.addListeners();
                betslip.addClassQuickBtn();
                betslip.bsMessage();
            })
            .catch(err => console.log('Delete All Items Request', err))
    };

    /*Quick Bet Cupon*/
    createQbCupon = (left, top, btn) => {
        if (this.qbCupon) {
            this.qbCupon.removeCupon()
        }
        this.qbCupon = new QbCupon(left, top, btn);
        this.qbCupon.init();
    };

    /*Another Function*/

    transformBetToOddType = () => {
        const { ODDS_TYPE: od } = config._config.CUSTOMER_CONFIG;
        betslip.container.querySelectorAll('.bs-Odds')
            .forEach(item => {
                const coef = item.innerText;
                item.innerText = transformBet(coef)
            });
    };

    setSesStorage = (data) => {
        sessionStorage.setItem('bt', JSON.stringify(data));
    };

    searchActiveButton = () => {
        const data = JSON.parse(sessionStorage.getItem('bt'));
        if (data && data.ns) {
            const fpArr = data.ns.match(/fp=\d*/g);
            const btn = document.querySelectorAll('.coef_item');

            if (btn && fpArr) {
                btn.forEach(el => {
                    el.classList.remove('on')
                    fpArr.map(id => {
                        id = id.replace('fp=', '')
                        if (el.dataset.id === id) {
                            el.classList.add('on')
                        }
                    });
                });
            }
        } else {
            this.unactiveAllActiveBtn()
        }
    };

    unactiveAllActiveBtn = () => {
        const btn = document.querySelectorAll('.coef_item');
        btn.forEach(el => {
            el.classList.remove('on')
        });
    };

    addCurrencySymbol = () => {
        betslip.container.querySelectorAll('.bs-StakeToReturn_Value')
            .forEach(item => item.innerHTML += ` ${betslip.currencySymbolTemplate()}`)
    };
};

window.qbC = new QbCuponMethod();

