import AbstractObserver from '../utils/abstract-observer.js';

class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }
}

export default Offers;
