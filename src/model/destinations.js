import AbstractObserver from '../utils/abstract-observer.js';

class Destinations extends AbstractObserver {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }
}

export default Destinations;
