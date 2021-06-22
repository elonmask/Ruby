import logo from "../../img/header/logo/img/logo.png";

export class LogoTemplate {
  render = () =>
  `<a class="logo" href="/#/sports/">
      <img class="logo-img" src=${logo} alt="Everest bet"/>
  </a>`;
}
/*`<a class="logo" href="/#/sports/">
      <img class="logo-img" src=${logo} alt="Everest bet"/>
  </a>`*/