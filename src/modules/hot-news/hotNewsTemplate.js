export class HotNewsTemplate {
  constructor() {}

  render = () =>
    `
<div class="hot flex-container align-middle">
  <div class="hot-title">
    <p class="font text-uppercase text-nowrap">Hot news</p>
  </div>
  <marquee class="hot-list">
    <div class="flex-container align-middle">
      <p class="font white hot-item"><strong>Tennis 0: </strong><span>Berdych blasts new rule</span></p>
      <p class="font white hot-item"><strong>Tennis 1: </strong><span>Berdych blasts new rule</span></p>
      <p class="font white hot-item"><strong>Tennis 2: </strong><span>Berdych blasts new rule</span></p>
      <p class="font white hot-item"><strong>Tennis 3: </strong><span>Berdych blasts new rule</span></p>
      <p class="font white hot-item"><strong>Tennis 4: </strong><span>Berdych blasts new rule</span></p>
      <p class="font white hot-item"><strong>Tennis 5: </strong><span>Berdych blasts new rule</span></p>
    </div>
  </marquee>
</div>`;
}
