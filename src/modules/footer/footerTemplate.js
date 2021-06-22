import { getModule } from "../../templates/templatesModules";
import "../../styles/footer.css";

export class FooterTemplate {
  render = () =>
    `   <div class="container-fluid partner" id="footer-forPartner" style="display: flex; justify-content: center; align-items: center; padding-top: 10px;">${getModule(
      "partner"
    )}</div>
        <div class="container-fluid about" id="footer-forAbout">${getModule(
          "about"
        )}</div>
        <div class="container-fluid info" id="footer-forInfo">${getModule(
          "info"
        )}</div>
        <div class="container-fluid copyright" id="footer-forCopyright">${getModule(
          "copyright"
        )}</div>
`;
}
