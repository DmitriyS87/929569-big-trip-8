const makeFliterHTML = (textFilter, condition) => {
  return `<input type="radio" id="filter-${textFilter.toLowerCase()}" name="filter" value="${textFilter.toLowerCase()}" ${condition}>
  <label class="trip-filter__item" for="filter-${textFilter.toLowerCase()}">${textFilter}</label>`;
};

const makeFilter = ({textFilter, condition = ``}, onClick = () => {}) => {
  const template = document.createElement(`template`);
  const filterHTML = makeFliterHTML(textFilter, condition);
  template.innerHTML = filterHTML;
  const filter = template.content;
  filter.firstChild.addEventListener(`click`, () => {
    onClick();
  });
  return filter;
};

export default (filtersData, onClick) => {
  const fragment = document.createDocumentFragment();
  const arrayFilters = filtersData.map((filterData) => {
    return makeFilter(filterData, onClick);
  });
  arrayFilters.forEach((filter) => {
    fragment.appendChild(filter);
  });
  return fragment;
};
