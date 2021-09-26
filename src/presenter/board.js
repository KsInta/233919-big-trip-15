import TripInfoView from '../view/trip-info.js';
import PointListView from '../view/point-list.js';
import SortView from '../view/sort.js';
import LoadingView from '../view/loading.js';
import NoPointView from '../view/no-point.js';
import PointPresenter, {State as PointPresenterViewState}  from './point.js';
import PointNewPresenter from './point-new.js';
import {sortPointTimeUp, sortPointDuration, sortPointPrice} from '../utils/point.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

class Board {
  constructor(infoContainer, boardContainer, pointsModel, filterModel, offersModel, api, destinationsModel) {
    this._api = api;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._boardContainer = boardContainer;
    this._infoContainer = infoContainer;
    this._pointPresenter = new Map();
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._infoComponent = null;
    this._sortComponent = null;
    this._noPointComponent = null;

    this._pointListComponent = new PointListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._infoComponent);
    remove(this._pointListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();

    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._pointNewPresenter.init(this._offers, this._destinations, callback);
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort(sortPointDuration);
      case SortType.PRICE:
        return filtredPoints.sort(sortPointPrice);
    }

    return filtredPoints.sort(sortPointTimeUp);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data, this._offers, this._destinations);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  renderInfo() {
    if(this._infoComponent !== null) {
      this._infoComponent = null;
    }

    this._infoComponent = new TripInfoView(this._pointsModel.getPoints());

    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    this._pointPresenter.set(point.id, pointPresenter);
    pointPresenter.init(point, this._offers, this._destinations);
  }

  _renderPoints(points) {
    points.forEach((boardPoint) => {
      this._renderPoint(boardPoint);
    });
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    this._noPointComponent = new NoPointView(this._filterType);
    render(this._boardContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    this._pointNewPresenter.destroy();

    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._infoComponent);

    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    const pointCount = points.length;

    if(pointCount !== 0) {
      this.renderInfo();
    }

    if (pointCount === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderPoints(points);
  }
}

export default Board;
