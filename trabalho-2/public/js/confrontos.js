import { renderLineChart } from './charts/lineChart.js';
import { renderBarChart } from './charts/barChart.js';
import { renderPieChart } from './charts/pieChart.js';
import { renderTableView } from './charts/tableView.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectGrafico = document.getElementById('visType');
  const chartDiv = document.getElementById('chart');
  const selectTime1 = document.getElementById('time1-select');
  const selectTime2 = document.getElementById('time2-select');
  const btnPesquisar = document.getElementById('attbtn');

  let data = [];
  let times = [];
  let config = {
    xField: 'time',
    yField: 'vitorias'
  };

  async function fetchData() {
    try {
      const r = await fetch('/api/times');
      times = await r.json();


      times.forEach(t => {
        const option1 = document.createElement('option');
        option1.value = t.time;
        option1.textContent = t.time;
        selectTime1.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = t.time;
        option2.textContent = t.time;
        selectTime2.appendChild(option2);
      });

      selectTime2.value = 'Vitoria';

      await atualizarData();
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  }

  async function atualizarData(){
      if(selectTime1.value !== selectTime2.value){
        const response = await fetch('/api/confrontos?time1='+selectTime1.value+'&time2='+selectTime2.value);
        let temp = await response.json();
        if(temp.length > 0){
          let statsTime1 = {time: temp[0].time1, vitorias: parseInt(temp[0].vitoriasTime1), gols: parseInt(temp[0].golsTime1)};
          let statsTime2 = {time: temp[0].time2, vitorias: parseInt(temp[0].vitoriasTime2), gols: parseInt(temp[0].golsTime2)};
          let statsEmpate = {time: 'Empate', vitorias: parseInt(temp[0].empates), gols: 0};
          data = [];
          data.push(statsTime1, statsEmpate, statsTime2);
          renderSelectedChart();
          return;
        }
      }

      alert("Não existem dados para o confronto selecionado");

  }

  function renderSelectedChart() {
    const type = selectGrafico.value;
    if (type === 'bar') renderBarChart(chartDiv, data, config);
    else if (type === 'line') renderLineChart(chartDiv, data, config);
    else if (type === 'pie') renderPieChart(chartDiv, data, config);
    else if (type === 'table') renderTableView(chartDiv, data);
  }

  selectGrafico.addEventListener('change', renderSelectedChart);
  btnPesquisar.addEventListener('click', atualizarData);

  fetchData();
});


