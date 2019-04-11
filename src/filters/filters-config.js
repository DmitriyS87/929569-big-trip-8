import moment from 'moment';

const FILTERS_CONFIG = [
  {
    textFilter: `Everything`,
    doFilter() {
      return true;
    }
  },
  {
    textFilter: `Future`,
    doFilter(point) {
      if (moment().isBefore(moment(point.date, `DD MMM`))) {
        return true;
      }
      return false;
    }
  },
  {
    textFilter: `Past`,
    doFilter(point) {
      if (moment(point.date, `DD MMM`).isBefore(moment())) {
        return true;
      }
      return false;
    }
  }];

export default FILTERS_CONFIG;
