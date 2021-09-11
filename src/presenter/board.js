import PointListView from '../view/site-points-list.js';
import SortView from '../view/site-sorting.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {sortPointDuration, sortPointPrice} from '../utils/point.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

class Board {
  constructor(boardContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._pointPresenter = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._noPointComponent = null;

    this._pointListComponent = new PointListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
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
    return filtredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
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

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((boardPoint) => this._renderPoint(boardPoint));
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

    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const points = this._getPoints();
    const pointCount = points.length;

    if (pointCount === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderPoints(points);
  }
}

export default Board;
