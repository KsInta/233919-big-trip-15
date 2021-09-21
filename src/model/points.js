import AbstractObserver from '../utils/abstract-observer.js';
import {humanizePointDueDate} from '../utils/point.js';
import dayjs from 'dayjs';

class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const pointStartFormatDate = dayjs(point['date_from']);
    const pointEndFormatDate = dayjs(point['date_to']);
    const pointTimeLength = pointEndFormatDate.diff(pointStartFormatDate, 'm');

    const adaptedPoint = Object.assign(
      {},
      point,
      {
        basePrice: point['base_price'],
        dateFrom: {
          pointStartFormatDate,
          pointStartFormatDay: humanizePointDueDate(point['date_from'], 'MMM DD'),
          pointStartFormatTime: humanizePointDueDate(point['date_from'], 'HH:mm'),
        },
        dateTo: {
          pointEndFormatDate,
          pointEndFormatTime: humanizePointDueDate(point['date_to'], 'HH:mm'),
          pointTimeLength,
        },
        isFavorite: point['is_favorite'],
        offersSelected: point['offers'],
      },
    );

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['offers'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.basePrice,
        'date_from': point.dateFrom.pointStartFormatDate.toISOString(),
        'date_to': point.dateTo.pointEndFormatDate.toISOString(),
        'is_favorite': point.isFavorite,
        'offers': point.offersSelected,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.offersSelected;

    return adaptedPoint;
  }
}

export default Points;
