import SiteMenuView  from './view/site-menu.js';
import FilterView from './view/site-filter.js';
import MainTripView from './view/site-main-trip.js';
import BoardPresenter from './presenter/board.js';
import {generatePoint} from './mock/point.js';
import {generateFilter} from './filter.js';
import {render, RenderPosition} from './utils/render.js';
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

render(siteNavigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteFilterElement, new FilterView(filters), RenderPosition.BEFOREEND);
render(siteMainTripElement, new MainTripView(), RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(siteBodyContainerElement);

boardPresenter.init(points);

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
