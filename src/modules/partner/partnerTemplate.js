import { useTranslate } from "../../helpers/utils";

export class PartnerTemplate {
  render = () =>
    `
<div class="container flex-container align-justify" style="display: flex; justify-content: center; align-items: center;">
  <div class="partner-wrapper text-center" style="margin-right: 5%;">
    <p class="font white text-uppercase" data-lang="our_partners">${useTranslate('partners')}</p>
    <ul class="flex-container">
      <li class="partner-item"></li>
      <li class="partner-item"></li>
      <li class="partner-item"></li>
    </ul>
  </div>
  <div class="partner-wrapper text-center" style="margin-left: 5%;">
    <p class="font white text-uppercase" data-lang="sec_trust">${useTranslate('sec')}</p>
    <ul class="flex-container">
      <li class="partner-item"></li>
      <li class="partner-item"></li>
      <li class="partner-item"></li>
    </ul>
  </div>
</div>`;
}
