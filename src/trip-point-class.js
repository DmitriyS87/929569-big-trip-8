const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstChild;
};

class TripPointClass {
  constructor(data) {
    this.data = data;


    this._element = null;
  }


  get template() {

  }

  render() {
    this._element = createElement(this.template);

  }


}
export const TripPoint = new TripPointClass();
