import { useTranslate } from "../../helpers/utils";

export class CopyrightTemplate {
  render = () =>
    `
<div class="container flex-container align-middle">
  <div class="plus18 mr">
    <p class="font m-white md">18+</p>
  </div>
  <p class="font m-white ml" data-lang="copyright">${useTranslate('cop')}</p>
</div>`;
}
