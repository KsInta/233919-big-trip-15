import SiteMenuView  from './view/site-menu.js';
import MainTripView from './view/site-main-trip.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {generatePoint} from './mock/point.js';
import {render, RenderPosition} from './utils/render.js';

const POINT_COUNT = 25;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

render(siteNavigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainTripElement, new MainTripView(), RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(siteBodyContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, pointsModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});
