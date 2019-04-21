const clearHTMLInside = (className) => {
  document.querySelector(className).innerHTML = ``;
};

export {clearHTMLInside};
