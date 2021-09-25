const Endpoints = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
  SYNC: 'sync',
};

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
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const MenuItem = {
  ADD_NEW_POINT: 'ADD_NEW_POINT',
  POINTS: 'Table',
  STATISTICS: 'Stats',
};

const BLANK_POINT = {
  type: 'train',
  basePrice: 100,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: {
    description: '',
    name: 'Tokio',
    pictures: [],
  },
  offersSelected: [],
};

export {Endpoints, SortType, UserAction, UpdateType, FilterType, MenuItem, BLANK_POINT};
