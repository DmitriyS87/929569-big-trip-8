// const renderHTML = (elementHTML, place) => {
//   document.querySelector(place).insertAdjacentHTML(`beforeEnd`, elementHTML);
// };

const clearHTMLInside = (className) => {
  document.querySelector(className).innerHTML = ``;
};

// const renderObject = (element, place) => {
//   document.querySelector(place).appendChild(element);
// };

export {clearHTMLInside};
