import SiteMenuView  from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import MainTripView  from './view/site-main-trip.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {generatePoint} from './mock/point.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './const.js';

const POINT_COUNT = 25;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

render(siteNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(siteMainTripElement, new MainTripView(), RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(siteBodyContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, pointsModel);

const handlePointNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[data-target=${MenuItem.POINTS}]`).style['pointer-events'] = 'none';
  siteMenuComponent.setMenuItem(MenuItem.POINTS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      boardPresenter.init();
      console.log(pointsModel);
      boardPresenter.createPoint(handlePointNewFormClose);
      siteMenuComponent.getElement().querySelector(`[data-target=${MenuItem.POINTS}]`).style['pointer-events'] = 'none';
      break;
    case MenuItem.POINTS:
      boardPresenter.init();
      siteMenuComponent.getElement().querySelector(`[data-target=${MenuItem.POINTS}]`).style['pointer-events'] = 'none';
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      siteMenuComponent.getElement().querySelector(`[data-target=${MenuItem.POINTS}]`).style['pointer-events'] = 'all';
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
