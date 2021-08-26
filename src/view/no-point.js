import AbstractView from './abstract.js';

const createNoPointTemplate = () => (
  `<p class="board__no-tasks" style="text-align: center">
    Click «New Event» in menu to create your first point
  </p>`
);

class NoPoint extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export default NoPoint;
