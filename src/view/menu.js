import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" data-target="${MenuItem.POINTS}">Table</a>
    <a class="trip-tabs__btn" data-target="${MenuItem.STATISTICS}" href="#">Stats</a>
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" data-target="${MenuItem.ADD_NEW_POINT}" type="button" style="position: absolute; right: 10px; bottom: 10px">New event</button>
  </nav>`
);

class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.getAttribute('data-target'));
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    items.forEach((item) => {
      (item.text === menuItem) ? item.classList.add('trip-tabs__btn--active') : item.classList.remove('trip-tabs__btn--active');
    });
  }
}

export default Menu;
