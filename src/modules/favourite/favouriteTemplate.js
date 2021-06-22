import "../../styles/favourite.css";

export class FavouritesTemplate {
  constructor() { }

  render = () =>
    `<div class="favourite oPen">
        <div class="flex-container align-middle align-justify favourite__category open">
          <p class="font">All</p>
        </div>
        <div class="favourite-container"></div>
      </div>`;
}
