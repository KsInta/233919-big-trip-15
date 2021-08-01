import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSiteFilterTemplate} from './view/site-filter.js';
import {createSiteSortingTemplate} from './view/site-sorting.js';
import {createSiteMainTripTemplate} from './view/site-main-trip.js';
import {createPointsListTemplate} from './view/site-points-list.js';
import {createNewPointTemplate} from './view/site-add-new-point.js';
import {createPointTemplate} from './view/site-point.js';

const POINT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.page-body__container');

render(siteNavigationElement, createSiteMenuTemplate(), 'beforeend');
render(siteFilterElement, createSiteFilterTemplate(), 'beforeend');
render(siteMainTripElement, createSiteMainTripTemplate(), 'afterbegin');
render(siteBodyContainerElement, createSiteSortingTemplate(), 'beforeend');
render(siteBodyContainerElement, createPointsListTemplate(), 'beforeend');

const sitePointsListElement = siteBodyElement.querySelector('.trip-events__list');

render(sitePointsListElement, createNewPointTemplate(), 'beforeend');

for (let i = 0; i < POINT_COUNT; i++) {
  render(sitePointsListElement, createPointTemplate(), 'beforeend');
}
