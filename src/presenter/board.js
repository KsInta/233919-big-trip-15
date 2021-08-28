import PointListView from '../view/site-points-list.js';
import SortView from '../view/site-sorting.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point.js';
import {updateItem} from '../utils/common.js';
import {sortPointDuration, sortPointPrice} from '../utils/point.js';
import {render, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';

class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardPoints) {
    this._boardPoints = boardPoints.slice();
    this._sourcedBoardPoints = boardPoints.slice();

    render(this._boardContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._boardPoints = updateItem(this._boardPoints, updatedPoint);
    this._sourcedBoardPoints = updateItem(this._sourcedBoardPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._boardPoints.sort(sortPointDuration);
        break;
      case SortType.PRICE:
        this._boardPoints.sort(sortPointPrice);
        break;
      default:
        this._boardPoints = this._sourcedBoardPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPoints();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    this._boardPoints.forEach((boardPoint) => this._renderPoint(boardPoint));
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _clearPointList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderBoard() {
    if (this._boardPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    this._renderPoints();
  }
}

export default Board;
