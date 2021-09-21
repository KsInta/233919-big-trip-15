const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const MenuItem = {
  ADD_NEW_POINT: 'ADD_NEW_POINT',
  POINTS: 'POINTS',
  STATISTICS: 'STATISTICS',
};

export {SortType, UserAction, UpdateType, FilterType, MenuItem};
