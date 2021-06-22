import { getModule } from "../templates/templatesModules";

export class SearchPageTemplate {
  render = () =>
    `<div class="container flex-container" style="margin-bottom: 10px">
    <div class="content center">
        <div id="search-hot-news"></div>
    </div>
</div>
<div class="container flex-container" style="margin-bottom: 10px">
    <div class="content center" id="search-search-result"></div>
    <div class="content right">
        <div id="search-search" style="margin-bottom: 10px">${getModule(
          "search"
        )}</div>
        <div id="search-right-column" style="margin-bottom: 10px">${getModule(
          "rightColumn"
        )}</div>
    </div>
</div>`;
}
