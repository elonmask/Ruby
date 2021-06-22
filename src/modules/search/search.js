window.Search = class Search {
    constructor(){
        this.input;
        this.searchValue = sessionStorage.getItem('SrgDt') || '';
        this.button;
    }

    getResult =(e)=> {
        if (e.key === 'Enter' || !e.key){
            if (this.searchValue !== '' && this.searchValue){
                this.rememberPageUrl();
                window.location.hash = `/search/${this.searchValue}`
            }
        }
    };

    rememberPageUrl =()=> {
        const hash = window.location.hash;
        const page = hash.split('/')[1];

        if (page !== 'search') sessionStorage.setItem('BackFromSeacrh', hash)
    };

    searchesData =(e)=> {
        const value = e.target.value;
        sessionStorage.setItem('SrgDt', value);
        this.searchValue = value;
    };

    init =()=> {
        this.input = document.querySelector('#search_inp');
        this.button = document.querySelector('#search-button');

        this.input.value = this.searchValue;
        this.input.addEventListener('input', this.searchesData);
        this.input.addEventListener('keypress', this.getResult);
        this.button.addEventListener('click', this.getResult)
    };

};

window.search = new Search();
search.init();