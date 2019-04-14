import Component from "../component";

class Sort extends Component {
  constructor(name) {
    super();
    this._name = name;
  }

  set onStat(fn) {
    this._onSort = fn.bind(this);
  }

  get template() {
    return `<div style="display:inline;">
    <input type="radio" name="trip-sorting" id="sorting-${this._name.toLoverCase()}" value="${this._name.toLoverCase()}" checked>
    <label class="trip-sorting__item trip-sorting__item--${this._name.toLoverCase()}" for="sorting-${this._name.toLoverCase()}">${this._name}</label>
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
