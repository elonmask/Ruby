import { links } from '../../links/links'
import {
	findNode,
	getRequestWithLoader, 
	getRequestWithoutCredentials,
} from '../../helpers/utils'
import { PrematchLeagueCategory } from '../overview/leagueLiveCategory/prematchLeagueCategory'

export class PrematchListLogic {
    constructor() {
        this.sportsID = [];
        this.sports = null;
        this.leagueData = null;
        this.leagueEvents = null;
    }

    changeEventContent = async () => {
		try {
            await this.loadSports();
            await this.showData();
		} catch (e) {
			console.log('PrematchListLogic', e)
		}
	}

    loadSports = async () => {
        try {
            this.sports = await getRequestWithoutCredentials(
                links.prematchAll
            )
        } catch(e) {
            console.log(e)
        }
    }

    setLeagueData = () => {
        this.sports.forEach(sport => {
            if (sport.id == window.location.hash.split('/')[3]) {
                sport.categories.forEach((cat) => {
                    cat.leagues.forEach(league => {
                        if (league.id == window.location.hash.split('/')[4]) {
                            this.leagueData = league;
                        }
                    })
                })
            }
        })
    }

    /*loadEvents = async () => {
		try {
			this.leagueEvents = await getRequestWithoutCredentials(
				links.prematchLeague + window.location.hash.split('/')[4]
			)
		} catch (e) {
			console.log(e)
		}
	}*/

    getSportByID = (id) => {
        let name = "";
        this.sportsID.forEach(item => {
            if (item.id == id) {
                name = item.name;
            }
        })

        return name;
    }

    headerElem = (sport, id) => {

        /*
        <div id="prematch-forBanner">
            <div class="flex-container align-middle background banner small shadow" style="background-image: url('img/banner/big/1.png');">
                <div class="lex-container align-center-middle banner__title">
                    <p id="headerIcon" class="icon" style="content: url('http://bestline.bet/media/icons/sports/png/soccer.png'); margin-left: 2px; width: 55px; height: 55px;"></p>
                </div>
                <p id="headerTitle" class="font banner__text">soccer</p>
            </div>
        </div>
        */

        const container = document.createElement('div')
        container.id = "prematch-forBanner";

        const minContainer = document.createElement('div');
        minContainer.className = "flex-container align-middle background banner small shadow";
        minContainer.style.backgroundImage = `url('./src/img/banner/big/1.png')`;

        const titleContainer = document.createElement('div');
        titleContainer.className = "lex-container align-center-middle banner__title";

        const title = document.createElement("p");
        title.id = "headerIcon";
        title.className = "icon";
        title.style.content = `url('http://bestline.bet/icon/sport/${id}')`
        title.style.marginLeft = "2px";
        title.style.width = "55px";
        title.style.height = "55px";

        const text = document.createElement('p');
        text.id="headerTitle";
        text.className = "font banner__text";
        text.textContent = sport;

        titleContainer.appendChild(title);
        minContainer.appendChild(titleContainer)
        minContainer.appendChild(text)
        container.appendChild(minContainer)

        return container;
    }

    fillSportsID = async () => {
		try {
			this.sports = await getRequestWithoutCredentials(links.prematchAll, 'GET')
			this.sports.forEach(sport => {
				let tempObj = {
					id: sport.id,
					name: sport.name, 
				}
				this.sportsID.push(tempObj)
			})
		} catch (e) {
			console.log(e)
		}
    }
    
    Draw = () => {
        document.getElementById("listHeader").innerHTML =
        `
        <div class="inplay-category-container" id="prematchLeagueContainer">
        </div>
        `
        document.getElementById("listHeader").prepend(this.headerElem(this.getSportByID(window.location.hash.split('/')[3]), window.location.hash.split('/')[3]))
        const League = new PrematchLeagueCategory(this.leagueData)
        document.getElementById("prematchLeagueContainer").appendChild(League.render())
    }

    showData = async () => {
		try {
            await this.fillSportsID()
           // await getRequestWithLoader(this.loadEvents)()
            await this.setLeagueData()
			await this.Draw()
		} catch (e) {
			console.log(e)
		}
	}

	init = () => {
        this.showData()
        window.changePrematchList = this.changeEventContent;
	}
}