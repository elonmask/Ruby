import "../../styles/search.css"

export class SearchTemplate {
  constructor() {}

  render = () =>
    `<div class="search not-active flex-container">
      <input class="field search__field"
             id="search_inp"
             type="text"
             placeholder="Search"/>
      <button class="button square primary search__button" id="search-button"></button>
    </div>`;
}
