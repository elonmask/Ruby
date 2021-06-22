export class SliderTemplate {
  render = () =>
    `<div class="slider__wrapper">
        <button class="button slider__prev" id="slider__prev">
            <span class="fa fa-angle-left"></span>
        </button>
        <button class="button slider__next" id="slider__next">
            <span class="fa fa-angle-right"></span>
        </button>
        <div class="slider__track" id="slider__track"></div>
    </div>`;
}
