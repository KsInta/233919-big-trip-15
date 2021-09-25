import AbstractView from './abstract.js';
import { humanizePointDueDate } from '../utils/point.js';

const getStartDataPoint = (points) =>
  points
    .slice(0)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));


const getEndDataPoint = (points) => points
  .slice(0)
  .sort((a, b) => new Date(b.dateTo) - new Date(a.dateTo));

const createTripInfoTitleTemplate = (points) => {
  const startDataPoint = getStartDataPoint(points);
  const endDataPoint = getEndDataPoint(points);

  return (points.length > 3) ?
    `${startDataPoint[0].destination.name} - ... - ${endDataPoint[0].destination.name}` :
    (points.map((item) => item.destination.name)).join(' - ');
};

const createTripInfoDatesTemplate = (points) => {
  const startDataPoint = getStartDataPoint(points);
  const endDataPoint = getEndDataPoint(points);

  const monthStart = humanizePointDueDate(startDataPoint[0].dateFrom, 'MMM');
  const monthEnd = humanizePointDueDate(endDataPoint[0].dateTo, 'MMM');

  const dataFormat = monthStart === monthEnd ? 'DD' : 'MMM DD';
  const dateStart = humanizePointDueDate(startDataPoint[0].dateFrom, 'MMM DD');
  const dateEnd = humanizePointDueDate(endDataPoint[0].dateTo, dataFormat);

  return `${dateStart} - ${dateEnd}`;
};

const createTripInfoCostTemplate = (points) => points.reduce((sum, item) => {
  const costOffers = item.offersSelected.reduce((sumOffers, {price}) => sumOffers + price, 0);
  return sum + item.basePrice + costOffers;
}, 0);

const createAppTripInfoTemplate = (points) => {
  const infoTitle = createTripInfoTitleTemplate(points);

  const infoDates = createTripInfoDatesTemplate(points);

  const infoCostValue = createTripInfoCostTemplate(points);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${infoTitle}</h1>

      <p class="trip-info__dates">${infoDates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${infoCostValue}</span>
    </p>
  </section>`;
};

class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createAppTripInfoTemplate(this._points);
  }
}

export default TripInfo;
