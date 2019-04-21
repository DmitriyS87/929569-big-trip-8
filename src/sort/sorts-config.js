import moment from 'moment';

const sortsConfig = [
  {sortName: `Event`,
    doSort(points) {
      return points.sort((a, b) => {
        return moment(a.date, `MMM DD`) - moment(b.date, `MMM DD`);
      });
    },
    checked: true
  },
  {sortName: `Time`,
    doSort(points) {
      return points.sort((a, b) => {
        return Number(b.duration) - Number(a.duration);
      });
    }
  },
  {sortName: `Price`,
    doSort(points) {
      return points.sort((a, b) => {
        return Number(b.price.count) - Number(a.price.count);
      });
    }
  }
];

export default sortsConfig;
