import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilterTemplate} from './view/site-filter.js';
import {createSiteSortingTemplate} from './view/site-sorting.js';
import {createSiteMainTripTemplate} from './view/site-main-trip.js';
import {createPointsListTemplate} from './view/site-points-list.js';
import {createNewPointTemplate} from './view/site-add-new-point.js';
import {createPointTemplate} from './view/site-point.js';
import {generatePoint} from './mock/point.js';
import {generateFilter} from './filter.js';
import flatpickr from 'flatpickr';

const POINT_COUNT = 25;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const points = new Array(POINT_COUNT).fill().map(generatePoint);
const filters = generateFilter(points);

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.page-body__container');

render(siteNavigationElement, createSiteMenuTemplate(), 'beforeend');
render(siteFilterElement, createFilterTemplate(filters), 'beforeend');
render(siteMainTripElement, createSiteMainTripTemplate(), 'afterbegin');
render(siteBodyContainerElement, createSiteSortingTemplate(), 'beforeend');
render(siteBodyContainerElement, createPointsListTemplate(), 'beforeend');

const sitePointsListElement = siteBodyElement.querySelector('.trip-events__list');
render(sitePointsListElement, createNewPointTemplate(points[0]), 'beforeend');

for (let i = 0; i < POINT_COUNT; i++) {
  render(sitePointsListElement, createPointTemplate(points[i]), 'beforeend');
}

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
