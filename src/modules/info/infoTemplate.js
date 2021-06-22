import { useTranslate } from "../../helpers/utils";

export class InfoTemplate {
  render = () =>
    `
<div class="container flex-container">
  <ul class="info-list">
    <li class="info-item">
      <p class="font white md" data-lang="info">${useTranslate('info')}</p>
    </li>
    <li class="info-item"><a class="font m-white info-link" data-lang="info">${useTranslate('info')}</a></li>
    <li class="info-item"><a class="font m-white info-link" data-lang="about_us">${useTranslate('about')}</a></li>
    <li class="info-item"><a class="font m-white info-link" data-lang="rules">${useTranslate('rules')}</a></li>
    <li class="info-item"><a class="font m-white info-link" data-lang="pay_way">${useTranslate('bill')}</a></li>
    <li class="info-item"><a class="font m-white info-link" data-lang="confidentiality">${useTranslate('confidence')}</a></li>
  </ul>
  <ul class="info-list">
    <li class="info-item">
      <p class="font white md" data-lang="social">${useTranslate('social')}</p>
    </li>
    <li class="info-item"><a class="font m-white info-link" data-lang="contacts">${useTranslate('contacts')}</a></li>
    <li class="info-item"><a class="font m-white info-link" data-lang="chat">${useTranslate('chat')}</a></li>
  </ul>
  <ul class="info-list">
    <li class="info-item">
      <p class="font white md" data-lang="social">${useTranslate('social')}</p>
    </li>
    <li class="info-item"><a class="font m-white info-link">Facebook</a></li>
    <li class="info-item"><a class="font m-white info-link">Twitter</a></li>
    <li class="info-item"><a class="font m-white info-link">Vkontakte</a></li>
    <li class="info-item"><a class="font m-white info-link">Odnoklassniki</a></li>
    <li class="info-item"><a class="font m-white info-link">Linkedin</a></li>
    <li class="info-item"><a class="font m-white info-link">Youtube</a></li>
  </ul>
  <div class="flex-container info-list align-self-middle">
    <div class="phone mr"></div>
    <div class="block ml">
      <p class="font m-white md">+ 0000 000 000 00</p>
      <p class="font m-white md">+ 0000 000 000 00</p>
    </div>
  </div>
</div>`;
}
