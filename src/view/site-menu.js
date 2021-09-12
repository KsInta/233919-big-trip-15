import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" data-target="${MenuItem.POINTS}" href="#" style="pointer-events: none">Table</a>
    <a class="trip-tabs__btn" data-target="${MenuItem.STATISTICS}" href="#">Stats</a>
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" data-target="${MenuItem.ADD_NEW_POINT}" type="button" style="position: absolute; right: 10px; bottom: 10px">New event</button>
  </nav>`
);

class SiteMenu extends AbstractView {
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
    const item = this.getElement().querySelector(`[data-target=${menuItem}]`);

    if (item !== null) {
      item.setAttribute('data-active', 'active');
    }
  }
}

export default SiteMenu;
