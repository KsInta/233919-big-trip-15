import AbstractView from './abstract.js';

const createPointsListTemplate = () => '<ul class="trip-events__list"></ul>';

class PointList extends AbstractView {
  getTemplate() {
    return createPointsListTemplate();
  }
}

export default PointList;
