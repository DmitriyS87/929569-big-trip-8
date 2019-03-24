import Component from "./component";

const renderFilter = ({textFilter, condition = false}, onClick = () => {}) => {
  const template = document.createElement(`template`);
  template.innerHTML = `<input type="radio" id="filter-${textFilter.toLowerCase()}" name="filter" value="${textFilter.toLowerCase()}" ${condition ? `checked` : ``}>
  <label class="trip-filter__item" for="filter-${textFilter.toLowerCase()}">${textFilter}</label>`;
  const filter = template.content;
  filter.firstChild.addEventListener(`click`, () => {
    onClick();
  });
  return filter;
};

class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.textFilter;

    this._state.isChecked = data.condition;

    this._onFilter = null;
  }

  set onFilter(fn) {
    this._onFilter = fn.bind(this);
  }

  _onClickFilter() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  get template() {
    return `<input type="radio" id="filter-${this._name.toLowerCase()}" name="filter" value="${this._name.toLowerCase()}" ${this._state.isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${this._name.toLowerCase()}">${this._name}</label>`;
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onClickFilter);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onClickFilter);
  }
}

export default (filtersData, onClick) => {
  const fragment = document.createDocumentFragment();
  const arrayFilters = filtersData.map((filterData) => {
    return renderFilter(filterData, onClick);
  });
  arrayFilters.forEach((filter) => {
    fragment.appendChild(filter);
  });
  return fragment;
};

export {Filter};
