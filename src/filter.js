export default ({textFilter, condition = ``}) => {
  const filter = `<input type="radio" id="filter-${textFilter.toLowerCase()}" name="filter" value="${textFilter.toLowerCase()}" ${condition}>
  <label class="trip-filter__item" for="filter-${textFilter.toLowerCase()}">${textFilter}</label>`;
  return filter;
};
