import { renderLineChart } from './charts/lineChart.js';
import { renderBarChart } from './charts/barChart.js';
import { renderPieChart } from './charts/pieChart.js';
import { renderTableView } from './charts/tableView.js';
import { mapaBrasil, estadoParaRegiao } from './util/estados.js';

console.log(mapaBrasil);

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('visType');
  const chartDiv = document.getElementById('chart');
  const groupBy = document.getElementById('groupBy');

  const groupOptions = ['clube', 'estado', 'regiao'];

  let data = [];

  async function fetchData() {
    try {
      const response = await fetch('/api/tabela');
      data = await response.json();
      if(groupBy.value != 'clube'){
        data = agruparDados(groupBy.value);
        console.log(data);
      }
      renderSelectedChart();
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  }

function agruparDados(grupo) {
  const agrupado = {};

  if (grupo === 'regiao') {
    for (const item of data) {
      const infoEstado = estadoParaRegiao[item.estado];
      if (!infoEstado) continue;

      const regiao = infoEstado.regiao;

      if (!agrupado[regiao]) {
        agrupado[regiao] = {
          time: regiao, // adiciona o nome da região no próprio objeto
          pontos: 0,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          gols_pro: 0,
          gols_contra: 0,
          saldo_gols: 0
        };
      }

      agrupado[regiao].pontos += parseInt(item.pontos);
      agrupado[regiao].jogos += parseInt(item.jogos);
      agrupado[regiao].vitorias += parseInt(item.vitorias);
      agrupado[regiao].empates += parseInt(item.empates);
      agrupado[regiao].derrotas += parseInt(item.derrotas);
      agrupado[regiao].gols_pro += parseInt(item.gols_pro);
      agrupado[regiao].gols_contra += parseInt(item.gols_contra);
      agrupado[regiao].saldo_gols += parseInt(item.saldo_gols);
    }

  } else if (grupo === 'estado') {
    for (const item of data) {

      const estado = item.estado;

      if (!agrupado[estado]) {
        agrupado[estado] = {
          time: estado,
          pontos: 0,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          gols_pro: 0,
          gols_contra: 0,
          saldo_gols: 0
        };
      }

      agrupado[estado].pontos += parseInt(item.pontos);
      agrupado[estado].jogos += parseInt(item.jogos);
      agrupado[estado].vitorias += parseInt(item.vitorias);
      agrupado[estado].empates += parseInt(item.empates);
      agrupado[estado].derrotas += parseInt(item.derrotas);
      agrupado[estado].gols_pro += parseInt(item.gols_pro);
      agrupado[estado].gols_contra += parseInt(item.gols_contra);
      agrupado[estado].saldo_gols += parseInt(item.saldo_gols);
    }
  }
  const resultado = Object.values(agrupado).sort((a, b) => b.pontos - a.pontos);

  return resultado;
}

  function renderSelectedChart() {
    const type = select.value;
    if (type === 'bar') renderBarChart(chartDiv, data);
    else if (type === 'line') renderLineChart(chartDiv, data);
    else if (type === 'pie') renderPieChart(chartDiv, data);
    else if (type === 'table') renderTableView(chartDiv, data);
  }

  select.addEventListener('change', renderSelectedChart);
  groupBy.addEventListener('change', fetchData);

  fetchData();
});
