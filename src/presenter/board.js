import PointListView from '../view/site-points-list.js';
import SortView from '../view/site-sorting.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render.js';

class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._pointPresenter = new Map();

    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(boardPoints) {
    this._boardPoints = boardPoints.slice();

    render(this._boardContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._boardPoints = updateItem(this._boardPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
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

  _clearTaskList() {
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
