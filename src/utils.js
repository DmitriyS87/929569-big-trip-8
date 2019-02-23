const render = (element, place) => {
  document.querySelector(place).insertAdjacentHTML(`beforeEnd`, element);
};

const clearHtmlInside = (className) => {
  document.querySelector(className).innerHTML = ``;
};

export {render, clearHtmlInside};
