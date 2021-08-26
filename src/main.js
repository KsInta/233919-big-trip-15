import SiteMenuView  from './view/site-menu.js';
import FilterView from './view/site-filter.js';
import SortView from './view/site-sorting.js';
import MainTripView from './view/site-main-trip.js';
import PointListView from './view/site-points-list.js';
import PointEditView from './view/site-add-new-point.js';
import PointView from './view/site-point.js';
import NoPointView from './view/no-point.js';
import {generatePoint} from './mock/point.js';
import {generateFilter} from './filter.js';
import {render, RenderPosition} from './utils.js';
import flatpickr from 'flatpickr';

const POINT_COUNT = 25;

const points = new Array(POINT_COUNT).fill().map(generatePoint);
const filters = generateFilter(points);

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const renderPoint = (pointListElement, task) => {
  const pointComponent = new PointView(task);
  const pointEditComponent = new PointEditView(task);

  const replaceCardToForm = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector('form').addEventListener('reset', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardPoints) => {
  const pointListComponent = new PointListView();
  render(boardContainer, pointListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(pointListComponent.getElement(), boardPoints[i]);
  }

  if (points.length === 0) {
    render(boardContainer, new NoPointView().getElement(), RenderPosition.BEFOREEND);
  }

  render(boardContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);
};

render(siteNavigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteFilterElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainTripElement, new MainTripView().getElement(), RenderPosition.AFTERBEGIN);

renderBoard(siteBodyContainerElement, points);

flatpickr('#event-start-time-1', {
  altInput: true,
  altFormat: 'F j, Y',
  dateFormat: 'Y-m-d',
  enableTime: true,
});

flatpickr('#event-end-time-1', {
  altInput: true,
  altFormat: 'F j, Y',
  dateFormat: 'Y-m-d',
  enableTime: true,
});
