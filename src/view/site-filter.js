import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (`
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isChecked ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}
        <span class="filter__${name}-count"> (${count}) </span>
      </label>
  `);
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<section class="main__filter filter container">
    ${filterItemsTemplate}
  </section>`;
};

class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}

export default Filter;
