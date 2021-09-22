import SiteMenuView  from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import MainTripView  from './view/site-main-trip.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
//import {generatePoint} from './mock/point.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {Endpoints, MenuItem, UpdateType, FilterType} from './const.js';
//import Api from './api.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

//const POINT_COUNT = 25;
const AUTHORIZATION = 'Basic zh9a590vi02037a';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME_POINTS = `${STORE_PREFIX}-${STORE_VER}-${Endpoints.POINTS}`;
const STORE_NAME_DESTINATIONS = `${STORE_PREFIX}-${STORE_VER}-${Endpoints.DESTINATIONS}`;
const STORE_NAME_OFFERS = `${STORE_PREFIX}-${STORE_VER}-${Endpoints.OFFERS}`;

//const points = new Array(POINT_COUNT).fill().map(generatePoint);
const api = new Api(END_POINT, AUTHORIZATION);
const storePoints = new Store(STORE_NAME_POINTS, window.localStorage);
const storeDestinations = new Store(STORE_NAME_DESTINATIONS, window.localStorage);
const storeOffers = new Store(STORE_NAME_OFFERS, window.localStorage);
const apiWithProviderPoints = new Provider(api, storePoints);
const apiWithProviderDestinations = new Provider(api, storeDestinations);
const apiWithProviderOffers = new Provider(api, storeOffers);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel =  new DestinationsModel();

const siteMenuComponent = new SiteMenuView();

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

render(siteMainTripElement, new MainTripView(), RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(siteBodyContainerElement, pointsModel, filterModel, offersModel, api, destinationsModel);
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

filterPresenter.init();
boardPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

Promise.all([
  apiWithProviderDestinations.getDestinations(),
  apiWithProviderOffers.getOffers(),
  apiWithProviderPoints.getPoints(),
]).then((values) => {
  const [destinations, offers, points] = values;
  destinationsModel.setDestinations(destinations);
  offersModel.setOffers(offers);
  pointsModel.setPoints(UpdateType.INIT, points);
  render(siteNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
}).catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  //eventAddBtnElement.disabled = false;
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProviderPoints.sync();
  if(document.querySelector('.event__type-btn')) {
    document.querySelector('.event__type-btn').style.pointerEvents = 'auto';
    document.querySelector('.event__type-btn').style.opacity = 1;
  }
  if(document.querySelector('.event__input--destination')) {
    document.querySelector('.event__input--destination').disabled = false;
  }
  boardPresenter.destroy();
  boardPresenter.init();
});


window.addEventListener('offline', () => {
  document.title += ' [offline]';
  if(document.querySelector('.event__type-btn')) {
    document.querySelector('.event__type-btn').style.pointerEvents = 'none';
    document.querySelector('.event__type-btn').style.opacity = 0.5;
  }
  if(document.querySelector('.event__input--destination')) {
    document.querySelector('.event__input--destination').disabled = true;
  }
  const refresh = window.localStorage.getItem('refresh');
  if (refresh === null){
    window.location.reload();
    window.localStorage.setItem('refresh', '1');
  }
});
