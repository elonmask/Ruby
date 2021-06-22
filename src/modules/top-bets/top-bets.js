window.TopBets = class TopBets {
    constructor(){
        this.container;
        //this.sportID = localStorage.getItem('spId-sports') || '1'
    }

    loadData =()=> {
      // fetch(`http://bestline.bet/top/?SI=${this.sportID}`)
      //     .then(res => res.json())
      //     .then(res => console.log(res))
    };

    init =()=> {
        this.container = document.getElementById('sportTop-Bets_container');
        this.loadData();
    };
};

window.topBets = new TopBets();
topBets.init()