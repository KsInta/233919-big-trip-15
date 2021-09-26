import {dateDifferenceInDay} from './point.js';
import {FilterType} from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) => points.filter((point) => dateDifferenceInDay(point.dateFrom, new Date()) >= 0 || dateDifferenceInDay(point.dateFrom, new Date()) < 0 && dateDifferenceInDay(point.dateTo, new Date()) > 0),

  [FilterType.PAST]: (points) => points.filter((point) => dateDifferenceInDay(point.dateTo, new Date()) < 0 || dateDifferenceInDay(point.dateFrom, new Date()) < 0 && dateDifferenceInDay(point.dateTo, new Date()) > 0),
};

export {filter};
