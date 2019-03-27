import Component from "./component";

class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.textFilter;

    this._doFilter = data.doFilter;
    this._onFilter = null;
    this._onClickFilter = this._onClickFilter.bind(this);
  }

  get doFilter() {
    return this._doFilter;
  }

  set onFilter(fn) {
    this._onFilter = fn.bind(this);
  }

  _onClickFilter() {
    this._onFilter();
  }

  get template() {
    return `<div style="display:inline;">
    <input type="radio" id="filter-${this._name.toLowerCase()}" name="filter" value="${this._name.toLowerCase()}"}>
    <label class="trip-filter__item" for="filter-${this._name.toLowerCase()}">${this._name}
    </label></div>`;
  }

  createListeners() {
    this._element.querySelector(`input`).addEventListener(`click`, this._onClickFilter);
  }
  removeListeners() {
    this._element.querySelector(`input`).removeEventListener(`click`, this._onClickFilter);
  }
}

export {Filter};
