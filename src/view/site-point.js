import AbstractView from './abstract.js';

const createPointOfferTemplate = (offer, isOfferSelected) => {
  const {title, price} = offer;

  return isOfferSelected ? `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>` : '';
};

const createPointOffersTemplate = (pointOffers, selectedOffers, isOffersExist) => {
  const pointOffersTemplate = isOffersExist  ? pointOffers.offers.map((offer) =>
    createPointOfferTemplate(offer, selectedOffers[`${pointOffers.type}-${pointOffers.offers.indexOf(offer)}`] === true)).join('') : '';

  return `${pointOffersTemplate}`;
};

const createPointTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, type, isFavorite, destination, pointOffers, offersSelected} = point;
  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dateFrom.pointStartFormatDay}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${dateFrom.pointStartFormatTime}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dateTo.pointEndFormatTime}</time>
        </p>
        <p class="event__duration">${dateTo.pointTimeLength}M</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createPointOffersTemplate(pointOffers, offersSelected, pointOffers.offers !== null)}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn ').addEventListener('click', this._favoriteClickHandler);
  }
}

export default Point;
