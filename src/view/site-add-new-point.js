import SmartView from './smart.js';
import {EVENT_OFFERS, CITIES, DESCRIPTION_TEXTS, PLUG_IMG_URL, MAX_DESCRIPTION_LENGTH, PLUG_IMG_URL_LIMIT} from '../mock/point.js';
import {getRandomInteger, getRandomArray} from '../utils/common.js';

const BLANK_POINT = {
  type: EVENT_OFFERS[0].type,
  destination: {
    description: '',
    name: CITIES[0],
    pictures: [
      {
        src: `${PLUG_IMG_URL}0`,
      },
    ],
  },
};

const createPointDestinationOption = (destination) => `<option value="${destination}"></option>`;

const createPointsDestinationOption = (destinationItems) => {
  const pointsDestinationOption = destinationItems.map((point) => createPointDestinationOption(point)).join('');
  return `${pointsDestinationOption}`;
};

const createPointTypeTemplate = (type, isTypeChecked) =>
  `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isTypeChecked ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" type="${type}">${type}</label>
  </div>`;


const createPointTypesTemplate = (pointType, typeItems) => {
  const pointTypesTemplate = typeItems.map((type) => createPointTypeTemplate(type, pointType === type)).join('');

  return `${pointTypesTemplate}`;
};

const createPointOfferTemplate = (offers, val, isOfferChecked) => {
  const {title, price} = offers;
  const MAX_ID_NUMBER = 20000;
  const id = getRandomInteger(0, MAX_ID_NUMBER);

  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" value="${val}" ${isOfferChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
};

const createPointOffersTemplate = (pointOffers, selectedOffers, isOffersExist) => {

  const pointOffersTemplate = isOffersExist  ? pointOffers.offers.map((offer) =>
    createPointOfferTemplate(offer, `${pointOffers.type}-${pointOffers.offers.indexOf(offer)}`, selectedOffers[`${pointOffers.type}-${pointOffers.offers.indexOf(offer)}`] === true)).join('') : '';

  return `${pointOffersTemplate}`;
};

const createPointEditTemplate = (data) => {
  const {type, destination, basePrice, pointOffers, offersSelected, isOffersExist} = data;
  const POINT_TYPES = [];
  EVENT_OFFERS.map((pointType) => POINT_TYPES.push(pointType.type));
  const pointTypesTemplate = createPointTypesTemplate(type, POINT_TYPES);
  const pointOffersTemplate = createPointOffersTemplate(pointOffers, offersSelected,  isOffersExist);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              ${pointTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createPointsDestinationOption(CITIES)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${pointOffersTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="${destination.pictures[0].src}" alt="Event photo">

            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
};

class PointEdit extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = PointEdit.parsePointToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._offersTypeSelectHandler = this._offersTypeSelectHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(point) {
    this.updateData(
      PointEdit.parsePointToData(point),
    );
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('click', this._offersTypeSelectHandler);
    this.getElement()
      .querySelector('.event__available-offers')
      .addEventListener('change', this._offersChangeHandler);
    this.getElement()
      .querySelector('.event__field-group--destination')
      .addEventListener('change', this._cityChangeHandler);
  }

  _offersTypeSelectHandler(evt) {
    if (evt.target.tagName !== 'LABEL' || this._data.type === evt.target.getAttribute('type')) {
      return;
    }

    const type = evt.target.getAttribute('type');
    const pointOffers = EVENT_OFFERS.find((offer) => offer.type === type);
    const isOffersExist = pointOffers.offers !== null;

    this.getElement()
      .querySelector('.event__type-icon').setAttribute('src', `img/icons/${type}.png`);
    this.updateData({
      pointOffers,
      type: pointOffers.type,
      offers: pointOffers.offers,
      offersSelected: {},
      isOffersExist,
    });
  }

  _offersChangeHandler(evt) {
    this.updateData({
      offersSelected: Object.assign(
        {},
        this._data.offersSelected,
        {[evt.target.value]: evt.target.checked},
      ),
    });
  }

  _cityChangeHandler(evt) {
    this.updateData({
      destination: Object.assign(
        {},
        this._data.destination,
        {
          name: evt.target.value,
          description: getRandomArray(DESCRIPTION_TEXTS, MAX_DESCRIPTION_LENGTH).join(' '),
          pictures: [
            {
              src: `${PLUG_IMG_URL}${getRandomInteger(0, PLUG_IMG_URL_LIMIT)}`,
            },
          ],
        },
      ),
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector('form').addEventListener('reset', this._formResetHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isOffersExist: point.offers !== null,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.isOffersExist) {
      data.offers = null;
    }

    delete data.isOffersExist;

    return data;
  }
}

export default PointEdit;
