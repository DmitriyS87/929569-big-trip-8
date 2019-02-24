const render = (elementHTML, place) => {
  document.querySelector(place).insertAdjacentHTML(`beforeEnd`, elementHTML);
};

const clearHtmlInside = (className) => {
  document.querySelector(className).innerHTML = ``;
};

export {render, clearHtmlInside};
