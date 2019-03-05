const renderFilter = ({textFilter, condition = ``}, onClick = () => {}) => {
  const template = document.createElement(`template`);
  template.innerHTML = `<input type="radio" id="filter-${textFilter.toLowerCase()}" name="filter" value="${textFilter.toLowerCase()}" ${condition}>
  <label class="trip-filter__item" for="filter-${textFilter.toLowerCase()}">${textFilter}</label>`;
  const filter = template.content;
  filter.firstChild.addEventListener(`click`, () => {
    onClick();
  });
  return filter;
};

export default (filtersData, onClick) => {
  const fragment = document.createDocumentFragment();
  const arrayFilters = filtersData.map((filterData) => {
    return renderFilter(filterData, onClick);
  });
  arrayFilters.forEach((filter) => {
    fragment.appendChild(filter);
  });
  return fragment;
};
