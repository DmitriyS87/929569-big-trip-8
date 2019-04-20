import moment from 'moment';

const FILTERS_CONFIG = [
  {
    textFilter: `Everything`,
    doFilter() {
      return true;
    },
    checked: true
  },
  {
    textFilter: `Future`,
    doFilter(point) {
      if (moment().isBefore(moment(point.date, `MMM DD`))) {
        return true;
      }
      return false;
    }
  },
  {
    textFilter: `Past`,
    doFilter(point) {
      if (moment(point.date, `MMM DD`).isBefore(moment())) {
        return true;
      }
      return false;
    }
  }];

export default FILTERS_CONFIG;
