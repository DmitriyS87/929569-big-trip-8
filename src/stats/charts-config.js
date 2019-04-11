import moment from 'moment';

const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);
const BAR_HEIGHT = 100;

const chartsConfig = [{
  format: (val) => {
    return `${val}x`;
  },
  name: `TRANSPORT`,
  ctx: transportCtx,
  countStat: (points, point) => {
    return points.filter((item) => {
      return item.type.type === point.type.type;
    }).length;
  },
  barHeight: BAR_HEIGHT
},
{
  format: (val) => {
    return `€ ${val}`;
  },
  name: `MONEY`,
  ctx: moneyCtx,
  countStat: (points, point) => {
    return points.filter((item) => {
      return item.type.type === point.type.type;
    }).reduce((a, b) => {
      return a + b.totalPrice;
    }, 0);
  },
  barHeight: BAR_HEIGHT
},
{
  format: (val) => {
    return `${val}H`;
  },
  name: `TIME SPENT`,
  ctx: timeSpendCtx,
  countStat: (points, point) => {
    const durationMilliseconds = points.filter((item) => {
      return item.type.type === point.type.type;
    }).reduce((a, b) => {
      return a + b.duration;
    }, 0);
    return (moment.duration(durationMilliseconds).get(`days`) * 24 + moment.duration(durationMilliseconds).get(`hours`));
  }
}];

export default chartsConfig;
