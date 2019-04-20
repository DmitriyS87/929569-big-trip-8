import Component from "../component";

class Sort extends Component {
  constructor(name, checked) {
    super();
    this._name = name;
    this._onSort = null;
    this._onClickSort = this._onClickSort.bind(this);
    this._checked = checked;
  }

  get name() {
    return this._name;
  }

  set onSort(fn) {
    this._onSort = fn.bind(this);
  }

  get template() {
    return `<div style="display:inline;">
    <input type="radio" name="trip-sorting" id="sorting-${this._name.toLowerCase()}" value="${this._name.toLowerCase()}" ${this._checked ? `checked` : ``}>
    <label class="trip-sorting__item trip-sorting__item--${this._name.toLowerCase()}" for="sorting-${this._name.toLowerCase()}">${this._name}</label>
    </div>`;
  }

  _onClickSort() {
    this._onSort();
  }

  createListeners() {
    this._element.querySelector(`input`).addEventListener(`click`, this._onClickSort);
  }

  removeListeners() {
    this._element.querySelector(`input`).removeListeners(`click`, this._onClickSort);
  }

}

export default Sort;
