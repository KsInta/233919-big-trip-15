import AbstractView from './abstract.js';

const createNoPointTemplate = () => (
  `<p class="points__no-tasks" style="text-align: center">
    Loading...
  </p>`
);

class Loading extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export default Loading;
