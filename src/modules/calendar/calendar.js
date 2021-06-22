window.Calendar = class Calendar {
        constructor(){
            this.container='';
            this.sliderWrapper = '';
            this.leftMenu = '';
            this.rightMenu = '';
            this.leftCheckedItem = '';
            this.righCheckedItem = '';
            this.lefMeIt;
            this.count = 0;
            this.data = {};
            this.activeHIT = '0_2';
            this.activeDay = '';
            this.itemsUl;
        }

        templateForCalendarHeader =()=> {
            const div = document.createElement('div');
            const { sports } = this.data;
            div.className = 'calendar-header';
            div.innerHTML = ` <button class="calendar-header-button" id="prev"></button>
                                <ul class="calendar-header-inner" id="sliderWrapper">
                                    <li class="calendar-header-item active" data-id="0_2">All sports</li>
                                    ${Object.keys(sports).map(key => `<li class="calendar-header-item" data-id="${sports[key].ID}">${key}</li>`).join('')}
                                </ul>
                               <button class="calendar-header-button" id="next"></button>`

            this.sliderWrapper = div.querySelector('#sliderWrapper');
            div.querySelector('#prev').addEventListener('click', this.slideToBack);
            div.querySelector('#next').addEventListener('click', this.slideToNext);
            div.querySelectorAll('.calendar-header-item').forEach(el => {
               el.addEventListener('click', this.sortBySport)
            });
            return div
        };

        templateForCalendarMenu =()=> {
            const { days } = this.data;
            this.activeDay = Object.keys(days)[0];
            const firstDayDate = days[this.activeDay].DD;

            const div = document.createElement('div');
            div.className = 'calendar-menu';
            div.innerHTML = `<div class="left-menu">
                                <div class="checked-item" id="leftDropMenu">${this.activeDay} ${firstDayDate}</div>
                                <ul class="left-menu-inner hide" id="leftMenu">
                                    ${Object.keys(days).map(key => {
                                        const day = days[key];
                                        return `<li class="left-menu-item" data-na="${day.NA}" data-dd="${day.DD}"">${day.NA} ${day.DD}</li>`
                                    }).join('')}
                                </ul>
                            </div>
                            <div class="right-menu">
                                <div class="right-menu-watch"></div>
                                <div class="right-menu-volume">
                                    <span class="fa fa-volume-up" ></span>
                                </div>
                                <div class="right-menu-time">Time</div>
                                <div class="right-menu-channel">
                                    <span id="rightDropMenu">Channel</span>
                                    <ul class="channel-inner hide" id="rightMenu">
                                        <li class="channel-item active">All</li>
                                        <li class="channel-item">Live</li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;

            this.leftCheckedItem = div.querySelector('#leftDropMenu');
            this.leftCheckedItem.addEventListener('click', this.showLeftMenu);

            this.righCheckedItem = div.querySelector('#rightDropMenu');
            this.righCheckedItem.addEventListener('click', this.showRightMenu)

            this.leftMenu = div.querySelector('#leftMenu');
            this.rightMenu = div.querySelector('#rightMenu');

            this.lefMeIt = div.querySelectorAll('.left-menu-item');
            this.lefMeIt.forEach(item => {
               item.addEventListener('click', this.sortByDay)
            });

            div.querySelector('.left-menu').addEventListener('mouseleave', this.closeLeftMenu);
            div.querySelector('.right-menu-channel').addEventListener('mouseleave', this.closeRightMenu);

            return div
        };

        templateForCalendarMain =(arr)=> {
            if ( this.itemsUl){
                this.itemsUl.innerHTML = '';
            } else {
                this.itemsUl = document.createElement('ul');
                this.itemsUl.id = 'evsContainer'
            }

            this.itemsUl.innerHTML = ` <div class="calendar-main">
                    <ul class="calendar-main-inner">
                        ${this.templateForCalendarItem(arr || this.data.events)}
                     </ul>
                </div>`

            return  this.itemsUl;
        };

        templateForCalendarItem =(arr)=> {
            return arr.map(el => {
                const {CL, NA, CN, SM} = el;
                return `<li class="calendar-main-item">
                    <div class="calendar-main-item-info">
                        <div class="sport-cl">${CL}</div>
                        <div class="sport-ev">${NA}</div>
                    </div>
                    <div class="calendar-main-item-options">
                        <div class="sport-watch off"></div>
                        <div class="sport-volume">
                            <span class="fa fa-volume-up off"></span>
                        </div>
                        <div class="sport-time">${SM}</div>
                        <div class="sport-channel">${CN}</div>
                    </div>
                </li>`
            }).join('')
        };

        templateForSingleSportCalendar =(arr)=> {
           return `<div class="calendar-main">
                    <ul class="calendar-main-inner">
                        ${ arr.map(item => {
                                const {NA, SM, CN } = item;
                                return `
                                <li class="calendar-main-item">
                                    <div class="calendar-main-item-info">
                                        <div class="sport-ev">${NA}</div>
                                    </div>
                                    <div class="calendar-main-item-options">
                                        <div class="sport-watch off"></div>
                                        <div class="sport-volume">
                                            <span class="fa fa-volume-up off"></span>
                                        </div>
                                        <div class="sport-time">${SM}</div>
                                        <div class="sport-channel">${CN}</div>
                                    </div>
                                </li>
                            `
                            }).join('') }
                     </ul>
                </div>`
        };

        emptyEventsDate =()=> {
            this.itemsUl.innerHTML = `
                <p class="empty-calendar-mess">
                    Sorry, there no evenys available <br>
                    for yor chosen sport on this date
                </p>
            `
        };

        slideToBack =()=> {
            if (!this.count <= 0){
                if (this.count - 150 > 0){
                    this.count -= 150;
                    this.sliderWrapper.scrollTo({
                        top:0,
                        left:this.count,
                        behavior:'smooth'
                    })
                } else {
                    this.count = 0;
                    this.sliderWrapper.scrollTo({
                        top:0,
                        left:this.count,
                        behavior:'smooth'
                    })
                }

            }
        };

        slideToNext =()=> {
            const nd = this.sliderWrapper;
            const scrWidth = nd.scrollWidth - nd.clientWidth;

            if(scrWidth){
                if (this.count+150 > scrWidth) {
                    this.count=scrWidth;
                    this.sliderWrapper.scrollTo({
                        top:0,
                        left:this.count,
                        behavior:'smooth'
                    })
                }else {
                    this.count += 150
                    this.sliderWrapper.scrollTo({
                        top:0,
                        left:this.count,
                        behavior:'smooth'
                    })
                }
            }

        };

        showLeftMenu =()=> {
            this.leftMenu.classList.toggle('hide');
        };

        showRightMenu =()=> {
            this.rightMenu.classList.toggle('hide');
        };

        closeLeftMenu =()=> {
            this.leftMenu.classList.add('hide');
        };

        closeRightMenu =()=> {
            this.rightMenu.classList.add('hide');
        };

        currentSportsEvents =()=> {
            const { days } = this.data;
            const arr = [];

            Object.keys(days).map(key => {
                if (key === this.activeDay){
                    days[key].EV.map(ev => {
                        if (ev.CI === this.activeHIT) {
                            arr.push(ev)
                        }
                    });
                }
            });

            if (this.activeHIT === '0_2') {
                const dayEv = this.data.days[this.activeDay].EV;
                this.templateForCalendarMain(dayEv);
                return;
            }

            if (this.activeHIT !== '0_2' && arr.length === 0){
                this.emptyEventsDate();
                return;
            }

            this.itemsUl.innerHTML = this.templateForSingleSportCalendar(arr)
        };

        sortBySport =(e)=> {
            this.activeHIT = e.target.dataset.id;
            this.currentSportsEvents()
            this.sliderWrapper.querySelectorAll('.calendar-header-item').forEach(el => {
               el.classList.remove('active')
            });
            e.target.classList.add('active')
        };

        sortByDay =(e)=> {
            const elem = e.target;
            this.lefMeIt.forEach(el => el.classList.remove('active'));
            this.leftMenu.classList.add('hide');
            elem.classList.add('active');

            this.activeDay = elem.dataset.na;
            this.leftCheckedItem.innerText = `${this.activeDay} ${elem.dataset.dd}`;
            this.currentSportsEvents()
        };

        loadPage =()=> {
            fetch('http://bestline.bet/schedule/')
                .then(res => res.json())
                .then(res => this.transformData(res))
                .then(res => loader.loaderOff())
                .catch(err => console.log(err))
        };

        transformData =(data)=> {
            let CS;
            let CL;
            this.data.events = [];

            data.map(item => {
                if (item.type === 'CS'){
                    if (item.ID === '0'){
                        CS = {};
                        this.data.sports = CS;
                    }
                    if (item.ID === 'D1'){
                        CS = {};
                        this.data.days = CS
                    }
                }

                if (item.type === 'CL'){
                    item.EV = [];
                    CS[item.NA] = item;
                    CL = item;
                }

                if (item.type === 'EV'){
                    CL.EV.push(item);
                    this.data.sports[item.CL].EV.push(item);
                    this.data.events.push(item)
                }
            });

            this.drawData()
        };

        drawData =()=> {
            const div = document.createElement('div');
            div.className = 'calendar_container';
            div.appendChild(this.templateForCalendarHeader());
            div.appendChild(this.templateForCalendarMenu());
            div.appendChild(this.templateForCalendarMain());

            this.container.appendChild(div)
        };

        init =()=> {
            loader.loaderOn();
            this.container = document.getElementById('contentCenter');
            this.loadPage()
        }
    };

window.calendar = new Calendar();
calendar.init();
