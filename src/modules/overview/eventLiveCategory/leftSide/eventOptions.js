export class EventOptions {
  constructor(event) {
    this.event = event;
  }

  render = () =>
    `<div class="flex-container align-center-middle inplayTeamOptions">
        <button class="sport-icon ${play.toLowerCase()} team-button"></button>
        <button class="sport-icon play team-button"></button>
    </div>`;
}
