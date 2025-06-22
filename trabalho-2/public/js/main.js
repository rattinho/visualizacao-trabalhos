import { renderLineChart } from './charts/lineChart.js';
import { renderBarChart } from './charts/barChart.js';
import { renderPieChart } from './charts/pieChart.js';
import { renderTableView } from './charts/tableView.js';

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('visType');
  const chartDiv = document.getElementById('chart');

  let data = [];

  async function fetchData() {
    try {
      const response = await fetch('/api/tabela');
      data = await response.json();
      renderSelectedChart();
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  }

  function renderSelectedChart() {
    const type = select.value;
    if (type === 'bar') renderBarChart(chartDiv, data);
    else if (type === 'line') renderLineChart(chartDiv, data);
    else if (type === 'pie') renderPieChart(chartDiv, data);
    else if (type === 'table') renderTableView(chartDiv, data);
  }

  select.addEventListener('change', renderSelectedChart);

  fetchData();
});
