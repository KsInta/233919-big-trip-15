import MenuView  from './view/menu.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {Endpoints, MenuItem, UpdateType, FilterType} from './const.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic zh9a590vi02088a';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME_POINTS = `${STORE_PREFIX}-${STORE_VER}-${Endpoints.POINTS}`;
const STORE_NAME_DESTINATIONS = `${STORE_PREFIX}-${STORE_VER}-${Endpoints.DESTINATIONS}`;
const STORE_NAME_OFFERS = `${STORE_PREFIX}-${STORE_VER}-${Endpoints.OFFERS}`;

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

const siteMenuComponent = new MenuView();

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.page-header');
const siteMainTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteBodyElement = siteMainElement.querySelector('.page-body__page-main');
const siteBodyContainerElement = siteBodyElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter(siteMainTripElement, siteBodyContainerElement, pointsModel, filterModel, offersModel, api, destinationsModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, pointsModel);

const handlePointNewFormClose = () => {
  siteMenuComponent.setMenuItem(MenuItem.POINTS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.POINTS);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      boardPresenter.init();
      boardPresenter.createPoint(handlePointNewFormClose);
      break;
    case MenuItem.POINTS:
      boardPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.POINTS);
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATISTICS);
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
});

const eventTypeBtn = document.querySelector('.event__type-btn');
const eventInputDestination = document.querySelector('.event__input--destination');

const changeEventBtnStyles = (element, events, opacity) => {
  element.style.pointerEvents = events;
  element.style.opacity = opacity;
};

const changeDestinationInputState = (element, disabled) => {
  element.disabled = disabled;
};

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProviderPoints.sync();
  if(eventTypeBtn) {
    changeEventBtnStyles(document.querySelector('.event__type-btn'), 'auto', 1);
  }
  if(eventInputDestination) {
    changeDestinationInputState(document.querySelector('.event__input--destination'), false);
  }
  boardPresenter.destroy();
  boardPresenter.init();
});


window.addEventListener('offline', () => {
  document.title += ' [offline]';
  if(eventTypeBtn) {
    changeEventBtnStyles(document.querySelector('.event__type-btn'), 'none', 0.5);
  }
  if(eventInputDestination) {
    changeDestinationInputState(document.querySelector('.event__input--destination'), true);
  }
  const refresh = window.localStorage.getItem('refresh');
  if (refresh === null){
    window.location.reload();
    window.localStorage.setItem('refresh', '1');
  }
});
