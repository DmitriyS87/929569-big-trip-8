const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstChild;
};
class TripPointClass {
  constructor(data) {
    this.type = data.type;
    this.city = data.city;
    this.price = data.price;
    this.description = data.description;
    this.timeTable = data.timeTable;
    this.duration = data.duration;
    this.offers = data.offers;
    this.picture = data.picture;

    this._element = null;
  }


  get template() {

  }

  render() {
    this._element = createElement(this.template);

  }


}
export const TripPoint = new TripPointClass();
