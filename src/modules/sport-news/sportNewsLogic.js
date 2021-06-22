import { getRequest, getRequestWithLoader, getRequestWithoutCredentials } from '../../helpers/utils'
import { links } from '../../links/links'
import { SportsNewsItemTemplate } from "./sportsNewsItemTemplate";
import news1 from "../../img/news/news_1.png";

export class SportNewsLogic {
    constructor () {
        this.data = null;
        this.newsItems = [];
        this.SoccerLeagues = null;
        this.leagues = [];

        this.SoccerEvents = [];
    }

    getLeagues = async () => {
        try {
            this.SoccerLeagues[0].categories.forEach(cat => {
                cat.leagues.forEach(league => {
                    this.leagues.push(league);
                })
            })
        } catch(e) {
            console.log(e)
        }
    }

    loadEvents = async () => {
        try {
            let counter = 0;
            for (let league of this.leagues) {
                if (counter < 10) {
                    const currentLeagueEvents = await getRequest(links.prematchLeague + league.id, 'GET');
                    currentLeagueEvents.events.forEach(ev => {
                        this.SoccerEvents.push(ev)
                    })
                    counter = counter + currentLeagueEvents.events.length;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    loadData = async () => {
		try {
			this.data = await getRequestWithoutCredentials(links.topGames, 'GET')
            this.SoccerLeagues = await getRequest(links.prematchAll);
            await this.getLeagues();
            await this.loadEvents();
		} catch (e) {
			console.log(e)
		}
    }

    sideScroll = (element,direction,speed,distance,step) => {
        let scrollAmount = 0;
        var slideTimer = setInterval(function(){
            if(direction == 'left'){
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if(scrollAmount >= distance){
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    drawData = () => {
        //console.log(this.sportsID)
        console.log(this.SoccerEvents)
        const newsContainer = document.getElementById('newsItemContainer');
        //const toRight = newsContainer.lastChild;
        //const toLeft = newsContainer.firstChild;
        const left = document.getElementById('bLeft');
        const right = document.getElementById('bRight');

        let translate = 0;

        let counter = 0;
        //this.data[0].sportId = 2;
        this.SoccerEvents.forEach(item => {
          //  console.log(item)
            if (item.sportId == 1 && counter < 10) {
                this.newsItems.push({image: news1, text: item.competitors[0].name + ' v ' + item.competitors[1].name, date: item.startDate.slice(8, 10) + '/' + item.startDate.slice(5, 7) + ' ' + item.startDate.slice(11, 16)})
                const container = document.createElement('div');
                container.innerHTML = new SportsNewsItemTemplate(news1, item.competitors, item.startDate.slice(8, 10) + '.' + item.startDate.slice(5, 7) + ' ' + item.startDate.slice(11, 16)).render();
                container.addEventListener('click', (ev) => {
                    //typeof window.opened == 'undefined' ? window.opened = ['Soccer'] : window.opened.push('Soccer');
                    let leagueName = null;
                    try {
                        //const sports = await getRequest('https://api.ruby.bet/feed/?key=sports');
                        this.SoccerLeagues[0].categories.forEach( (item_) => {
                            item_.leagues.forEach( (it) => {
                                if (it.id == item.leagueId) {
                                    leagueName = it.name;
                                   // typeof window.openedEV == 'undefined' ? window.openedEV = [leagueName] : window.opened.push(leagueName);
                                    window.location = './#/sports/table/1/' + item.leagueId + '/' + item.id;
                                }
                            });
                        })
                    } catch(err) {
                        console.log(err)
                    }
                })
                newsContainer.append(container);
                counter++;
            }
        });

        left.addEventListener('click', (ev) => {
            this.sideScroll(newsContainer, 'left', 25, 200, 10);
        })

        right.addEventListener('click', (ev) => {
            this.sideScroll(newsContainer, 'rigth', 25, 200, 10);
        })
        console.log(this.newsItems)

    }

    showData = async () => {
        try {
            await getRequestWithLoader(this.loadData)();
            await this.drawData();
        } catch (err) {
            console.log(err)
        }
    }

    init = () => {
        this.showData();
    }
}
