import {renderLineChart} from "./charts/lineChart.js";
import {renderBarChart} from "./charts/barChart.js";
import {renderPieChart} from "./charts/pieChart.js";
import {renderTableView} from "./charts/tableView.js";

document.addEventListener("DOMContentLoaded", () => {
  const chartDivs = {
    barChart: document.getElementById("chart"),
    lineChart: document.getElementById("chart2"),
    pieChart: document.getElementById("chart3"),
    tableView: document.getElementById("chart4"),
  };

  const selectTime = document.getElementById("time-select");
  const btnPreencherAnosFora = document.getElementById("preencherBtn");

  let dataOriginal = [];
  let filtrosAtivos = {
    barChart: null,
    lineChart: null,
    pieChart: null,
  };

  let times = [];

  const config = {
    xField: "temporada",
    yField: "total_pontos",
  };

  async function fetchTimes() {
    try {
      const r = await fetch("/api/times");
      times = await r.json();

      times.forEach((t) => {
        const option = document.createElement("option");
        option.value = t.time;
        option.textContent = t.time;
        selectTime.appendChild(option);
      });

      await atualizarData();
    } catch (err) {
      console.error("Erro ao buscar times:", err);
    }
  }

  async function atualizarData() {
    try {
      const response = await fetch("/api/individual?time=" + selectTime.value);
      dataOriginal = await response.json();

      if (btnPreencherAnosFora.checked) {
        dataOriginal = preencherTemporadasFaltantes(dataOriginal);
      }

      // Resetar filtros
      filtrosAtivos.barChart = null;
      filtrosAtivos.lineChart = null;
      filtrosAtivos.pieChart = null;

      atualizarTodosGraficos(dataOriginal);
    } catch (err) {
      console.error("Erro ao buscar dados do time:", err);
    }
  }

  function preencherTemporadasFaltantes(lista) {
    const temporadasExistentes = lista.map((item) => item.temporada);
    const temporadaMin = 2003;
    const temporadaMax = 2024;

    const preenchida = [];

    for (let ano = temporadaMin; ano <= temporadaMax; ano++) {
      const existente = lista.find((item) => item.temporada === ano);
      if (existente) {
        preenchida.push(existente);
      } else {
        preenchida.push({
          time_nome: selectTime.value,
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

    return preenchida;
  }

  function atualizarTodosGraficos(dados) {
    renderBarChart(chartDivs.barChart, dados, {
      ...config,
      onSelection: (selecionados) => atualizarFiltro("barChart", selecionados),
    });

    renderLineChart(chartDivs.lineChart, dados, {
      ...config,
      onSelection: (selecionados) => atualizarFiltro("lineChart", selecionados),
    });

    renderPieChart(chartDivs.pieChart, dados, {
      ...config,
      onSelection: (selecionados) => atualizarFiltro("pieChart", selecionados),
    });

    renderTableView(chartDivs.tableView, dados);
  }

  function atualizarFiltro(grafico, selecionados) {
    filtrosAtivos[grafico] = selecionados?.length > 0 ? selecionados : null;
    const dadosFiltrados = combinarFiltros();
    atualizarTodosGraficos(dadosFiltrados);
  }

  function combinarFiltros() {
    let resultado = [...dataOriginal];
    for (const key in filtrosAtivos) {
      if (filtrosAtivos[key]) {
        resultado = resultado.filter((item) => filtrosAtivos[key].some((f) => compararItem(item, f)));
      }
    }
    return resultado;
  }

  function compararItem(a, b) {
    return a.temporada === b.temporada;
  }

  selectTime.addEventListener("change", atualizarData);
  btnPreencherAnosFora.addEventListener("change", atualizarData);

  fetchTimes();
});
