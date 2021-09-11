import {FilterType} from '../const.js';
//import {isExpired} from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => !point.isExpired),
  [FilterType.PAST]: (points) => points.filter((point) => point.isExpired),
};

export {filter};
