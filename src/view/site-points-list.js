import {createElement} from '../utils.js';

const createPointsListTemplate = () => '<ul class="trip-events__list"></ul>';

class PointList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPointsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default PointList;
