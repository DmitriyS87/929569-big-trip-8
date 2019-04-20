const SORTS_CONFIG = [
  {sortName: `Event`,
    doSort(points) {
      return points.sort((a, b) => {
        return Number(a.id) - Number(b.id);
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

export default SORTS_CONFIG;
