import he from 'he';
import SmartView from './smart.js';
import {BLANK_POINT} from '../const.js';
import {humanizePointDueDate} from '../utils/point.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const LABEL_DISABLED_STYLE = 'style="pointer-events:none;opacity:0.5"';

const getUpperCaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const isExistsNamePoint = (namePoint, destinations) => destinations.filter((destination) => destination.name === namePoint);

const createPointsDestinationOption = (destinations) => (destinations.map((item) => `<option value="${item.name}"></option>`).join(''));

const getDestinationDescription = (namePoint, destinations) => (isExistsNamePoint(namePoint, destinations).length > 0) ? destinations.filter((destination) => destination.name === namePoint)[0].description : '';

const createEditPointEventTypeItemTemplate = (id, offers) => (
  offers.map(({type}) => `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${getUpperCaseFirstLetter(type)}</label>
    </div>`).join('')
);

const createEditPointOffersTemplate = (type, offersSelected, offers, id, isDisabled) => {
  const isCheckedOffer = (title) => offersSelected.map((item) => item.title).includes(title) ? 'checked' : '';

  const offersByType = offers.filter((offer) => offer.type === type)[0].offers;

  return `${offersByType.length ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersByType.map(({title, price}) => `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}-${price}" ${isCheckedOffer(title)} ${isDisabled ? 'disabled' : ''}>
            <label class="event__offer-label" for="event-offer-${title}-${id}" ${isDisabled ? LABEL_DISABLED_STYLE : ''} >
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>` : ''}`;
};

const createPhotosTemplate = (namePoint, destinations) => {
  const pictures = (isExistsNamePoint(namePoint, destinations).length > 0) ? destinations.filter((destination) => destination.name === namePoint)[0].pictures : [];

  return `${pictures.length ? `<div class="event__photos-container">
  <div class="event__photos-tape">
  ${pictures.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`).join('')}
  </div>
</div>`: ''}`;
};

const createPointEditTemplate = (data, offers, destinations, isNewEvent) => {
  const {type, destination, basePrice, offersSelected, dateFrom, dateTo, id, isDisabled, isSaving, isDeleting} = data;

  const eventTypeItems = createEditPointEventTypeItemTemplate(id, offers);

  const destinationDescription = getDestinationDescription(destination.name, destinations);

  const editPointOffersTemplate = createEditPointOffersTemplate(type, offersSelected, offers, id, isDisabled);

  const eventDestinationItems = createPointsDestinationOption(destinations);

  const photos = createPhotosTemplate(destination.name, destinations);

  const eventResetBtnText = () => {
    if(isNewEvent) {
      return 'Cancel';
    }

    return (isDeleting) ? 'Deleting...' : 'Delete';
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1" ${isDisabled ? LABEL_DISABLED_STYLE : ''}>
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              ${eventTypeItems}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-${id}">
            ${eventDestinationItems}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizePointDueDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizePointDueDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${eventResetBtnText()}</button>
      </header>
      <section class="event__details">

        ${editPointOffersTemplate}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDescription}</p>

          <div class="event__photos-container">

            ${photos}

          </div>
        </section>
      </section>
    </form>
  </li>`;
};

class PointEdit extends SmartView {
  constructor(point = BLANK_POINT, offers = [], destinations = []) {
    super();
    this._data = PointEdit.parsePointToData(point);
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._offers = [ ...offers ];
    this._destinations = [ ...destinations];

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    //this._formResetHandler = this._formResetHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._offersTypeSelectHandler = this._offersTypeSelectHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerStart || this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerEnd.destroy();
      this._datepickerStart = null;
      this._datepickerEnd = null;
    }
  }

  reset(point) {
    this.updateData(
      PointEdit.parsePointToData(point),
    );
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._offers, this._destinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    //this.setFormResetHandler(this._callback.formReset);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepickerStart || this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerEnd.destroy();
      this._datepickerStart = null;
      this._datepickerEnd = null;
    }

    this._datepickerStart = flatpickr(
      this.getElement().querySelector(`#event-start-time-${this._data.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        ['time_24hr']: true,
        defaultDate: this._data.dateFrom,
        onChange: this._dueDateChangeHandler,
      },
    );

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector(`#event-end-time-${this._data.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        ['time_24hr']: true,
        defaultDate: this._data.dateTo,
        onChange: this._endDateChangeHandler,
      },
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('click', this._offersTypeSelectHandler);
    if (this.getElement().querySelector('.event__available-offers')) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offersChangeHandler);
    }
    this.getElement()
      .querySelector('.event__field-group--destination')
      .addEventListener('change', this._cityChangeHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);
  }

  _dueDateChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate.toISOString(),
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate.toISOString(),
    });
  }

  _offersTypeSelectHandler(evt) {
    if (evt.target.tagName !== 'LABEL' || this._data.type === evt.target.getAttribute('type')) {
      return;
    }

    const type = evt.target.getAttribute('type');
    //const pointOffers = EVENT_OFFERS.find((offer) => offer.type === type);
    //const isOffersExist = pointOffers.offers !== null;

    this.getElement()
      .querySelector('.event__type-icon').setAttribute('src', `img/icons/${type}.png`);
    this.updateData({
      type: (evt.target.textContent).toLowerCase(),
      offersSelected: [],
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    const checkboxElements = this.getElement().querySelectorAll('.event__offer-checkbox');

    const currentOffers = [];
    checkboxElements.forEach((checkbox) => {
      if(checkbox.checked) {
        currentOffers.push({
          title: checkbox.name.split('-')[2],
          price: + checkbox.name.split('-')[3],
        });
      }
    });
    this.updateData({offersSelected: currentOffers}, 'noUpdateElement');
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    evt.target.required = true;
    evt.target.autocomplete = 'off';
    const isExists = this._destinations.filter((destination) => destination.name === evt.target.value);
    if(isExists.length <= 0) {
      evt.target.setCustomValidity('There must be values from the list');
    } else {
      evt.target.setCustomValidity('');
      this.updateData({
        destination: Object.assign(
          {},
          this._data.destination,
          {
            name: evt.target.value,
          },
        ),
      });
    }
    evt.target.reportValidity();
  }

  _priceChangeHandler(evt) {
    this.updateData({
      basePrice: +evt.target.value,
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

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  /*_formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector('form').addEventListener('reset', this._formResetHandler);
  }*/

  static parsePointToData(point) {
    return Object.assign({}, point, {isDisabled: false, isSaving: false, isDeleting: false});
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

export default PointEdit;
