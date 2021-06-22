import { LiveMatchLogic } from './liveMatch/liveMatchLogic'
import { findNode, getAll, getAllLeagues, getRequest } from '../../helpers/utils'
import { transformInplayData } from '../../helpers/transform/transform'
import { links } from '../../links/links'

export class LiveNowLogic {
    constructor () {
        this.inplayData = null
        this.leagues = []
        this.events = []

        this.prioritySportId = [1,2,4]
        this.eventsIDS = []

        this.leftContainer = null
        this.rightContainer = null

        this.rigthInstance = null
        this.leftInstance = null
    }

    loadTree = async () => {
        try {
          const data = await getRequest(links.inplayTree)
          this.inplayData = transformInplayData(data)
        } catch (e) {
          console.log(e)
        }
    }

    loadLeagueEvents = async (leagues) => {
        try {
            const data = await getAll(leagues.map(league => getRequest(links.league + league.id)));

            console.log(data)

            if (data){
                data.forEach(({ events }) => {
                    this.events.push(...events)
                })
            }
        } catch (e) {
            console.log(e);
        }
    }


    loadData = async () => {
        try {
            await this.loadTree();
            await this.getLeagues()
            await this.getEvents()
        } catch (err) {
            console.log(err)
        }
    }

    getLeagues =()=> {
        this.inplayData.forEach(sport => {
            if (this.prioritySportId.includes(sport.id)){
                const leagues = getAllLeagues(sport)
                leagues.forEach(league => {
                    if (league.inPlayMatchCount > 0){
                        this.leagues.push(league)
                    }
                })
            }
        })
    }

    getEvents = async ()=> {
        const leagues = []
        let matchCounts = 0

        this.leagues.forEach(league => {
            if (matchCounts < 10){
                matchCounts = league.inPlayMatchCount + matchCounts
                leagues.push(league)
            }
        })

        await this.loadLeagueEvents(leagues)
    }

    getEvent =()=> {
       return this.events.find(event => {
            if (event.eventType === 'Match' && event.providerStatus === 'live' && !this.eventsIDS.includes(event.id) && event.odds){
                this.eventsIDS.push(event.id)
                return event
            }
        })
    }

    render = async ()=> {
        console.log(this.getEvent());
        this.leftContainer = findNode('.', 'live-now-left')
        this.rightContainer = findNode('.', 'live-now-right')

        this.leftInstance = new LiveMatchLogic({ container: this.leftContainer, id: this.getEvent()?.id || null, update:this.update, name: this.getEvent()?.odds[0].name })
        this.rigthInstance = new LiveMatchLogic({ container: this.rightContainer, id: this.getEvent()?.id || null, update:this.update,name: this.getEvent()?.odds[0].name })

        this.leftInstance.init()
        this.rigthInstance.init()
    }

    init = async () => {
       await this.loadData();
       await this.render()
    }

    update =()=> {
        this.destroy()

        this.leftContainer.innerHTML = ''
        this.rightContainer.innerHTML = ''

        this.leagues = []
        this.events = []
        this.eventsIDS = []
        this.init()
    }

    destroy =()=> {
        this.leftInstance.destroy()
        this.rigthInstance.destroy()
    }

    // startTimer = () => {
    //     this.timer = setInterval( () => {
    //     }, 2500)
    // }
    //
    // destroyTimer = () => {
    //     clearInterval(this.timer);
    // }
}
