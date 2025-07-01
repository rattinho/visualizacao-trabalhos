import { renderLineChart } from './charts/lineChart.js';
import { renderBarChart } from './charts/barChart.js';
import { renderPieChart } from './charts/pieChart.js';
import { renderTableView } from './charts/tableView.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectGrafico = document.getElementById('visType');
  const chartDiv = document.getElementById('chart');
  const selectTime = document.getElementById('time-select');
  const btnPreencherAnosFora = document.getElementById('preencherBtn');

  let data = [];
  let times = [];
  let config = {
    xField: 'temporada',
    yField: 'total_pontos'
  };

  async function fetchData() {
    try {
      const r = await fetch('/api/times');
      times = await r.json();


      times.forEach(t => {
        const option = document.createElement('option');
        option.value = t.time;
        option.textContent = t.time;
        selectTime.appendChild(option);
      });

      await atualizarData();
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  }

  async function atualizarData(){
      const response = await fetch('/api/individual?time='+selectTime.value);
      data = await response.json();
      console.log(btnPreencherAnosFora.checked);
      if(btnPreencherAnosFora.checked == true){
        data = preencherTemporadasFaltantes(data);
      }
      renderSelectedChart();
  }

  function renderSelectedChart() {
    const type = selectGrafico.value;
    if (type === 'bar') renderBarChart(chartDiv, data, config);
    else if (type === 'line') renderLineChart(chartDiv, data, config);
    else if (type === 'pie') renderPieChart(chartDiv, data, config);
    else if (type === 'table') renderTableView(chartDiv, data);
  }

  function preencherTemporadasFaltantes(lista) {
      if (lista.length === 0) return [];

      const temporadasExistentes = lista.map(item => item.temporada);

      const temporadaMin = 2003;
      const temporadaMax = 2024;

      const listaPreenchida = [];

      for (let ano = temporadaMin; ano <= temporadaMax; ano++) {
        const existente = lista.find(item => item.temporada === ano);
        if (existente) {
          listaPreenchida.push(existente);
        } else {
          listaPreenchida.push({
            time_nome: '--',
            temporada: ano,
            jogos: 0,
            total_pontos: 0,
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            gols_marcados: 0,
            gols_sofridos: 0,
            saldo_gols: 0,
          });
        }
      }
      return listaPreenchida;
  }

  selectGrafico.addEventListener('change', renderSelectedChart);
  selectTime.addEventListener('change', atualizarData);
  btnPreencherAnosFora.addEventListener('change', atualizarData);

  fetchData();
});
