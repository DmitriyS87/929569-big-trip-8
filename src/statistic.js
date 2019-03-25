import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderNewChart = (ctx, arrayLabels, arrayCounts, nameChart = `Chart`, setFormat = (val) => `€ ${val}`) => {
  const options = {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: arrayLabels,
      datasets: [{
        data: arrayCounts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: setFormat
        }
      },
      title: {
        display: true,
        text: nameChart,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };

  const newChart = new Chart(ctx, options);
  return newChart;
};

const deleteChart = (chart) => {
  return chart.destroy();
};

export {renderNewChart, deleteChart};
